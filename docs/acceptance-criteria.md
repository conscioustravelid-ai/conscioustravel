# Acceptance Criteria — Conscioustravel.id

## Overview

Dokumen ini adalah daftar kriteria yang harus dipenuhi sebelum setiap halaman
dianggap selesai dan siap dipublish. Gunakan dokumen ini sebagai checklist QA.

---

## GLOBAL (Berlaku untuk Semua Halaman)

### Design & Brand
- [ ] Website tidak terlihat seperti template travel agent generik
- [ ] Maksimal 2 warna dominan per section
- [ ] Tidak ada gradien ramai, warna neon, atau efek visual yang berlebihan
- [ ] Semua warna menggunakan CSS variables (tidak ada hardcode)
- [ ] Typography menggunakan Plus Jakarta Sans di semua teks
- [ ] Skala font mengikuti yang didefinisikan di `design-system.md`

### Layout & Responsif
- [ ] Semua halaman mobile-first dan responsif di 375px, 768px, 1280px
- [ ] Tidak ada horizontal scroll yang tidak disengaja di mobile
- [ ] Container max-width 1200px dengan padding horizontal 24px
- [ ] Section padding konsisten (80px desktop, 56px mobile)
- [ ] Tidak ada elemen yang terpotong atau overflow di mobile

### Navbar
- [ ] Sticky di atas di semua halaman
- [ ] Transparent saat di hero, solid saat scroll
- [ ] Link aktif sesuai halaman yang sedang dibuka
- [ ] Language switcher ID/EN berfungsi di semua halaman
- [ ] CTA WhatsApp terlihat di navbar desktop
- [ ] Hamburger menu berfungsi di mobile
- [ ] Mobile menu menutup saat link diklik

### Footer
- [ ] Identik di semua halaman
- [ ] Quick Links mengarah ke halaman yang benar
- [ ] WhatsApp link bisa diklik
- [ ] Instagram link mengarah ke profil yang benar
- [ ] Nama legal PT Wisata Perjalanan Bermakna tertera

### WhatsApp
- [ ] Floating WhatsApp button ada di semua halaman
- [ ] Nomor selalu `6285195559749` (format internasional)
- [ ] Semua WhatsApp link menggunakan format `https://wa.me/6285195559749`
- [ ] Prefilled message sesuai konteks halaman/package/experience

### Accessibility
- [ ] Semua gambar punya `alt` yang deskriptif (bukan `alt=""` kecuali dekoratif)
- [ ] Semua CTA button punya label teks yang jelas atau `aria-label`
- [ ] Kontras warna teks minimal 4.5:1 di atas background
- [ ] Form: setiap input terhubung dengan `<label>` via `for` dan `id`
- [ ] FAQ accordion menggunakan `aria-expanded`

### Performance
- [ ] Semua foto pakai `loading="lazy"` kecuali hero
- [ ] Tidak ada foto lebih dari 300KB
- [ ] Halaman load dalam 3 detik di koneksi 4G (estimasi)
- [ ] Tidak ada console error saat halaman dibuka

### SEO
- [ ] Setiap halaman punya `<title>` yang unik dan deskriptif
- [ ] Setiap halaman punya `<meta name="description">` yang unik (150–160 karakter)
- [ ] Setiap halaman punya tepat satu `<h1>`
- [ ] `<link rel="canonical">` ada dengan URL yang benar

### Tracking
- [ ] GTM snippet ada di `<head>` (script) dan awal `<body>` (noscript)
- [ ] ID GTM: `GTM-NVVKFSSN`

---

## HOME (`/`)

- [ ] B2B dan B2C bisa dibedakan dalam 5 detik tanpa membaca banyak teks
- [ ] CTA WhatsApp terlihat di above the fold di mobile (375px)
- [ ] Hero headline jelas menjelaskan value proposition
- [ ] Trust badges terlihat dan readable
- [ ] Audience split card mengarah ke halaman yang benar (`/company-outing` dan `/experiences`)
- [ ] Package cards menampilkan 2 paket dengan benar
- [ ] "Lihat Semua Paket" mengarah ke `/company-outing`
- [ ] Experience preview menampilkan 3–4 experience
- [ ] "Lihat Semua Experience" mengarah ke `/experiences`
- [ ] Impact block ada dengan link ke `/impact`
- [ ] Gallery grid tampil dengan benar di mobile (2 kolom) dan desktop (4 kolom)
- [ ] Client logos / testimonial tampil
- [ ] Final CTA ada sebelum footer
- [ ] Bahasa switcher mengubah semua teks di halaman

---

## COMPANY OUTING (`/company-outing`)

- [ ] Breadcrumb menampilkan: Home > Company Outing
- [ ] H1 ada dan menekankan value B2B
- [ ] CTA "Minta Proposal" mengarah ke WhatsApp dengan pesan prefilled yang relevan
- [ ] Kedua package card tampil dengan semua informasi (includes, addons, harga, pax)
- [ ] Add-on toggle berfungsi (expand/collapse)
- [ ] How It Works menampilkan 3 langkah dengan jelas
- [ ] FAQ accordion berfungsi, pertanyaan relevan untuk B2B
- [ ] Link ke `/impact` dari Impact Light block berfungsi
- [ ] Link ke `/contact` dari CTA sekunder berfungsi
- [ ] Client logos tampil
- [ ] Inquiry form tersedia sebagai alternatif WhatsApp

---

## EXPERIENCES (`/experiences`)

- [ ] Breadcrumb menampilkan: Home > Experiences
- [ ] H1 ada dengan tone B2C (personal, warm)
- [ ] Halaman menjelaskan daily trip / small-group custom trip tanpa catalog final
- [ ] Tidak ada harga B2C fixed yang tampil sebelum Phase 2
- [ ] Tidak ada link ke `/experiences/[slug]` sebelum Experience Catalog dibuat
- [ ] Trip type tags tampil sebagai inspirasi, bukan paket final
- [ ] Gallery / preview visual tampil tanpa klaim itinerary detail
- [ ] Custom Trip CTA block ada dan WhatsApp link berfungsi
- [ ] FAQ accordion dengan pertanyaan relevan B2C berfungsi

---

## EXPERIENCE DETAIL (`/experiences/[slug]`) — DEFERRED PHASE 2

- [ ] Route detail experience belum dipublish di Phase 1.5
- [ ] Data draft B2C tidak tampil sebagai public catalog sebelum Phase 2
- [ ] Detail page baru boleh dibuat saat Phase 2 Experience Catalog dimulai

---

## IMPACT & SUSTAINABILITY (`/impact`)

- [ ] Breadcrumb menampilkan: Home > Impact
- [ ] H1 tone rendah hati, tidak bombastis
- [ ] Tidak ada klaim berlebihan ("terbaik", "100% eco-friendly", dll)
- [ ] 6 aktivitas impact tampil dalam grid
- [ ] Local partner section ada
- [ ] Angka/stats hanya ditampilkan jika data nyata tersedia
- [ ] Link ke `/company-outing` dan `/experiences` dari block "Impact dalam setiap paket" berfungsi
- [ ] CTA WhatsApp berfungsi dengan pesan prefilled relevan

---

## ABOUT US (`/about`)

- [ ] Breadcrumb menampilkan: Home > About
- [ ] Nama legal "PT Wisata Perjalanan Bermakna" tertera
- [ ] Alamat lengkap dan benar
- [ ] Team section ada (foto atau placeholder)
- [ ] Mission & Values tampil
- [ ] Client logos tampil
- [ ] Tone narasi personal dan genuine, bukan korporat
- [ ] CTA WhatsApp berfungsi

---

## CONTACT (`/contact`)

- [ ] H1 ada
- [ ] Nomor WhatsApp bisa diklik langsung di mobile (wa.me link)
- [ ] Instagram link mengarah ke profil yang benar
- [ ] Alamat lengkap tertera
- [ ] Google Maps embed tampil responsif
- [ ] Form inquiry berfungsi end-to-end (submit → sukses → tombol WhatsApp)
- [ ] Validasi form berjalan (required fields, format email)
- [ ] Error state tampil dengan pesan yang jelas
- [ ] Success state tampil setelah submit berhasil
- [ ] FAQ accordion berfungsi

---

## CHECKLIST SEBELUM LAUNCH

### Technical
- [ ] Semua halaman Phase 1 selesai dan lulus acceptance criteria masing-masing
- [ ] Tidak ada console error di semua halaman
- [ ] Tidak ada broken link (semua `href` mengarah ke tujuan yang valid)
- [ ] GTM terverifikasi aktif di semua halaman via Tag Assistant
- [ ] GA4 menerima pageview dari semua halaman (cek Realtime report)
- [ ] Form inquiry mengirim data ke Google Sheets dengan benar
- [ ] WhatsApp links semua berfungsi di mobile

### Content
- [ ] Semua copy bilingual (ID dan EN) sudah diisi di `content.js`
- [ ] Tidak ada teks placeholder seperti "Lorem ipsum" atau "TODO"
- [ ] Semua foto sudah ada di `assets/images/` dan ukurannya wajar
- [ ] Nomor WhatsApp benar: `085195559749` / `6285195559749`
- [ ] Alamat dan info legal benar

### SEO
- [ ] Semua halaman punya title dan meta description yang unik
- [ ] Semua canonical URL mengarah ke domain yang benar (`conscioustravel.id`)
- [ ] Tidak ada duplicate H1

### Ads Readiness
- [ ] URL `/` (Home) tetap berfungsi sebagai landing page untuk ads
- [ ] URL `/company-outing` bisa dipakai sebagai landing page B2B ads
- [ ] UTM parameter dari URL tersimpan di form submission
- [ ] Halaman load cepat di mobile (prioritas karena mayoritas traffic dari ads mobile)
