# Component Plan — Conscioustravel.id

## Overview

Dokumen ini mendefinisikan semua reusable component yang digunakan di website.
Setiap component harus dibuat sekali dan bisa dipakai di banyak halaman
tanpa mengubah struktur atau styling dasarnya.

---

## File Structure

```
conscioustravel-website/
├── css/
│   ├── variables.css          ← design tokens (warna, spacing, font)
│   └── style.css              ← semua styles (import variables.css di atas)
├── js/
│   ├── main.js                ← init, language switcher, scroll effects
│   └── experience-filter.js   ← parked untuk Phase 2, tidak diload di Phase 1.5
├── data/
│   ├── content.js             ← semua copy bilingual + config global
│   ├── experiences.json       ← dikosongkan sampai Experience Catalog Phase 2
│   └── packages.json          ← data paket outing
├── assets/
│   └── images/                ← semua foto (WebP diutamakan)
├── docs/                      ← dokumen implementasi ini
├── index.html                 ← Home
├── company-outing/index.html  ← Company Outing
├── experiences/index.html     ← Experiences hub, tanpa catalog final
├── impact/index.html          ← Impact & Sustainability
├── about/index.html           ← About Us
├── contact/index.html         ← Contact
├── robots.txt                 ← crawler directive
└── sitemap.xml                ← sitemap halaman Phase 1
```

---

## 1. NAVBAR

**Dipakai di:** Semua halaman

**Behavior:**
- Sticky di atas (position: fixed)
- Transparent saat di hero, solid (putih + shadow) saat scroll
- Active link highlight sesuai halaman yang sedang dibuka
- Language switcher ID / EN
- CTA button "Diskusi via WhatsApp" di kanan

**Struktur HTML:**
```html
<nav id="navbar">
  <div class="nav-inner">
    <a href="/" class="nav-logo">
      <img src="assets/images/conscious-logo-main.png" alt="Conscioustravel">
    </a>
    <div class="nav-links" id="nav-links">
      <!-- Rendered by JS: Experiences, Corporate, Impact, About, Contact -->
    </div>
    <div class="nav-right">
      <div class="lang-switcher">
        <button class="lang-btn" data-lang="id">ID</button>
        <span>|</span>
        <button class="lang-btn" data-lang="en">EN</button>
      </div>
      <a href="#" id="nav-cta" class="btn-primary">Diskusi via WhatsApp</a>
      <button class="hamburger" id="hamburger" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <div class="mobile-menu" id="mobile-menu">
    <!-- Mobile nav links + lang switcher + CTA -->
  </div>
</nav>
```

**Nav Links:**
```
Experiences    → /experiences
Corporate      → /company-outing
Impact         → /impact
About          → /about
Contact        → /contact
```

**CSS Notes:**
- Navbar height: 72px desktop, 64px mobile
- Transition background: 250ms ease
- Mobile menu: slide down dari atas, z-index tinggi

---

## 2. FOOTER

**Dipakai di:** Semua halaman

**Struktur:**
```
Kolom 1: Brand
  - Logo
  - Deskripsi singkat
  - Social links (Instagram + WhatsApp)

Kolom 2: Company Info
  - PT Wisata Perjalanan Bermakna
  - Alamat lengkap
  - WhatsApp (clickable)
  - Instagram
  - Google Reviews

Kolom 3: Quick Links
  - Experiences, Company Outing, Impact, About, Contact

Footer Bottom:
  - Copyright
  - (Opsional Phase 2: Privacy Policy, Terms)
```

---

## 3. HERO SECTION

**Dipakai di:** Home, Company Outing, Experiences, Impact, About

**Variasi:**
- `hero--home`: foto besar + badge float + trust badges
- `hero--page`: lebih compact, tidak perlu trust badges
- `hero--split`: teks kiri, foto kanan (untuk Company Outing dan Experiences)
- `hero--centered`: teks di tengah, foto background (untuk Impact, About)

**Props yang harus bisa dikustomisasi per halaman:**
```
- eyebrow (string)
- headline (string)
- subheadline (string)
- ctaPrimary (label + href)
- ctaSecondary (label + href)
- image (src + alt)
- variant (home | page | split | centered)
```

---

## 4. SECTION HEADER

**Dipakai di:** Semua section yang punya judul

**Struktur:**
```html
<div class="section-header">
  <p class="eyebrow">Label Kecil</p>
  <h2>Judul Section</h2>
  <p class="section-desc">Deskripsi opsional</p>
</div>
```

**CSS:**
- Eyebrow: uppercase, letter-spacing, warna `--color-primary-light`
- H2: bold, warna `--color-dark`
- Deskripsi: max-width 600px, centered jika section centered

---

## 5. PACKAGE CARD

**Dipakai di:** Home, Company Outing

**Struktur:**
```html
<div class="package-card">
  <div class="pkg-img">
    <img src="..." alt="...">
  </div>
  <div class="pkg-body">
    <div class="pkg-meta">
      <span class="pkg-chip">📍 Lokasi</span>
      <span class="pkg-chip price">Mulai Rp750.000/pax</span>
      <span class="pkg-chip pax">Min. 50 pax</span>
    </div>
    <div class="pkg-title">Bali Starter</div>
    <div class="pkg-subtitle">Nature Escape + Impact Light</div>
    <p>Deskripsi paket...</p>
    <div class="pkg-includes">
      <h4>Termasuk</h4>
      <ul><!-- list includes --></ul>
    </div>
    <button class="pkg-addons-toggle">Add-on Tersedia ▾</button>
    <div class="pkg-addons-list"><!-- addon tags --></div>
    <div class="pkg-cta">
      <a href="..." class="btn-primary">Tanya Paket</a>
    </div>
  </div>
</div>
```

**Data source:** `data/packages.json`

---

## 6. EXPERIENCE CARD

**Status:** Ditunda sampai Phase 2 Experience Catalog.

**Dipakai nanti di:** Experiences hub, Home (preview), Experience Detail (related)

Catatan Phase 1.5: jangan tampilkan card, harga mulai, atau link detail B2C
sebelum data catalog final disetujui.

**Struktur:**
```html
<div class="experience-card" data-category="nature">
  <div class="exp-img">
    <img src="..." alt="...">
    <span class="exp-category-badge">Nature</span>
  </div>
  <div class="exp-body">
    <h3 class="exp-title">Nama Experience</h3>
    <p class="exp-location">📍 Kintamani</p>
    <p class="exp-duration">⏱ Full Day</p>
    <p class="exp-price">Mulai Rp350.000/pax</p>
    <a href="/experiences/nama-slug" class="btn-ghost">Lihat Detail →</a>
  </div>
</div>
```

**Data source:** `data/experiences.json`

**Filter behavior:**
- `data-category` attribute digunakan oleh `experience-filter.js`
- Default tampilkan semua, filter hide/show berdasarkan kategori aktif

---

## 7. CTA SECTION

**Dipakai di:** Semua halaman (bagian bawah sebelum footer)

**Variasi:**
- `cta--cream`: background cream, teks gelap
- `cta--dark`: background hijau gelap, teks putih
- `cta--white`: background putih, teks gelap

**Struktur:**
```html
<section class="cta-section cta--cream">
  <div class="container">
    <h2>Judul CTA</h2>
    <p>Subtext pendek</p>
    <div class="cta-buttons">
      <a href="..." class="btn-primary">💬 Diskusi via WhatsApp</a>
      <a href="/contact" class="btn-secondary">Isi Inquiry Form</a>
    </div>
  </div>
</section>
```

---

## 8. INQUIRY FORM

**Dipakai di:** Contact, Company Outing (embedded singkat), Experience Detail

**Versi:**
- `form--full`: semua field (dipakai di /contact)
- `form--short`: hanya nama, WA, jenis kebutuhan, pesan (dipakai di halaman lain)

**Field lengkap (form--full):**
```
- Nama Lengkap (required)
- Nomor WhatsApp (required)
- Email (optional)
- Jenis Kebutuhan (select, required)
- Tipe Customer (select, required)
- Nama Perusahaan (optional)
- Paket yang Diminati (select)
- Area Tujuan (select)
- Jumlah Peserta (select, required)
- Tanggal Trip (date, optional)
- Budget per pax (select, optional)
- Pesan (textarea)
```

**Submit behavior:**
- POST ke Google Apps Script endpoint
- Success state: sembunyikan form, tampilkan pesan sukses + tombol WhatsApp
- Error state: highlight field yang belum diisi

**Submit endpoint:** sudah ada di `js/main.js` (APPS_SCRIPT_URL)

---

## 9. TESTIMONIAL SECTION

**Dipakai di:** Home, Company Outing, Experiences

**Struktur:**
```html
<section class="testimonials">
  <div class="container">
    <div class="section-header">...</div>
    <div class="testimonial-grid">
      <div class="testimonial-card">
        <p class="testimonial-text">"Kutipan testimonial..."</p>
        <div class="testimonial-author">
          <strong>Nama</strong>
          <span>Jabatan — Perusahaan</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 10. CLIENT LOGO SECTION

**Dipakai di:** Home, Company Outing, About

**Struktur:**
```html
<section class="clients">
  <div class="container">
    <p class="clients-label">Dipercaya oleh</p>
    <div class="clients-grid">
      <!-- logo atau nama klien -->
    </div>
  </div>
</section>
```

**Catatan:** Kalau logo belum ada, tampilkan nama klien sebagai badge teks.

---

## 11. FAQ ACCORDION

**Dipakai di:** Company Outing, Experiences, Contact

**Struktur:**
```html
<div class="faq-list">
  <div class="faq-item">
    <button class="faq-q" aria-expanded="false">
      Pertanyaan? <span class="faq-arrow">▾</span>
    </button>
    <div class="faq-a">
      <p>Jawaban...</p>
    </div>
  </div>
</div>
```

**Behavior:**
- Satu item terbuka sekaligus (accordion)
- Smooth slide down `300ms ease`
- aria-expanded update untuk accessibility

---

## 12. GALLERY GRID

**Dipakai di:** Home, Experiences, About, Experience Detail

**Struktur:**
```html
<div class="gallery-grid">
  <div class="gallery-item">
    <img src="..." alt="..." loading="lazy">
    <div class="gallery-label">Label Foto</div>
  </div>
</div>
```

**CSS Layout:**
- Desktop: 4 kolom
- Tablet: 3 kolom
- Mobile: 2 kolom
- Aspect ratio: 1:1 atau 4:3

---

## 13. IMPACT HIGHLIGHT BLOCK

**Dipakai di:** Home, Impact, About

**Struktur:**
```html
<section class="impact-block">
  <div class="container">
    <div class="impact-inner">
      <div class="impact-content">
        <p class="eyebrow">Impact Light Concept</p>
        <h2>Small Impact, Better Story</h2>
        <p>Deskripsi konsep...</p>
        <div class="impact-items">
          <div class="impact-item">
            <span class="ii-icon">💚</span>
            <span class="ii-label">Responsible Travel Briefing</span>
          </div>
          <!-- ... -->
        </div>
        <a href="/impact" class="btn-white">Pelajari Impact Light</a>
      </div>
      <div class="impact-img">
        <img src="..." alt="...">
      </div>
    </div>
  </div>
</section>
```

---

## 14. WHATSAPP FLOATING BUTTON

**Dipakai di:** Semua halaman

**Struktur:**
```html
<a href="https://wa.me/6285195559749?text=..." id="floating-wa"
   target="_blank" rel="noopener" aria-label="Chat via WhatsApp">
  <span class="wa-icon"><!-- SVG WhatsApp --></span>
  <span class="wa-label">Diskusi via WhatsApp</span>
</a>
```

**CSS:**
- Position: fixed, bottom-right
- Z-index: var(--z-floating)
- Mobile: label tersembunyi, hanya icon
- Desktop: icon + label

---

## 15. BREADCRUMB

**Dipakai di:** Semua halaman kecuali Home

**Struktur:**
```html
<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li aria-current="page">Nama Halaman</li>
  </ol>
</nav>
```

---

## 16. STICKY BOTTOM BAR (Mobile Only)

**Status:** Ditunda sampai Phase 2 Experience Detail.

**Dipakai nanti di:** Experience Detail page

**Behavior:**
- Muncul saat user scroll melewati hero section
- Berisi: harga mulai + tombol WhatsApp
- Position: fixed, bottom-0, full-width
- Z-index: var(--z-floating)

```html
<div class="sticky-bar" id="sticky-bar">
  <span class="sticky-price">Mulai Rp350.000/pax</span>
  <a href="..." class="btn-primary">💬 Tanya via WhatsApp</a>
</div>
```

---

## Data Files

### `data/experiences.json`

Phase 1.5: file ini dikosongkan agar draft harga dan route B2C tidak
terpublish sebagai catalog final. Struktur berikut hanya referensi Phase 2.

```json
[
  {
    "slug": "kintamani-jeep-adventure",
    "title": "Kintamani Jeep Adventure & Local Lunch",
    "category": "nature",
    "location": "Kintamani",
    "duration": "Full Day",
    "priceFrom": 350000,
    "image": "assets/images/jeep-adventure.png",
    "excerpt": "Deskripsi singkat...",
    "includes": [],
    "excludes": [],
    "itinerary": [],
    "gallery": [],
    "waMessage": "Halo, saya tertarik dengan Kintamani Jeep Adventure..."
  }
]
```

### `data/packages.json`
```json
[
  {
    "id": "nature-escape",
    "title": "Bali Starter",
    "subtitle": "Nature Escape + Impact Light",
    "location": "Ubud / Kintamani",
    "priceFrom": 750000,
    "minPax": 50,
    "image": "assets/images/kintamani-outing-cover.png",
    "includes": [],
    "addons": [],
    "waMessage": "Halo, saya tertarik dengan paket Nature Escape..."
  }
]
```
