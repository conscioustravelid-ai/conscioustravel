import {keyGenerator} from '@portabletext/editor'
import type {PortableTextInputProps} from 'sanity'
import {createBlogTablePasteHandler, parseHtmlTableElement, parseMarkdownTable, toNativeTable, type ParsedTable} from './tablePaste.ts'

type KeyGenerator = () => string
type PasteOptions = {createDocument?: (html: string) => Document; createKey?: KeyGenerator}
type Member = {_type:string; [key:string]:unknown}
const aliases = new Map([['waktu','time'],['time','time'],['agenda','activity'],['aktivitas','activity'],['activity','activity'],['area','area'],['catatan','notes'],['notes','notes'],['opsional','optional'],['optional','optional']])
const yes = new Set(['ya','yes','true','✓'])
const no = new Set(['','tidak','no','false'])
const clean = (value: string) => value.replace(/\u00a0/gu,' ').replace(/[\t\r\n ]+/gu,' ').trim()
const normalized = (value: string) => clean(value).normalize('NFKC').toLocaleLowerCase('id-ID')

function textBlock(text: string, style: 'normal'|'h3', createKey: KeyGenerator, listItem?: 'bullet'|'number'): Member {
  return {_type:'block',_key:createKey(),style,markDefs:[],...(listItem?{listItem,level:1}:{}),children:[{_type:'span',_key:createKey(),text:clean(text),marks:[]}]}
}

export function classifyItinerary(table: ParsedTable, dayTitle: string, createKey: KeyGenerator = keyGenerator): Member | undefined {
  if (table.headerRows !== 1 || table.rows.length < 2 || !clean(dayTitle)) return undefined
  const fields = table.rows[0].map((header) => aliases.get(normalized(header)))
  if (fields.some((field) => !field) || new Set(fields).size !== fields.length || !fields.includes('time') || !fields.includes('activity')) return undefined
  const items: Member[] = []
  for (const row of table.rows.slice(1)) {
    const values = Object.fromEntries(fields.map((field,index) => [field!,clean(row[index] || '')]))
    if (!values.time || !values.activity) return undefined
    let optional = false
    if (fields.includes('optional')) {
      const value = normalized(values.optional)
      if (!yes.has(value) && !no.has(value)) return undefined
      optional = yes.has(value)
    }
    items.push({_type:'itineraryItem',_key:createKey(),time:values.time,activity:values.activity,...(values.area?{area:values.area}:{}),...(values.notes?{notes:values.notes}:{}),optional})
  }
  if (!items.length || items.length > 12) return undefined
  return {_type:'itineraryBlock',_key:createKey(),dayTitle:clean(dayTitle),items}
}

type ParsedPart = {kind:'h3'|'paragraph'|'list'|'table'; text?:string; listItem?:'bullet'|'number'; table?:ParsedTable}

function partsToMembers(parts: ParsedPart[], createKey: KeyGenerator): Member[] | undefined {
  const output: Member[]=[]
  let heading=''; let gap=0; let headingAvailable=false; let itineraries=0
  for (const part of parts) {
    if (part.kind==='h3') { heading=clean(part.text||''); gap=0; headingAvailable=Boolean(heading); output.push(textBlock(heading,'h3',createKey)); continue }
    if (part.kind==='paragraph'||part.kind==='list') { const value=clean(part.text||''); if(value) output.push(textBlock(value,'normal',createKey,part.listItem)); if(headingAvailable) gap+=value.length; continue }
    const itinerary=headingAvailable && gap<=300 ? classifyItinerary(part.table!,heading,createKey) : undefined
    if (itinerary) { output.push(itinerary); itineraries++; headingAvailable=false }
    else { output.push(toNativeTable(part.table!,createKey)); headingAvailable=false }
  }
  return itineraries ? output : undefined
}

export function parseHtmlItineraryPaste(html: string, options: PasteOptions={}): Member[] | undefined {
  if (!/<table[\s>]/iu.test(html)) return undefined
  const parse=options.createDocument||((value:string)=>new DOMParser().parseFromString(value,'text/html'))
  const document=parse(html); const parts:ParsedPart[]=[]
  const walk=(node:Node) => {
    if(node.nodeType!==1)return
    const element=node as Element; const tag=element.tagName.toLowerCase()
    if(['script','style','iframe','object','embed','meta','link','img','svg'].includes(tag))return
    if(tag==='h3'||tag==='p'){const value=clean(element.textContent||'');if(value)parts.push({kind:tag==='h3'?'h3':'paragraph',text:value});return}
    if(tag==='table'){const table=parseHtmlTableElement(element);if(table)parts.push({kind:'table',table});return}
    if(tag==='ul'||tag==='ol'){for(const li of [...element.children].filter((child)=>child.tagName.toLowerCase()==='li')){const value=clean(li.textContent||'');if(value)parts.push({kind:'list',text:value,listItem:tag==='ol'?'number':'bullet'})}return}
    for(const child of [...element.childNodes])walk(child)
  }
  walk(document.body)
  return partsToMembers(parts,options.createKey||keyGenerator)
}

const tableStart=(lines:string[],index:number)=>index+1<lines.length&&lines[index].includes('|')&&/^\s*\|?\s*:?-{3,}:?/u.test(lines[index+1])
export function parseMarkdownItineraryPaste(text: string, createKey: KeyGenerator=keyGenerator): Member[] | undefined {
  const lines=text.replace(/\r\n?/gu,'\n').split('\n'); const parts:ParsedPart[]=[]
  for(let i=0;i<lines.length;){const line=lines[i].trim();if(!line){i++;continue}
    if(/^###(?!#)\s+/u.test(line)){parts.push({kind:'h3',text:line.replace(/^###\s+/u,'')});i++;continue}
    if(tableStart(lines,i)){const chunk=[lines[i],lines[i+1]];i+=2;while(i<lines.length&&lines[i].trim()&&lines[i].includes('|'))chunk.push(lines[i++]);const table=parseMarkdownTable(chunk.join('\n'));if(table)parts.push({kind:'table',table});continue}
    const bullet=line.match(/^[-*+]\s+(.+)$/u);const number=line.match(/^\d+[.)]\s+(.+)$/u);if(bullet||number){parts.push({kind:'list',text:(bullet||number)![1],listItem:bullet?'bullet':'number'});i++;continue}
    const paragraph=[line];i++;while(i<lines.length&&lines[i].trim()&&!/^###(?!#)\s+/u.test(lines[i].trim())&&!tableStart(lines,i)){paragraph.push(lines[i].trim());i++}parts.push({kind:'paragraph',text:paragraph.join(' ')})
  }
  return partsToMembers(parts,createKey)
}

export function createBlogPasteHandler(options:PasteOptions={}):NonNullable<PortableTextInputProps['onPaste']>{
  const tableFallback=createBlogTablePasteHandler(options)
  return (data)=>{const clipboard=data.event.clipboardData;const html=clipboard?.getData('text/html')||'';const text=clipboard?.getData('text/plain')||''
    const members=html?parseHtmlItineraryPaste(html,options):parseMarkdownItineraryPaste(text,options.createKey)
    return members?{insert:members,path:data.path}:tableFallback(data)
  }
}
export const handleBlogPaste=createBlogPasteHandler()
