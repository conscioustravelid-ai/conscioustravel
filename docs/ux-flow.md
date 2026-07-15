# UX Flow — Conscioustravel.id

## Overview

Dokumen ini menjelaskan alur perjalanan user dari pertama kali melihat iklan
sampai melakukan kontak atau inquiry. Ada tiga flow utama yang perlu didukung
oleh struktur dan komponen website.

---

## 1. B2B FLOW — Dari Ads ke Request Proposal

### Konteks
User adalah HR, Manajer, atau Event Planner yang melihat iklan company outing di Bali.
Mereka butuh meyakinkan diri (dan atasan) bahwa Conscioustravel adalah pilihan yang tepat.

### Alur Lengkap

```
[1] Iklan Google / Meta
    ↓ (klik iklan)
    
[2] Landing di /company-outing atau /
    - Hero section menjelaskan value prop dalam 5 detik
    - CTA WhatsApp sudah terlihat tanpa scroll
    
    ↓ (scroll ke bawah atau klik "Lihat Paket")
    
[3] Baca Package Cards
    - Bandingkan Nature Escape vs Beach Club Party
    - Lihat includes dan add-on
    - Cek harga mulai dan minimum pax
    
    ↓ (masih ragu, scroll terus)
    
[4] Lihat How It Works
    - 3 langkah yang clear: Diskusi → Proposal → Execution
    - Menjawab kekhawatiran soal proses dan koordinasi
    
    ↓ (semakin yakin)
    
[5] Lihat Client Logo + Testimonial
    - Social proof dari perusahaan yang sudah pernah pakai
    - Trust bertambah
    
    ↓ (siap kontak)
    
[6] Klik CTA WhatsApp ATAU scroll ke Inquiry Form
    
    Path A — WhatsApp:
    → Klik tombol WhatsApp dengan prefilled message
    → Chat langsung dengan tim Conscioustravel
    → Diskusi kebutuhan (jumlah pax, tanggal, budget)
    → Tim kirim proposal/quotation
    → Follow up → Deal ✓
    
    Path B — Inquiry Form:
    → Isi form inquiry (nama, WA, jenis kebutuhan, pax, dll)
    → Submit → Success state dengan tombol WhatsApp
    → Tim follow up via WhatsApp
    → Diskusi → Proposal → Deal ✓
```

### Touchpoints Kritis (Jangan Sampai Hilang)

| Touchpoint | Lokasi | Fungsi |
|---|---|---|
| Hero CTA WhatsApp | Above the fold, mobile | First conversion opportunity |
| Package Cards | Section #packages | Decision point utama |
| How It Works | Setelah package | Hilangkan kekhawatiran proses |
| Client Logos | Sebelum FAQ | Social proof |
| FAQ | Sebelum final CTA | Jawab keberatan terakhir |
| Final CTA | Sebelum footer | Last chance kontak |
| Floating WA button | Seluruh halaman | Always-available escape hatch |

### Micro-interactions yang Penting
- Package card hover: lift subtle, tidak berlebihan
- FAQ accordion: smooth open/close
- Form submit: loading state + success state yang jelas
- WhatsApp button: label berubah sedikit di hover ("Mulai Chat" atau tetap)

---

## 2. B2C FLOW — Dari Ads ke Inquiry Daily Trip

### Konteks
User adalah traveler, couple, atau small group yang melihat iklan daily trip atau
experience di Bali. Mereka lebih spontan, lebih visual, dan ingin proses yang cepat.

### Alur Lengkap

```
[1] Iklan Meta (Instagram/Facebook) — visual-heavy
    ↓ (klik iklan)
    
[2] Landing di /experiences atau /
    - Hero tone lebih personal dan warm
    - Foto Bali yang beautiful
    - CTA: "Buat Trip Custom" atau "Explore Trip Types"
    
    ↓ (scroll ke trip type / custom trip)
    
[3] Lihat inspirasi trip type
    - Uluwatu, Kintamani, Ubud, beach hopping, food, family/couple
    - Tidak ada harga fixed atau detail itinerary public di Phase 1.5
    
    ↓ (tertarik diskusi itinerary)
    
[4] Klik CTA WhatsApp
    → Chat langsung
    → Tanya tanggal, pax, custom request
    → Konfirmasi → Trip terjadwal ✓
    
    ATAU
    
[4b] Lihat "Custom Trip" CTA Block
    → "Tidak menemukan yang cocok? Kami bisa buat khusus."
    → Klik WhatsApp
    → Diskusi custom itinerary
    → Konfirmasi → Trip terjadwal ✓
```

### Touchpoints Kritis

| Touchpoint | Lokasi | Fungsi |
|---|---|---|
| Hero visual | Above the fold | First impression — harus beautiful |
| Trip type tags | /experiences | Inspirasi tanpa menjanjikan catalog final |
| Gallery preview | /experiences | Memperkuat desire tanpa detail package |
| Custom trip block | /experiences | Jaring lead yang tidak cocok paket |
| Floating WA button | Seluruh halaman | Escape hatch kapan saja |

### UX Notes B2C
- Foto adalah senjata utama — kualitas foto langsung mempengaruhi konversi
- Proses harus terasa ringan: WhatsApp satu klik, bukan form panjang
- Jangan tampilkan harga B2C fixed sebelum data Experience Catalog Phase 2 final
- Mobile experience harus sempurna — B2C mayoritas dari Instagram ads di HP

---

## 3. FUTURE EXPERIENCE CATALOG & BOOKING FLOW

### Konteks
Phase 2 membuat Experience Catalog untuk B2C Daily Trip. Phase 3 membuat
Booking Request System tanpa payment. Phase 4 baru menambahkan online payment.
B2B tetap via proposal dan WhatsApp.

### Alur Lengkap

```
[1] User di /experiences/[slug] (Phase 2)
    ↓
    
[2] Klik tombol "Request Booking" (Phase 3, tanpa payment)
    ↓
    
[3] /booking?experience=[slug]
    - Pilih tanggal (date picker)
    - Pilih jumlah pax
    - Preview harga otomatis (pax × harga per pax)
    ↓
    
[4] Isi detail peserta
    - Nama, WhatsApp, email
    - Special request (optional)
    ↓
    
[5] Review & Confirm
    - Summary: nama experience, tanggal, pax, total harga
    - Tombol: "Kirim Booking Request"
    ↓
    
[6] Tim follow up via WhatsApp / email
    - Validasi availability
    - Konfirmasi detail operasional
    ↓

[7] Payment Gateway (Phase 4: Midtrans atau Xendit)
    - Transfer bank / QRIS / kartu kredit
    ↓
    
[8] Konfirmasi
    - Email konfirmasi otomatis
    - WhatsApp notifikasi dari tim
    - Status booking di halaman terima kasih
```

### Yang Perlu Disiapkan Sekarang untuk Phase 2
- Struktur konten Experiences tetap rapi sebagai entry point B2C
- Data draft experience tidak dipublish sebagai public catalog
- Form inquiry sudah ada sebagai fondasi form booking
- Jangan hardcode harga B2C di HTML sebelum data Phase 2 final

---

## 4. NAVIGATION FLOW (Antar Halaman)

### Dari Home

```
Home → /company-outing     (klik card B2B atau menu Corporate)
Home → /experiences        (klik card B2C atau menu Experiences)
Home → /impact             (klik Impact block atau menu Impact)
Home → /about              (menu About)
Home → /contact            (menu Contact atau CTA Form)
```

### Dari Company Outing

```
/company-outing → WhatsApp (CTA utama)
/company-outing → /contact (CTA sekunder / inquiry form)
/company-outing → /impact  (Impact Light preview block)
```

### Dari Experiences

```
/experiences → WhatsApp             (custom trip CTA)
```

### Dari Experience Detail (Phase 2)

```
/experiences/[slug] → WhatsApp                 (CTA utama)
/experiences/[slug] → /experiences             (breadcrumb)
/experiences/[slug] → /experiences/[other-slug] (related experiences)
```

---

## 5. MOBILE UX NOTES

### Prinsip Utama
- **Mobile-first**: semua layout dirancang dari 375px, bukan di-scale down dari desktop
- **Thumb-friendly**: semua tombol minimal 44×44px tap target
- **Above the fold**: CTA WhatsApp harus selalu terlihat tanpa scroll di mobile

### Hal Spesifik per Halaman

**Home:**
- Hero CTA dua tombol: stack vertikal di mobile, tidak side-by-side
- Trust badges: scroll horizontal
- Audience split card: 1 kolom penuh di mobile

**Company Outing:**
- Package card: 1 kolom penuh, foto atas konten bawah
- How It Works: numbered list vertikal, bukan horizontal steps
- FAQ accordion: sangat penting di mobile untuk kompres konten panjang

**Experiences:**
- Filter bar: scroll horizontal, tidak wrap ke 2 baris
- Experience grid: 1 kolom di mobile (400px ke bawah), 2 kolom di tablet

**Experience Detail:**
- Gallery: swipeable horizontal slider atau lightbox
- Sticky bottom bar: muncul setelah scroll 300px dari top
- Itinerary accordion: default tertutup di mobile untuk hemat ruang

**Contact:**
- Nomor WhatsApp: `<a href="tel:+6285195559749">` dan `<a href="https://wa.me/...">`
- Maps embed: height 250px di mobile, 400px di desktop
- Form: satu kolom penuh, label di atas input (bukan inline)

---

## 6. ACCESSIBILITY NOTES

- Semua gambar punya `alt` yang deskriptif
- Semua CTA button punya `aria-label` yang jelas
- FAQ accordion menggunakan `aria-expanded` dan `aria-controls`
- Form: setiap input punya `<label>` yang terhubung dengan `for` dan `id`
- Kontras warna minimum 4.5:1 untuk teks body
- Navigasi keyboard harus berfungsi di semua komponen interaktif
- `prefers-reduced-motion`: kurangi atau hilangkan animasi untuk user yang meminta
