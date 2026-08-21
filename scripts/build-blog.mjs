import {mkdir, readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {ALL_CATEGORIES_QUERY, ALL_PUBLISHED_POSTS_QUERY} from './lib/blog-queries.mjs'
import {sanityQuery} from './lib/sanity-client.mjs'
import {normalizePost} from './lib/blog-normalize.mjs'
import {eligiblePosts, routablePosts, selectFeatured, selectLatest, selectRelated} from './lib/blog-select.mjs'
import {cleanupGeneratedRoutes} from './lib/blog-cleanup.mjs'
import {escapeAttribute, escapeHtml, safeJson} from './lib/html-utils.mjs'
import {renderPortableText} from './lib/portable-text.mjs'
import {CONNECTION_TEST_ID, SANITY_CONFIG, SITE_ORIGIN} from './lib/sanity-config.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const blogRoot = path.join(root, 'blog')
const manifestPath = path.join(root, '.blog-generated-manifest.json')
const sitemapPath = path.join(root, 'sitemap.xml')
const fallbackImage = `${SITE_ORIGIN}/assets/images/group-local-lunch.webp`
const publisherLogo = `${SITE_ORIGIN}/assets/images/new-logo-conscious.webp`

async function readManifest() {
  try { return JSON.parse(await readFile(manifestPath, 'utf8')) }
  catch (error) { if (error.code === 'ENOENT') return null; throw new Error(`Manifest lama tidak valid: ${error.message}`) }
}

const dateLabel = (value) => value ? new Intl.DateTimeFormat('id-ID', {dateStyle:'long', timeZone:'UTC'}).format(new Date(value)) : ''
const dateOnly = (value) => value?.slice(0, 10) || ''
const meta = (name, content, property = false) => `<meta ${property ? 'property' : 'name'}="${escapeAttribute(name)}" content="${escapeAttribute(content)}">`
const jsonLd = (value) => `<script type="application/ld+json">${safeJson(value)}</script>`

function transformedImageUrl(baseUrl, width) {
  const url = new URL(baseUrl)
  url.searchParams.set('w', String(width)); url.searchParams.set('fit', 'max'); url.searchParams.set('auto', 'format'); url.searchParams.set('q', '85')
  return url.href
}

function imageMarkup(post, {className = '', loading = 'lazy', sizes = '(max-width: 760px) calc(100vw - 40px), 760px'} = {}) {
  const info = post.coverImage
  if (!info || !post.coverImageAlt) return ''
  const variants = [480, 800, 1200, 1600].filter((width) => width < info.width).map((width) => `${escapeAttribute(transformedImageUrl(info.baseUrl, width))} ${width}w`)
  variants.push(`${escapeAttribute(info.baseUrl)} ${info.width}w`)
  const position = info.hotspot ? ` style="object-position:${Math.round(info.hotspot.x * 100)}% ${Math.round(info.hotspot.y * 100)}%"` : ''
  return `<img${className ? ` class="${className}"` : ''} src="${escapeAttribute(info.baseUrl)}" srcset="${variants.join(', ')}" sizes="${escapeAttribute(sizes)}" width="${info.width}" height="${info.height}" alt="${escapeAttribute(post.coverImageAlt)}"${loading ? ` loading="${loading}"` : ' fetchpriority="high"'} decoding="async"${position}>`
}

function articleCard(post, className = 'blog-card') {
  const media = imageMarkup(post, {sizes:'(max-width: 700px) calc(100vw - 40px), 420px'}) || '<span class="blog-image-fallback" aria-hidden="true">Conscious Travel Journal</span>'
  return `<article class="${className}"><a class="blog-card-media" href="/blog/${escapeAttribute(post.slug)}/" tabindex="-1" aria-hidden="true">${media}</a><div class="blog-card-body"><p class="blog-category">${escapeHtml(post.category.name)}</p><h3><a href="/blog/${escapeAttribute(post.slug)}/">${escapeHtml(post.title)}</a></h3><p>${escapeHtml(post.excerpt)}</p><p class="blog-meta">${escapeHtml(post.author.name)} <span aria-hidden="true">·</span> <time datetime="${escapeAttribute(post.publishedAt)}">${escapeHtml(dateLabel(post.publishedAt))}</time></p></div></article>`
}

function sharedHead() {
  return `<link rel="icon" type="image/png" sizes="377x377" href="/assets/images/favicon-logo-only.png">
  <link rel="apple-touch-icon" href="/assets/images/favicon-logo-only.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="/css/variables.css?v=phase2-editorial-4"><link rel="stylesheet" href="/css/style.css?v=phase2-visual-a-1"><link rel="stylesheet" href="/css/editorial.css?v=phase2-editorial-4"><link rel="stylesheet" href="/css/blog-foundation.css?v=sanity-phase-d4-1"><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NVVKFSSN');</script>`
}

function shell({head, content}) {
  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  ${head}
  ${sharedHead()}
</head>
<body data-page="blog" data-static-blog="true"><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NVVKFSSN" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript><header id="site-header"></header><main id="main-content"><div id="page-root">${content}</div></main><footer id="site-footer"></footer><script src="/data/content.js?v=phase2-revised-2" defer></script><script src="/js/main.js?v=phase2-editorial-4" defer></script></body>
</html>
`
}

function listingHtml(posts, categories) {
  const title = 'Blog ConsciousTravel | Cerita Perjalanan Bermakna'
  const description = 'Cerita dan panduan berbahasa Indonesia tentang perjalanan bermakna, corporate journeys, Study Tour, pengalaman lokal, dan impact.'
  const canonical = `${SITE_ORIGIN}/blog/`
  const featured = selectFeatured(posts)
  const latest = selectLatest(posts, featured)
  const featuredBlock = featured ? `<section class="blog-featured section"><div class="container"><div class="blog-section-heading blog-listing-heading"><p class="blog-kicker">Artikel pilihan</p><h2>Untuk Dibaca Hari Ini</h2></div><article class="blog-featured-card"><a class="blog-featured-media" href="/blog/${escapeAttribute(featured.slug)}/">${imageMarkup(featured, {loading:null, sizes:'(max-width: 768px) calc(100vw - 40px), 440px'}) || '<span class="blog-image-fallback" aria-hidden="true">Conscious Travel Journal</span>'}</a><div class="blog-featured-copy"><p class="blog-category">${escapeHtml(featured.category.name)}</p><h3><a href="/blog/${escapeAttribute(featured.slug)}/">${escapeHtml(featured.title)}</a></h3><p>${escapeHtml(featured.excerpt)}</p><p class="blog-meta">${escapeHtml(featured.author.name)} <span aria-hidden="true">·</span> ${escapeHtml(dateLabel(featured.publishedAt))}</p><a class="blog-read-link" href="/blog/${escapeAttribute(featured.slug)}/">Baca artikel <span aria-hidden="true">→</span></a></div></article></div></section>` : ''
  const latestBlock = latest.length ? `<section class="section blog-latest"><div class="container"><div class="blog-section-heading blog-listing-heading"><p class="blog-kicker">Jelajahi cerita</p><h2>Artikel Terbaru</h2></div><div class="blog-latest-list">${latest.map((post) => articleCard(post, 'blog-card blog-latest-card')).join('')}</div></div></section>` : ''
  const empty = posts.length ? '' : `<section class="section"><div class="container"><div class="blog-empty"><p class="blog-kicker">Conscious Travel Journal</p><h2>Segera hadir</h2><p>Cerita dan panduan perjalanan bermakna sedang kami siapkan.</p></div></div></section>`
  const categoryBlock = categories.length ? `<section class="section blog-categories"><div class="container"><div class="blog-section-heading blog-listing-heading"><p class="blog-kicker">Topik perjalanan</p><h2>Jelajahi Topik</h2></div><ul aria-label="Kategori Blog">${categories.map((category) => `<li><span>${escapeHtml(category.name)}</span></li>`).join('')}</ul></div></section>` : ''
  const cta = `<section class="blog-cta"><div class="container narrow"><p class="blog-kicker">Rancang perjalanan Anda</p><h2>Punya perjalanan yang ingin diwujudkan?</h2><p>Ceritakan kebutuhan, peserta, tujuan, dan waktu perjalanan Anda. Tim ConsciousTravel akan membantu menentukan langkah berikutnya.</p><a class="btn btn-light" href="/contact/#inquiry">Mulai diskusi</a></div></section>`
  return shell({head:`<title>${escapeHtml(title)}</title>\n  ${meta('description',description)}\n  ${meta('robots','index, follow')}\n  <link rel="canonical" href="${canonical}">\n  ${meta('og:type','website',true)}${meta('og:title',title,true)}${meta('og:description',description,true)}${meta('og:url',canonical,true)}${meta('og:image',featured?.ogImageUrl||fallbackImage,true)}${meta('twitter:card','summary_large_image')}${meta('twitter:title',title)}${meta('twitter:description',description)}${meta('twitter:image',featured?.ogImageUrl||fallbackImage)}`,content:`<section class="blog-hero"><div class="container"><p class="blog-kicker">Conscious Travel Journal</p><h1>Conscious Travel Journal</h1><p>Cerita, inspirasi, dan panduan untuk perjalanan yang lebih bermakna.</p></div></section>${featuredBlock}${latestBlock}${empty}${categoryBlock}${cta}`})
}

function articleHtml(post, posts) {
  const canonical = `${SITE_ORIGIN}/blog/${post.slug}/`
  const image = post.ogImageUrl || fallbackImage
  const body = renderPortableText(post.body)
  const related = selectRelated(post, posts)
  const articleLd = {'@context':'https://schema.org','@type':'Article',headline:post.title,description:post.metaDescription,image:[image],datePublished:post.publishedAt,dateModified:post.updatedAt||post.publishedAt,author:{'@type':'Person',name:post.author.name},publisher:{'@type':'Organization',name:'Conscious Travel',url:SITE_ORIGIN,logo:{'@type':'ImageObject',url:publisherLogo}},mainEntityOfPage:{'@type':'WebPage','@id':canonical},articleSection:post.category.name}
  const breadcrumbLd = {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:`${SITE_ORIGIN}/`},{'@type':'ListItem',position:2,name:'Blog',item:`${SITE_ORIGIN}/blog/`},{'@type':'ListItem',position:3,name:post.title,item:canonical}]}
  const authorDetails = post.author.role || post.author.bio || post.author.photoUrl ? `<section class="blog-author" aria-label="Tentang penulis"><div class="blog-author-inner">${post.author.photo ? `<img src="${escapeAttribute(post.author.photoUrl)}" width="${post.author.photo.width}" height="${post.author.photo.height}" alt="Foto ${escapeAttribute(post.author.name)}" loading="lazy" decoding="async">` : ''}<div><p class="blog-kicker">Tentang penulis</p><h2>${escapeHtml(post.author.name)}</h2>${post.author.role ? `<p class="blog-author-role">${escapeHtml(post.author.role)}</p>` : ''}${post.author.bio ? `<p>${escapeHtml(post.author.bio)}</p>` : ''}</div></div></section>` : ''
  const relatedBlock = related.length ? `<section class="section blog-related"><div class="container"><div class="blog-section-heading"><p class="blog-kicker">Lanjut membaca</p><h2>Artikel Terkait</h2></div><div class="blog-grid">${related.map((item) => articleCard(item)).join('')}</div></div></section>` : ''
  const cta = `<section class="blog-cta"><div class="container narrow"><p class="blog-kicker">Dari inspirasi ke perjalanan</p><h2>Mari rancang perjalanan yang relevan untuk Anda</h2><p>Diskusikan tujuan, peserta, waktu, dan pengalaman yang ingin dibangun bersama tim ConsciousTravel.</p><a class="btn btn-light" href="/contact/#inquiry">Kirim inquiry</a></div></section>`
  return shell({head:`<title>${escapeHtml(post.seoTitle)}</title>\n  ${meta('description',post.metaDescription)}\n  ${meta('robots',post.noindex?'noindex, follow':'index, follow')}\n  <link rel="canonical" href="${canonical}">\n  ${meta('og:type','article',true)}${meta('og:title',post.seoTitle,true)}${meta('og:description',post.metaDescription,true)}${meta('og:url',canonical,true)}${meta('og:image',image,true)}${meta('twitter:card','summary_large_image')}${meta('twitter:title',post.seoTitle)}${meta('twitter:description',post.metaDescription)}${meta('twitter:image',image)}${meta('article:published_time',post.publishedAt,true)}${meta('article:modified_time',post.updatedAt||post.publishedAt,true)}${meta('article:author',post.author.name,true)}${meta('article:section',post.category.name,true)}\n  ${jsonLd(articleLd)}\n  ${jsonLd(breadcrumbLd)}`,content:`<article class="blog-article"><div class="container narrow"><nav class="blog-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/blog/">Blog</a></li><li aria-current="page">${escapeHtml(post.title)}</li></ol></nav></div><header class="blog-article-header"><div class="container narrow"><p class="blog-category">${escapeHtml(post.category.name)}</p><h1>${escapeHtml(post.title)}</h1><p class="blog-lead">${escapeHtml(post.excerpt)}</p><p class="blog-meta"><span>${escapeHtml(post.author.name)}</span><span>Terbit <time datetime="${escapeAttribute(post.publishedAt)}">${escapeHtml(dateLabel(post.publishedAt))}</time></span>${post.updatedAt?`<span>Diperbarui <time datetime="${escapeAttribute(post.updatedAt)}">${escapeHtml(dateLabel(post.updatedAt))}</time></span>`:''}</p>${imageMarkup(post,{className:'blog-cover',loading:null,sizes:'(max-width: 860px) calc(100vw - 40px), 900px'})}</div></header><div class="container blog-prose" data-blog-article-body>${body}</div>${authorDetails}</article>${relatedBlock}${cta}`})
}

async function updateSitemap(posts) {
  const existing = await readFile(sitemapPath, 'utf8')
  const lines = existing.split(/\r?\n/).filter((line) => !line.includes(`${SITE_ORIGIN}/blog/`))
  const closeIndex = lines.findIndex((line) => line.includes('</urlset>'))
  if (closeIndex < 0) throw new Error('sitemap.xml tidak memiliki penutup urlset.')
  const eligible = eligiblePosts(posts)
  const latest = eligible.map((post) => post.updatedAt || post.publishedAt).filter(Boolean).sort().at(-1)
  const rows = [`  <url><loc>${SITE_ORIGIN}/blog/</loc>${latest ? `<lastmod>${dateOnly(latest)}</lastmod>` : ''}<priority>0.7</priority></url>`, ...eligible.map((post) => `  <url><loc>${SITE_ORIGIN}/blog/${post.slug}/</loc><lastmod>${dateOnly(post.updatedAt||post.publishedAt)}</lastmod><priority>0.7</priority></url>`)]
  lines.splice(closeIndex, 0, ...rows)
  await writeFile(sitemapPath, lines.join('\n').replace(/\n*$/, '\n'), 'utf8')
}

async function build() {
  const [rawPosts, rawCategories] = await Promise.all([sanityQuery(ALL_PUBLISHED_POSTS_QUERY), sanityQuery(ALL_CATEGORIES_QUERY)])
  if (!Array.isArray(rawPosts) || !Array.isArray(rawCategories)) throw new Error('Sanity tidak mengembalikan data Blog yang diharapkan.')
  const normalizedPosts = rawPosts.map(normalizePost)
  const posts = routablePosts(normalizedPosts, new Date())
  if (!normalizedPosts.some((post) => post.id === CONNECTION_TEST_ID)) throw new Error('Connection-test post tidak ditemukan pada published perspective.')
  const slugs = posts.map((post) => post.slug)
  if (new Set(slugs).size !== slugs.length) throw new Error('Slug artikel duplikat ditemukan.')
  const categories = rawCategories.map((category) => ({id:category._id,name:String(category.name).trim(),slug:String(category.slug).trim(),description:typeof category.description==='string'?category.description.trim():''}))
  await mkdir(blogRoot, {recursive:true})
  const removed = await cleanupGeneratedRoutes(blogRoot, await readManifest(), slugs)
  const publicPosts = eligiblePosts(posts)
  await writeFile(path.join(blogRoot, 'index.html'), listingHtml(publicPosts, categories), 'utf8')
  for (const post of posts) { const folder=path.join(blogRoot,post.slug); await mkdir(folder,{recursive:true}); await writeFile(path.join(folder,'index.html'),articleHtml(post,posts),'utf8') }
  await updateSitemap(posts)
  const manifest={version:2,projectId:SANITY_CONFIG.projectId,dataset:SANITY_CONFIG.dataset,apiVersion:SANITY_CONFIG.apiVersion,perspective:SANITY_CONFIG.perspective,generatedSlugs:[...slugs].sort(),indexableSlugs:publicPosts.map((post)=>post.slug).sort(),sourceDocumentIds:posts.map((post)=>post.id).sort()}
  await writeFile(manifestPath, `${safeJson(manifest)}\n`, 'utf8')
  console.log(`Blog build berhasil: /blog/ + ${posts.length} route artikel (${publicPosts.length} indexable).`)
  for (const slug of [...slugs].sort()) console.log(`- /blog/${slug}/`)
  if (removed.length) console.log(`Route stale dihapus: ${removed.join(', ')}`)
  const futureCount = normalizedPosts.length - posts.length
  if (futureCount) console.log(`${futureCount} artikel bertanggal masa depan tidak dibuatkan route.`)
}

build().catch((error) => { console.error(`Blog build gagal: ${error.message}`); process.exitCode=1 })
