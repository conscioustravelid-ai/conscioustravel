import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CONNECTION_TEST_SLUG, SITE_ORIGIN } from './lib/sanity-config.mjs'
import { normalizeSlug } from './lib/blog-normalize.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const blogRoot = path.join(root, 'blog')
const failures = []
const check = (condition, message) => { if (!condition) failures.push(message) }
const read = (relative) => readFile(path.join(root, relative), 'utf8')

function jsonLd(html, type) {
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      const value = JSON.parse(match[1])
      if (value?.['@type'] === type) return value
    } catch { /* reported by required schema checks */ }
  }
  return null
}

async function validatePage(relative, { article = false } = {}) {
  const html = await read(relative)
  check((html.match(/<h1\b/gi) || []).length === 1, `${relative}: jumlah H1 harus satu`)
  check(/<title>[^<]+<\/title>/i.test(html), `${relative}: title hilang`)
  check(/<meta name="description" content="[^"]+">/i.test(html), `${relative}: meta description hilang`)
  check(new RegExp(`<link rel="canonical" href="${SITE_ORIGIN.replaceAll('.', '\\.')}/`).test(html), `${relative}: canonical hilang`)
  check(/data-static-blog="true"/.test(html), `${relative}: static Blog gate hilang`)
  check(/blog-foundation\.css\?v=blog-toc-1/.test(html), `${relative}: Blog stylesheet version hilang`)
  for (const property of ['og:title', 'og:description', 'og:url', 'og:image']) {
    check(new RegExp(`<meta property="${property}" content="[^"]+"`, 'i').test(html), `${relative}: ${property} hilang`)
  }
  for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    check(new RegExp(`<meta name="${name}" content="[^"]+"`, 'i').test(html), `${relative}: ${name} hilang`)
  }
  if (article) {
    const body = html.match(/<div class="container blog-prose" data-blog-article-body>([\s\S]*?)<\/div><!-- \/blog-article-body -->/i)?.[1] || ''
    check(body.trim().length > 0, `${relative}: body artikel kosong`)
    check(!/<(?:script|iframe|object|embed)\b|javascript:/i.test(body), `${relative}: HTML tidak aman`)
    check(!/<[^>]+\son(?:error|click)=/i.test(body), `${relative}: event handler tidak aman`)
    const pageIds = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
    check(new Set(pageIds).size === pageIds.length, `${relative}: duplicate id attribute ditemukan`)
    const headingIds = [...body.matchAll(/<h2 id="([^"]+)"/g)].map((match) => match[1])
    const tocMarkup = html.match(/<nav class="blog-toc"[\s\S]*?<\/nav>/i)?.[0] || ''
    check(headingIds.length >= 3 ? Boolean(tocMarkup) : !tocMarkup, `${relative}: threshold TOC tidak sesuai jumlah H2`)
    if (tocMarkup) {
      check(/aria-labelledby="blog-toc-title-[^"]+"/.test(tocMarkup) && />Dalam Artikel Ini<\/p>/.test(tocMarkup), `${relative}: label TOC tidak aksesibel`)
      const tocIds = [...tocMarkup.matchAll(/href="#([^"]+)"/g)].map((match) => match[1])
      check(tocIds.length === headingIds.length, `${relative}: jumlah anchor TOC tidak sesuai H2`)
      check(tocIds.every((id, index) => id === headingIds[index]), `${relative}: urutan atau target TOC tidak cocok`)
      check(tocIds.every((id) => /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(id)), `${relative}: anchor TOC tidak aman`)
      check(tocIds.every((id) => headingIds.filter((candidate) => candidate === id).length === 1), `${relative}: anchor TOC tidak resolve tepat satu H2`)
    }
    for (const match of body.matchAll(/href="(\/blog\/([^/]+)\/)"/g)) {
      check(Boolean(normalizeSlug(match[2])), `${relative}: internal Blog link tidak valid`)
    }
    const articleSchema = jsonLd(html, 'Article')
    check(Boolean(articleSchema), `${relative}: Article JSON-LD hilang/tidak valid`)
    check(Boolean(articleSchema?.headline && articleSchema?.datePublished && articleSchema?.author?.name && articleSchema?.mainEntityOfPage), `${relative}: Article JSON-LD tidak lengkap`)
    const breadcrumbSchema = jsonLd(html, 'BreadcrumbList')
    check(Array.isArray(breadcrumbSchema?.itemListElement) && breadcrumbSchema.itemListElement.length >= 3, `${relative}: Breadcrumb JSON-LD tidak lengkap`)
  }
  return html
}

try {
  await access(path.join(blogRoot, 'index.html'))
  const manifest = JSON.parse(await read('.blog-generated-manifest.json'))
  check(manifest.version === 2, 'Manifest version tidak valid')
  check(manifest.perspective === 'published', 'Manifest bukan published perspective')
  check(Array.isArray(manifest.generatedSlugs), 'Manifest generatedSlugs tidak valid')
  check(Array.isArray(manifest.indexableSlugs), 'Manifest indexableSlugs tidak valid')
  check(manifest.generatedSlugs.every(normalizeSlug), 'Manifest memuat slug tidak valid')
  check(manifest.indexableSlugs.every((slug) => manifest.generatedSlugs.includes(slug)), 'Manifest indexableSlugs tidak konsisten')
  check(!manifest.generatedSlugs.includes(CONNECTION_TEST_SLUG), 'Connection-test masih dimiliki generator')
  check(!manifest.indexableSlugs.includes(CONNECTION_TEST_SLUG), 'Connection-test tidak boleh indexable')
  check(!manifest.sourceDocumentIds.some((id) => id.startsWith('drafts.')), 'Draft ditemukan dalam manifest')

  const listing = await validatePage('blog/index.html')
  check(/<meta name="robots" content="index, follow">/i.test(listing), 'Listing Blog harus index, follow')
  check(!listing.includes(CONNECTION_TEST_SLUG), 'Connection-test muncul di listing')
  check(/blog-categories/.test(listing) && /blog-cta/.test(listing), 'Kategori atau CTA listing hilang')
  check(/<h1>Conscious Travel Journal<\/h1>/.test(listing), 'H1 editorial ringkas listing hilang')
  check((listing.match(/class="blog-featured-card"/g) || []).length <= 1, 'Featured Article terduplikasi')
  check(/class="blog-section-heading blog-listing-heading"/.test(listing), 'Heading listing ringkas hilang')
  check(/<ul aria-label="Kategori Blog">/.test(listing), 'Category chips listing hilang')
  if (manifest.indexableSlugs.length === 1) check(!/class="section blog-latest"/.test(listing), 'Latest harus disembunyikan ketika tidak ada artikel tambahan')

  try {
    await access(path.join(blogRoot, CONNECTION_TEST_SLUG, 'index.html'))
    check(false, 'Route stale connection-test masih tersedia')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  for (const slug of manifest.generatedSlugs) await validatePage(`blog/${slug}/index.html`, { article: true })

  const directories = (await readdir(blogRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name)
  for (const directory of directories) check(manifest.generatedSlugs.includes(directory), `Route stale ditemukan: ${directory}`)

  const sitemap = await read('sitemap.xml')
  check(/^<\?xml[\s\S]*<urlset[\s\S]*<\/urlset>\s*$/i.test(sitemap), 'Sitemap XML tidak valid secara struktural')
  check(sitemap.includes(`<loc>${SITE_ORIGIN}/blog/</loc>`), 'Listing Blog hilang dari sitemap')
  check(!sitemap.includes(`/${CONNECTION_TEST_SLUG}/`), 'Connection-test muncul di sitemap')
  for (const slug of manifest.indexableSlugs) check(sitemap.includes(`<loc>${SITE_ORIGIN}/blog/${slug}/</loc>`), `Sitemap kehilangan artikel: ${slug}`)
} catch (error) {
  failures.push(error.message)
}

if (failures.length) {
  console.error(`Validasi Blog gagal (${failures.length}):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}
console.log('Validasi Blog berhasil: listing, routes, manifest, SEO, structured data, sitemap, dan keamanan HTML.')
