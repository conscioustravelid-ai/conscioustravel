import {normalizeSlug} from './lib/blog-normalize.mjs'
import {renderPortableText} from './lib/portable-text.mjs'

const body=[
  {_type:'block',style:'h2',markDefs:[],children:[{_type:'span',text:'Judul <aman>',marks:[]}]},
  {_type:'block',style:'normal',markDefs:[{_key:'safe',_type:'externalLink',href:'https://example.com/',openInNewTab:true},{_key:'unsafe',_type:'externalLink',href:'javascript:alert(1)'},{_key:'internal',_type:'internalLink',reference:{slug:'artikel-aman'}}],children:[{_type:'span',text:'Eksternal',marks:['safe']},{_type:'span',text:' Tidak aman',marks:['unsafe']},{_type:'span',text:' Internal',marks:['internal']}]},
  {_type:'block',style:'normal',listItem:'bullet',markDefs:[],children:[{_type:'span',text:'Satu',marks:['strong']}]},
  {_type:'block',style:'normal',listItem:'bullet',markDefs:[],children:[{_type:'span',text:'Dua',marks:['em']}]},
  {_type:'unsupported',html:'<script>alert(1)</script>'},
]
const html=renderPortableText(body)
const checks=[
  [html.includes('Judul &lt;aman&gt;'),'Text escaping gagal'],
  [html.includes('target="_blank" rel="noopener noreferrer"'),'Proteksi external link gagal'],
  [!html.includes('javascript:'),'Protokol tidak aman dirender'],
  [html.includes('href="/blog/artikel-aman/"'),'Internal Blog link gagal'],
  [html.includes('<ul>')&&html.includes('<strong>Satu</strong>')&&html.includes('<em>Dua</em>'),'List atau marks gagal'],
  [!html.includes('<script>'),'Block tidak didukung dirender'],
  [normalizeSlug('artikel-aman')==='artikel-aman'&&!normalizeSlug('../bahaya')&&!normalizeSlug('Huruf-Besar'),'Validasi slug gagal'],
]
const failure=checks.find(([ok])=>!ok)
if(failure)throw new Error(failure[1])
console.log('Uji renderer berhasil: escaping, marks, list, link aman, internal route, dan slug validation.')
