import assert from 'node:assert/strict'
import {JSDOM} from 'jsdom'
import {classifyItinerary, createBlogPasteHandler, parseHtmlItineraryPaste, parseMarkdownItineraryPaste} from '../lib/itineraryPaste.ts'

let sequence=0;const key=()=>`k${++sequence}`;const document=(html:string)=>new JSDOM(html).window.document
const markdown=`### Day 1 — Sanur\n\nNarasi hari pertama.\n\n### Day 2 — Ubud\n\n| Waktu | Agenda | Area | Catatan | Opsional |\n| --- | --- | --- | --- | --- |\n| 08.00 | Sarapan | Sanur | Santai | Tidak |\n| 10.00 | Ubud ringan / opsional | Gianyar | 2 jam | Ya |\n\nParagraf sesudah.\n\n### Day 3 — Airport\n\nPulang.`
const parsed=parseMarkdownItineraryPaste(markdown,key)!
assert.deepEqual(parsed.map((block)=>block._type),['block','block','block','itineraryBlock','block','block','block'])
assert.equal((parsed[3].items as any[])[0].optional,false)
assert.equal((parsed[3].items as any[])[1].optional,true)
assert.equal((parsed[3].items as any[])[1].activity,'Ubud ringan / opsional')
assert.equal(parseMarkdownItineraryPaste('### Day 1\n\nNarasi saja.',key),undefined)

const html=`<h3 onclick="bad()">Day 2 &lt;script&gt;</h3><p>Pengantar <img src=x onerror=bad></p><table><thead><tr><th>Time</th><th>Activity</th></tr></thead><tbody><tr><td>10.00<script>bad()</script></td><td>Bird Park<iframe></iframe></td></tr></tbody></table><p>Penutup</p><h3>Day 3</h3><p>Narasi</p>`
const htmlParsed=parseHtmlItineraryPaste(html,{createDocument:document,createKey:key})!
assert.deepEqual(htmlParsed.map((block)=>block._type),['block','block','itineraryBlock','block','block','block'])
assert.equal((htmlParsed[2].items as any[])[0].time,'10.00')
assert.equal(JSON.stringify(htmlParsed).includes('bad()'),false)

const simple=classifyItinerary({headerRows:1,rows:[['WAKTU','AKTIVITAS'],['08.00','Sarapan']]},'Hari 1',key)!
assert.equal((simple.items as any[])[0].optional,false)
assert.equal(classifyItinerary({headerRows:1,rows:[['Route','Base'],['A','B']]},'Hari 1',key),undefined)
assert.equal(classifyItinerary({headerRows:1,rows:[['Waktu','Agenda'],['','Sarapan']]},'Hari 1',key),undefined)
assert.equal(classifyItinerary({headerRows:1,rows:[['Waktu','Agenda'],['08.00','Sarapan']]},'',key),undefined)
const noHeading=parseMarkdownItineraryPaste('| Waktu | Agenda |\n| --- | --- |\n| 08.00 | Sarapan |',key)
assert.equal(noHeading,undefined)

const mixed=`### Hari 1\n\n| Route | Base | Ritme |\n| --- | --- | --- |\n| A | B | C |\n\n### Hari 2\n\n| Waktu | Agenda |\n| --- | --- |\n| 09.00 | Jalan |`
assert.deepEqual(parseMarkdownItineraryPaste(mixed,key)!.map((block)=>block._type),['block','table','block','itineraryBlock'])

const handler=createBlogPasteHandler({createDocument:document,createKey:key})
const event=(plain:string,html='')=>({clipboardData:{getData:(type:string)=>type==='text/html'?html:plain}} as any)
assert.ok(handler({event:event(markdown),path:['body']} as any))
assert.equal(handler({event:event('paragraf biasa'),path:['body']} as any),undefined)
assert.equal(handler({event:event('https://example.com'),path:['body']} as any),undefined)
assert.ok(handler({event:event('| A | B |\n| --- | --- |\n| 1 | 2 |'),path:['body']} as any))
assert.equal(handler({event:event('| broken |'),path:['body']} as any),undefined)
console.log('Smart Itinerary Paste tests passed.')
