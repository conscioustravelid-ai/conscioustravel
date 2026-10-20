# Phase 0 — Baseline staging untuk bilingual website dan English SEO

Tanggal pemeriksaan: 20 Oktober 2026 (Asia/Makassar).

## Riwayat dan batas perubahan

- Main awal: `b5b7f8fa78360223bb3b7a0fe7b52425ff787da1`.
- Staging awal: `ddea530f1432ed5770dde23f831222bdada682ba`.
- Merge base: `ef466bc6c72c0d9f6f44ace4e8eb7328b7400a4e`.
- Main memiliki hotfix validator sitemap `b5b7f8f`; staging memiliki optimasi runtime `a248fa2` dan CSS/font Blog `ddea530`.
- `origin/main` digabungkan ke `staging` melalui merge biasa, tanpa konflik. Tidak ada reset, force push, atau merge ke main.
- Hotfix validator dan kedua optimasi dipertahankan. Generator, runtime Blog, Reader Blocks, query Sanity, redirect, dan konfigurasi automation tidak diubah.
- HTML Blog, manifest, dan sitemap diregenerasi melalui workflow yang ada dan disimpan di Git sesuai kebijakan generated output pada `docs/sanity-blog-implementation-plan.md`.
- Tidak ada route `/en/`, perubahan schema/konten Sanity, atau perubahan production pada Phase 0.

## Routing dan bahasa saat ini

Route homepage dan layanan tetap tanpa prefix bahasa:

```text
/
/corporate-packages/
/corporate-packages/indonesia-region/
/corporate-packages/international/
/corporate-packages/csr-program/
/corporate-packages/event-planning-organizer/
/experiences/
/study-tour/
/sailing-package/
/about/
/impact/
/faq/
/contact/
```

`js/main.js` memakai `localStorage["ct-language"]` untuk memilih ID/EN pada URL yang sama. `bindLanguageToggle()` merender ulang UI; `renderPage()` mengubah `html.lang` tetapi tidak mengganti metadata head. Konten berada pada `CT_CONTENT`, `CT_EDITORIAL_CONTENT`, dan `CT_PRODUCT_COPY` di `data/content.js`.

Blog tetap berbahasa Indonesia pada `/blog/` dan `/blog/{slug}/`. `scripts/build-blog.mjs` menghasilkan header/footer statis melalui `blogHeader()`/`blogFooter()`. Blog memakai `js/blog.js` dan `css/blog.css`; tidak memuat runtime/katalog website umum. Belum ada language field, translation relationship, hreflang, atau OG locale.

## Sanity dan inventaris yang harus dilindungi

- Project: `7k96ai2c`; dataset: `production`; API: `2026-07-30`.
- Generator membaca perspective `published` melalui public token-free query dan Sanity CDN.
- Published saat pemeriksaan: **18**; routable: **18**; indexable: **18**.
- Tidak ada published post noindex atau bertanggal masa depan dalam snapshot ini. Draft tidak dibaca oleh query generator.
- Output: **18 halaman artikel + 1 index Blog**; manifest version 2.
- Snapshot Git sebelumnya memuat 8 artikel. Seluruh slug dan body kedelapan artikel dipertahankan; 10 artikel published lainnya ditambahkan oleh generator.
- Tidak ada route yang dihapus. Cleanup tetap dibatasi pada route milik manifest melalui `cleanupGeneratedRoutes()`.

Seluruh slug berikut tetap berada pada `/blog/{slug}/`:

```text
aktivitas-team-building-bali
biaya-liburan-ke-bali
cara-merencanakan-company-outing-bali
company-outing-csr-bali
company-outing-sendiri-vs-vendor-bali
company-outing-vs-retreat-gathering-bali
company-trip-luar-negeri-asean
conscious-travel-corporate-travel-sustainable-experiences
corporate-outing-rsm-bali
csr-activity-bali
gathering-atlas-beach-club-bali
ide-company-outing-bali
itinerary-bali-3-hari-2-malam
itinerary-bali-4-hari-3-malam
pantai-di-bali
rute-wisata-bali-searah
tempat-team-building-bali
tempat-wisata-di-bali
```

## SEO, publikasi, dan performa yang dipertahankan

- Canonical production tetap `https://conscioustravel.id`, non-www, dengan trailing slash. Semua 18 artikel memiliki self-canonical sesuai slug sebenarnya.
- Sitemap berisi 32 URL: 13 halaman non-Blog, 1 index Blog, dan 18 artikel indexable. Baris sitemap non-Blog identik dengan main awal.
- `scripts/validate-phase2.js` menolak enam URL legacy melalui pencocokan `<loc>` lengkap: `/company-outing`, `/company-outing/`, `/company-trip`, `/company-trip/`, `/corporate-trip`, dan `/corporate-trip/`.
- Artikel valid seperti `/blog/company-outing-csr-bali/` tidak boleh ditolak oleh pencocokan substring `/company-outing`.
- Legacy redirect tetap menuju `/corporate-packages/indonesia-region/`. `vercel.json`, `robots.txt`, dan file homepage/layanan identik dengan main awal.
- Published noindex tetap boleh memiliki direct route dengan `noindex, follow`, tetapi dikeluarkan dari listing, featured/latest, related, dan sitemap. Future published dikecualikan oleh `routablePosts()`; ini bukan penjadwalan otomatis.
- Aturan host staging tetap mengirim `X-Robots-Tag: noindex, nofollow`.
- Reader Blocks, Portable Text, TOC, featured/latest, fallback related berdasarkan kategori, escaping, dan tracking tidak berubah.
- Optimasi Blog tetap mencakup static chrome, runtime/CSS khusus, DM Sans 400/600/700 dan DM Serif Display non-blocking dengan fallback noscript, serta kandidat cover image 360/640px dengan kualitas 78.
- Pipeline tetap `npm run build`: verify Sanity, generator, validator Blog dan tesnya, validator Phase 2, lalu validator editorial.
- Automation yang didokumentasikan tetap published post mutation → production webhook → private Vercel Deploy Hook branch main → build → deployment production. Webhook staging didokumentasikan Disabled. Phase 0 tidak memeriksa atau mengubah pengaturan webhook/secrets dan tidak memicu hook production.

## Validasi lokal sebelum commit

- `npm run build`: PASS, termasuk renderer/security, Reader Blocks, TOC, integrated reader fixture, selection/related, publication state, cleanup ownership, dan Publish Now.
- `npm run validate:phase2` dan `npm run validate:editorial`: PASS dalam pipeline build.
- Script Studio `test:reader-block-schemas`, `test:table-paste`, dan `test:itinerary-paste`: PASS.
- `node --check` untuk seluruh 26 file JavaScript/MJS tracked: PASS.
- `git diff --check` dan pemeriksaan staged diff: PASS.
- Pencocokan manifest dengan seluruh 18 post published/indexable dan URL produksi: PASS.
- Pemeriksaan 156 tautan internal artikel pada 19 halaman Blog: seluruh target tersedia.
- Perbandingan body 8 artikel lama terhadap staging awal: identik.
- Generator, validator performa, runtime, dan CSS Blog identik dengan staging awal; file non-Blog, konfigurasi production, dan integrasi Sanity tetap identik dengan main awal.

Status deployment staging dan SHA merge akhir dilaporkan pada hasil eksekusi Phase 0 setelah push. Dokumen ini merekam baseline source dan validasi lokal.

## Titik awal Phase 1

Setelah deployment staging terkonfirmasi, buat branch pengembangan terpisah dari SHA staging hasil Phase 0, misalnya `feature/bilingual-website-seo-v1`. Branch tersebut belum dibuat pada Phase 0.

Phase 1 perlu memutuskan namespace EN, relasi terjemahan, fallback saat terjemahan belum tersedia, canonical/hreflang, serta URL berbasis bahasa. Semua URL Indonesia di atas merupakan baseline kompatibilitas dan harus dipertahankan.
