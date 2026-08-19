# Sanity Blog Foundation

## Architecture

ConsciousTravel remains an existing static HTML, CSS, and JavaScript website. Sanity Content Lake stores structured blog content in the public `production` dataset, while the standalone Sanity Studio in `/sanity-studio` provides the editorial interface. Published content is converted into committed static listing and article HTML by the root build workflow.

## Current configuration

- Project: ConsciousTravel Content Studio
- Project ID: `7k96ai2c`
- Dataset: `production` (public)
- Studio title: ConsciousTravel Content Studio
- Studio URL: `https://conscioustravel-content.sanity.studio`
- Initial language: Bahasa Indonesia
- Default author: Conscious Team
- Categories: Corporate Travel, Experiences, Study Tour, Impact & Sustainability, Travel Guides

## Local development

Use Node.js 24 and run these commands from `sanity-studio`:

```powershell
npm install
npm run dev
npm run build
npm run seed
npm run verify:connection
```

Copy `.env.example` to `.env` only if local overrides are needed. Never commit `.env`.

The seed uses the already-authenticated Sanity CLI user session and deterministic IDs. It does not require a permanent API token. Re-running it replaces the same records instead of creating duplicates.

Seed IDs use deterministic hyphenated values (for example, `author-conscious-team`). Sanity treats IDs containing periods as private and excludes them from tokenless queries, so the prompt's suggested dotted IDs were adapted to preserve the required public published-content connection.

## Editorial workflow

1. Log in to the deployed Studio.
2. Open **Blog Posts** and create a post.
3. Complete the required title, slug, excerpt, cover image and alt text, author, category, published date, and body fields.
4. Keep the document as a draft while writing.
5. Ask the internal team to review the draft.
6. Use Sanity's Publish action after approval.

## Schema guide

- **Post** contains the article title, URL slug, card excerpt, hero image and alternative text, author, category, tags, publication date, Portable Text body, SEO overrides, social image, featured and search-engine visibility controls, and up to three related posts. `_updatedAt` is the canonical last-updated value; future frontend queries must use it rather than an editor-maintained field.
- **Author** contains a name, slug, optional role, photo, and short biography.
- **Category** contains a name, slug, and concise description.
- **Block content** supports paragraphs, H2–H4 headings, quotes, bold, italic, bullet and numbered lists, external links with an optional new-tab setting, internal post references, and article images with required alt text and optional captions.

The connection-test post intentionally has no cover image because it is test-only seed data. Normal editor-created posts retain required cover-image validation.

## Security

The `production` dataset is public, so published documents can be queried without a token. Drafts remain protected and require authenticated access. Credentials, secrets, personal data, and internal-only material must not be stored in published CMS fields. No `.env` file is committed, and the current seed and connection-test workflows require no permanent API token.

## Deferred work

The following are not implemented in this phase:

- Vercel Deploy Hook
- deployment configuration changes
- draft preview
- scheduled publishing
- multilingual articles

## Phase A — Static Generation Architecture

Phase A menambahkan data layer build-time tanpa framework frontend dan tanpa dependency website baru. `scripts/build-blog.mjs` menjalankan query native `fetch` ke public Sanity CDN menggunakan Project ID `7k96ai2c`, dataset `production`, API version `2026-07-30`, dan perspective `published`. Query secara eksplisit mengecualikan draft dan tidak menggunakan token.

Modul di `scripts/lib/` menangani konfigurasi, GROQ projection, normalisasi artikel, validasi slug dan tanggal, referensi gambar Sanity, escaping HTML, URL aman, rendering Portable Text, dan cleanup route. Data opsional mendapat fallback yang aman. SEO title menggunakan judul artikel, meta description menggunakan excerpt, Open Graph image menggunakan OG image lalu cover image dan akhirnya aset lokal. `_updatedAt` menjadi modified date. Artikel indexable dengan field kritis yang hilang menggagalkan build; connection-test merupakan pengecualian terdokumentasi untuk cover image.

Generator menulis HTML statis ke `blog/index.html` dan `blog/{slug}/index.html`. Output dan `.blog-generated-manifest.json` disimpan di Git agar static hosting saat ini tidak membutuhkan perubahan build production. Manifest menyimpan hanya slug dan document ID yang dimiliki generator. Saat regenerasi, cleanup hanya menghapus folder slug yang tercatat pada manifest lama tetapi tidak ada pada output baru; path harus berupa slug tervalidasi dan anak langsung folder `blog`. Halaman atau aset manual yang tidak tercatat tidak pernah dihapus.

Portable Text dirender saat build dan mendukung paragraf, H2–H4, bold, italic, bullet/numbered list, blockquote, external link, internal Blog reference, serta gambar dengan alt text dan caption. Semua teks dan atribut di-escape, protokol link dibatasi, raw HTML/iframe/script tidak dirender, dan external link bertab baru menggunakan `noopener noreferrer`.

`js/main.js` memiliki gate minimal `data-static-blog="true"` agar runtime bersama tidak menimpa HTML hasil generator. Header, footer, GTM, dan bahasa Indonesia tetap memakai sistem website saat ini. Pada Phase A listing masih `noindex, follow`; ketentuan tersebut digantikan oleh konfigurasi launch Phase B di bawah.

Perintah dari root repository:

```powershell
npm run verify:sanity
npm run build:blog
npm run validate:blog
npm run validate:phase2
npm run validate:editorial
npm run serve:static
```

Phase A belum mengubah pipeline Vercel, navigasi, sitemap, atau deployment production. Generator mengikuti convention canonical saat ini, yaitu `https://conscioustravel.id`.

## Phase B — Blog Launch MVP

Phase B mengaktifkan `/blog/` sebagai halaman `index, follow`, menambahkan Blog ke navigasi utama dan footer, serta memasukkan listing dan setiap artikel published yang indexable ke `sitemap.xml`. Connection-test dan post berstatus `noindex` tetap dikeluarkan dari listing, featured/latest, related, dan sitemap; direct route-nya tetap tersedia sebagai `noindex, follow` untuk pengecekan integrasi.

Listing menampilkan hero editorial, artikel featured (atau artikel terbaru sebagai fallback), latest articles, kategori, empty state, dan CTA. Detail artikel mencakup breadcrumb, metadata, cover image responsif, Portable Text, profil author, related article eksplisit dengan fallback kategori hingga tiga item, dan CTA. Semua gambar Sanity memakai transformasi CDN, `srcset`, dimensi intrinsik bila tersedia, lazy loading di bawah fold, dan posisi hotspot.

Setiap route mempertahankan title, description, canonical non-`www`, Open Graph, dan Twitter Card. Route artikel juga menghasilkan `Article` serta `BreadcrumbList` JSON-LD build-time. Root command `npm run build` menjalankan connection check, generator, validator Blog, serta validator website yang sudah ada. `npm run validate:blog` mencakup keamanan renderer, aturan seleksi artikel, cleanup ownership, manifest, structured data, dan sitemap.

Output HTML, manifest, dan sitemap tetap disimpan di Git. Konfigurasi deployment (`vercel.json` maupun Deploy Hook) sengaja belum diubah sampai checkpoint staging; pipeline deployment harus menjalankan root `npm run build` atau menerima output hasil build yang sudah di-commit. Canonical production saat ini secara konsisten memakai `https://conscioustravel.id`; redirect hostname `www` ke non-`www` harus dikonfirmasi pada checkpoint staging sebelum launch production.
