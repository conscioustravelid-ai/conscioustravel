import assert from 'node:assert/strict'
import {JSDOM} from 'jsdom'
import {createBlogTablePasteHandler,parseHtmlTable,parseMarkdownTable,toNativeTable} from '../lib/tablePaste.ts'

const htmlDocument=(html:string)=>new JSDOM(html).window.document

assert.deepEqual(parseHtmlTable('<table><thead><tr><th>Route</th><th>Base</th></tr></thead><tbody><tr><td>A</td><td>Sanur</td></tr></tbody></table>',htmlDocument),{headerRows:1,rows:[['Route','Base'],['A','Sanur']]})
assert.deepEqual(parseHtmlTable('<table><tr><th>Route</th><th>Base</th></tr><tr><td>A</td><td>Sanur</td></tr></table>',htmlDocument)?.headerRows,1)
assert.deepEqual(parseHtmlTable('<table><tr><td><p>Route</p></td><td>Base</td></tr><tr><td>A</td><td>Ubud</td></tr></table>',htmlDocument),{headerRows:0,rows:[['Route','Base'],['A','Ubud']]})
const hostileHtml='<style>body{display:none}</style><table class="x" onclick="bad()"><tr><th>Safe<script>alert(1)</script></th><th><img src=x onerror=bad()>Name</th></tr><tr><td><iframe>bad</iframe>Text</td><td><a href="javascript:bad()">Link label</a></td></tr></table>'
assert.deepEqual(parseHtmlTable(hostileHtml,htmlDocument),{headerRows:1,rows:[['Safe','Name'],['Text','Link label']]})
assert.equal(parseHtmlTable('<p>Prose penting</p><table><tr><td>A</td></tr></table>',htmlDocument),undefined)
assert.equal(parseHtmlTable('<table><tr><td>A</td><td>B</td></tr><tr><td>C</td></tr></table>',htmlDocument),undefined)
assert.equal(parseHtmlTable('<table><tr><td>A<table><tr><td>B</td></tr></table></td></tr></table>',htmlDocument),undefined)

assert.deepEqual(parseMarkdownTable('| Route | Base | Ritme |\n| --- | --- | --- |\n| A | Sanur | Aktif |\n| B | Ubud | Santai |'),{headerRows:1,rows:[['Route','Base','Ritme'],['A','Sanur','Aktif'],['B','Ubud','Santai']]})
assert.deepEqual(parseMarkdownTable('Route | Base\n:--- | ---:\nA | Ubud'),{headerRows:1,rows:[['Route','Base'],['A','Ubud']]})
assert.deepEqual(parseMarkdownTable('| Notes |\n| --- |\n| Bali \\| Lombok |'),{headerRows:1,rows:[['Notes'],['Bali | Lombok']]})
assert.deepEqual(parseMarkdownTable('| A | B |\n| --- | --- |\n|  | value |')?.rows,[['A','B'],['','value']])
assert.deepEqual(parseMarkdownTable('| Code |\n| --- |\n| <script>alert(1)</script> |')?.rows,[['Code'],['<script>alert(1)</script>']])
assert.equal(parseMarkdownTable('Kalimat biasa dengan satu | karakter.'),undefined)
assert.equal(parseMarkdownTable('A | B\n-- | ---\n1 | 2'),undefined)
assert.equal(parseMarkdownTable('A | B\n--- | ---\n1'),undefined)

let key=0
const native=toNativeTable({headerRows:1,rows:[['A','B'],['1','2']]},()=>`key-${++key}`)
assert.equal(native._type,'table');assert.equal(native.headerRows,1);assert.equal(native.rows.length,2)
assert.equal(native.rows[0].cells[0].value[0].style,'normal')
assert.equal(native.rows[0].cells[0].value[0].children[0].text,'A')
const keys=[native._key,...native.rows.flatMap((row)=>[row._key,...row.cells.flatMap((cell)=>[cell._key,...cell.value.flatMap((block)=>[block._key,...block.children.map((span)=>span._key)])])])]
assert.equal(new Set(keys).size,keys.length)

const paste=(html:string,text:string,path:unknown[]=[])=>createBlogTablePasteHandler({createDocument:htmlDocument,createKey:()=>`paste-${++key}`})({
  event:{clipboardData:{getData:(type:string)=>type==='text/html'?html:text}},
  path,
} as never)
const htmlPaste=paste('<table><tr><th>A</th></tr><tr><td>1</td></tr></table>','A\n1',['body',0])
assert.equal(htmlPaste?.insert?.[0]._type,'table');assert.deepEqual(htmlPaste?.path,['body',0])
assert.equal(paste('','| A |\n| --- |\n| 1 |')?.insert?.[0]._type,'table')
assert.equal(paste('','Paragraf biasa'),undefined)
assert.equal(paste('','https://conscioustravel.id/'),undefined)
assert.equal(paste('<p>Intro</p><table><tr><td>A</td></tr></table>','A'),undefined)

console.log('Smart Table Paste parser tests lulus: HTML, Markdown, escaped pipes, fallback, security, dan native shape.')
