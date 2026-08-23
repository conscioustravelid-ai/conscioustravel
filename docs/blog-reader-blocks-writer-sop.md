# Panduan Menulis Artikel ConsciousTravel

Panduan ini ditujukan untuk penulis dan editor non-teknis. Semua komponen di bawah tersedia melalui **Article Body** di Sanity Studio; penulis tidak perlu menulis HTML, CSS, JavaScript, GROQ, atau kode analitik.

> **Peringatan sementara:** jangan publish artikel yang menggunakan Table, Itinerary Block, Callout Block, atau CTA Block ke production sebelum tim teknis mengonfirmasi bahwa rilis frontend BRB1H selesai.

## 1. Struktur dasar artikel

- **Paragraph** untuk isi penjelasan biasa.
- **H2** untuk bagian utama. H2 masuk ke Table of Contents (TOC).
- **H3** untuk subbagian di bawah H2. H3 tampil sebagai sub-list TOC.
- **H4** biasanya tidak diperlukan dalam alur Blog.

Gunakan heading untuk menunjukkan struktur, bukan sekadar membuat teks terlihat lebih besar. Urutan yang benar adalah H2 lalu H3 yang terkait.

## 2. Table of Contents

TOC dibuat otomatis. Penulis tidak perlu dan tidak boleh membuat TOC secara manual.

- Kurang dari 3 H2: TOC disembunyikan.
- 3–6 H2: seluruh struktur H2 dan H3 terlihat.
- Lebih dari 6 H2: enam bagian utama pertama terlihat; pembaca dapat memilih **Lihat semua bagian**.
- H3 menjadi sub-item di bawah H2 terdekat.
- H4 tidak masuk TOC.

Tugas penulis hanya menyusun H2 dan H3 dengan benar.

## 3. Image

1. Pilih **Image** dan unggah atau pilih gambar yang sudah tersedia.
2. Isi **Alt Text**—field ini wajib.
3. Isi **Caption** bila pembaca membutuhkan konteks tambahan.

Alt harus menjelaskan apa yang benar-benar terlihat, bukan menumpuk keyword.

- Baik: `Peserta company outing mengikuti workshop kerajinan bersama pengrajin lokal di Ubud.`
- Buruk: `gambar bali tour travel bali murah corporate trip terbaik`.

## 4. Table

Gunakan Table untuk data terstruktur seperti budget, perbandingan rute, destinasi, atau paket. Baris pertama dapat ditandai sebagai header agar nama kolom mudah dipahami.

Contoh:

| Route | Base | Ritme |
| --- | --- | --- |
| A | Sanur | Aktif |
| B | Ubud | Santai |

Jangan gunakan Table untuk jadwal perjalanan harian. Gunakan Itinerary Block untuk jadwal berbasis hari dan waktu.

## 5. Itinerary Block

Gunakan Itinerary Block untuk jadwal Day 1, Day 2, Day 3, atau rencana perjalanan berbasis waktu.

- **Judul hari:** nama hari atau bagian itinerary.
- **Waktu:** waktu agenda, misalnya `09.00–10.30`.
- **Aktivitas:** kegiatan utama.
- **Area:** lokasi kegiatan.
- **Catatan:** informasi tambahan atau persiapan.
- **Opsional:** aktifkan bila agenda boleh dilewati.

Contoh: `Day 1 — Bali Selatan`, dengan agenda `09.00–10.30 | Workshop budaya | Sanur | Gunakan pakaian nyaman`.

Jangan menyusun itinerary panjang secara manual menggunakan tabel banyak kolom.

## 6. Callout Block

- **Tip:** saran praktis. Contoh: `Bawa botol minum isi ulang.`
- **Penting:** informasi yang perlu diperhatikan. Contoh: `Konfirmasi jumlah peserta sebelum reservasi.`
- **Perhatian:** risiko atau batasan. Contoh: `Jadwal dapat berubah karena cuaca.`
- **Good to Know:** konteks tambahan yang membantu. Contoh: `Sebagian venue menyediakan menu vegetarian.`

Judul bersifat opsional. Isi dapat memakai paragraf, list, bold, italic, dan link aman. Jangan terlalu sering memakai callout; gunakan hanya ketika informasi benar-benar layak ditekankan.

## 7. CTA Block

CTA adalah ajakan agar pembaca mengambil tindakan.

- **Eyebrow:** konteks singkat di atas judul.
- **Title:** pesan utama CTA.
- **Description:** alasan atau informasi pendukung.
- **Button Label:** teks tombol.
- **Destination:** tujuan tombol.
- **Style:** kekuatan tampilan CTA.
- **Tracking ID:** identitas unik untuk pengukuran.

Destination yang tersedia: **WhatsApp**, **Contact**, **Experiences**, **Corporate Packages**, dan **Custom Internal**. Untuk Custom Internal, gunakan path internal seperti `/study-tour/`, bukan URL eksternal.

Tracking ID hanya memakai huruf kecil, angka, dan tanda hubung tanpa spasi. Contoh: `blog-itinerary-bali-plan-trip`. Tracking ID harus unik dalam satu artikel. Penulis tidak perlu membuat JavaScript atau nama event GA4.

## 8. CTA Style

- **Soft:** CTA editorial yang halus.
- **Highlight:** CTA tengah artikel dengan penekanan lebih kuat.
- **Primary:** CTA konversi paling kuat.

Hindari terlalu banyak CTA bergaya Primary dalam satu artikel.

## 9. Quick rule: which block should I use?

| Kebutuhan | Gunakan |
| --- | --- |
| Penjelasan biasa | Paragraph |
| Bagian utama baru | H2 |
| Subbagian | H3 |
| Membandingkan data terstruktur | Table |
| Jadwal harian atau berbasis waktu | Itinerary |
| Catatan yang perlu ditekankan | Callout |
| Mengajak pembaca menghubungi atau melihat layanan | CTA |
| Menampilkan foto | Image |

## 10. Common mistakes

- Menggunakan H2 hanya untuk memperbesar teks.
- Menggunakan Table untuk itinerary.
- Menambahkan terlalu banyak Callout.
- Menambahkan terlalu banyak CTA agresif.
- Membiarkan Alt Text kosong atau mengisinya dengan keyword berulang.
- Menggunakan Tracking ID yang sama dua kali dalam satu artikel.
- Memasukkan URL eksternal ke Custom Internal CTA.
- Menulis TOC secara manual.

## 11. Before publishing checklist

- [ ] Title dan Slug sudah benar.
- [ ] Excerpt sudah ringkas dan jelas.
- [ ] Cover Image dan Alt Text sudah terisi.
- [ ] Author dan Category sudah dipilih.
- [ ] Struktur H2/H3 logis.
- [ ] Semua gambar memiliki Alt Text.
- [ ] Table mudah dibaca dan bukan itinerary.
- [ ] Itinerary lengkap dan urut.
- [ ] Callout benar-benar berguna.
- [ ] Destination CTA benar.
- [ ] Tracking ID unik dan sesuai format.
- [ ] SEO Title dan Meta Description sudah diperiksa.
- [ ] Featured dan Noindex sudah sesuai tujuan artikel.
- [ ] Preview/staging QA sudah dilakukan.
- [ ] Tim teknis telah mengonfirmasi BRB1H sebelum Reader Blocks dipublish ke production.
