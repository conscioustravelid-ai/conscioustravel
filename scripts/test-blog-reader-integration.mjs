import assert from 'node:assert/strict'
import {readFile,writeFile} from 'node:fs/promises'
import {normalizeReaderBlocks} from './lib/blog-reader-blocks.mjs'
import {createBlogToc,renderBlogToc} from './lib/blog-toc.mjs'
import {renderPortableText} from './lib/portable-text.mjs'

const articleSlug='reader-blocks-integrated-fixture'
const span=(text,marks=[])=>({_type:'span',text,marks})
const block=(text,options={})=>({_type:'block',style:options.style||'normal',...(options.listItem?{listItem:options.listItem}:{}),markDefs:options.markDefs||[],children:[span(text,options.marks||[])]})
const cell=(text)=>({value:[block(text)]})

const body=[
  block('Fixture ini menguji struktur panduan perjalanan panjang tanpa menjadi konten produksi.'),
  block('Merencanakan Rute Bali', {style:'h2'}),
  block('Gunakan urutan yang sesuai dengan waktu, minat, dan kondisi perjalanan.'),
  {_type:'calloutBlock',type:'tip',title:'Mulai dari prioritas',body:[block('Pilih beberapa pengalaman utama.'),block('Sisakan waktu jeda.',{listItem:'bullet'})]},
  block('Rute Pertama', {style:'h2'}),
  block('Hari Pertama', {style:'h3'}),
  {_type:'itineraryBlock',dayTitle:'Hari 1 — Ubud dan sekitarnya',items:[
    {time:'08.30–10.00',activity:'Perjalanan menuju area kegiatan',area:'Bali',notes:'Waktu dapat menyesuaikan kondisi lokal.',optional:false},
    {time:'10.00–12.00',activity:'Kegiatan bersama komunitas',area:'Ubud',notes:'Ikuti arahan fasilitator.',optional:false},
    {time:'13.00–15.00',activity:'Pengalaman budaya lokal',area:'Gianyar',notes:'Gunakan pakaian yang nyaman.',optional:false},
    {time:'16.00–17.00',activity:'Waktu bebas terarah',area:'Ubud',notes:'Aktivitas ini dapat dilewati bila jadwal berubah.',optional:true},
  ]},
  {_type:'image',asset:{_ref:'image-abc123-1200x800-webp'},alt:'Kelompok wisatawan mengikuti pengalaman lokal di Bali',caption:'Fixture gambar untuk pengujian layout artikel.',hotspot:{x:.5,y:.5},crop:{top:0,bottom:0,left:0,right:0}},
  block('Perbandingan Rute', {style:'h2'}),
  {_type:'table',headerRows:1,rows:[
    {cells:[cell('Rute'),cell('Fokus'),cell('Ritme')]},
    {cells:[cell('Rute A'),cell('Budaya dan komunitas'),cell('Seimbang')]},
    {cells:[cell('Rute B'),cell('Alam dan waktu santai'),cell('Lebih pelan')]},
  ]},
  block('Catatan Perencanaan', {style:'h2'}),
  block('Detail Tambahan', {style:'h3'}),
  {_type:'table',headerRows:0,rows:[{cells:[cell('Durasi fleksibel'),cell('Sesuaikan dengan kebutuhan peserta')]},{cells:[cell('Transportasi'),cell('Pertimbangkan jarak antarlokasi')]}]},
  {_type:'calloutBlock',type:'warning',body:[block('Jadwal merupakan contoh struktur dan bukan jaminan operasional.'),block('Lihat informasi perjalanan resmi melalui tautan aman.',{markDefs:[{_key:'official',_type:'externalLink',href:'https://www.indonesia.travel/',openInNewTab:true}],marks:['official']})]},
  block('Langkah Berikutnya', {style:'h2'}),
  block('Baca artikel terkait.',{markDefs:[{_key:'related',_type:'internalLink',reference:{slug:'conscious-travel-corporate-travel-sustainable-experiences'}}],marks:['related']}),
  block('Siapkan informasi dasar berikut.'),
  block('Jumlah peserta',{listItem:'bullet'}),block('Rentang waktu',{listItem:'bullet'}),
  {_type:'ctaBlock',eyebrow:'Mulai berdiskusi',title:'Rancang perjalanan yang relevan',description:'Bagikan tujuan dan kebutuhan perjalanan Anda.',buttonLabel:'Chat WhatsApp',destinationType:'whatsapp',style:'primary',trackingId:'fixture-whatsapp-cta'},
  {_type:'ctaBlock',title:'Lihat pilihan pengalaman',description:'Jelajahi struktur pengalaman ConsciousTravel.',buttonLabel:'Lihat experiences',destinationType:'experiences',style:'soft',trackingId:'fixture-experiences-cta'},
]

const normalized=normalizeReaderBlocks(body,articleSlug)
const toc=createBlogToc(normalized,articleSlug)
const articleBody=renderPortableText(normalized,{articleSlug,headingIds:toc.headingIds})
const tocHtml=renderBlogToc(toc,`blog-toc-title-${articleSlug}`)
const html=`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Integrated Reader Fixture</title><link rel="stylesheet" href="/css/variables.css"><link rel="stylesheet" href="/css/style.css"><link rel="stylesheet" href="/css/blog-foundation.css"></head><body data-page="blog" data-static-blog="true"><header id="site-header"></header><main id="main-content"><div id="page-root"><article class="blog-article"><header class="blog-article-header"><div class="container narrow"><p class="blog-category">Fixture QA</p><h1>Panduan Struktur Perjalanan Bali</h1><p class="blog-lead">Contoh lokal untuk memeriksa pengalaman Reader Blocks secara menyeluruh.</p></div></header>${tocHtml}<div class="container blog-prose" data-blog-article-body>${articleBody}</div><!-- /blog-article-body --></article></div></main><footer id="site-footer"></footer><script src="/data/content.js"></script><script src="/js/main.js"></script></body></html>`

assert.equal(toc.visible,true)
assert.equal(toc.items.length,5)
assert.deepEqual(toc.items.map((item)=>item.text),['Merencanakan Rute Bali','Rute Pertama','Perbandingan Rute','Catatan Perencanaan','Langkah Berikutnya'])
assert.deepEqual(toc.items[1].children.map((item)=>item.text),['Hari Pertama'])
assert.deepEqual(toc.items[3].children.map((item)=>item.text),['Detail Tambahan'])
assert.equal(toc.collapsible,false)
assert.equal((articleBody.match(/<h3/g)||[]).length>=3,true)
assert.equal((articleBody.match(/blog-data-table/g)||[]).length,2)
assert.match(articleBody,/<thead>/);assert.match(articleBody,/<table class="blog-data-table"><tbody>/)
assert.equal((articleBody.match(/blog-callout blog-callout--/g)||[]).length,2)
assert.match(articleBody,/blog-callout--tip/);assert.match(articleBody,/blog-callout--warning/)
assert.match(articleBody,/>Opsional</)
assert.equal((articleBody.match(/data-blog-reader-cta/g)||[]).length,2)
assert.match(articleBody,/data-destination-type="whatsapp"/);assert.match(articleBody,/data-destination-type="experiences"/)
assert.match(articleBody,/data-wa-key="general"/);assert.match(articleBody,/href="\/contact\/#inquiry"/);assert.match(articleBody,/href="\/experiences\/"/)
assert.match(articleBody,/href="\/blog\/conscious-travel-corporate-travel-sustainable-experiences\/"/)
assert.match(articleBody,/href="https:\/\/www\.indonesia\.travel\/" target="_blank" rel="noopener noreferrer"/)
assert.match(articleBody,/width="1200" height="800"/);assert.match(articleBody,/srcset=/);assert.match(articleBody,/loading="lazy" decoding="async"/);assert.match(articleBody,/<figcaption>Fixture gambar/)
const hrefs=[...tocHtml.matchAll(/href="#([^"]+)"/g)].map((match)=>match[1])
const ids=[...toc.headingIds.values()]
assert.deepEqual(hrefs,ids);assert.equal(new Set(ids).size,ids.length)
for(const id of ids)assert.match(articleBody,new RegExp(`<h[23] id="${id}">`))
assert.match(tocHtml,/<ul class="blog-toc-children"><li><a href="#hari-pertama">Hari Pertama<\/a><\/li><\/ul>/)
assert.doesNotMatch(tocHtml,/data-blog-toc-toggle|Hari 1|Mulai dari prioritas|Rancang perjalanan|Rute A/)
assert.doesNotMatch(html,/<(?:script onclick|iframe|object|embed)\b|javascript:|data:text\/html/i)

const invalidCases=[
  [[{_type:'table',headerRows:1,rows:[{cells:[cell('A'),cell('B')]},{cells:[cell('A')]}]}],/inconsistent cell count/],
  [[{_type:'itineraryBlock',dayTitle:'Hari',items:[]}],/items must contain 1–12/],
  [[{_type:'calloutBlock',type:'invalid',body:[block('Isi')]}],/type is invalid/],
  [[{_type:'ctaBlock',title:'CTA',buttonLabel:'Buka',destinationType:'customInternal',customPath:'javascript:alert(1)',style:'soft',trackingId:'safe-id'}],/customPath/],
  [[{_type:'ctaBlock',title:'CTA',buttonLabel:'Buka',destinationType:'contact',style:'soft',trackingId:'duplicate-id'},{_type:'ctaBlock',title:'CTA 2',buttonLabel:'Buka',destinationType:'experiences',style:'soft',trackingId:'duplicate-id'}],/duplicate trackingId/],
]
for(const [fixture,pattern] of invalidCases)assert.throws(()=>normalizeReaderBlocks(fixture,articleSlug),pattern)
assert.throws(()=>createBlogToc([block('',{style:'h2'})],articleSlug),/empty or malformed/)

const runtime=await readFile(new URL('../js/main.js',import.meta.url),'utf8')
assert.equal((runtime.match(/pushTrackingEvent\("blog_reader_cta_click"/g)||[]).length,1)
assert.equal((runtime.match(/pushTrackingEvent\("whatsapp_cta_click"/g)||[]).length,1)
assert.match(runtime,/trackingId: link\.dataset\.trackingId[\s\S]*destinationType: link\.dataset\.destinationType[\s\S]*articleSlug: link\.dataset\.articleSlug/)
assert.match(runtime,/blogReaderTrackingBound === "true"/)
assert.match(runtime,/waTrackingBound === "true"/)
assert.match(runtime,/blogTocBound === "true"/)

assert.throws(()=>normalizeReaderBlocks([
  {_type:'calloutBlock',type:'tip',title:'Unsafe link',body:[block('Tautan ditolak',{markDefs:[{_key:'bad',_type:'externalLink',href:'javascript:alert(1)'}],marks:['bad']})]},
],articleSlug),/unsafe external link/)
const malicious=normalizeReaderBlocks([
  block('<script>alert(1)</script>',{style:'h2'}),
  {_type:'table',headerRows:0,rows:[{cells:[cell('<img src=x onerror=alert(1)>')]}]},
  {_type:'itineraryBlock',dayTitle:'Hari aman',items:[{time:'09.00',activity:'Aktivitas <b>aman</b>',notes:'<iframe>teks</iframe>',optional:false}]},
  {_type:'calloutBlock',type:'tip',title:'" onclick="alert(1)',body:[block('Teks aman')]},
],articleSlug)
const maliciousHtml=renderPortableText(malicious,{articleSlug,headingIds:createBlogToc(malicious,articleSlug).headingIds})
assert.doesNotMatch(maliciousHtml,/<script>|<img src=x|<iframe>|<[^>]+\sonclick=/i)
assert.match(maliciousHtml,/&lt;script&gt;alert\(1\)&lt;\/script&gt;/)

const outputArg=process.argv.find((arg)=>arg.startsWith('--qa-output='))
if(outputArg)await writeFile(outputArg.slice('--qa-output='.length),html,'utf8')
console.log('Integrated Reader fixture lulus: full flow, TOC, Reader Blocks, image, links, failures, dan security.')
