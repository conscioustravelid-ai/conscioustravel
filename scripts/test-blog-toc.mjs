import assert from 'node:assert/strict'
import {createBlogToc,headingAnchorBase,headingPlainText,renderBlogToc} from './lib/blog-toc.mjs'
import {renderPortableText} from './lib/portable-text.mjs'

const span=(text,marks=[])=>({_type:'span',text,marks})
const heading=(text,style='h2')=>({_type:'block',style,markDefs:[],children:[span(text)]})
const tocFor=(labels)=>createBlogToc(labels.map((label)=>heading(label)),'toc-fixture')

assert.equal(tocFor(['Satu']).visible,false)
assert.equal(tocFor(['Satu','Dua']).visible,false)
assert.equal(tocFor(['Satu','Dua','Tiga']).visible,true)
assert.deepEqual(tocFor(['Pertama','Kedua','Ketiga']).items.map((item)=>item.text),['Pertama','Kedua','Ketiga'])
assert.deepEqual(tocFor(['Tips','Tips','Tips']).items.map((item)=>item.id),['tips','tips-2','tips-3'])
assert.equal(headingAnchorBase('Estimasi Budget Bali'),'estimasi-budget-bali')
assert.equal(headingAnchorBase('FAQ & Tips'),'faq-tips')
assert.equal(headingAnchorBase('Éksplorasi Indonesia 2026'),'éksplorasi-indonesia-2026')
assert.equal(headingAnchorBase('✨ !!!'),'bagian')
assert.deepEqual(tocFor(['✨','✨','✨']).items.map((item)=>item.id),['bagian','bagian-2','bagian-3'])
assert.equal(headingPlainText({...heading('Route A'),children:[span('Route '),span('A — '),span('First Timer',['strong'])]}),'Route A — First Timer')
assert.throws(()=>createBlogToc([heading('')],'empty-heading'),/empty or malformed/)

const malicious='<script onclick="alert(1)">javascript:</script>'
const toc=createBlogToc([heading(malicious),heading('Aman'),heading('Aman')],'malicious-heading')
const tocHtml=renderBlogToc(toc,'blog-toc-title-malicious-heading')
const articleHtml=renderPortableText([heading(malicious),heading('Aman'),heading('Aman')],{headingIds:toc.headingIds})
assert.doesNotMatch(tocHtml,/<script|<[^>]+\sonclick=|href="#javascript:/i)
assert.match(tocHtml,/&lt;script onclick=&quot;alert\(1\)&quot;&gt;javascript:/)

const hrefs=[...tocHtml.matchAll(/href="#([^"]+)"/g)].map((match)=>match[1])
const ids=[...articleHtml.matchAll(/<h2 id="([^"]+)"/g)].map((match)=>match[1])
assert.deepEqual(hrefs,ids)
assert.equal(new Set(ids).size,ids.length)
for(const id of hrefs)assert.equal(ids.filter((candidate)=>candidate===id).length,1)

const mixed=[
  heading('Top Level 1'),
  heading('H3 tidak masuk','h3'),
  {_type:'itineraryBlock',dayTitle:'Itinerary title'},
  {_type:'calloutBlock',title:'Callout title',body:[heading('Nested callout')]},
  {_type:'table',rows:[{cells:[{value:[heading('Nested table')]}]}]},
  {_type:'ctaBlock',title:'CTA title'},
  heading('Top Level 2'),heading('Top Level 3'),
]
assert.deepEqual(createBlogToc(mixed,'mixed').items.map((item)=>item.text),['Top Level 1','Top Level 2','Top Level 3'])

console.log('Blog TOC tests lulus: threshold, Unicode, duplicates, security, exclusions, dan anchor matching.')
