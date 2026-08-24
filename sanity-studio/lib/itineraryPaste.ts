import {keyGenerator} from '@portabletext/editor'
import type {PortableTextInputProps} from 'sanity'
import {createBlogTablePasteHandler, parseHtmlTableElement, parseMarkdownTable, toNativeTable, type ParsedTable} from './tablePaste.ts'

type KeyGenerator=()=>string
type PasteOptions={createDocument?:(html:string)=>Document;createKey?:KeyGenerator}
type Member={_type:string;[key:string]:unknown}
type Style='normal'|'h2'|'h3'|'blockquote'
type Inline={text:string;marks:Array<'strong'|'em'>;href?:string}
type ParsedPart={kind:'block';style:Style;inline:Inline[];listItem?:'bullet'|'number'}|{kind:'table';table:ParsedTable}
const aliases=new Map([['waktu','time'],['time','time'],['agenda','activity'],['aktivitas','activity'],['rencana','activity'],['activity','activity'],['area','area'],['catatan','notes'],['notes','notes'],['opsional','optional'],['optional','optional']])
const yes=new Set(['ya','yes','true','✓']),no=new Set(['','tidak','no','false'])
const unsafe=new Set(['script','style','iframe','object','embed','form','input','button','select','textarea','meta','link','svg'])
const boundaries=new Set(['h2','h3','p','blockquote','table','ul','ol'])
const clean=(value:string)=>value.replace(/\u00a0/gu,' ').replace(/[\t\r\n ]+/gu,' ').trim()
const normalized=(value:string)=>clean(value).normalize('NFKC').toLocaleLowerCase('id-ID')
const inlineWhitespace=(value:string)=>value.replace(/\u00a0/gu,' ').replace(/[\t\r\n ]+/gu,' ')
const plain=(text:string):Inline[]=>clean(text)?[{text:inlineWhitespace(text),marks:[]}]:[]

function safeHref(value:string){const href=clean(value);if(!href||href.startsWith('/')||href.startsWith('#'))return undefined;try{const url=new URL(href);return ['http:','https:','mailto:','tel:'].includes(url.protocol)?href:undefined}catch{return undefined}}
function block(inline:Inline[],style:Style,createKey:KeyGenerator,listItem?:'bullet'|'number'):Member|undefined{
  const markDefs:Member[]=[],links=new Map<string,string>(),children:Member[]=[]
  const normalized=inline.map((run)=>({...run,text:inlineWhitespace(run.text)}));if(normalized.length){normalized[0].text=normalized[0].text.trimStart();normalized.at(-1)!.text=normalized.at(-1)!.text.trimEnd()}
  for(const run of normalized){const text=run.text;if(!text)continue;const marks:string[]=[...run.marks];if(run.href){let key=links.get(run.href);if(!key){key=createKey();links.set(run.href,key);markDefs.push({_type:'externalLink',_key:key,href:run.href,openInNewTab:true})}marks.push(key)}children.push({_type:'span',_key:createKey(),text,marks})}
  return children.length?{_type:'block',_key:createKey(),style,markDefs,...(listItem?{listItem,level:1}:{}),children}:undefined
}

export function classifyItinerary(table:ParsedTable,dayTitle:string,createKey:KeyGenerator=keyGenerator):Member|undefined{
  if(table.rows.length<2||!clean(dayTitle))return
  const fields=table.rows[0].map((header)=>aliases.get(normalized(header)))
  if(fields.some((field)=>!field)||new Set(fields).size!==fields.length||!fields.includes('time')||!fields.includes('activity'))return
  const items:Member[]=[]
  for(const row of table.rows.slice(1)){const values=Object.fromEntries(fields.map((field,index)=>[field!,clean(row[index]||'')]));if(!values.time||!values.activity)return;let optional=false;if(fields.includes('optional')){const value=normalized(values.optional);if(!yes.has(value)&&!no.has(value))return;optional=yes.has(value)}items.push({_type:'itineraryItem',_key:createKey(),time:values.time,activity:values.activity,...(values.area?{area:values.area}:{}),...(values.notes?{notes:values.notes}:{}),optional})}
  return items.length&&items.length<=12?{_type:'itineraryBlock',_key:createKey(),dayTitle:clean(dayTitle),items}:undefined
}

function partsToMembers(parts:ParsedPart[],createKey:KeyGenerator):Member[]|undefined{
  const output:Member[]=[];let heading='',intervening=0,headingAvailable=false,structured=false
  for(const part of parts){if(part.kind==='block'){const member=block(part.inline,part.style,createKey,part.listItem);if(!member)continue;output.push(member);if(part.style==='h3'){heading=clean(part.inline.map((run)=>run.text).join(' '));intervening=0;headingAvailable=Boolean(heading);structured=true}else if(part.style==='h2'){headingAvailable=false;structured=true}else if(part.listItem){if(headingAvailable)intervening++;structured=true}else if(headingAvailable)intervening++;continue}
    structured=true;const itinerary=headingAvailable&&intervening<=1?classifyItinerary(part.table,heading,createKey):undefined;output.push(itinerary||toNativeTable(part.table,createKey));headingAvailable=false}
  return structured&&output.length?output:undefined
}

function htmlInline(element:Element,marks:Array<'strong'|'em'>=[]):Inline[]{const output:Inline[]=[]
  for(const node of [...element.childNodes]){if(node.nodeType===3){const text=inlineWhitespace(node.textContent||'');if(text.trim())output.push({text,marks:[...marks]});continue}if(node.nodeType!==1)continue;const child=node as Element,tag=child.tagName.toLowerCase();if(unsafe.has(tag))continue;if(tag==='br'){output.push({text:' ',marks:[...marks]});continue}const next=[...marks];if(tag==='strong'||tag==='b')next.push('strong');if(tag==='em'||tag==='i')next.push('em');const href=tag==='a'?safeHref(child.getAttribute('href')||''):undefined;for(const run of htmlInline(child,next))output.push(href?{...run,href}:run)}
  return output
}

export function parseHtmlItineraryPaste(html:string,options:PasteOptions={}):Member[]|undefined{
  const parse=options.createDocument||((value:string)=>new DOMParser().parseFromString(value,'text/html')),document=parse(html),parts:ParsedPart[]=[]
  const walk=(node:Node)=>{if(node.nodeType!==1)return;const element=node as Element,tag=element.tagName.toLowerCase();if(unsafe.has(tag))return
    if(tag==='h2'||tag==='h3'||tag==='p'||tag==='blockquote'){const inline=htmlInline(element);if(inline.length)parts.push({kind:'block',style:tag==='p'?'normal':tag as Style,inline});return}
    if(tag==='table'){const table=parseHtmlTableElement(element);if(table)parts.push({kind:'table',table});return}
    if(tag==='ul'||tag==='ol'){for(const li of [...element.children].filter((child)=>child.tagName.toLowerCase()==='li')){const clone=li.cloneNode(true) as Element;clone.querySelectorAll('ul,ol').forEach((list)=>list.remove());const inline=htmlInline(clone);if(inline.length)parts.push({kind:'block',style:'normal',inline,listItem:tag==='ol'?'number':'bullet'});for(const list of [...li.children].filter((child)=>['ul','ol'].includes(child.tagName.toLowerCase())))walk(list)}return}
    const containsBlock=[...element.querySelectorAll('*')].some((child)=>boundaries.has(child.tagName.toLowerCase()));if(!containsBlock){const inline=htmlInline(element);if(inline.length)parts.push({kind:'block',style:'normal',inline});return}for(const child of [...element.childNodes])walk(child)}
  walk(document.body);return partsToMembers(parts,options.createKey||keyGenerator)
}

function markdownInline(value:string):Inline[]{const output:Inline[]=[],pattern=/(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_)/gu;let index=0
  for(const match of value.matchAll(pattern)){if(match.index!>index)output.push(...plain(value.slice(index,match.index)));if(match[2]){const href=safeHref(match[3]);output.push({text:clean(match[2]),marks:[],...(href?{href}:{})})}else if(match[4]||match[5])output.push({text:clean(match[4]||match[5]),marks:['strong']});else output.push({text:clean(match[6]||match[7]),marks:['em']});index=match.index!+match[0].length}if(index<value.length)output.push(...plain(value.slice(index)));return output}
const tableStart=(lines:string[],index:number)=>index+1<lines.length&&lines[index].includes('|')&&/^\s*\|?\s*:?-{3,}:?/u.test(lines[index+1])
export function parseMarkdownItineraryPaste(text:string,createKey:KeyGenerator=keyGenerator):Member[]|undefined{const lines=text.replace(/\r\n?/gu,'\n').split('\n'),parts:ParsedPart[]=[]
  for(let i=0;i<lines.length;){const line=lines[i].trim();if(!line){i++;continue}const heading=line.match(/^(##|###)(?!#)\s+(.+)$/u);if(heading){parts.push({kind:'block',style:heading[1]==='##'?'h2':'h3',inline:markdownInline(heading[2])});i++;continue}if(tableStart(lines,i)){const chunk=[lines[i],lines[i+1]];i+=2;while(i<lines.length&&lines[i].trim()&&lines[i].includes('|'))chunk.push(lines[i++]);const table=parseMarkdownTable(chunk.join('\n'));if(table)parts.push({kind:'table',table});continue}const bullet=line.match(/^[-*+]\s+(.+)$/u),number=line.match(/^\d+[.)]\s+(.+)$/u);if(bullet||number){parts.push({kind:'block',style:'normal',inline:markdownInline((bullet||number)![1]),listItem:bullet?'bullet':'number'});i++;continue}const paragraph=[line];i++;while(i<lines.length&&lines[i].trim()&&!/^(##|###)(?!#)\s+/u.test(lines[i].trim())&&!tableStart(lines,i)&&!/^[-*+]\s+/u.test(lines[i].trim())&&!/^\d+[.)]\s+/u.test(lines[i].trim()))paragraph.push(lines[i++].trim());parts.push({kind:'block',style:'normal',inline:markdownInline(paragraph.join(' '))})}
  return partsToMembers(parts,createKey)}

export const parseHtmlUniversalPaste=parseHtmlItineraryPaste
export const parseMarkdownUniversalPaste=parseMarkdownItineraryPaste
export function createBlogPasteHandler(options:PasteOptions={}):NonNullable<PortableTextInputProps['onPaste']>{const tableFallback=createBlogTablePasteHandler(options);return(data)=>{const clipboard=data.event.clipboardData,html=clipboard?.getData('text/html')||'',text=clipboard?.getData('text/plain')||'',members=html?parseHtmlItineraryPaste(html,options):parseMarkdownItineraryPaste(text,options.createKey);return members?{insert:members,path:data.path}:tableFallback(data)}}
export const handleBlogPaste=createBlogPasteHandler()
