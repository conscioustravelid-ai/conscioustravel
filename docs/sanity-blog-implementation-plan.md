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

Connection-test merupakan pengecualian test-only terhadap validasi cover image sehingga tetap dapat dibangun bila tidak memiliki cover. Saat cover tersedia, generator tetap memprosesnya seperti gambar Sanity normal. Artikel publik buatan editor selalu memakai validasi cover image dan alt text wajib.

## Security

The `production` dataset is public, so published documents can be queried without a token. Drafts remain protected and require authenticated access. Credentials, secrets, personal data, and internal-only material must not be stored in published CMS fields. No `.env` file is committed, and the current seed and connection-test workflows require no permanent API token.

## Deferred work

The following remain outside the current MVP:

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

## Phase C1 — Vercel Build dan Staging

Vercel menjalankan `npm run build` dari root repository dan melayani output statis langsung dari `.`. Konfigurasi ini disimpan di `vercel.json` melalui `buildCommand` dan `outputDirectory`, sehingga deployment tidak bergantung pada override build dashboard. Install standar Vercel tetap digunakan; root project tidak memiliki dependency runtime maupun build tambahan.

Root build memverifikasi koneksi public Sanity, menjalankan generator Blog, lalu menjalankan validator Blog, Phase 2, dan editorial. Published query menggunakan konfigurasi non-secret terpusat: Project ID `7k96ai2c`, dataset `production`, API version `2026-07-30`, dan perspective `published`. Tidak diperlukan Sanity token atau environment variable rahasia. Build mengembalikan exit code non-zero bila Content Lake tidak dapat diakses, data artikel kritis tidak valid, generator gagal, atau validator gagal; zero indexable article tetap merupakan kondisi valid dan menghasilkan intentional empty state.

Workflow staging adalah push/merge ke branch `staging`, menunggu Vercel Git deployment, lalu memeriksa `https://staging.conscioustravel.id`. Header berbasis host di `vercel.json` wajib mempertahankan `X-Robots-Tag: noindex, nofollow` secara global pada staging, meskipun metadata `/blog/` adalah production-intended `index, follow`. Output generated tetap mencakup `blog/index.html`, route artikel, `.blog-generated-manifest.json`, dan kontribusi Blog pada `sitemap.xml`; cleanup hanya menyentuh route yang dimiliki manifest.

Kondisi CMS saat checkpoint C1 masih nol artikel indexable, sehingga listing menampilkan empty state dan sitemap hanya memuat `/blog/`. Connection-test tetap direct-access, `noindex, follow`, dan dikeluarkan dari listing, featured, related, serta sitemap.

Blocker sebelum production: verifikasi GTM Preview/GA4, konfirmasi redirect hostname production, dan first real article populated-state QA.

## Phase C2 — Publishing Automation (historical staging workflow)

Arsitektur publishing yang telah diverifikasi:

```text
Sanity Studio
→ Published document mutation
→ Sanity Webhook
→ private Vercel staging Deploy Hook
→ Vercel deployment
→ npm run build
→ published Sanity query
→ static Blog regeneration
→ staging.conscioustravel.id
```

Webhook bernama **Vercel Staging Blog Rebuild** pernah memantau dataset `production` dengan metode `POST`. Event-nya adalah Create, Update, dan Delete, dengan filter `_type in ["post", "author", "category"]`; Draft dan Version events dinonaktifkan. Webhook ini sekarang **Disabled** agar routine publish tidak membuat deployment staging kedua. Staging dan private staging Deploy Hook tetap tersedia untuk QA manual perubahan berisiko atau perubahan kode. URL aktualnya tidak boleh disimpan di repository, dokumentasi, `.env.example`, log, atau commit message.

### Perilaku terverifikasi

- **Draft:** mengedit dokumen published membuat draft, tetapi tidak memicu webhook atau deployment.
- **Publish/update:** Publish memicu webhook, deployment Vercel staging, `npm run build`, dan pembaruan HTML statis dari published Content Lake. Konten terbaru kemudian terlihat di staging.
- **Content-only update:** tidak memerlukan commit Git. Deployment Hook selalu membangun branch `staging` dengan data published terbaru.
- **Unpublish/delete:** mutasi published memicu rebuild; manifest dan stale-route cleanup menghapus route artikel obsolete yang sebelumnya dimiliki generator. Connection-test adalah konten QA infrastruktur sementara dan telah sengaja di-unpublish pada cleanup sebelum production.

Zero published post maupun zero artikel indexable merupakan kondisi CMS yang valid. Listing menampilkan empty state dan `/blog/` tetap ada di sitemap. `verify:sanity` memvalidasi koneksi publik, konfigurasi, published perspective, serta foundation author/category tanpa bergantung pada connection-test atau artikel sementara lain.

### Pemulihan kegagalan publishing

Jika artikel published tidak berubah di staging:

1. Pastikan dokumen benar-benar berstatus **Published** di Sanity.
2. Periksa status **Noindex** bila artikel tidak muncul di listing.
3. Buka **Attempts Log** pada webhook Sanity dan pastikan respons sukses/2xx.
4. Buka Vercel Deployments dan pastikan deployment baru tercipta.
5. Pastikan deployment mencapai status **Ready**.
6. Jika gagal, periksa Vercel build logs tanpa menyalin Deploy Hook URL.
7. Jalankan lokal `npm run verify:sanity`.
8. Jalankan `npm run build`.
9. Jalankan `npm run validate:blog`.
10. Bila perlu, lakukan safe manual staging redeployment melalui mekanisme project yang sudah disetujui.
11. Eskalasikan kegagalan webhook yang berulang; MVP ini tidak menggunakan custom webhook server.

Staging wajib mempertahankan `X-Robots-Tag: noindex, nofollow` pada seluruh request host `staging.conscioustravel.id`. Dependency Sanity tidak diubah sebagai bagian dari automation closure; audit dan upgrade tetap merupakan pekerjaan keamanan terpisah.

## Phase D3A — Publish Now Workflow

Sanity Studio mengganti built-in Publish khusus dokumen `post` dengan action **Publish Now** melalui Document Actions API resmi. Saat publish, helper deterministik menerapkan aturan berikut:

- `publishedAt` kosong atau tidak valid → waktu publish saat ini;
- `publishedAt` berada di masa depan → waktu publish saat ini;
- `publishedAt` sama dengan atau lebih lama dari waktu publish → dipertahankan, termasuk saat republish.

Field **Publication Date** bersifat read-only dan menjelaskan aturan tersebut kepada editor. Validasi required pada field ini sengaja dihapus agar draft baru dapat disiapkan sebelum action mengisinya secara atomik dalam antrean operasi Sanity. Field konten wajib lainnya tetap divalidasi oleh Studio.

Generator juga memfilter dokumen published bertanggal masa depan sebelum membuat route, listing, related article, manifest, atau sitemap. Semua dokumen tetap dinormalisasi lebih dulu agar published document dengan data kritis tidak valid tetap menggagalkan build. Tes helper Publish Now dan future-date routing menjadi bagian dari `npm run validate:blog`.

Workflow ini adalah MVP **publish segera**. Scheduling dan custom scheduling UI tetap ditunda sampai fase post-launch yang disetujui terpisah; automation production dijelaskan pada bagian berikutnya.

Future enhancement: evaluasi **Sanity Scheduled Drafts** untuk scheduled publishing yang sesungguhnya. Arsitektur masa depan harus memastikan tidak ada deployment ketika editor masih mengedit atau menjadwalkan; waktu terjadwal menghasilkan published mutation; published mutation memicu tepat satu rebuild; `datePublished` benar; serta draft dan version tetap dikecualikan dari webhook kecuali arsitektur baru yang telah diuji secara eksplisit membutuhkannya.

## Blog Publish Automation v1 — Production

Alur publikasi konten production adalah:

```text
Sanity Publish Now / update / unpublish post
→ Sanity webhook production (published post only)
→ private Vercel Deploy Hook untuk branch main
→ npm run build
→ query published Content Lake tanpa token
→ generator dan seluruh validator
→ atomic Vercel production deployment
```

Webhook production terpisah dari webhook staging yang berstatus Disabled. Webhook production hanya memantau dokumen `_type == "post"` pada dataset `production`, dengan Drafts dan Versions dinonaktifkan. Create, Update, dan Delete published mutation dipantau agar publish, republish, unpublish, dan delete menghasilkan regenerasi yang konsisten. URL Deploy Hook bersifat rahasia dan tidak disimpan di repository, dokumentasi, environment example, output CI, atau commit message.

Build production memakai `npm run build` dari root dan branch `main`. Generator membaca perspective `published`, sehingga draft tidak dapat masuk ke HTML, manifest, listing, related article, atau sitemap. Perubahan konten tidak membuat commit Git. Output baru hanya menjadi aktif ketika build, validator Blog, validator Phase 2, dan validator editorial semuanya sukses; deployment gagal tidak menggantikan deployment production terakhir yang sehat.

Operasional harian tidak memerlukan staging. Staging tetap tersedia untuk QA perubahan kode dan tetap memiliki perlindungan `X-Robots-Tag: noindex, nofollow`. Untuk observability, periksa Attempts Log webhook Sanity terlebih dahulu, kemudian Vercel Deployments dan build log. Satu mutasi published post harus menghasilkan satu request webhook dan satu deployment; retry hanya dilakukan setelah penyebab kegagalan dipahami.

## Blog Reader Blocks v1

**Status rilis:** Sanity Studio dan frontend Reader Blocks v1 telah dideploy ke production dan lulus owner QA. Editor dapat menggunakan blok yang didukung setelah menyelesaikan checklist editorial dan preview.

Sanity Studio mendukung komponen terstruktur berikut di dalam `blockContent`:

- native `table` untuk data perbandingan;
- `itineraryBlock` untuk agenda berbasis hari dan waktu;
- `calloutBlock` untuk Tip, Penting, Perhatian, dan Good to Know;
- `ctaBlock` untuk tujuan CTA yang dibatasi dan dapat dilacak;
- Image serta Portable Text H2/H3 yang sudah tersedia sebelumnya.

Regresi image memastikan alt text, caption, dimensi intrinsik, `srcset`, lazy loading, escaping, dan fallback aset tetap aman bersama Reader Blocks.

Frontend membangun Table of Contents secara otomatis dari H2 dan H3 top-level. H2 menjadi bagian utama, H3 menjadi anak dari H2 terdekat, dan H4 tidak dimasukkan. TOC tampil mulai tiga H2; artikel dengan lebih dari enam H2 memakai progressive enhancement agar enam H2 pertama terlihat pada state ringkas, sementara HTML tanpa JavaScript tetap memuat hierarki lengkap.

Draft-only QA Reader Blocks tidak memicu webhook karena Drafts tetap OFF. Setelah review, publish atau republish post memicu automation production. Panduan praktis untuk penulis tersedia di `docs/blog-reader-blocks-writer-sop.md`.

### Smart Table Paste

Input Portable Text khusus `blockContent` memakai kontrak `PortableTextInputProps.onPaste` dari Sanity 6.7.0. Clipboard HTML yang berisi satu tabel terfokus serta tabel Markdown valid dikonversi ke struktur native `table` pada posisi cursor. Parser hanya menyimpan teks sel, menggunakan semantik `<thead>`/`<th>` untuk `headerRows`, dan mengabaikan markup presentasional maupun HTML berbahaya. Tabel Markdown memerlukan header, separator valid, minimal satu data row, dan jumlah kolom yang konsisten; escaped pipe didukung.

Paste paragraph, URL, tabel malformed, atau pilihan campuran prose+tabel biasa mengembalikan `undefined` secara sinkron sehingga perilaku default Sanity tetap berjalan. Pembatasan tabel biasa ini sengaja mencegah teks di sekitar tabel terbuang: editor perlu menyeleksi tabel saja. Custom handler hanya dipasang pada body artikel, bukan table cell, callout body, atau editor terbatas lain.

### Smart Itinerary Paste

Smart Itinerary memperluas handler dan utilitas Smart Table yang sama. Parser subset aman untuk Google Docs HTML dan Markdown ChatGPT mempertahankan urutan H3, paragraf, list sederhana, tabel biasa, dan tabel itinerary. Klasifikasi itinerary bersifat ketat: baris pertama wajib berisi kombinasi `Waktu|Time` dan `Agenda|Aktivitas|Rencana|Activity`; kolom tambahan hanya `Area`, `Catatan|Notes`, serta `Opsional|Optional`. Google Docs dapat menyalin header visual sebagai sel `<td>` biasa, sehingga classifier memvalidasi isi baris pertama alih-alih bergantung pada `<thead>`/`<th>`. Nilai opsional dipetakan hanya dari kolom eksplisit, tidak ditebak dari teks aktivitas.

Konversi hanya dilakukan bila tabel memiliki H3 terdekat yang tidak ambigu (langsung sesudah H3 atau setelah maksimal satu paragraf pendek). Tanpa judul tersebut tabel tetap memakai fallback native Table. Handler mixed-content hanya mengambil alih clipboard jika minimal satu itinerary berhasil diklasifikasikan; paste biasa tetap diserahkan ke Sanity.

H3 dan `itineraryBlock.dayTitle` sengaja sama di data agar TOC dan integritas block tetap terjaga. Saat block langsung didahului H3 dengan teks yang sama, renderer menghilangkan heading internal yang duplikat dan memberi `<section>` `aria-labelledby` ke anchor H3 top-level. Itinerary manual atau block yang tidak berdampingan tetap merender judul internalnya. Solusi berbasis konteks ini menjaga satu judul visual, TOC, dan nama aksesibel tanpa CSS hiding atau perubahan schema/GROQ.
