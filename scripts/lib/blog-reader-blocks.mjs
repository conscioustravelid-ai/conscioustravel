import {escapeAttribute, escapeHtml, safeUrl} from './html-utils.mjs'

const CALLOUT_LABELS = {tip:'Tip',important:'Penting',warning:'Perhatian',goodToKnow:'Good to Know'}
const CTA_DESTINATIONS = new Set(['whatsapp','contact','experiences','corporatePackages','customInternal'])
const CTA_STYLES = new Set(['soft','highlight','primary'])
const TRACKING_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const INTERNAL_PATH = /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*(?:[a-z0-9]+(?:-[a-z0-9]+)*\/?)?$/
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const KNOWN_TYPES = new Set(['table','itineraryBlock','calloutBlock','ctaBlock'])

function fail(type, slug, problem) {
  throw new Error(`Invalid ${type} in article "${slug || '(unknown)'}" — ${problem}`)
}
function text(value, {required=false,max=Infinity,label='field',type='Reader Block',slug}={}) {
  if (value == null || value === '') { if (required) fail(type,slug,`${label} is required.`); return '' }
  if (typeof value !== 'string') fail(type,slug,`${label} must be text.`)
  const normalized=value.replace(/\s+/g,' ').trim()
  if (required&&!normalized) fail(type,slug,`${label} is required.`)
  if (normalized.length>max) fail(type,slug,`${label} exceeds ${max} characters.`)
  return normalized
}
function normalizeRestricted(blocks,{type,slug,lists=false,min=1,max=Infinity,label='body'}) {
  if(!Array.isArray(blocks)||blocks.length<min||blocks.length>max) fail(type,slug,`${label} must contain ${min}${max<Infinity?`–${max}`:' or more'} block(s).`)
  return blocks.map((block,index)=>{
    if(block?._type!=='block'||(block.style&&block.style!=='normal')) fail(type,slug,`${label}[${index}] must be a normal text block.`)
    if(block.listItem&&!lists) fail(type,slug,`${label}[${index}] cannot contain a list.`)
    if(block.listItem&&!['bullet','number'].includes(block.listItem)) fail(type,slug,`${label}[${index}] has an invalid list type.`)
    if(!Array.isArray(block.children)) fail(type,slug,`${label}[${index}] has invalid children.`)
    const markDefs=Array.isArray(block.markDefs)?block.markDefs.map((def)=>{
      if(def?._type==='externalLink'){
        const href=safeUrl(def.href)
        if(!href) fail(type,slug,`${label}[${index}] contains an unsafe external link.`)
        return {_key:String(def._key||''),_type:'externalLink',href,openInNewTab:def.openInNewTab===true}
      }
      if(def?._type==='internalLink'){
        const candidate=def.reference?.slug||def.reference?._refSlug
        const refSlug=typeof candidate==='string'&&SLUG.test(candidate)?candidate:null
        if(!refSlug) fail(type,slug,`${label}[${index}] contains an invalid internal Blog link.`)
        return {_key:String(def._key||''),_type:'internalLink',reference:{slug:refSlug}}
      }
      fail(type,slug,`${label}[${index}] contains an unsupported annotation.`)
    }):[]
    const keys=new Set(markDefs.map((def)=>def._key))
    const children=block.children.map((span,spanIndex)=>{
      if(span?._type!=='span'||typeof span.text!=='string') fail(type,slug,`${label}[${index}].children[${spanIndex}] is invalid.`)
      const marks=Array.isArray(span.marks)?span.marks:[]
      if(marks.some((mark)=>!['strong','em'].includes(mark)&&!keys.has(mark))) fail(type,slug,`${label}[${index}] contains an unsupported mark.`)
      return {_type:'span',text:span.text,marks}
    })
    return {_type:'block',style:'normal',...(block.listItem?{listItem:block.listItem}:{}),children,markDefs}
  })
}
function normalizeTable(block,slug){
  const type='table'
  if(!Number.isInteger(block.headerRows)||![0,1].includes(block.headerRows)) fail(type,slug,'headerRows must be 0 or 1.')
  if(!Array.isArray(block.rows)||!block.rows.length) fail(type,slug,'rows must contain at least one row.')
  let columns
  const rows=block.rows.map((row,rowIndex)=>{
    if(!Array.isArray(row?.cells)||!row.cells.length) fail(type,slug,`rows[${rowIndex}] must contain at least one cell.`)
    columns??=row.cells.length
    if(row.cells.length!==columns) fail(type,slug,`rows[${rowIndex}] has an inconsistent cell count.`)
    return {cells:row.cells.map((cell,cellIndex)=>({value:normalizeRestricted(cell?.value,{type,slug,min:1,label:`rows[${rowIndex}].cells[${cellIndex}].value`})}))}
  })
  return {_type:type,_key:String(block._key||''),headerRows:block.headerRows,rows}
}
function normalizeItinerary(block,slug,index){
  const type='itineraryBlock'
  const dayTitle=text(block.dayTitle,{required:true,max:120,label:'dayTitle',type,slug})
  if(!Array.isArray(block.items)||block.items.length<1||block.items.length>12) fail(type,slug,'items must contain 1–12 agenda items.')
  const items=block.items.map((item,itemIndex)=>({
    time:text(item?.time,{required:true,max:40,label:`items[${itemIndex}].time`,type,slug}),
    activity:text(item?.activity,{required:true,max:140,label:`items[${itemIndex}].activity`,type,slug}),
    area:text(item?.area,{max:80,label:`items[${itemIndex}].area`,type,slug}),
    notes:text(item?.notes,{max:240,label:`items[${itemIndex}].notes`,type,slug}),
    optional:item?.optional===undefined?false:item.optional,
  }))
  if(items.some((item)=>typeof item.optional!=='boolean')) fail(type,slug,'item optional must be boolean.')
  return {_type:type,_key:String(block._key||''),id:`itinerary-${slug||'article'}-${index+1}`,dayTitle,items}
}
function normalizeCallout(block,slug){
  const type='calloutBlock'
  if(!Object.hasOwn(CALLOUT_LABELS,block.type)) fail(type,slug,'type is invalid.')
  return {_type:type,_key:String(block._key||''),type:block.type,title:text(block.title,{max:100,label:'title',type,slug}),body:normalizeRestricted(block.body,{type,slug,lists:true,min:1,max:8,label:'body'})}
}
function normalizeCta(block,slug){
  const type='ctaBlock'
  const destinationType=text(block.destinationType,{required:true,label:'destinationType',type,slug})
  if(!CTA_DESTINATIONS.has(destinationType)) fail(type,slug,'destinationType is invalid.')
  const style=text(block.style,{required:true,label:'style',type,slug})
  if(!CTA_STYLES.has(style)) fail(type,slug,'style is invalid.')
  const trackingId=text(block.trackingId,{required:true,max:80,label:'trackingId',type,slug})
  if(!TRACKING_ID.test(trackingId)) fail(type,slug,'trackingId is invalid.')
  const customPath=text(block.customPath,{label:'customPath',type,slug})
  if(destinationType==='customInternal'&&(!customPath||!INTERNAL_PATH.test(customPath))) fail(type,slug,'customPath must be a safe root-relative internal path.')
  if(customPath&&!INTERNAL_PATH.test(customPath)) fail(type,slug,'customPath is unsafe.')
  return {_type:type,_key:String(block._key||''),eyebrow:text(block.eyebrow,{max:60,label:'eyebrow',type,slug}),title:text(block.title,{required:true,max:100,label:'title',type,slug}),description:text(block.description,{max:240,label:'description',type,slug}),buttonLabel:text(block.buttonLabel,{required:true,max:40,label:'buttonLabel',type,slug}),destinationType,customPath,style,trackingId}
}
export function normalizeReaderBlocks(blocks,articleSlug){
  const trackingIds=new Set()
  const normalized=(Array.isArray(blocks)?blocks:[]).map((block,index)=>{
    if(!KNOWN_TYPES.has(block?._type)) return block
    let result
    if(block._type==='table') result=normalizeTable(block,articleSlug)
    if(block._type==='itineraryBlock') result=normalizeItinerary(block,articleSlug,index)
    if(block._type==='calloutBlock') result=normalizeCallout(block,articleSlug)
    if(block._type==='ctaBlock') result=normalizeCta(block,articleSlug)
    if(result?._type==='ctaBlock'){
      if(trackingIds.has(result.trackingId)) fail('ctaBlock',articleSlug,`duplicate trackingId "${result.trackingId}".`)
      trackingIds.add(result.trackingId)
    }
    return result
  })
  return normalized
}
function marked(textValue,active,defs){
  let html=escapeHtml(textValue)
  for(const mark of Array.isArray(active)?active:[]){
    if(mark==='strong')html=`<strong>${html}</strong>`
    else if(mark==='em')html=`<em>${html}</em>`
    else {const def=defs.find((item)=>item._key===mark);if(def?._type==='externalLink')html=`<a href="${escapeAttribute(def.href)}"${def.openInNewTab?' target="_blank" rel="noopener noreferrer"':''}>${html}</a>`;else if(def?._type==='internalLink')html=`<a href="/blog/${escapeAttribute(def.reference.slug)}/">${html}</a>`}
  }
  return html
}
function restrictedHtml(blocks){
  const output=[];let list=null
  const close=()=>{if(list)output.push(`</${list}>`);list=null}
  for(const block of blocks){const defs=block.markDefs||[];const content=block.children.map((span)=>marked(span.text,span.marks,defs)).join('');if(block.listItem){const tag=block.listItem==='number'?'ol':'ul';if(list!==tag){close();output.push(`<${tag}>`);list=tag}output.push(`<li>${content}</li>`)}else{close();output.push(`<p>${content}</p>`)}}
  close();return output.join('')
}
function tableHtml(block){
  const row=(item,tag)=>`<tr>${item.cells.map((cell)=>`<${tag}${tag==='th'?' scope="col"':''}>${restrictedHtml(cell.value)}</${tag}>`).join('')}</tr>`
  const head=block.headerRows===1?`<thead>${row(block.rows[0],'th')}</thead>`:''
  const body=block.rows.slice(block.headerRows).map((item)=>row(item,'td')).join('')
  return `<div class="blog-table-scroll" tabindex="0" role="region" aria-label="Tabel artikel"><table class="blog-data-table">${head}<tbody>${body}</tbody></table></div>`
}
function itineraryHtml(block){return `<section class="blog-itinerary" aria-labelledby="${escapeAttribute(block.id)}"><h3 id="${escapeAttribute(block.id)}" class="blog-itinerary-title">${escapeHtml(block.dayTitle)}</h3><ol>${block.items.map((item)=>`<li><div class="blog-itinerary-time">${escapeHtml(item.time)}</div><div class="blog-itinerary-details"><h4>${escapeHtml(item.activity)}</h4>${item.optional?'<span class="blog-itinerary-optional">Opsional</span>':''}${item.area?`<p class="blog-itinerary-area">${escapeHtml(item.area)}</p>`:''}${item.notes?`<p class="blog-itinerary-notes">${escapeHtml(item.notes)}</p>`:''}</div></li>`).join('')}</ol></section>`}
function calloutHtml(block){const label=CALLOUT_LABELS[block.type];return `<aside class="blog-callout blog-callout--${block.type}" aria-label="${escapeAttribute(label)}"><p class="blog-callout-label">${escapeHtml(label)}</p>${block.title?`<h3>${escapeHtml(block.title)}</h3>`:''}<div class="blog-callout-body">${restrictedHtml(block.body)}</div></aside>`}
const CTA_HREF={contact:'/contact/#inquiry',experiences:'/experiences/',corporatePackages:'/corporate-packages/'}
function ctaHtml(block,articleSlug){const href=block.destinationType==='customInternal'?block.customPath:(CTA_HREF[block.destinationType]||'/contact/#inquiry');const wa=block.destinationType==='whatsapp';return `<section class="blog-reader-cta blog-reader-cta--${block.style}" aria-label="Ajakan bertindak">${block.eyebrow?`<p class="blog-reader-cta-eyebrow">${escapeHtml(block.eyebrow)}</p>`:''}<h3>${escapeHtml(block.title)}</h3>${block.description?`<p>${escapeHtml(block.description)}</p>`:''}<a class="blog-reader-cta-link" href="${escapeAttribute(href)}"${wa?' target="_blank" rel="noopener noreferrer" data-wa-key="general"':''} data-blog-reader-cta data-tracking-id="${escapeAttribute(block.trackingId)}" data-destination-type="${escapeAttribute(block.destinationType)}" data-article-slug="${escapeAttribute(articleSlug)}">${escapeHtml(block.buttonLabel)}</a></section>`}
export function renderReaderBlock(block,{articleSlug}={}){
  if(block?._type==='table')return tableHtml(block)
  if(block?._type==='itineraryBlock')return itineraryHtml(block)
  if(block?._type==='calloutBlock')return calloutHtml(block)
  if(block?._type==='ctaBlock')return ctaHtml(block,articleSlug)
  return null
}
