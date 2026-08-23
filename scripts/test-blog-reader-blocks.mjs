import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {normalizeReaderBlocks,renderReaderBlock} from './lib/blog-reader-blocks.mjs'
import {renderPortableText} from './lib/portable-text.mjs'

const slug='fixture-article'
const span=(value,marks=[])=>({_type:'span',text:value,marks})
const paragraph=(value,extra={})=>({_type:'block',style:'normal',markDefs:[],children:[span(value)],...extra})
const normalize=(block)=>normalizeReaderBlocks([block],slug)[0]
const fails=(block,pattern)=>assert.throws(()=>normalize(block),pattern)

const table={_type:'table',_key:'table1',headerRows:1,rows:[
  {cells:[{value:[paragraph('Paket <A>')]},{value:[paragraph('Harga')]}]},
  {cells:[{value:[{...paragraph('Lihat situs'),markDefs:[{_key:'link',_type:'externalLink',href:'https://example.com/',openInNewTab:true}],children:[span('Lihat situs',['link'])]}]},{value:[paragraph('Rp 1 juta')]}]},
]}
let block=normalize(table);let html=renderReaderBlock(block,{articleSlug:slug})
assert.match(html,/<thead><tr><th scope="col">/)
assert.match(html,/<tbody><tr><td>/)
assert.match(html,/Paket &lt;A&gt;/)
assert.match(html,/noopener noreferrer/)
assert.match(renderReaderBlock(normalize({...table,headerRows:0}),{articleSlug:slug}),/<tbody><tr><td>/)
assert.doesNotMatch(renderReaderBlock(normalize({...table,headerRows:0}),{articleSlug:slug}),/<thead>/)
fails({...table,rows:[]},/rows must contain/)
fails({...table,rows:[table.rows[0],{cells:[table.rows[1].cells[0]]}]},/inconsistent cell count/)
fails({...table,rows:[{cells:[{value:[{_type:'ctaBlock'}]}]}]},/normal text block/)
fails({...table,rows:[{cells:[{value:[{...paragraph('Bad'),markDefs:[{_key:'x',_type:'externalLink',href:'javascript:alert(1)'}]}]}]}]},/unsafe external link/)

const itinerary={_type:'itineraryBlock',dayTitle:'Hari <Pertama>',items:[{time:'09.00',activity:'Desa <script>',area:'Ubud',notes:'Tanpa onclick=',optional:true}]}
html=renderReaderBlock(normalize(itinerary),{articleSlug:slug})
assert.match(html,/<section class="blog-itinerary"/)
assert.match(html,/Hari &lt;Pertama&gt;/)
assert.match(html,/Desa &lt;script&gt;/)
assert.match(html,/>Opsional</)
assert.doesNotMatch(html,/<script>/)
fails({...itinerary,items:[]},/items must contain 1–12/)
fails({...itinerary,dayTitle:''},/dayTitle is required/)
fails({...itinerary,items:[{...itinerary.items[0],activity:'x'.repeat(141)}]},/exceeds 140/)
const importedHeading={_type:'block',style:'h3',markDefs:[],children:[span('Hari Pertama')]}
const importedItinerary=normalize({...itinerary,dayTitle:'Hari Pertama'})
html=renderPortableText([importedHeading,importedItinerary],{articleSlug:slug,headingIds:new Map([[0,'hari-pertama']])})
assert.equal((html.match(/Hari Pertama/g)||[]).length,1)
assert.match(html,/<h3 id="hari-pertama">Hari Pertama<\/h3>/)
assert.match(html,/<section class="blog-itinerary" aria-labelledby="hari-pertama"><ol>/)

for(const type of ['tip','important','warning','goodToKnow']){
  const callout=normalize({_type:'calloutBlock',type,body:[paragraph('Isi aman'),paragraph('Daftar',{listItem:'bullet'})]})
  html=renderReaderBlock(callout,{articleSlug:slug})
  assert.match(html,new RegExp(`blog-callout--${type}`))
  assert.match(html,/blog-callout-label/)
  assert.match(html,/<ul><li>Daftar<\/li><\/ul>/)
}
html=renderReaderBlock(normalize({_type:'calloutBlock',type:'warning',title:'Awas <iframe>',body:[paragraph('Isi')]}),{articleSlug:slug})
assert.match(html,/Awas &lt;iframe&gt;/)
assert.doesNotMatch(html,/<iframe>/)
fails({_type:'calloutBlock',type:'unknown',body:[paragraph('Isi')]},/type is invalid/)
fails({_type:'calloutBlock',type:'tip',body:[]},/body must contain/)
fails({_type:'calloutBlock',type:'tip',body:[{_type:'image'}]},/normal text block/)

const cta={_type:'ctaBlock',eyebrow:'Mulai <sekarang>',title:'Rancang perjalanan',description:'Aman & relevan',buttonLabel:'Hubungi kami',destinationType:'contact',style:'soft',trackingId:'blog-contact-cta'}
const destinations={contact:'/contact/#inquiry',experiences:'/experiences/',corporatePackages:'/corporate-packages/'}
for(const [destinationType,href] of Object.entries(destinations)){
  html=renderReaderBlock(normalize({...cta,destinationType,trackingId:`blog-${destinationType.toLowerCase()}-cta`}),{articleSlug:slug})
  assert.match(html,new RegExp(`href="${href.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"`))
}
html=renderReaderBlock(normalize({...cta,destinationType:'customInternal',customPath:'/study-tour/',style:'highlight'}),{articleSlug:slug})
assert.match(html,/href="\/study-tour\/"/)
assert.match(html,/blog-reader-cta--highlight/)
html=renderReaderBlock(normalize({...cta,destinationType:'whatsapp',style:'primary'}),{articleSlug:slug})
assert.match(html,/href="\/contact\/#inquiry"/)
assert.match(html,/data-wa-key="general"/)
assert.match(html,/data-blog-reader-cta/)
assert.match(html,/data-article-slug="fixture-article"/)
assert.match(html,/Mulai &lt;sekarang&gt;/)
for(const path of ['https://evil.test','//evil.test','javascript:alert(1)','data:text/html,x','../admin','/safe/?onclick=x']) fails({...cta,destinationType:'customInternal',customPath:path},/customPath/)
fails({...cta,destinationType:'external'},/destinationType is invalid/)
fails({...cta,style:'loud'},/style is invalid/)
fails({...cta,trackingId:'Bad ID'},/trackingId is invalid/)
assert.throws(()=>normalizeReaderBlocks([cta,{...cta,_key:'two'}],slug),/duplicate trackingId "blog-contact-cta"/)

const article=normalizeReaderBlocks([paragraph('Awal'),table,itinerary,{_type:'calloutBlock',type:'tip',body:[paragraph('Tip')]},cta],slug)
html=renderPortableText(article,{articleSlug:slug})
assert.match(html,/blog-data-table/);assert.match(html,/blog-itinerary/);assert.match(html,/blog-callout/);assert.match(html,/blog-reader-cta/)
assert.doesNotMatch(html,/<(?:script|iframe|object|embed)\b|javascript:|data:text\/html|<[^>]+\son(?:error|click)=/i)

const imageHtml=renderPortableText([{_type:'image',asset:{_ref:'image-abc123-1200x800-webp'},alt:'Foto "aman" <x>',caption:'Caption <script> & aman',hotspot:{x:.25,y:.75},crop:{top:.1,bottom:0,left:0,right:0}}])
assert.match(imageHtml,/width="1200" height="800"/)
assert.match(imageHtml,/loading="lazy" decoding="async"/)
assert.match(imageHtml,/alt="Foto &quot;aman&quot; &lt;x&gt;"/)
assert.match(imageHtml,/Caption &lt;script&gt; &amp; aman/)
assert.equal(renderPortableText([{_type:'image',asset:{_ref:'bad'},alt:'Alt'}]),'')

const runtime=await readFile(new URL('../js/main.js',import.meta.url),'utf8')
assert.match(runtime,/pushTrackingEvent\("blog_reader_cta_click",\s*\{[\s\S]*trackingId:[\s\S]*destinationType:[\s\S]*articleSlug:/)
assert.match(runtime,/blogReaderTrackingBound === "true"/)
assert.match(runtime,/waTrackingBound === "true"/)
assert.equal((runtime.match(/pushTrackingEvent\("blog_reader_cta_click"/g)||[]).length,1)

console.log('Reader Blocks frontend tests lulus: normalization, rendering, destination, security, dan image regression.')
