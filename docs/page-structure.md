# Page Structure — Conscioustravel.id

## Overview

Dokumen ini menjelaskan struktur section dari setiap halaman Phase 1.
Setiap halaman mengikuti pola: Navbar → Konten → Footer.
Semua halaman menggunakan layout default kecuali ada catatan khusus.

---

## Sitemap Phase 1

```
/                        → Home
/company-outing          → Company Outing
/experiences             → Experiences / Daily Trips
/impact                  → Impact & Sustainability
/about                   → About Us
/contact                 → Contact
```

## Sitemap Phase 2 (Ditunda)

```
/experiences/[slug]      → Experience Detail
/company-outing/team-building
/company-outing/corporate-retreat
/company-outing/csr-impact-trip
/destinations
/destinations/[slug]
/blog
/blog/[slug]
/booking
```

---

## 1. HOME (`/`)

**Tujuan:** Jelaskan siapa Conscioustravel, tawarkan dua jalur (B2B dan B2C),
drive pengunjung ke WhatsApp atau halaman yang relevan.

**Target User:** Semua segmen — pengunjung baru dari ads, direct, referral.

### Struktur Section

```
1.  Navbar (sticky, transparent → solid saat scroll)
2.  Hero Section
      - Eyebrow: "Sustainable journeys. Meaningful impact."
      - H1: "Company Outing & Meaningful Trip in Bali"
      - Subheadline: value prop singkat, hangat
      - CTA Primary: "Diskusi via WhatsApp" → wa.me link
      - CTA Secondary: "Lihat Paket" → scroll ke #packages
      - Trust badges: 5 poin singkat (curated, facilitator, dll)
      - Visual: foto hero landscape atau portrait

3.  Trust Strip
      - Logo klien (horizontal scroll di mobile)
      - Atau stats: jumlah trip, klien, dll

4.  Audience Split (B2B vs B2C)
      - 2 card berdampingan
      - B2B: icon 🏢, judul, deskripsi, CTA ke /company-outing
      - B2C: icon 🌿, judul, deskripsi, CTA ke /experiences
      - Background: --color-cream

5.  Package Highlight
      - Eyebrow: "B2B Packages"
      - H2: "Paket Outing Kantor di Bali"
      - 2 Package Card (Nature Escape + Beach Club Party)
      - CTA di bawah: "Lihat Semua Paket" → /company-outing

6.  Experience Preview
      - Eyebrow: "Daily Trip & Small Group"
      - H2: "Explore Bali dengan Cara yang Lebih Personal"
      - Preview visual dan trip style, bukan catalog final
      - Jangan tampilkan harga B2C fixed sebelum Phase 2
      - CTA: "Explore Experiences" → /experiences

7.  Why Conscioustravel
      - 4 benefit block (icon + judul + deskripsi)
      - Background: --color-white

8.  Impact Light Block
      - Penjelasan singkat konsep Impact Light
      - 6 item (icon + label)
      - CTA: "Pelajari Impact Light" → /impact
      - Background: --color-primary (teks putih)

9.  Gallery Grid
      - 6–8 foto aktivitas
      - Background: --color-cream

10. Testimonial / Client Section
      - Logo klien
      - 2–3 testimonial card

11. Final CTA Section
      - H2 + subtext + CTA Primary (WhatsApp) + CTA Secondary (Inquiry)
      - Background: --color-cream

12. Footer
```

**CTA Utama:** Diskusi via WhatsApp
**CTA Sekunder:** Lihat Paket Outing

**SEO:**
- Title: `Company Outing & Daily Trip Bali | Conscioustravel.id`
- Meta description: fokus pada Bali, outing, meaningful travel
- H1 satu per halaman

---

## 2. COMPANY OUTING (`/company-outing`)

**Tujuan:** Meyakinkan HR, Manager, dan Event Planner bahwa Conscioustravel
adalah partner outing yang tepat. Drive ke WhatsApp atau inquiry form.

**Target User:** B2B — HR, Manajer, Founder, CSR Team, Corporate Event Planner.

### Struktur Section

```
1.  Navbar
2.  Breadcrumb: Home > Company Outing

3.  Hero Section
      - Eyebrow: "B2B — Corporate & Company"
      - H1: "Outing Kantor di Bali yang Lebih dari Sekadar Jalan-Jalan"
      - Subheadline: tekankan rapi, bermakna, mudah dikoordinasikan
      - CTA Primary: "Minta Proposal" → WhatsApp prefilled
      - CTA Secondary: "Lihat Paket" → scroll ke #packages

4.  Problem / Solution Statement
      - 2 kolom: "Outing biasanya..." vs "Bersama Conscioustravel..."
      - Tone: empathetic, bukan merendahkan kompetitor

5.  Package Cards (id="packages")
      - Eyebrow: "Bali Starter Packages"
      - H2: "Pilih Format Outing yang Paling Cocok"
      - 2 Package Card lengkap (includes, addons, harga, CTA)

6.  Add-on Section
      - List add-on yang bisa ditambahkan ke paket mana saja
      - Format: tag/chip atau simple list

7.  Why Conscioustravel untuk B2B
      - 4 benefit spesifik B2B (facilitator, dokumentasi, koordinasi, dll)

8.  How It Works
      - 3 langkah: Diskusi Kebutuhan → Kami Siapkan Proposal → Execution Day
      - Visual: numbered step dengan icon

9.  Client Logo + Testimonial
      - Logo perusahaan yang pernah jadi klien
      - 2–3 testimonial dari klien B2B

10. Impact Light Preview
      - Block singkat tentang impact option
      - CTA: "Tambahkan Impact ke Outing" → /impact

11. FAQ Accordion (B2B focused)
      - Pertanyaan seputar harga, minimum pax, proses, transport, dll

12. Final CTA Section
      - H2: "Siap Rencanakan Outing Tim Kamu?"
      - CTA Primary: WhatsApp
      - CTA Secondary: Isi Inquiry Form → /contact

13. Footer
```

**CTA Utama:** Minta Proposal / Diskusi via WhatsApp
**CTA Sekunder:** Isi Inquiry Form

**SEO:**
- Title: `Company Outing Bali | Team Building & Corporate Event | Conscioustravel`
- Keywords: company outing Bali, team building Bali, outing kantor Bali

---

## 3. EXPERIENCES / DAILY TRIPS (`/experiences`)

**Tujuan:** Menjelaskan daily trip dan custom small-group inquiry tanpa
menampilkan Experience Catalog final. Entry point B2C traveler.

**Target User:** B2C — traveler, couple, family, small group, international visitor.

### Struktur Section

```
1.  Navbar
2.  Breadcrumb: Home > Experiences

3.  Hero Section
      - Eyebrow: "B2C — Daily Trip & Small Group"
      - H1: "Explore Bali dengan Cara yang Lebih Personal"
      - Subheadline: fleksibel, custom, bukan paket wisata biasa
      - CTA Primary: "Buat Trip Custom" → WhatsApp
      - CTA Secondary: "Explore Trip Types" → scroll ke #daily-trip

4.  Daily Trip / Custom Trip Block
      - Jelaskan trip style secara umum: Uluwatu, Kintamani, Ubud, beach, food, family, couple
      - Tidak menampilkan card catalog, itinerary detail, atau harga B2C fixed
      - CTA WhatsApp untuk diskusi itinerary kustom

5.  Experience Preview / Gallery
      - Foto dan narasi inspiratif saja
      - Tidak mengarah ke detail page sebelum Phase 2

6.  Custom Trip CTA Block
      - Tone: "Tidak menemukan yang cocok? Kami bisa buat khusus untuk kamu."
      - CTA: WhatsApp dengan pesan prefilled
      - Background: --color-cream

7.  FAQ Accordion (B2C focused)
      - Pertanyaan seputar itinerary, harga, minimum pax, booking, dll

8. Final CTA Section
9. Footer
```

**CTA Utama:** Buat Trip Custom via WhatsApp
**CTA Sekunder:** Explore Trip Types

**SEO:**
- Title: `Daily Trip & Small Group Experiences Bali | Conscioustravel`
- Keywords: daily trip Bali, private tour Bali, custom trip Bali

---

## 4. EXPERIENCE DETAIL PAGE TEMPLATE (`/experiences/[slug]`) — DITUNDA PHASE 2

Catatan Phase 1.5: jangan publish route ini dan jangan tampilkan harga,
itinerary, gallery detail, include/exclude, add-ons, atau FAQ per experience
sebelum Experience Catalog Phase 2 disetujui.

**Tujuan:** Meyakinkan traveler untuk inquiry atau booking experience tertentu.

**Target User:** B2C yang sudah tertarik dengan experience spesifik.

### Struktur Section

```
1.  Navbar
2.  Breadcrumb: Home > Experiences > [Nama Experience]

3.  Hero / Cover
      - Foto full-width atau split (foto 60% | info 40%)
      - Judul experience (H1)
      - Badge: kategori, lokasi, durasi
      - Harga mulai
      - CTA Primary: "Tanya via WhatsApp"
      - CTA Secondary: "Isi Inquiry Form"

4.  Experience Overview
      - Deskripsi 2–3 paragraf
      - 4–6 highlight poin (icon + teks singkat)

5.  Itinerary / Program Detail
      - Accordion per waktu atau per sesi
      - Contoh: "Pagi", "Siang", "Sore" atau "Sesi 1", "Sesi 2"

6.  Gallery Grid
      - 4–8 foto experience
      - Swipeable/lightbox di mobile

7.  Includes & Excludes
      - 2 kolom: ✓ Termasuk | ✗ Tidak Termasuk

8.  Practical Info
      - Meeting point
      - Durasi
      - Minimum pax
      - Bahasa (Indonesia / English)
      - What to bring

9.  Related Experiences
      - 3 experience card lain
      - Judul: "Kamu Mungkin Juga Suka"

10. Sticky Bottom Bar (mobile only)
      - Harga mulai + tombol "Tanya via WhatsApp"
      - Muncul saat scroll melewati hero

11. Inquiry / Booking CTA Block
      - Form singkat atau tombol WhatsApp besar
      - Background: --color-cream

12. Footer
```

**CTA Utama:** Tanya via WhatsApp (prefilled message dengan nama experience)
**CTA Sekunder:** Isi Inquiry Form

**SEO:**
- Title: `[Nama Experience] Bali | Conscioustravel`
- Meta description: unik per experience
- Structured data: TouristAttraction atau TourPackage (future)

---

## 5. IMPACT & SUSTAINABILITY (`/impact`)

**Tujuan:** Bangun kredibilitas soal responsible travel tanpa overclaiming.

**Target User:** B2B yang butuh justifikasi CSR, B2C yang peduli lingkungan.

### Struktur Section

```
1.  Navbar
2.  Breadcrumb: Home > Impact

3.  Hero Section
      - Eyebrow: "Responsible Travel"
      - H1: "Travel yang Sedikit Lebih Baik"
      - Subheadline: genuine, rendah hati, tidak bombastis
      - Foto: suasana lokal yang genuine

4.  Philosophy Statement
      - 2–3 paragraf narasi
      - Tone: jujur, tidak klaim berlebihan
      - "Kami tidak menyebut diri kami eco-warrior. Kami hanya berusaha..."

5.  Impact Light Concept
      - Penjelasan konsep Impact Light
      - Cocok untuk outing dan daily trip
      - Visual: diagram sederhana atau icon block

6.  Aktivitas Impact yang Tersedia
      - Grid 6 item: icon + nama + deskripsi singkat
      - Responsible Travel Briefing, Local Lunch, Tree Support, dll

7.  Local Partner Highlight
      - 2–4 partner lokal dengan nama + deskripsi singkat
      - Tone: mendukung, bukan self-promo

8.  Stats / Angka Jujur (opsional)
      - Hanya tampilkan kalau datanya ada dan akurat
      - Jangan buat angka fiktif

9.  Impact dalam Setiap Paket
      - Block: "Semua paket outing dan experience bisa ditambahkan impact activity"
      - Link ke /company-outing dan /experiences

10. CTA Section
      - "Tambahkan Impact ke Trip atau Outing Kamu"
      - CTA Primary: WhatsApp
      - CTA Secondary: Lihat Paket

11. Footer
```

**SEO:**
- Title: `Responsible Travel Bali | Impact Light | Conscioustravel`
- Keywords: responsible travel Bali, CSR trip Bali, sustainable outing Bali

---

## 6. ABOUT US (`/about`)

**Tujuan:** Humanisasi brand, bangun trust, jelaskan siapa di balik Conscioustravel.

**Target User:** Semua segmen — terutama B2B yang butuh trust sebelum request proposal.

### Struktur Section

```
1.  Navbar
2.  Breadcrumb: Home > About

3.  Hero Section
      - Eyebrow: "Our Story"
      - H1: "Kami Percaya Perjalanan Bisa Lebih Bermakna"
      - Foto: tim atau suasana behind the scenes

4.  Our Story
      - Narasi 3–4 paragraf, tone personal dan genuine
      - Bagaimana Conscioustravel dimulai, kenapa, oleh siapa

5.  Mission & Values
      - 3–4 nilai utama (icon + judul + deskripsi singkat)

6.  Team Section
      - Foto + nama + role per anggota tim
      - Grid 2–4 kolom

7.  Legal Info
      - Nama legal: PT Wisata Perjalanan Bermakna
      - Alamat PT: Jl. Cempaka Bulak No. 77, Jaticempaka, Pondokgede, Kota Bekasi, Jawa Barat, 17411
      - Kantor Bali: Jl. Nusantara II No. 17, Tuban, Kuta, Badung, Bali, 80361
      - Nomor WhatsApp, Instagram
      - Background: --color-cream

8.  Client Logo Section
      - Logo perusahaan klien
      - Subtext: "Dipercaya oleh perusahaan dan komunitas di Bali"

9.  CTA Section
      - "Ingin tahu lebih lanjut? Diskusi dengan tim kami."
      - CTA Primary: WhatsApp
      - CTA Secondary: Lihat Paket

10. Footer
```

**SEO:**
- Title: `Tentang Kami | Conscioustravel.id — PT Wisata Perjalanan Bermakna`

---

## 7. CONTACT (`/contact`)

**Tujuan:** Berikan semua jalur kontak yang jelas.
Primary: WhatsApp. Secondary: Inquiry form.

**Target User:** Semua segmen yang sudah siap kontak.

### Struktur Section

```
1.  Navbar
2.  Page Header (H1 sederhana, tidak perlu hero besar)

3.  Contact Info Block
      - 📱 WhatsApp: 085195559749 (bisa di-tap di mobile)
      - 📸 Instagram: @conscioustravel.id
      - 📍 Alamat lengkap
      - Embed Google Maps (responsif)

4.  Inquiry Form (full version)
      - Semua field sesuai spec form yang sudah ada
      - Label bilingual (ID default, EN toggle)

5.  FAQ Singkat
      - 3–5 pertanyaan paling umum
      - Accordion

6.  Footer
```

**CTA Utama:** Hubungi via WhatsApp
**CTA Sekunder:** Kirim Inquiry Form

**SEO:**
- Title: `Kontak & Inquiry | Conscioustravel.id`
