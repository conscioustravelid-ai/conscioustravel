# Codex Prompt — Use Phase 2 Product Files

Halo Codex,

Saya sudah menambahkan dua file sumber produk untuk Phase 2:

- `product-content-spec.md`
- `product-data.json`

Tolong baca keduanya sebelum implementasi.

Gunakan:
1. `product-content-spec.md` sebagai business/content specification.
2. `product-data.json` sebagai structured product source untuk reusable components atau centralized data.

Important rules:
- Jangan membuat interpretasi produk baru yang bertentangan dengan dua file tersebut.
- WhatsApp utama: `+6285195559749`
- Email: `happy@conscioustravel.id`
- Pertahankan Google Sheets integration.
- Jangan implementasikan booking/payment.
- Jangan implementasikan Blog CMS sebelum CMS audit disetujui.

Key product rules:

## Bali Starter
Bali Starter adalah SATU produk 1 hari dengan empat opsi:
- Kintamani
- Ubud
- Atlas Beach Club
- Nuanu City

Jangan tampilkan keempatnya sebagai empat top-level package yang tidak berhubungan.

## Indonesia Region
Urutan:
1. Bali
2. Jogja
3. Bandung
4. Lombok

Bali Starter menjadi hero product Bali.
Jogja Silver, Bandung Silver, dan Lombok Silver menjadi featured.
Gold menjadi upgrade.

## International Corporate
Tampilkan Bangkok, Vietnam, dan Europe.
Europe prices:
- Gold: mulai Rp32 juta/pax excl. flight
- Premium: mulai Rp39,9 juta/pax excl. flight

Harga Europe adalah working price dan harus mudah diedit.

## CSR
Featured:
- Village Empowerment
- School Impact Day
- Bicycle for Education
- Build for Community
- Mangrove Restoration

Program lain masuk ke “More CSR Programs”.

Claims seperti Impact Report, ESG Certificate, 2,5% automatic donation, dan one tree per person masih dalam business review. Buat centralized/easy-to-edit.

## Event Planning
Fokus pada corporate travel, retreat, gathering, team building, company outing, incentive trip, CSR activation, dan MICE/conference bila relevan.
Jangan perluas menjadi general wedding/concert EO.

Gunakan 3 pricing cards:
- Starter
- Professional
- Enterprise

Premium Corporate tampil sebagai separate CTA/banner.

## Study Tour
Satu landing page dengan:
- Regional Study Tour
- International Study Tour

Gunakan “Mulai dari / Starting from”.

## Experiences
Tetap general:
- Local Experiences
- International Experiences

Jangan masukkan Corporate Packages ke halaman Experiences.

## Sailing
General, available by request.
Tidak ada fixed price atau fixed itinerary.

Setelah membaca file:
1. Ringkas mapping produk ke setiap route.
2. Jelaskan reusable components/data structure yang akan dipakai.
3. Sebutkan konflik dengan code/data existing jika ada.
4. Jika masih Plan/Audit Mode, jangan ubah code sebelum saya approve.
