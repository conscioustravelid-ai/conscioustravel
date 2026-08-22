# SOP Editor Blog ConsciousTravel

Panduan ini ditujukan untuk tim marketing dan editorial. Jangan simpan password, token, atau informasi internal di dalam artikel.

## A. Mengakses Sanity

1. Buka [ConsciousTravel Content Studio](https://conscioustravel-content.sanity.studio/).
2. Login menggunakan akun tim yang telah diberi akses.
3. Pilih menu **Blog Posts** untuk melihat draft dan artikel published.

Dokumen yang masih draft tidak tampil pada website publik.

## B. Membuat Artikel Baru

1. Klik tombol untuk membuat Blog Post baru.
2. Isi **Title** dengan judul yang jelas dan spesifik.
3. Buat **Slug** dari judul. Gunakan huruf kecil dan tanda hubung, misalnya `panduan-study-tour-bali`. Jangan mengubah slug artikel published tanpa koordinasi karena URL lama dapat berhenti berfungsi.
4. Isi **Excerpt** sebagai ringkasan singkat untuk kartu artikel dan fallback SEO.
5. Unggah **Cover Image** berkualitas baik.
6. Isi **Cover Image Alt Text** dengan deskripsi gambar yang membantu pembaca dan aksesibilitas. Jangan menulis “gambar” atau nama file saja.
7. Pilih **Author** dan **Category** yang sesuai.
8. Tambahkan **Tags** seperlunya. Hindari tag yang berulang atau tidak relevan.
9. Periksa **Publication Date**. Field ini read-only dan akan diisi otomatis ketika artikel diterbitkan.
10. Tulis konten pada **Article Body**.

Sebelum review, pastikan semua field wajib sudah terisi dan gambar memiliki alt text.

## C. Alat pada Article Body

- **Paragraph:** teks isi biasa.
- **H2:** judul bagian utama artikel.
- **H3:** subbagian di bawah H2.
- **H4:** rincian tambahan di bawah H3.
- **Bold:** penekanan kuat pada kata penting.
- **Italic:** penekanan ringan atau istilah tertentu.
- **Bullet List:** daftar tanpa urutan.
- **Numbered List:** langkah atau daftar berurutan.
- **Blockquote:** kutipan yang relevan.
- **Internal Link:** tautan ke artikel Blog ConsciousTravel lain.
- **External Link:** tautan ke situs lain. Pastikan sumber tepercaya dan URL benar.
- **Image:** gambar di dalam artikel.
- **Alt Text:** deskripsi wajib untuk setiap gambar.
- **Caption:** keterangan opsional yang tampil di bawah gambar.

Gunakan heading secara berurutan. Jangan memakai H3 sebelum H2 hanya untuk mendapatkan ukuran tulisan tertentu.

## D. SEO

- **SEO Title:** judul untuk mesin pencari dan social preview. Jika kosong, sistem menggunakan Article Title.
- **Meta Description:** ringkasan untuk hasil pencarian. Jika kosong, sistem menggunakan Excerpt.
- **Open Graph Image:** gambar untuk preview saat tautan dibagikan. Jika kosong, sistem menggunakan Cover Image.

Tuliskan SEO Title dan Meta Description secara natural. Hindari keyword berulang dan klaim yang belum disetujui.

## E. Featured

Mengaktifkan **Featured** membuat artikel dapat dipilih sebagai Featured Article utama di `/blog/`. Jangan menandai semua artikel sebagai Featured. Pilih hanya artikel prioritas editorial saat ini.

Jika tidak ada artikel yang ditandai, sistem menggunakan artikel terbaru yang memenuhi syarat sebagai fallback.

## F. Noindex

Jika **Noindex ON**, artikel:

- tidak muncul pada listing Blog publik;
- tidak masuk sitemap Blog;
- tidak seharusnya diindeks mesin pencari;
- masih dapat memiliki direct route selama dokumennya published.

Artikel publik normal umumnya menggunakan **Noindex OFF**. Gunakan Noindex hanya untuk pengujian atau kebutuhan editorial yang jelas.

## G. Related Articles

Pilih hanya artikel yang benar-benar membantu pembaca melanjutkan topik. Sistem saat ini menampilkan maksimum tiga rekomendasi. Hindari cross-link ke artikel yang tidak relevan. Jika pilihan eksplisit belum mencapai tiga, sistem dapat melengkapi rekomendasi dari kategori yang sama.

## H. Publish Now

```text
Draft → Internal Review → Publish Now
```

Untuk artikel yang akan online segera:

1. Selesaikan Draft.
2. Review konten dan SEO.
3. Konfirmasi status Featured dan Noindex.
4. Klik **Publish Now**.
5. Publication Date ditangani otomatis.
6. Publishing memicu rebuild website.
7. Tunggu deployment selesai.
8. Verifikasi artikel online.

**Publish Now** mengisi Publication Date dengan waktu saat ini jika field masih kosong atau berisi tanggal masa depan. Jika artikel pernah diterbitkan, tanggal publikasi pertamanya dipertahankan. Menyimpan draft tidak memicu rebuild website; Publish Now memicu rebuild staging secara otomatis melalui webhook.

**Jangan gunakan Publication Date sebagai alat penjadwalan manual.** Scheduled publication belum menjadi bagian dari workflow launch saat ini. Artikel akan diterbitkan segera dan tanggal masa depan akan dinormalisasi ke waktu publish.

## I. Setelah Publish

Deployment membutuhkan waktu untuk diproses; durasinya dapat berbeda setiap saat. Setelah deployment Ready:

1. Buka listing Blog staging dan pastikan artikel muncul jika Noindex OFF.
2. Buka URL artikel dan pastikan slug benar.
3. Periksa Cover Image dan gambar di dalam artikel.
4. Periksa heading, list, link, quote, serta jarak antarbagian.
5. Periksa SEO Title, Meta Description, dan social image bila diperlukan.

Staging memang dilindungi dari indexing dan digunakan untuk review sebelum production.

## J. Mengedit Artikel yang Sudah Ada

1. Buka artikel published.
2. Lakukan perubahan; Sanity membuat draft baru.
3. Minta internal review.
4. Klik **Publish Now** lagi.
5. Tunggu deployment otomatis dan periksa hasil terbaru di staging.

Draft perubahan tidak menggantikan versi published sampai tombol Publish Now ditekan. Republish tidak mengubah Publication Date awal.

## K. Unpublish

Unpublish menghapus versi published dari Content Lake. Webhook seharusnya memicu rebuild otomatis, kemudian generator membersihkan route artikel obsolete yang sebelumnya dimilikinya.

Setelah deployment Ready, pastikan artikel tidak lagi muncul pada listing atau sitemap dan URL lamanya tidak lagi dapat ditemukan. Jangan unpublish artikel tanpa persetujuan karena tautan eksternal menuju artikel tersebut dapat rusak.

## L. Troubleshooting

### Artikel tidak muncul di listing

- Pastikan artikel sudah Published, bukan hanya draft.
- Pastikan Noindex OFF.
- Pastikan Title, Slug, Excerpt, Cover Image, Alt Text, Author, Category, dan Body terisi. Publication Date diisi otomatis saat Publish Now.
- Tunggu deployment mencapai Ready.

### Artikel masih menampilkan konten lama

- Pastikan perubahan terbaru sudah di-Publish.
- Periksa Attempts Log webhook Sanity.
- Periksa deployment terbaru di Vercel dan pastikan statusnya Ready.
- Lakukan hard refresh pada browser.

### Gambar tidak tampil

- Pastikan upload selesai.
- Pastikan aset gambar masih terhubung pada field yang benar.
- Isi Alt Text.
- Coba unggah ulang hanya jika aset benar-benar rusak.

### Artikel tidak sengaja Noindex

- Matikan Noindex.
- Minta review.
- Publish ulang dan tunggu deployment Ready.

### Deployment gagal

- Jangan membuat webhook atau Deploy Hook baru.
- Periksa Attempts Log Sanity dan build logs Vercel.
- Laporkan pesan error kepada tim teknis tanpa menyalin URL Deploy Hook.

### Artikel sudah di-unpublish

- Pastikan unpublish memang disengaja.
- Jika perlu dikembalikan, lakukan sesuai persetujuan editorial dan Publish ulang.

### Slug salah

- Perbaiki sebelum artikel pertama kali Published bila memungkinkan.
- Jika artikel sudah Published, koordinasikan dengan tim teknis sebelum mengganti slug agar dampak URL lama dapat ditangani.

## Pemulihan Teknis untuk Tim yang Berwenang

Jika artikel published tetap tidak diperbarui:

1. Konfirmasi status Published dan Noindex.
2. Buka Sanity webhook Attempts Log dan pastikan respons 2xx.
3. Buka Vercel Deployments dan pastikan deployment tercipta serta mencapai Ready.
4. Periksa build logs bila deployment gagal.
5. Jalankan `npm run verify:sanity` dari root repository.
6. Jalankan `npm run build`.
7. Jalankan `npm run validate:blog`.
8. Bila perlu, lakukan safe manual staging redeployment melalui mekanisme yang sudah disetujui.
9. Eskalasikan kegagalan webhook yang terus berulang.

Jangan meminta atau membagikan private Vercel Deploy Hook URL. MVP ini tidak memerlukan custom webhook server.
