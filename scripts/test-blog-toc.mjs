import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {BLOG_TOC_PRIMARY_LIMIT,createBlogToc,headingAnchorBase,headingPlainText,renderBlogToc} from './lib/blog-toc.mjs'
import {renderPortableText} from './lib/portable-text.mjs'

const span=(text,marks=[])=>({_type:'span',text,marks})
const heading=(text,style='h2')=>({_type:'block',style,markDefs:[],children:[span(text)]})
const tocFor=(count)=>createBlogToc(Array.from({length:count},(_,index)=>heading(`Bagian ${index+1}`)),'toc-fixture')

assert.equal(BLOG_TOC_PRIMARY_LIMIT,6)
assert.equal(tocFor(2).visible,false)
assert.equal(tocFor(3).visible,true)
assert.equal(tocFor(6).collapsible,false)
assert.equal(tocFor(7).collapsible,true)
assert.equal(tocFor(16).items.length,16)

const hierarchyBlocks=[
  heading('H3 Orphan','h3'),
  heading('Rute A'),heading('Hari 1','h3'),heading('Hari 2','h3'),heading('Detail H4','h4'),
  heading('Rute B'),heading('Tips','h3'),heading('Tips'),heading('Tips','h3'),
]
const hierarchy=createBlogToc(hierarchyBlocks,'hierarchy')
assert.deepEqual(hierarchy.items.map((item)=>item.text),['Rute A','Rute B','Tips'])
assert.deepEqual(hierarchy.items[0].children.map((item)=>item.text),['Hari 1','Hari 2'])
assert.deepEqual(hierarchy.items[1].children.map((item)=>item.text),['Tips'])
assert.deepEqual(hierarchy.items[2].children.map((item)=>item.text),['Tips'])
assert.deepEqual(hierarchy.orphanHeadings.map((item)=>item.text),['H3 Orphan'])
assert.deepEqual([...hierarchy.headingIds.values()],['h3-orphan','rute-a','hari-1','hari-2','rute-b','tips','tips-2','tips-3'])
const hierarchyBody=renderPortableText(hierarchyBlocks,{headingIds:hierarchy.headingIds})
assert.match(hierarchyBody,/<h3 id="h3-orphan">/)
assert.doesNotMatch(hierarchyBody,/<h4 id=/)

assert.equal(headingAnchorBase('Estimasi Budget Bali'),'estimasi-budget-bali')
assert.equal(headingAnchorBase('FAQ & Tips'),'faq-tips')
assert.equal(headingAnchorBase('Éksplorasi Indonesia 2026'),'éksplorasi-indonesia-2026')
assert.equal(headingAnchorBase('✨ !!!'),'bagian')
assert.equal(headingPlainText({...heading('Route A'),children:[span('Route '),span('A — '),span('First Timer',['strong'])]}),'Route A — First Timer')
assert.throws(()=>createBlogToc([heading('', 'h3')],'empty-heading'),/Invalid H3.*empty or malformed/)

const malicious='<script onclick="alert(1)">javascript:</script>'
const maliciousBlocks=[heading(malicious),heading(malicious,'h3'),heading('Aman'),heading('Aman')]
const maliciousToc=createBlogToc(maliciousBlocks,'malicious-heading')
const maliciousHtml=renderBlogToc(maliciousToc,'blog-toc-title-malicious-heading')
const articleHtml=renderPortableText(maliciousBlocks,{headingIds:maliciousToc.headingIds})
assert.doesNotMatch(maliciousHtml,/<script|<[^>]+\sonclick=|href="#javascript:/i)
assert.match(maliciousHtml,/&lt;script onclick=&quot;alert\(1\)&quot;&gt;javascript:/)
const hrefs=[...maliciousHtml.matchAll(/href="#([^"]+)"/g)].map((match)=>match[1])
const ids=[...articleHtml.matchAll(/<h[23] id="([^"]+)"/g)].map((match)=>match[1])
assert.deepEqual(hrefs,ids)
assert.equal(new Set(ids).size,ids.length)

const excluded=[
  heading('Top Level 1'),
  {_type:'itineraryBlock',dayTitle:'Itinerary title'},
  {_type:'calloutBlock',title:'Callout title',body:[heading('Nested callout')]},
  {_type:'table',rows:[{cells:[{value:[heading('Nested table')]}]}]},
  {_type:'ctaBlock',title:'CTA title'},
  heading('Top Level 2'),heading('Top Level 3'),
]
assert.deepEqual(createBlogToc(excluded,'excluded').items.map((item)=>item.text),['Top Level 1','Top Level 2','Top Level 3'])

const six=tocFor(6)
const sixHtml=renderBlogToc(six,'six-title')
assert.doesNotMatch(sixHtml,/data-blog-toc-toggle|data-blog-toc-long/)
const seven=tocFor(7)
const sevenHtml=renderBlogToc(seven,'seven-title')
assert.match(sevenHtml,/<button class="blog-toc-toggle" type="button" aria-expanded="false" aria-controls="seven-title-list" data-blog-toc-toggle hidden>Lihat semua bagian<\/button>/)
assert.equal((sevenHtml.match(/data-blog-toc-overflow/g)||[]).length,1)
assert.equal((renderBlogToc(tocFor(16),'sixteen-title').match(/data-blog-toc-overflow/g)||[]).length,10)

const runtime=await readFile(new URL('../js/main.js',import.meta.url),'utf8')
assert.equal((runtime.match(/function bindBlogTocToggle\(/g)||[]).length,1)
assert.equal((runtime.match(/bindBlogTocToggle\(\);/g)||[]).length,1)
assert.match(runtime,/blogTocBound === "true"/)
assert.match(runtime,/toggle\.hidden = false/)
assert.match(runtime,/toggle\.textContent = expanded \? "Tampilkan lebih sedikit" : "Lihat semua bagian"/)
assert.doesNotMatch(runtime,/data-blog-toc-toggle[^\n]*innerHTML/)

console.log('Blog TOC v1.1 tests lulus: hierarchy, thresholds, compact markup, Unicode, security, exclusions, dan toggle contract.')
