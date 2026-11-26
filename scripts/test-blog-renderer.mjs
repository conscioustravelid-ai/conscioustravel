import {normalizeSlug,sanityImageUrl} from './lib/blog-normalize.mjs'
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
  [sanityImageUrl({asset:{_ref:'image-abc123-1200x800-webp'}})==='https://cdn.sanity.io/images/7k96ai2c/production/abc123-1200x800.webp','Sanity image URL gagal mempertahankan dimensi asset'],
]
const failure=checks.find(([ok])=>!ok)
if(failure)throw new Error(failure[1])
console.log('Uji renderer berhasil: escaping, marks, list, link aman, internal route, dan slug validation.')
{
  const assertMap = (await import('node:assert/strict')).default
  const {readFileSync} = await import('node:fs')
  const {renderPortableText: render} = await import('./lib/portable-text.mjs')
  const {stripAllowedMapFrames} = await import('./lib/blog-map.mjs')
  const embedUrl = 'https://www.google.com/maps/d/embed?mid=1-U1T4WfCvNas2-rDSSMi1Xgb65k3lJU&ehbc=2E312F&noprof=1'
  const map = {_type: 'mapEmbed', embedUrl, title: 'Bali "Selatan"', caption: '<script>'}
  const html = render([map])
  assertMap.match(html, /<iframe.*ehbc=2E312F&amp;noprof=1.*title="Bali &quot;Selatan&quot;".*width="640" height="480" loading="lazy"/)
  assertMap.match(html, /<figcaption>&lt;script&gt;<\/figcaption>/)
  assertMap.match(html, /\/maps\/d\/viewer\?mid=.*rel="noopener noreferrer"/)
  assertMap.doesNotMatch(stripAllowedMapFrames(html), /<iframe/)
  assertMap.match(stripAllowedMapFrames(html.replace('www.google.com', 'evil.example')), /<iframe/)
  for (const url of ['', embedUrl.replace('https:', 'http:'), embedUrl.replace('/embed', '/viewer'),
    embedUrl.replace('www.google.com', 'www.google.com.evil.example'), embedUrl + '&mid=second',
    embedUrl.replace(/mid=[^&]+/, 'mid=%3Cbad%3E'), 'javascript:alert(1)']) {
    const fallback = render([{...map, embedUrl: url, openUrl: 'https://www.google.com/maps/d/viewer?mid=abc'}])
    assertMap.doesNotMatch(fallback, /<iframe/)
    assertMap.match(fallback, /Peta sematan tidak tersedia.*\/maps\/d\/viewer\?mid=abc/)
  }
  assertMap.doesNotMatch(render([{_type: 'mapEmbed', openUrl: 'https://evil.example'}]), /<iframe|<a /)
  const section = text => ({_type: 'block', style: 'h2', children: [{_type: 'span', text}]})
  assertMap.match(render([section('Sebelum'), map, section('Sesudah')]), /<h2>Sebelum<\/h2>\s*<figure[\s\S]*<\/figure>\s*<h2>Sesudah<\/h2>/)
  const css = readFileSync(new URL('../css/blog-foundation.css', import.meta.url), 'utf8')
  assertMap.match(css, /\.blog-map-frame\s*\{[^}]*width: 100%[^}]*height: auto[^}]*aspect-ratio: 4 \/ 3/)
}
