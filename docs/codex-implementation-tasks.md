# Codex Implementation Tasks — Conscioustravel.id

## Overview

Dokumen ini adalah panduan implementasi untuk Codex (atau developer).
Ikuti urutan fase ini secara berurutan. Jangan loncat ke fase berikutnya
sebelum fase sebelumnya selesai dan diverifikasi.

Setiap task ditandai dengan:
- [ ] = belum dikerjakan
- [x] = selesai

---

## FASE 0 — Setup & Fondasi

**Tujuan:** Siapkan struktur file dan design system sebelum mulai coding halaman.

### 0.1 Setup File Structure
- [ ] Buat file `css/variables.css` berisi semua CSS custom properties dari `design-system.md`
- [ ] Import `variables.css` di baris pertama `css/style.css`
- [ ] Buat folder `docs/` (sudah ada)
- [ ] Buat folder `data/` (sudah ada)
- [ ] Buat file `data/experiences.json` dengan struktur yang sudah didefinisikan di `component-plan.md`
- [ ] Buat file `data/packages.json` dengan data 2 paket yang sudah ada
- [ ] Verifikasi semua gambar ada di `assets/images/`

### 0.2 Refactor CSS
- [ ] Pindahkan semua nilai warna hardcode di `style.css` ke variable
- [ ] Pindahkan semua nilai spacing hardcode ke variable
- [ ] Pastikan tidak ada warna atau spacing yang masih hardcode setelah refactor
- [ ] Test: tampilan Home (index.html) tidak berubah setelah refactor

### 0.3 Setup Shared Layout
- [ ] Buat Navbar yang support multi-page (active link per halaman)
  - Active state: tandai link sesuai `window.location.pathname`
  - Contoh: di `/company-outing.html`, link "Corporate" harus aktif
- [ ] Update Footer dengan kolom Quick Links yang link ke semua halaman Phase 1
- [ ] Pastikan Navbar dan Footer identik di semua halaman

### 0.4 Setup Routing (Client-side)
- [ ] Buat file `js/router.js` atau gunakan pendekatan multi-file HTML biasa
  - Rekomendasi Phase 1: multi-file HTML (lebih sederhana, SEO-friendly)
  - Setiap halaman = file `.html` terpisah
  - Navbar dan Footer di-render via JS (sudah ada pola ini di `main.js`)

---

## FASE 1 — Home Page (Refactor dari LP yang Ada)

**File:** `index.html`
**Catatan:** File ini sudah ada. Tujuannya adalah update, bukan tulis ulang dari nol.

### 1.1 Update Navbar
- [ ] Tambahkan link ke halaman-halaman baru (Experiences, Corporate, Impact, About, Contact)
- [ ] Tambahkan logika active state
- [ ] Test di mobile: hamburger menu berfungsi

### 1.2 Update Hero Section
- [ ] Pastikan CTA Primary sudah mengarah ke WhatsApp dengan pesan yang benar
- [ ] Pastikan CTA Secondary scroll ke section packages

### 1.3 Update Package Cards
- [ ] Tambahkan link "Lihat Semua Paket" yang mengarah ke `/company-outing.html`
- [ ] Data paket diambil dari `data/packages.json` (refactor dari hardcode di `content.js`)

### 1.4 Update Experience Preview
- [ ] Tambahkan 3–4 experience card dari `data/experiences.json`
- [ ] Tambahkan link "Lihat Semua Experience" ke `/experiences.html`

### 1.5 Update Footer
- [ ] Tambahkan kolom Quick Links dengan semua halaman Phase 1

### 1.6 Verifikasi
- [ ] Home load tanpa error di console
- [ ] Semua link di navbar dan footer mengarah ke halaman yang benar
- [ ] Mobile tampilan tidak rusak
- [ ] GTM sudah terpasang dan aktif (sudah selesai)

---

## FASE 2 — Company Outing Page

**File:** `company-outing.html` (file baru)

### 2.1 Setup File
- [ ] Buat `company-outing.html` dengan struktur HTML dasar
- [ ] Import `css/style.css`, `data/content.js`, `data/packages.json`, `js/main.js`
- [ ] Tambahkan Navbar (render via JS, sama dengan index.html)
- [ ] Tambahkan Footer (render via JS)
- [ ] Tambahkan GTM snippet (sama persis dengan index.html)

### 2.2 Implementasi Sections
- [ ] Breadcrumb: Home > Company Outing
- [ ] Hero Section (variant: split atau page)
  - H1: "Outing Kantor di Bali yang Lebih dari Sekadar Jalan-Jalan"
  - CTA Primary: Minta Proposal (WhatsApp prefilled)
  - CTA Secondary: Lihat Paket (scroll ke #packages)
- [ ] Problem / Solution Statement (2 kolom)
- [ ] Package Cards (id="packages") — ambil dari `data/packages.json`
- [ ] Add-on Section
- [ ] Why Conscioustravel untuk B2B (4 benefit)
- [ ] How It Works (3 langkah)
- [ ] Client Logo + Testimonial
- [ ] Impact Light Preview Block + link ke /impact.html
- [ ] FAQ Accordion (B2B questions) — ambil dari `data/content.js`
- [ ] Final CTA Section
- [ ] Footer

### 2.3 Verifikasi
- [ ] Semua section tampil dengan benar di mobile dan desktop
- [ ] FAQ accordion berfungsi
- [ ] Package card add-on toggle berfungsi
- [ ] Semua CTA link mengarah ke tujuan yang benar
- [ ] Bahasa switcher ID/EN berfungsi

---

## FASE 3 — Experiences Hub Page

**File:** `experiences.html` (file baru)

### 3.1 Setup File
- [ ] Buat `experiences.html` dengan struktur dasar
- [ ] Import semua dependency yang sama

### 3.2 Implementasi Sections
- [ ] Breadcrumb: Home > Experiences
- [ ] Hero Section (tone B2C, lebih warm)
  - H1: "Explore Bali dengan Cara yang Lebih Personal"
- [ ] Filter Category Bar
  - Kategori: Semua | Nature | Beach | Culture | Adventure | Food
  - Scroll horizontal di mobile
  - Active state dengan CSS class
- [ ] Experience Card Grid
  - Data dari `data/experiences.json`
  - Setiap card punya `data-category` attribute untuk filter
- [ ] Filter logic di `js/experience-filter.js`
  - Klik kategori → hide/show card berdasarkan `data-category`
  - Smooth transition (opacity + height)
- [ ] Custom Trip CTA Block
- [ ] Testimonial Section (B2C)
- [ ] FAQ Accordion (B2C questions)
- [ ] Final CTA Section

### 3.3 Buat `js/experience-filter.js`
```javascript
// Logic:
// 1. Ambil semua .experience-card
// 2. Listen click pada .filter-btn
// 3. Toggle class active pada tombol yang diklik
// 4. Filter card: tampilkan yang data-category match, sembunyikan yang tidak
// 5. "Semua" = tampilkan semua card
```

### 3.4 Verifikasi
- [ ] Filter berfungsi di semua kategori
- [ ] "Semua" menampilkan semua card
- [ ] Smooth transition saat filter
- [ ] Mobile: filter bar scroll horizontal tanpa wrap

---

## FASE 4 — Experience Detail Template (DITUNDA KE PHASE 2)

**File:** `experience-detail.html` (template, file baru)

Catatan Phase 1.5: jangan buat atau publish file ini dulu. Experience Catalog,
detail page, itinerary, gallery detail, dan harga B2C baru masuk Phase 2.

### 4.1 Setup File
- [ ] Ditunda sampai Phase 2: buat `experience-detail.html` sebagai template
- [ ] Data experience diambil dari URL parameter atau path
  - Contoh: `experience-detail.html?slug=kintamani-jeep-adventure`
  - JS baca `URLSearchParams`, cari data di `experiences.json`, render konten

### 4.2 Implementasi Sections
- [ ] Breadcrumb: Home > Experiences > [Nama Experience]
- [ ] Hero / Cover (foto full-width + info)
- [ ] Experience Overview + highlight points
- [ ] Itinerary Accordion
- [ ] Gallery Grid (swipeable di mobile)
- [ ] Includes & Excludes (2 kolom)
- [ ] Practical Info block
- [ ] Related Experiences (3 card)
- [ ] Sticky Bottom Bar (mobile only, muncul saat scroll)
- [ ] Inquiry/Booking CTA Block

### 4.3 Logic JS untuk Dynamic Content
```javascript
// Di experience-detail.js atau main.js:
// 1. Baca slug dari URL: new URLSearchParams(location.search).get('slug')
// 2. Fetch atau import data/experiences.json
// 3. Cari experience dengan slug yang match
// 4. Render semua section dengan data tersebut
// 5. Kalau slug tidak ditemukan, redirect ke /experiences.html
```

### 4.4 Verifikasi
- [ ] Halaman render dengan benar untuk semua experience di `experiences.json`
- [ ] Breadcrumb menampilkan nama experience yang benar
- [ ] WhatsApp link menggunakan prefilled message dengan nama experience
- [ ] Sticky bar muncul/hilang saat scroll
- [ ] Related experiences tidak menampilkan experience yang sama dengan yang sedang dibuka

---

## FASE 5 — Impact & Sustainability Page

**File:** `impact.html` (file baru)

### 5.1 Implementasi Sections
- [ ] Breadcrumb: Home > Impact
- [ ] Hero Section (tone: thoughtful, calm)
  - H1: "Travel yang Sedikit Lebih Baik"
- [ ] Philosophy Statement (narasi, tidak bombastis)
- [ ] Impact Light Concept block
- [ ] Aktivitas Impact Grid (6 item)
- [ ] Local Partner Highlight
- [ ] Stats (hanya jika data nyata tersedia)
- [ ] Impact dalam setiap paket (link ke /company-outing + /experiences)
- [ ] CTA Section

### 5.2 Verifikasi
- [ ] Tidak ada klaim berlebihan dalam copy
- [ ] Semua link ke halaman lain berfungsi
- [ ] Mobile tampilan baik

---

## FASE 6 — About Us Page

**File:** `about.html` (file baru)

### 6.1 Implementasi Sections
- [ ] Breadcrumb: Home > About
- [ ] Hero Section
- [ ] Our Story (narasi brand)
- [ ] Mission & Values (4 poin)
- [ ] Team Section (foto + nama + role)
- [ ] Legal Info block (PT Wisata Perjalanan Bermakna + alamat)
- [ ] Client Logo Section
- [ ] CTA Section

### 6.2 Verifikasi
- [ ] Nama legal perusahaan tertera dengan benar
- [ ] Alamat lengkap dan benar
- [ ] Team section tampil dengan benar di mobile

---

## FASE 7 — Contact Page

**File:** `contact.html` (file baru)

### 7.1 Implementasi Sections
- [ ] Page Header (H1 sederhana)
- [ ] Contact Info Block
  - WhatsApp: clickable `href="https://wa.me/6285195559749"`
  - Instagram: link ke profil
  - Alamat + Google Maps embed (responsif)
- [ ] Inquiry Form (full version — reuse dari index.html)
- [ ] FAQ Singkat (3–5 item)

### 7.2 Verifikasi
- [ ] WhatsApp link berfungsi di mobile (buka app langsung)
- [ ] Maps embed responsif
- [ ] Form submit berfungsi dan kirim ke Apps Script
- [ ] Success state muncul setelah submit

---

## FASE 8 — QA & Polish

**Tujuan:** Pastikan semua halaman konsisten, responsif, dan tidak ada broken link.

### 8.1 Cross-page Consistency
- [ ] Navbar identik di semua halaman
- [ ] Footer identik di semua halaman
- [ ] Active state navbar benar di setiap halaman
- [ ] Language switcher berfungsi di semua halaman
- [ ] WhatsApp floating button ada di semua halaman

### 8.2 Responsif Check
- [ ] Test semua halaman di 375px (iPhone SE)
- [ ] Test di 768px (iPad)
- [ ] Test di 1280px (desktop)
- [ ] Tidak ada horizontal scroll yang tidak disengaja

### 8.3 Performance
- [ ] Semua foto pakai `loading="lazy"` kecuali hero
- [ ] Foto hero pakai `loading="eager"`
- [ ] Kompres semua foto ke WebP kalau belum
- [ ] Tidak ada foto yang lebih dari 300KB

### 8.4 Broken Link Check
- [ ] Semua link di navbar mengarah ke halaman yang benar
- [ ] Semua link di footer benar
- [ ] Semua CTA button punya href yang benar (bukan `href="#"`)
- [ ] WhatsApp links menggunakan format `https://wa.me/6285195559749`

### 8.5 GTM & Tracking
- [ ] GTM snippet ada di semua halaman (head + body)
- [ ] Test GTM Preview di setiap halaman baru
- [ ] Verifikasi GA4 menerima pageview dari semua halaman

### 8.6 SEO
- [ ] Setiap halaman punya `<title>` yang unik
- [ ] Setiap halaman punya `<meta name="description">` yang unik
- [ ] Setiap halaman punya tepat satu `<h1>`
- [ ] `<link rel="canonical">` ada di setiap halaman dengan URL yang benar

---

## CATATAN PENTING UNTUK CODEX

### Jangan Lakukan Ini
- ❌ Jangan hardcode warna atau spacing — selalu pakai CSS variables
- ❌ Jangan duplikasi kode Navbar atau Footer — render via JS dari satu sumber
- ❌ Jangan ubah nomor WhatsApp — selalu `6285195559749`
- ❌ Jangan hapus atau ubah GTM snippet yang sudah ada
- ❌ Jangan ubah APPS_SCRIPT_URL di `main.js`
- ❌ Jangan pakai animasi yang berlebihan
- ❌ Jangan buat halaman baru di Phase 2 sebelum semua Phase 1 selesai

### Selalu Lakukan Ini
- ✅ Test di mobile setelah setiap perubahan
- ✅ Gunakan `alt` yang deskriptif untuk semua gambar
- ✅ Tambahkan `aria-label` untuk semua tombol yang tidak punya teks jelas
- ✅ Commit ke git setelah setiap fase selesai
- ✅ Konsultasikan perubahan besar sebelum diimplementasikan
