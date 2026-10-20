# Phase 1A — Kontrak arsitektur bilingual dan English SEO

Status: **FINAL — KONTRAK ARSITEKTUR DISETUJUI DENGAN TIGA KETENTUAN OWNER**. Tanggal finalisasi: 21 Oktober 2026 (Asia/Makassar); pemeriksaan baseline dimulai 20 Oktober 2026.

Dokumen ini membedakan **fakta terkonfirmasi** dari **kontrak implementasi Phase 1B yang belum dijalankan**. Finalisasi Phase 1A hanya mengubah dan mengizinkan commit dokumen ini pada `feature/bilingual-website-seo-v1`; tidak ada implementasi route, perubahan runtime, perubahan Sanity, build output, push, publikasi, atau deployment. Keputusan arsitektur tetap dipertahankan dengan tambahan pemisahan readiness, baseline regresi ID yang ketat, dan batas kompleksitas adapter. Persetujuan kontrak bukan persetujuan copy EN atau rilis production; **Phase 1B tidak boleh mengubah production**.

## 1. Baseline dan preflight terkonfirmasi

| Item | Baseline setelah fetch origin |
| --- | --- |
| Repository | `C:/Users/ASUS/Documents/Conscious LP/conscioustravel-website` |
| Phase 0 / origin/staging | `8acaca12558680abf4763cbec9cbd355dada2bbf` |
| Production / origin/main | `b5b7f8fa78360223bb3b7a0fe7b52425ff787da1` |
| Branch kerja lokal Phase 1 | `feature/bilingual-website-seo-v1`, dibuat dari origin/staging; tanpa upstream agar tidak menargetkan staging secara tidak sengaja |
| Worktree sebelum penulisan dokumen | Bersih; tidak ada perubahan baseline yang tidak dijelaskan |
| Blog dalam manifest baseline | 18 generated/indexable artikel Indonesia + 1 index Blog |
| Sitemap baseline | 32 URL: 13 non-Blog + 1 index Blog + 18 artikel |
| Arsitektur | HTML/CSS/JS statis, build Node.js, tanpa framework website |

Baseline mempertahankan hotfix sitemap dari main dan dua optimasi Blog dari staging. Detail Phase 0 tersedia pada `docs/phase-0-staging-baseline.md`. Angka 18 adalah snapshot commit tersebut, bukan batas tetap untuk publikasi berikutnya. Draft Sanity tidak dihitung; jumlah draft tidak ditetapkan oleh dokumen ini.

### Dua tingkat readiness yang wajib dibedakan

| Tingkat | Syarat dan batas |
| --- | --- |
| **Kesiapan teknis staging** | Seluruh 13 halaman EN boleh dibangun dan diuji pada staging yang terlindungi `X-Robots-Tag: noindex, nofollow`, termasuk ketika copy dan metadata EN masih menunggu persetujuan editorial. HTML tetap harus berupa konten EN nyata, metadata lengkap secara teknis, dan route yang valid. Lulus teknis tidak berarti copy telah disetujui atau halaman boleh dirilis ke production. |
| **Kesiapan editorial/SEO production** | Memerlukan persetujuan eksplisit owner atau reviewer yang ditunjuk owner atas copy lengkap dan metadata EN setiap halaman pada versi yang akan dirilis, diikuti otorisasi rilis production yang terpisah. Catat halaman, versi/fingerprint copy dan metadata, pemberi persetujuan, serta waktu persetujuan. Perubahan materi yang telah disetujui memerlukan review ulang. |

Status ketersediaan teknis dalam artifact staging dan status persetujuan production harus dibedakan dalam registry/check rilis; satu flag enabled tidak boleh menyamakan keduanya. Kontrak tetap menargetkan 13 pasangan: rilis production harus tertahan jika salah satu dari 13 halaman EN belum mendapat persetujuan copy dan metadata yang sesuai, bukan diam-diam menerbitkan draft atau mengubahnya menjadi rilis parsial. Phase 1B melaporkan readiness teknis dan status editorial secara terpisah, tanpa merge, push, deploy, atau perubahan konfigurasi production.

### Bukti source dan fungsi yang ditinjau

Nomor baris mengacu ke SHA Phase 0 di atas.

| Source | Fakta atau dampak pada kontrak |
| --- | --- |
| `js/main.js:1`, `content():80`, `editorialContent():84`, `productCopy():130` | Bahasa berasal dari local storage; konten ID/EN dan katalog dipakai renderer yang sama. |
| `js/main.js`, `renderHeader():193`, `renderFooter():233` | Navigasi dan toggle dihasilkan sebagai HTML; tautan internal masih tanpa prefix EN. |
| `js/main.js`, `inquiryUrl():108`, `trackingContext():1164`, `prepareInquiryForm():1175` | Path contact, service, sourcePage, language, UTM, endpoint, dan payload harus dilindungi. |
| `js/main.js`, renderer halaman `renderHome():524` sampai `renderContact():841`, `renderPage():855` | Renderer halaman menghasilkan string HTML; wrapper menulisnya ke DOM. |
| `js/main.js`, `bindLanguageToggle():1042`, `initializeUi():1265`, `initializeSite():1281` | Toggle sekarang merender ulang URL yang sama; startup mengambil katalog dan mengganti isi halaman. |
| `js/main.js`, `bindHeaderVisualState():891`, `bindNavigation():905`, `bindClientCarousel():943`, `bindVariantTabs():1096`, `bindIndonesiaAccordions():1123` | Interaksi dapat diikat ke HTML statis; akses katalog runtime ditemukan pada jalur rendering dan startup, bukan binder tersebut. |
| `data/content.js:47,482,1345` | Dictionary `CT_CONTENT`, `CT_EDITORIAL_CONTENT`, dan `CT_PRODUCT_COPY`; key ID/EN masing-masing 405/405, 540/540, 62/62. Paritas struktur bukan bukti mutu terjemahan. |
| `data/product-catalog.json`, `renderPrice():135`, `renderDestinationStory():452`, `renderStudy():737` | Harga/minimum/ID produk tetap satu sumber; sejumlah label/nama juga dibaca langsung dari katalog. |
| 13 `index.html` pada matriks di bawah | Wrapper head, stylesheet, favicon, GTM, data-page, dan fallback H1; primary content lengkap sekarang baru dirender di browser. |
| `package.json:4`, `vercel.json:3` | Build existing: verify Sanity → build Blog → validate Blog → Phase 2 → editorial; output statis `.` dan trailingSlash true. |
| `scripts/build-blog.mjs`, `blogHeader():59`, `blogFooter():64`, `shell():68`, `updateSitemap():111`, `build():123` | Blog memakai chrome ID dan aset khusus; sitemap hanya mengganti kontribusi `/blog/`. |
| `scripts/lib/blog-cleanup.mjs`, `cleanupGeneratedRoutes():5` | Penghapusan dibatasi pada slug lama yang dimiliki manifest Blog. |
| `scripts/lib/sanity-config.mjs`, `scripts/lib/blog-queries.mjs`, `sanity-studio/schemaTypes/post.ts` | Published-only, project/dataset tetap; belum ada bahasa atau relasi terjemahan post. |
| `scripts/validate-phase2.js:160` | Hotfix memakai enam pencocokan `<loc>` legacy lengkap, bukan substring company-outing. |
| `scripts/validate-editorial-refinement.js:19,50` | Paritas dictionary dan pathway ID harus tetap valid; raw dictionary href dipertahankan sebagai path dasar. |
| `css/style.css:229`, `css/editorial.css:196` | `.language-toggle` berbasis class, sehingga anchor bisa memakai tampilan existing tanpa desain ulang. |
| `scripts/serve-static.mjs:11` | Server lokal sudah dapat melayani direktori berisi index.html; tidak meniru redirect/header Vercel. |

### Uji kelayakan tanpa perubahan file

Eksperimen read-only menjalankan source `data/content.js` dan `js/main.js` dalam Node `vm` dengan katalog lokal dan adapter DOM kecil. Callback DOMContentLoaded tidak dijalankan. Hanya `renderHeader()`, `renderPage()`, dan `renderFooter()` dipanggil; tidak ada request network, event tracking, atau submission form.

Hasil: **26 render berhasil** (13 route × ID/EN), primary content EN tersedia, dan daftar ID anchor pada pasangan ID/EN identik. Semua render masih menghasilkan tautan non-lokal karena helper locale belum ada. Eksperimen ini membuktikan kelayakan reuse renderer, bukan implementasi SSG, validasi SEO EN, pengujian browser Phase 1B, atau jaminan terjemahan lengkap.

## 2. Kontrak URL yang diusulkan

Semua route ID di bawah dipertahankan. Tidak ada `/id/`, URL regional EN, rewrite universal ke homepage, geo-IP redirect, atau redirect berdasarkan bahasa browser.

| Page key / data-page | URL Indonesia | URL English | Source wrapper ID; output EN |
| --- | --- | --- | --- |
| home | `/` | `/en/` | `index.html`; `en/index.html` |
| corporateHub | `/corporate-packages/` | `/en/corporate-packages/` | `corporate-packages/index.html`; `en/corporate-packages/index.html` |
| indonesia | `/corporate-packages/indonesia-region/` | `/en/corporate-packages/indonesia-region/` | `corporate-packages/indonesia-region/index.html`; `en/corporate-packages/indonesia-region/index.html` |
| international | `/corporate-packages/international/` | `/en/corporate-packages/international/` | `corporate-packages/international/index.html`; `en/corporate-packages/international/index.html` |
| csr | `/corporate-packages/csr-program/` | `/en/corporate-packages/csr-program/` | `corporate-packages/csr-program/index.html`; `en/corporate-packages/csr-program/index.html` |
| event | `/corporate-packages/event-planning-organizer/` | `/en/corporate-packages/event-planning-organizer/` | `corporate-packages/event-planning-organizer/index.html`; `en/corporate-packages/event-planning-organizer/index.html` |
| experiences | `/experiences/` | `/en/experiences/` | `experiences/index.html`; `en/experiences/index.html` |
| study | `/study-tour/` | `/en/study-tour/` | `study-tour/index.html`; `en/study-tour/index.html` |
| sailing | `/sailing-package/` | `/en/sailing-package/` | `sailing-package/index.html`; `en/sailing-package/index.html` |
| about | `/about/` | `/en/about/` | `about/index.html`; `en/about/index.html` |
| impact | `/impact/` | `/en/impact/` | `impact/index.html`; `en/impact/index.html` |
| faq | `/faq/` | `/en/faq/` | `faq/index.html`; `en/faq/index.html` |
| contact | `/contact/` | `/en/contact/` | `contact/index.html`; `en/contact/index.html` |

Tujuan Phase 1B adalah seluruh 13 pasangan. Seluruh varian EN boleh tersedia untuk QA teknis pada staging terlindungi setelah konten, metadata, dan output HTML-nya lengkap secara teknis serta disertakan dalam artifact yang sama; persetujuan editorial tidak menjadi prasyarat QA tersebut. Aktivasi pada production hanya boleh melalui persetujuan copy/metadata dan rilis terpisah sesuai dua tingkat readiness di bagian 1, di luar Phase 1B. Route registry merupakan allowlist eksplisit, bukan aturan menambahkan `/en` ke semua URL.

`/en/blog/`, `/en/blog/{slug}/`, dan `/en/{legacy-route}/` tidak dibuat. URL EN yang tidak terdaftar tetap 404; tidak dialihkan diam-diam ke homepage, versi ID, atau Blog. Prefix dikenali per segmen (`/en/`), bukan substring seperti `/english/`.

Static hosting saat ini layak: setiap URL EN dipetakan ke file nyata dalam direktori `en/`, memakai aset absolute-root yang sama. `vercel.json` tidak perlu diubah; trailing slash existing tetap berlaku. Vercel melakukan normalisasi URL tanpa slash, bukan pemilihan bahasa.

## 3. Kontrak state bahasa dan language switch

Urutan otoritas yang diusulkan:

1. URL `/en/…/` yang terdaftar menentukan `en`; URL ID existing menentukan `id`.
2. Preferensi tersimpan hanya boleh dipakai untuk UI non-routing, misalnya saran pilihan bahasa. Preferensi tidak memilih isi halaman, metadata, atau tujuan otomatis.
3. Halaman root existing selalu fallback ke `id`, termasuk ketika localStorage berisi `en`, storage tidak tersedia, atau Accept-Language browser adalah EN.

`html.lang` dan penanda `data-language` berasal dari hasil build dan harus cocok dengan route. Ketidakcocokan adalah error validasi, bukan alasan redirect runtime. Jangan menampilkan ID dahulu lalu menggantinya menjadi EN. Tidak ada deteksi negara/kewarganegaraan dari hreflang atau bahasa.

Language switch memakai anchor nyata dengan class `.language-toggle`, label target `EN`/`ID`, accessible name, `lang` dan `hreflang` yang sesuai. Klik melakukan navigasi dokumen biasa ke pasangan route; membuka tab baru, back/forward, dan penggunaan tanpa JS harus tetap bekerja. Listener tracking tidak membatalkan navigasi atau memanggil initializeUi untuk mengganti bahasa pada URL lama. Event `language_change` dipertahankan; `language` menyatakan bahasa target, `sourcePage` menyatakan pathname asal.

Dengan JS aktif, switch mempertahankan parameter query yang sudah ada (termasuk service, sourcePage, dan UTM) tanpa mengubah nilai atribusi di dalamnya. Query/hash tidak dimasukkan ke canonical, og:url, atau hreflang. Hash dipertahankan apabila target mempunyai ID yang sama. Jika hash tidak valid pada pasangan, buka pasangan tanpa hash; keputusan dibuat dari manifest anchor build, bukan menebak URL. Tanpa JS, anchor statis menjamin navigasi ke halaman pasangan yang benar, tetapi query/hash request saat ini tidak dapat disalin dinamis oleh static hosting; batas yang telah ditetapkan dalam kontrak ini tetap berlaku. Pada deep link, buka disclosure atau panel existing yang menyembunyikan target sebelum memperbaiki posisi scroll; jangan mengganti ID anchor atau melakukan redirect bahasa. Navigasi browser dan prefers-reduced-motion tetap dihormati.

Jika terjemahan suatu halaman belum tersedia, jangan membuat anchor EN palsu. Tampilkan keterangan non-interaktif “English translation unavailable”; tautan eksplisit “English home” boleh disediakan ke `/en/` hanya bila halaman itu tersedia. Jangan menyebut halaman lain sebagai terjemahan halaman saat ini. Tidak ada hreflang menuju terjemahan draft/tidak tersedia.

## 4. Strategi rendering yang direkomendasikan untuk Phase 1B

**Pilihan yang diusulkan: SSG kecil dengan Node built-ins dan adapter terhadap renderer existing; browser melakukan progressive enhancement.** Tidak memakai framework, headless browser saat build, layanan terjemahan, atau implementasi renderer kedua.

### 4.1 Registry dan helper bersama

- Tambahkan `data/site-pages.js` sebagai registry non-secret yang dapat dibaca browser dan build. Setiap entry berisi page key, data-page, path ID/EN, source wrapper, ketersediaan teknis locale, metadata ID/EN, dan versi schema registry. Status persetujuan copy/metadata production harus dicatat terpisah dari ketersediaan teknis staging dan diverifikasi oleh check rilis; belum disetujui editorial tidak menghalangi QA 13 halaman EN di staging terlindungi.
- Origin registry harus sama dengan `SITE_ORIGIN` existing di `scripts/lib/sanity-config.mjs`; validator menolak perbedaan tanpa mengubah konfigurasi Blog tersebut.
- Metadata ID awal disalin persis dari head existing; dictionary konten tetap menjadi sumber copy halaman. Registry tidak menjadi katalog harga kedua.
- Tambahkan `js/site-language.js` dengan helper murni yang diusulkan: `localeFromPath()`, `pageFromPath()`, `localizedUrl()`, dan `languageSwitchUrl()`. Browser dan adapter build memuat source helper yang sama. Nama fungsi ini adalah rencana, belum tersedia.
- Script registry dan helper dimuat dengan absolute-root URL sebelum `data/content.js` dan `js/main.js`. CSS, gambar, font, GTM, Apps Script, dan URL eksternal tidak diberi prefix `/en/`.
- Raw href dalam dictionary tetap menggunakan path dasar ID, agar validator editorial dan konten existing tidak perlu diubah. Lokalisasi dilakukan ketika renderer membentuk href, melalui allowlist; jangan melakukan replace global pada HTML, copy, JSON, query, atau semua string berawalan `/`.

### 4.2 Adapter rendering build-time

`scripts/lib/site-render-adapter.mjs` yang diusulkan menjalankan source registry/helper/content/runtime lokal dalam Node `vm`, satu context bersih per pasangan page/locale. Input eksplisit mencakup language, pathname, page key, katalog, dan waktu build yang konsisten.

Adapter hanya menyediakan tiga sink HTML (`site-header`, `page-root`, `site-footer`), documentElement, body.dataset, URLSearchParams, serta registrasi DOMContentLoaded yang tidak dieksekusi. Panggil tiga entry renderer existing secara langsung; jangan memanggil initializeUi/initializeSite, fetch, binder UI, tracking, atau form submit. Tidak ada eksekusi string yang dibentuk dari konten CMS/URL pengguna. VM dipakai untuk kompatibilitas source tepercaya, bukan diklaim sebagai security sandbox.

**Batas kompleksitas yang wajib:** adapter harus kecil, generik, dan deterministik. Permukaan kompatibilitas dibatasi pada sink dan input eksplisit di atas; page key hanya memilih renderer melalui registry. Jangan menambahkan pohon DOM tiruan, selector/layout engine, simulasi siklus hidup browser, event loop/binder palsu, dependency DOM browser, atau cabang/hack khusus halaman untuk memperbaiki hasil HTML. Source, katalog, locale, pathname, dan konteks waktu yang sama harus menghasilkan HTML yang sama, tanpa network, randomness, state lintas context, atau ketergantungan pada jam aktual di dalam adapter.

Jika implementasi ternyata memerlukan mocking DOM yang luas, API di luar permukaan kecil tersebut, atau hack khusus halaman, **hentikan pekerjaan adapter dan laporkan sebelum memperluasnya**. Jangan menyembunyikan kegagalan lewat mock permisif, fallback HTML, atau patch per halaman. Laporan wajib menyebut renderer/fungsi yang terhalang, API yang diminta, reproduksi minimum, dan alternatif refactor terfokus: ekstrak hanya pembentukan string HTML yang terhalang menjadi fungsi murni dengan input eksplisit, lalu gunakan fungsi yang sama dari wrapper browser dan build. Sajikan dampak file dan tes regresi; tunggu persetujuan owner sebelum mengubah pendekatan atau menjalankan refactor. Bukan izin untuk migrasi framework atau refactor seluruh aplikasi.

### 4.3 Wrapper dan generated output

`scripts/build-site.mjs` yang diusulkan menggunakan 13 wrapper HTML existing. Tambahkan marker unik untuk head metadata dan tiga region rendered. Penggantian harus terbatas pada satu pasangan marker yang tervalidasi; regex penutup `</div>` pertama tidak aman untuk body bersarang. Marker dipertahankan dalam output agar build berikutnya idempotent.

Render full primary content, header, dan footer untuk **ID maupun EN**; ini menjaga satu jalur rendering dan menyediakan anchor sejak source HTML. Pertahankan stylesheet per halaman, favicon, preload yang relevan, GTM script/iframe tepat sekali, data-page, DOM ID, class, ARIA, dan struktur form. ID mempertahankan copy dictionary dan data katalog yang sama, walau source HTML menjadi lebih lengkap daripada fallback pendek sebelumnya. Penambahan source content ID merupakan bagian eksplisit usulan, bukan fakta baseline.

Output EN ditulis hanya ke 13 file dalam matriks. Tambahkan `.site-generated-manifest.json` terpisah yang merekam page/locale/path, file EN yang dimiliki generator, anchor IDs, dan fingerprint input. Wrapper ID adalah source terlindungi yang region tertentu diisi generator; wrapper tidak boleh dihapus oleh cleanup. Cleanup EN hanya boleh menyentuh file yang dimiliki manifest situs di bawah `en/`, sesudah verifikasi resolved path; tidak boleh menyentuh blog atau manifest Blog. Jangan menghapus direktori `en/` secara rekursif tanpa memeriksa ownership.

Kegagalan data/metadata EN secara teknis wajib gagal build, bukan menghasilkan EN yang berisi fallback copy ID. Konten EN nyata dan metadata yang masih menunggu persetujuan editorial boleh dirender untuk QA staging terlindungi; status tersebut harus tetap dibedakan dari persetujuan production. Tidak ada placeholder EN yang dinyatakan siap diindeks. Check rilis production harus menolak materi yang belum disetujui, bukan mengandalkan header staging untuk melindungi deployment production. Hasil HTML dan manifest baru disimpan di Git mengikuti kebijakan output existing setelah review.

### 4.4 Runtime tanpa flicker dan tanpa penggantian DOM

Tambahkan gate khusus non-Blog `data-static-site="true"` dan `data-language="id|en"`; jangan memakai atau mengubah `data-static-blog` sebagai gate situs.

Pada output statis, initializeSite menentukan locale dari URL lalu mengikat interaksi ke DOM yang sudah ada. initializeUi harus memisahkan langkah render dan bind: jangan merender ulang header/main/footer pada startup atau setelah fetch katalog. Binder yang ditinjau tidak membutuhkan katalog untuk rendering; jalur statis tidak perlu menunggu request katalog untuk aktif. Kegagalan resource opsional tidak boleh mengganti HTML statis dengan pesan error generik. Jalur fallback non-statis, bila dipertahankan selama transisi, tetap tunduk pada bahasa URL.

Tetap ikat menu mobile/dropdown, header scroll, carousel, reduced motion, tabs, accordion, tracking WhatsApp, dan form sekali saja. Gate/idempotency binder mencegah listener ganda. Language switch bukan lagi pemicu render ulang. Perubahan ini menghindari kehilangan input/autofill, scroll, atau anchor akibat penggantian DOM setelah halaman tampil.

Konten utama dan tautan tetap dapat dibaca tanpa JS. Validasi/pengiriman inquiry tetap membutuhkan JS seperti perilaku existing; Phase 1B tidak membuat backend form baru.

### 4.5 Batas copy dan data produk

Pertahankan amount, currency IDR, minimum peserta, product ID, destination order, variant ID, dan status starting-from/excludesFlight. `formatCurrency()` sekarang memakai id-ID untuk IDR; Phase 1B mempertahankan harga dan tidak mengonversi mata uang. Unit/label EN memakai dictionary existing. Nama produk/brand, durasi 3D2N, nama tempat, dan legal entity boleh tetap sama.

Review manual wajib untuk string katalog, hardcoded label, alt, ARIA, dan fallback `productCopy()`. Bila copy EN belum tersedia, tambahkan representasi teks di dictionary EN tanpa menyalin data harga. Paritas key dan H1 berbahasa Inggris saja tidak cukup untuk menyatakan halaman sudah diterjemahkan.

### 4.6 Baseline regresi HTML dan perilaku Indonesia yang ketat

Sebelum mengubah renderer atau wrapper pada Phase 1B, rekam pembanding dari **situs ID yang saat ini bekerja**, bukan dari hasil generator baru. Pin SHA Phase 0 `8acaca12558680abf4763cbec9cbd355dada2bbf`, URL/environment pembanding, waktu pengambilan, versi browser, viewport, katalog dan input konten. Untuk pembanding ID, pilih bahasa ID pada runtime existing; perbaikan agar URL ID mengalahkan preferensi EN tetap merupakan perubahan bahasa yang telah disetujui. Ambil respons HTML awal dan DOM setelah renderer existing selesai untuk seluruh 13 route ID; rekam screenshot serta perilaku browser pada viewport acceptance. Membaca production sebagai pembanding harus read-only dan tidak mengubah konten, settings, tracking configuration, atau mengirim inquiry nyata.

| Area baseline ID | Perbandingan wajib dan kondisi lulus |
| --- | --- |
| Konten dan struktur semantik | Bandingkan generated ID HTML dengan DOM ID situs pembanding yang sudah dirender: H1/headings, seluruh section dan urutannya, copy, daftar/card produk, alt/caption, CTA, serta target anchor tetap sama. Bandingkan juga hasil akhir browser setelah interaksi aktif. Source fallback pendek boleh menjadi full HTML dari konten UI existing; itu bukan izin menulis ulang konten ID. |
| Metadata yang telah disetujui | Simpan dan cocokkan nilai title, description, self-canonical, robots/indexability, OG existing, identity Organization, dan structured data existing. Penambahan hreflang, OG locale, serta WebPage inLanguage hanya sesuai keputusan SEO kontrak; jangan mengganti atau menghapus nilai approved existing tanpa review terpisah. |
| Nilai produk | Katalog tetap identik: amount/currency, minimum peserta, durasi, product/destination/variant ID, urutan, starting-from dan excludesFlight. Teks/harga yang terlihat dan hasil pemilihan paket harus cocok dengan pembanding; normalisasi tidak boleh menyembunyikan perubahan nilai. |
| Visual dan interaksi | Bandingkan screenshot dan perilaku pada viewport yang sama: layout, typography, gambar, menu/dropdown, header scroll, carousel, reduced motion, tabs, accordion, keyboard/focus, hash dan deep link, serta tidak ada overflow. Penggantian tag toggle menjadi anchor dan startup statis adalah perubahan terencana; tampilannya dan interaksi non-bahasa tetap dipertahankan. |
| Form dan contact | Pertahankan nama/ID input, pilihan service, prefill query, validasi, consent, endpoint, payload legacy/canonical, sourcePage/UTM, alur success/error dan kontak. Gunakan request interception/stub untuk membandingkan payload; jangan submit inquiry nyata. Tidak boleh ada input/autofill yang hilang karena startup merender ulang DOM. |
| Tracking | Cocokkan GTM ID, event non-bahasa, parameter/payload, attribution, jumlah pemanggilan, dan tidak adanya listener/event ganda. Perubahan semantik language_change mengikuti kontrak switch; event lain tidak berubah. |
| Route dan SEO ID | Seluruh 13 path ID, URL Blog yang dilindungi, link internal, canonical host/slash, legacy redirect dan aturan sitemap tetap valid. Tidak ada /id/, pengalihan bahasa otomatis, route hilang, atau perubahan indexing yang tidak disetujui. |

Bandingkan input/kondisi yang sama: waktu deterministik, data katalog/konten sama, viewport dan font yang sudah siap. Normalisasi hanya boleh untuk perbedaan serialisasi yang tidak bermakna, misalnya CRLF/LF, urutan atribut, atau whitespace antartag yang tidak mengubah tampilan. Jangan menghapus teks, heading, href, metadata, nilai produk, ARIA, class/CSS, atau event dari pembanding agar tes lulus.

Allowlist perbedaan source ID dibatasi pada full rendered regions menggantikan fallback pendek, marker build, script order/helper dan static attributes yang diperlukan, language switch berbasis URL, serta tambahan SEO yang telah ditetapkan kontrak. Perbedaan visual/semantik di luar perubahan terencana harus dilaporkan. Regresi ID sekecil apa pun yang mengubah konten approved, metadata, nilai produk, visual behavior, form, tracking, atau route adalah **FAIL dan memblokir kesiapan teknis staging**, bukan ditunda sampai review copy EN. Jangan memperbarui baseline atau expected output untuk menerima perbedaan tersebut tanpa penjelasan dan persetujuan owner.

## 5. Kontrak SEO dan metadata

| Elemen | Usulan kontrak |
| --- | --- |
| Host canonical | Selalu `https://conscioustravel.id`, non-www, termasuk ketika diperiksa pada staging. |
| Self-canonical | Tepat satu URL self per locale; EN menunjuk ke `/en/…/`, ID ke path lama. Tidak cross-canonical EN ke ID. Tidak mengandung query/hash. |
| HTML source | `html lang="id"` atau `html lang="en"`, full primary content sesuai bahasa, satu H1. |
| Title/description | Nilai eksplisit per page/locale. Metadata ID approved dipertahankan persis; EN ditulis tersendiri, bukan fallback ID atau sekadar prefix “English”. Nilai EN berbeda dari metadata ID pasangannya. Kelengkapan teknis dapat diuji di staging; persetujuan eksplisit copy dan metadata EN wajib sebelum rilis production. |
| Hreflang | Pasangan eligible memuat dua link absolut `id` dan `en`, termasuk self, dengan set identik pada kedua halaman. Hanya counterpart yang tersedia dalam artifact rilis yang sama. |
| Regional targeting | Tidak ada en-SG, en-AU, en-US, subfolder negara, atau inferensi kewarganegaraan. `en` menandai bahasa saja; domain .id tidak berubah. |
| x-default | Tidak ditambahkan pada V1; pasangan bahasa sudah eksplisit dan tidak ada halaman pemilih bahasa netral. Ini pilihan desain, bukan larangan protokol. |
| OG | `og:type=website`; title/description lokal; og:url sama dengan self-canonical; image/alt existing yang relevan tetap valid. |
| OG locale | Konvensi `id_ID` dan `en_US`, dengan `og:locale:alternate` untuk counterpart tersedia. `en_US` di sini hanya konvensi format OG; bukan target regional hreflang atau janji konten khusus AS. Persetujuan konvensi arsitektur ini bukan persetujuan copy EN atau rilis production. |
| Structured data | Pertahankan identity Organization, legalName, logo, contact, dan `@id` existing. Tambahkan WebPage locale-specific dengan url/self @id dan inLanguage id/en; jangan menaruh inLanguage pada Organization sebagai pengganti WebPage. Jangan menciptakan offers/FAQ/Product schema yang tidak didukung konten. |
| Robots intended production | Halaman yang mendapat persetujuan copy/metadata dan rilis production terpisah memakai `index, follow`; tidak mengubah robots.txt Allow existing. Phase 1B tidak mengubah production. |
| Staging | Seluruh 13 EN boleh diuji dengan head intended production pada artifact staging, tetapi wajib tetap terlindungi header host existing `X-Robots-Tag: noindex, nofollow`. Head tersebut, hasil tes teknis, dan hreflang preview tidak membuktikan persetujuan editorial/SEO production. |

Contoh kontrak untuk pasangan experiences, dengan origin production pada kedua environment:

```html
<!-- Pada versi EN; versi ID mempunyai canonical ID sendiri dan dua alternate yang sama. -->
<html lang="en">
<link rel="canonical" href="https://conscioustravel.id/en/experiences/">
<link rel="alternate" hreflang="id" href="https://conscioustravel.id/experiences/">
<link rel="alternate" hreflang="en" href="https://conscioustravel.id/en/experiences/">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="id_ID">
```

Contoh di atas adalah fragmen kontrak, bukan HTML template lengkap atau output yang sudah dibuat. Nilai title/description EN per halaman menjadi materi review copy sebelum aktivasi.

Rujukan: Google menyarankan URL terpisah dan pilihan bahasa melalui tautan, serta memperingatkan bahwa mengganti boilerplate saja tidak cukup untuk halaman bahasa lain. Lihat [Managing multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites). Syarat alternate mencakup self-reference, URL absolut, dan return link; HTML dan sitemap merupakan metode alternatif, sehingga V1 memilih HTML hreflang. Lihat [Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions). Format locale OG menggunakan language_TERRITORY: [Open Graph protocol](https://ogp.me/).

## 6. Strategi sitemap dan urutan build

Gunakan satu `sitemap.xml` existing. HTML hreflang dipilih agar tidak perlu menambah xhtml alternates ke XML. Setiap varian eligible tetap mempunyai `<url><loc>` sendiri.

- Builder situs memiliki tepat 13 URL ID dan maksimal 13 URL EN dari registry/manifest, dengan pencocokan `<loc>` lengkap. Ia mempertahankan semua entry Blog dan entry non-owned lain; entry yang tidak valid tetap terdeteksi validator, bukan disembunyikan melalui penghapusan luas.
- Generator Blog existing tetap memiliki `/blog/` dan `/blog/{slug}/`; `updateSitemap()` existing tidak diubah untuk bilingual. Jangan menambahkan `/en/blog/` atau sitemap khusus EN Blog.
- Dengan seluruh 13 EN aktif dan snapshot 18 artikel tetap sama, total menjadi **45 URL**: 26 non-Blog + 19 Blog. Dalam operasi normal rumusnya `26 + 1 + jumlah artikel Blog indexable`, bukan assert tetap 45 selamanya.
- Exclude URL redirect legacy, query/hash, route EN belum tersedia, dan post noindex/draft/future sesuai aturan existing. Pastikan setiap URL unik dan merujuk file nyata.
- Lastmod harus berdasarkan perubahan konten/metadata yang relevan atau tanggal publikasi awal EN yang dicatat; jangan mengubah semua tanggal menjadi waktu setiap CMS rebuild. Pertahankan baris/tanggal non-owned dan jangan membuat tanggal palsu.
- Build situs harus idempotent: dua build dengan input sama menghasilkan konten dan sitemap sama, termasuk tanggal/footer year yang memakai konteks build konsisten.

Sitemap staging boleh menguji seluruh 13 EN dengan URL intended production, meskipun persetujuan editorial masih tertunda; endpoint sitemap staging tetap terlindungi noindex,nofollow dan tidak disubmit sebagai sitemap production. Lulus pemeriksaan ini hanya menyatakan kesiapan teknis. Artifact tersebut tidak boleh dipromosikan atau disajikan sebagai sitemap production sampai seluruh approval copy/metadata dan otorisasi rilis terpenuhi. Phase 1B tetap tidak mengubah sitemap atau deployment yang sedang dilayani production.

Urutan pipeline yang diusulkan: verify Sanity → **build situs** → build Blog existing → **validate situs** → validate Blog existing → validate Phase 2 existing → validate editorial existing. Penambahan script `build:site` dan `validate:site` adalah usulan Phase 1B; keduanya belum tersedia di package.json Phase 1A. Jangan menghapus atau melemahkan check existing.

Build produksi melalui hook post tetap dapat menjalankan keseluruhan root pipeline setelah kode kelak disetujui untuk production. Tahap situs lokal harus deterministik dan tidak menambah request Sanity, token, hook, atau mutasi CMS. Kegagalan tahap situs membuat deployment gagal dan tidak mempromosikan artifact parsial.

## 7. Navigasi, anchor, inquiry, dan tracking

| Area | Perilaku yang diusulkan |
| --- | --- |
| Logo/home, navbar, dropdown desktop/mobile | EN menuju counterpart `/en/` dari registry; ID menuju path lama. Active state memakai page key/path dasar yang sudah dinormalisasi, bukan startsWith path EN terhadap literal ID. |
| Service cards, pathway, breadcrumb, supporting pages | Lokalisasi hanya pathname yang dikenali. Query/hash tetap terjaga dan di-escape satu kali saat dirender ke HTML. |
| Contact/CTA | EN ke `/en/contact/`, termasuk `?service=…&sourcePage=…#inquiry`; ID tetap `/contact/`. SourcePage mempertahankan path asal termasuk `/en/`, bukan diubah menjadi path dasar. |
| Hash lokal | `#inquiry`, `#corporate-pathways`, `#destination-guide`, `#bali`, `#jogja`, `#international-guide`, `#study-guide`, dan ID existing lainnya tetap sama. |
| Hash antarhalaman | `/experiences/#local` menjadi `/en/experiences/#local`; `/study-tour/#regional` menjadi `/en/study-tour/#regional`. Target diperiksa pada HTML tujuan. |
| Footer | Memakai helper yang sama, termasuk company/supporting pages dan inquiry; bukan implementasi routing kedua. |
| Asset dan skema eksternal | `/assets/`, `/css/`, `/js/`, `/data/`, mailto, tel, WhatsApp, Instagram, Google Review, dan endpoint eksternal tidak diberi prefix bahasa. |
| Blog pada navbar/footer EN | Link nyata ke `/blog/` dengan label **“Blog (Bahasa Indonesia)”** dan hreflang=id; tidak menunjuk `/en/blog/`. |

Klik Blog merupakan pilihan eksplisit membaca bahasa Indonesia; tidak ada redirect preference ketika masuk/keluar Blog. Chrome Blog existing tetap ID dan tetap menaut ke route ID. Phase 1 tidak mengubah Blog agar mengingat konteks EN atau menambahkan toggle terjemahan artikel.

GTM ID, event non-language, parameter service, product ID, nama input, endpoint Apps Script, payload legacy/canonical, consent text, serta UTM tetap dipertahankan. `language`/`lang` mengikuti URL saat submission. `sourcePage` tetap berasal dari query jika tersedia, selain itu pathname aktual. Label service yang dikirim tidak diterjemahkan dengan cara yang merusak pencocokan nilai select existing. Tes submission memakai stub/mock; tidak mengirim inquiry nyata untuk QA.

Language link dapat mempertahankan query atribusi lewat enhancement sebelum navigasi; href tanpa JS tetap merupakan URL pasangan valid. Untuk URL ber-query/hash yang dibuka langsung, helper harus dapat membentuk href pasangan dari current URL tanpa mengganti DOM utama. Hash tanpa JS tetap tersedia pada source HTML; tidak menjanjikan persistence isian form saat pengguna memilih pindah dokumen bahasa.

## 8. Proteksi Blog dan transisi fase berikutnya

Phase 1B bukan implementasi bilingual Blog. File dan perilaku berikut dilindungi:

- `/blog/index.html` dan seluruh 18 URL pada `.blog-generated-manifest.json` Phase 0; publikasi sah berikutnya dapat menambah inventory.
- Seluruh `sanity-studio/`, schema post/author/category, Publish Now, Universal Paste, dan Reader Blocks.
- `scripts/build-blog.mjs`, `scripts/lib/blog-*`, `scripts/lib/portable-text.mjs`, `scripts/lib/sanity-*`, `scripts/lib/html-utils.mjs`, `js/blog.js`, `css/blog.css`, serta validator/tes Blog existing.
- Ownership dan cleanup `.blog-generated-manifest.json` tetap terpisah dari manifest situs baru.
- Tidak ada field language/translation Sanity, migrasi konten, dokumen terjemahan, atau perubahan related/featured/category Blog.
- Webhook production, disabled staging webhook, private Deploy Hook, dan secrets tidak disentuh. Konfigurasi eksternal ini mengikuti dokumentasi existing; tidak diaudit ulang dari dashboard pada Phase 1A.
- Hotfix enam exact legacy loc pada `scripts/validate-phase2.js` tetap dipertahankan. Ketiga artikel company-outing valid pada baseline wajib diterima.

Menjalankan build Blog pada Phase 1B boleh memperbarui HTML/manifest sesuai published Sanity terbaru dengan generator yang sama. Dengan input CMS sama, hasil Blog harus tetap sama; jangan menganggap perubahan CMS independen sebagai perubahan bilingual dan jangan mengembalikan inventory ke snapshot 18 secara paksa. Review output generated sebelum commit.

Implementasi EN Blog memerlukan kontrak fase terpisah. Menu sementara tidak menciptakan hubungan hreflang antara Blog ID dan homepage/service EN.

## 9. Daftar file Phase 1B yang diperkirakan

Daftar ini adalah kontrak perubahan yang diusulkan, bukan file yang dibuat pada Phase 1A.

| Status Phase 1B | Path tepat | Tujuan |
| --- | --- | --- |
| Baru | `data/site-pages.js` | Registry 13 pasangan/metadata; pisahkan ketersediaan teknis staging dari persetujuan copy/metadata production yang diverifikasi check rilis. |
| Baru | `js/site-language.js` | Helper URL/locale yang dipakai browser dan build. |
| Ubah | `js/main.js` | URL precedence, href locale-aware, anchor language switch, render/bind gate statis, hash handling, error handling tanpa menghapus HTML statis. |
| Ubah terbatas | `data/content.js` | Label Blog EN, translation unavailable/accessible labels, dan copy EN yang terbukti belum lengkap; tidak mengubah angka katalog atau raw pathway dasar. |
| Baru | `scripts/lib/site-render-adapter.mjs` | Adapter VM kecil/deterministik, renderer existing, output tiga region; berhenti dan laporkan alternatif refactor bila membutuhkan mocking luas/hack per halaman. |
| Baru | `scripts/build-site.mjs` | SSG non-Blog, head metadata, marker, manifest, dan kontribusi sitemap terpisah. |
| Baru | `scripts/validate-site.mjs` | Pemeriksaan 26 HTML, metadata, route, links, anchors, ownership, dan sitemap. |
| Baru | `scripts/test-site-language.mjs` | Tes helper locale, counterpart, query/hash, fallback, dan EN Blog exclusion. |
| Baru | `scripts/test-site-render.mjs` | Tes adapter/batas kompleksitas, baseline regresi HTML ID dan browser, idempotency, missing data, bind-only gate, serta output invariants. |
| Ubah | `package.json` | Tambah build:site/validate:site dan hook tes baru ke pipeline tanpa menghapus tes existing. |
| Ubah | `scripts/validate-phase2.js` | Tambah pemeriksaan route EN/static gate; semua aturan ID/Blog/hotfix existing tetap aktif. |
| Ubah | Seluruh 13 source wrapper ID pada matriks bagian 2 | Marker terjaga, localized metadata, script order, data-language/static gate, full generated ID regions. |
| Baru, generated | Seluruh 13 `en/…/index.html` pada matriks bagian 2 | Full English source HTML. |
| Baru, generated | `.site-generated-manifest.json` | Ownership EN, page identity, anchor inventory, dan input fingerprint. |
| Ubah, generated | `sitemap.xml` | Menambah eligible EN sambil menjaga seluruh entry ID/Blog. |

`vercel.json`, `robots.txt`, `data/product-catalog.json`, CSS existing, dependency/lockfile, validator editorial, dan source Blog/Sanity tidak direncanakan berubah. Penyesuaian CSS hanya boleh diusulkan bila tes layout membuktikan kebutuhan nyata; tanpa desain ulang atau perubahan Blog CSS. Dokumen implementasi dan daftar perubahan direview ulang jika cakupan melebar.

## 10. Kontrak acceptance test — belum dijalankan pada Phase 1A

Tes source/build dilakukan dengan Node built-ins dan fixture lokal; tes browser dilakukan terhadap server statis dan staging setelah deployment staging yang disetujui pada fase implementasi. Jangan mengklaim server lokal memvalidasi header/redirect Vercel. Semua 16 kriteria teknis berikut serta baseline regresi ID bagian 4.6 wajib PASS sebelum **kesiapan teknis staging** Phase 1B dinyatakan. Pengujian mencakup seluruh 13 EN; pending approval editorial tidak boleh disamakan dengan kegagalan teknis. Sebaliknya, seluruh tes teknis PASS tidak boleh dilaporkan sebagai kesiapan editorial/SEO production. Phase 1B tidak mengubah production.

| No. | Kriteria | PASS | FAIL |
| --- | --- | --- | --- |
| 1 | Direct EN URL | Semua 13 EN URL merespons 200 dan membuka page key yang benar lewat deep link/refresh, tanpa redirect ID. | Satu route hilang, salah halaman, atau dialihkan ke ID/home. |
| 2 | Initial HTML bahasa | Respons tanpa menjalankan JS berisi lang=en, satu H1, primary sections, cards, links, dan form EN yang relevan; ID lang=id. | EN hanya placeholder/head atau membutuhkan client-side translation untuk isi utama. |
| 3 | Title/description teknis | Semua pasangan memiliki satu title/description EN eksplisit, berbeda dari metadata ID, tidak kosong/undefined/fallback; metadata ID cocok baseline approved. Status review copy/metadata EN dilaporkan terpisah dan boleh pending selama QA staging. | Duplikasi lintas bahasa yang tidak disetujui, metadata ID berubah dari baseline, atau head baru bergantung JS. Tidak adanya approval editorial sendiri tidak menggagalkan QA teknis, tetapi memblokir rilis production. |
| 4 | Self-canonical | 26 canonical absolut tepat ke path locale sendiri, origin production, slash akhir, tanpa query/hash. | EN canonical ID, domain staging/www, atau canonical tidak cocok route. |
| 5 | Reciprocal hreflang | Tiap pasangan eligible mempunyai set id/en identik, self-reference, URL absolut, dan file counterpart nyata. | Return link hilang, alternate ke 404/noindex-intended/missing translation, atau alternate Blog palsu. |
| 6 | URL mengalahkan storage | Cross-product 26 URL × preference id/en/kosong/invalid/storage error tetap merender locale URL yang sama; browser EN tidak memicu redirect. | Bahasa, head, atau URL berubah karena preferensi/Accept-Language. |
| 7 | Language switch | Anchor bekerja dengan/tanpa JS, deep path benar, new tab/back valid; query dan hash valid dipertahankan pada enhancement; tidak rerender bahasa di URL lama. | Button-only, stale path, double prefix, broken anchor, redirect otomatis, atau input/scroll berubah akibat startup rerender. |
| 8 | Internal links | Crawl header/footer/cards/CTA/breadcrumb 26 halaman: counterpart sesuai allowlist; query service/UTM/sourcePage benar; asset/eksternal tidak berubah. | EN keluar ke ID tanpa pengecualian Blog/unavailable yang jelas, href palsu, atau atribusi berubah. |
| 9 | Blog ID regression | Semua route baseline tetap ada; published snapshot cocok manifest; dengan CMS sama, body/head/chrome/related dan aset Blog sama; seluruh tes Blog existing PASS. | Artikel terhapus tanpa perubahan CMS yang sah, Blog memuat runtime situs, atau schema/automation/Reader Blocks/paste berubah. |
| 10 | Tanpa fake EN Blog | EN navbar/footer menuju /blog/ dengan label Indonesia; tidak ada output/loc/hreflang /en/blog/; request langsung /en/blog/ 404. | Blog ID diiklankan sebagai terjemahan EN, route placeholder, atau redirect ke index lain sebagai pengganti terjemahan. |
| 11 | Tanpa 404 tak diinginkan | Semua destination navigasi/cards/CTA/image/JS/CSS 200 dan seluruh fragment target ada; negative route tetap 404. | Satu link intended rusak atau catch-all mengembalikan homepage 200 untuk path tidak dikenal. |
| 12 | Layout/overflow dan baseline ID | QA 320/375/768/1024/1440px: document scrollWidth <= clientWidth + 1px; menu/dropdown/tabs/accordion/form/carousel berfungsi dan focus/reduced motion terjaga. Generated ID HTML, screenshot, dan perilaku browser cocok dengan baseline situs ID yang bekerja sesuai bagian 4.6. | Overflow viewport, kontrol tertutup, language link tak terbaca, atau perbedaan ID yang tidak diizinkan pada konten, metadata, nilai produk, visual behavior, form, tracking, atau route. |
| 13 | Staging protection | GET 26 halaman dan representative Blog/sitemap pada staging mengirim noindex,nofollow; canonical tetap intended production. | Header hilang/melemah atau Vercel config staging diubah tanpa persetujuan. |
| 14 | Isolasi production pada Phase 1B | Main/ref/deployment dan konfigurasi production tetap tidak tersentuh sepanjang Phase 1B; seluruh validator dan baseline ID lulus; laporan memisahkan kesiapan teknis staging dari status persetujuan copy/metadata EN untuk rilis terpisah. | Perubahan production pada Phase 1B, klaim siap rilis hanya dari PASS teknis, URL ID bergeser, indexability/nilai produk berubah, atau checks dibypass. |
| 15 | Legacy sitemap hotfix | Enam exact legacy loc ditolak; tiga slug company-outing baseline diterima; noindex/draft/future Blog tetap dikecualikan; 45 loc unik untuk fixture 18 post + 13 EN. | Substring matcher dipulihkan, valid post ditolak, redirect URL masuk sitemap, atau jumlah fixture/ownership salah. |
| 16 | Scope/architecture dan batas VM | Tidak ada framework/dependency baru, mutasi Sanity/webhook/secrets, regional EN, atau source Blog yang berubah; build idempotent, adapter tetap dalam permukaan kecil generik bagian 4.2, dan cleanup hanya file milik site manifest. | Mocking DOM luas, hack khusus halaman atau perluasan adapter diam-diam; framework migration, output tak terjelaskan, cross-generator deletion, atau implementasi EN Blog masuk scope. |

Tes pendukung wajib mencakup invalid/missing registry/metadata, locale collision, duplikat canonical/H1/ID, script order, escaping URL/text/JSON, tidak ada network/tracking pada adapter, bind-once, serta kondisi request katalog gagal tanpa menghapus static content. Re-run script existing dari package.json: full build, validate:blog, validate:phase2, validate:editorial; tes Studio terkait, JS syntax, dan git diff --check. Nama script baru harus benar-benar ditambahkan pada Phase 1B sebelum diklaim dijalankan.

**Gate production editorial/SEO, di luar penyelesaian Phase 1B:** persetujuan eksplisit yang tercatat untuk copy dan metadata seluruh 13 EN pada versi/fingerprint artifact final, review regresi ID dan SEO, serta otorisasi rilis production terpisah. Jika salah satu approval belum tersedia atau materinya berubah, status production adalah BELUM SIAP meskipun teknis staging PASS. Sesudah rilis terpisah yang diotorisasi, lakukan QA live URL ID/EN dan metadata; langkah tersebut bukan deployment atau pengujian mutatif production yang diizinkan oleh Phase 1B.

## 11. Risiko teknis dan mitigasi

| Risiko terkonfirmasi / batas verifikasi | Mitigasi yang diusulkan |
| --- | --- |
| Runtime saat ini storage-first dan mengganti DOM sesudah fetch katalog. | Locale dari URL; static gate; bind-only; uji first paint, autofill, hash, dan network failure. |
| Renderer terikat DOM dan global state, walau 26 probe berhasil. | Adapter kecil/deterministik yang fail-closed; berhenti jika membutuhkan mocking DOM luas atau hack per halaman, laporkan fungsi terhalang dan alternatif ekstraksi fungsi murni yang terfokus untuk review owner. |
| String href tersebar dalam header/footer/cards/dictionary. | Shared allowlist helper pada boundary pembentukan link; crawl semua anchor, bukan hanya navbar. |
| Primary copy EN tersedia secara struktur, tetapi beberapa nilai katalog/fallback/hardcoded belum diaudit editorial lengkap. | QA teknis seluruh 13 EN boleh berjalan di staging terlindungi. Approval copy/metadata eksplisit per halaman wajib untuk production; jangan mengubah katalog angka, memakai fallback ID diam-diam, atau menyamakan PASS teknis dengan izin rilis. |
| Wrapper ID menjadi source scaffold sekaligus output ber-marker. | Marker unik wajib; idempotency; hanya owned regions diganti; review diff; jangan regex nested div atau edit generated EN manual. |
| Source ID sekarang berisi fallback H1 yang kadang berbeda dari H1 dictionary aktif. | Full generated ID harus cocok dengan DOM situs ID yang bekerja; source/head approved direkam terpisah. Baseline ketat bagian 4.6 memblokir perubahan konten/metadata/produk/perilaku yang tidak diizinkan, bukan sekadar memeriksa jumlah H1. |
| Native hash scroll dapat menuju disclosure/panel tersembunyi. | Pertahankan IDs; buka ancestor/tabpanel yang relevan melalui kontrol existing; uji initial hash, hashchange, dan switch counterpart. |
| Static hosting tidak dapat mengetahui query/hash request untuk menyusun href switch tanpa JS. | Href statis tetap ke counterpart valid; enhancement mempertahankan query/hash ketika JS aktif. Pertahankan batas yang telah ditetapkan kontrak, bukan menjanjikan kesetaraan yang belum dapat dipenuhi. |
| Root pipeline dipakai production Blog Publish Automation. | Builder situs lokal/deterministik; tidak ada mutasi CMS; pertahankan seluruh tahap lama dan last-good deployment behavior. |
| Sitemap mempunyai dua pemilik setelah Phase 1B. | Exact URL ownership, manifest terpisah, preserve Blog entries, build order dan fixture dynamic post count. |
| Tombol bahasa menjadi anchor dan label Blog EN lebih panjang. | Reuse class CSS existing; responsive/keyboard QA; perubahan CSS hanya bila terbukti perlu. |
| Metadata EN di staging memakai URL production yang belum live sebelum rilis. | Staging tetap noindex; counterpart berada dalam artifact; validasi production live baru dilakukan setelah rilis production disetujui. |
| Local static server tidak meniru headers/redirect deployment. | Bedakan bukti source/local dari HTTP staging; jangan mengklaim hasil staging sebelum diperiksa. |

## 12. Rencana rollback untuk fase implementasi

Tidak ada rollback runtime yang perlu dilakukan pada Phase 1A karena hanya dokumen kontrak yang difinalisasi dan di-commit. Jangan membuang perubahan untuk menutupi status worktree.

Untuk Phase 1B yang belum dirilis ke production, lakukan perubahan pada feature branch dan review per commit. Bila staging bermasalah, revert commit Phase 1B yang relevan secara normal, tanpa reset/force push, lalu jalankan workflow Blog terhadap published Sanity saat itu sebelum deployment staging yang diotorisasi. Gunakan Phase 0 sebagai referensi source, bukan mengembalikan artifact artikel lama yang bisa menghilangkan post baru. Jangan mengganti main atau webhook untuk rollback staging.

Setelah EN kelak sudah dirilis/indexed di production, rollback tidak boleh sekadar menghapus seluruh EN dan mengembalikan sitemap lama. Utamakan perbaikan runtime dengan mempertahankan EN static HTML, URL, canonical, dan alternate valid. Penarikan route EN memerlukan keputusan owner dan rencana redirect/SEO terpisah; deployment production tetap membutuhkan otorisasi fase rilis. Backup/ownership manifest tidak menggantikan kebijakan tersebut.

## 13. Keputusan arsitektur final dan gate lanjutan

Owner mengizinkan finalisasi dan commit dokumen ini pada feature branch. Keputusan arsitektur berikut dipertahankan; persetujuan ini bukan persetujuan editorial atau rilis production:

1. Seluruh 13 pasangan URL pada matriks, tanpa /id/ atau regional EN.
2. SSG ID dan EN melalui adapter renderer existing; sumber ID menjadi full HTML ber-marker, bukan hanya menghasilkan 13 EN. Baseline HTML dan perilaku ID bagian 4.6 wajib dipertahankan, dan adapter wajib mematuhi batas berhenti/lapor bagian 4.2.
3. URL sebagai otoritas bahasa, navigasi dokumen nyata, fallback unavailable tanpa URL palsu, dan kebijakan query/hash di atas, termasuk batas bahwa switch tanpa JS tidak menyalin query/hash request secara dinamis.
4. Interim EN Blog ke /blog/ dengan label “Blog (Bahasa Indonesia)”; seluruh infrastruktur Blog tetap dilindungi.
5. Metadata ID dipertahankan, reciprocal id/en pada HTML, tanpa x-default V1, serta OG id_ID/en_US sebagai konvensi metadata saja.
6. Seluruh 13 EN boleh diuji secara teknis pada staging terlindungi. Kesiapan editorial/SEO production tetap memerlukan approval eksplisit copy dan metadata per halaman/versi oleh owner atau reviewer yang ditunjuk owner; persetujuan materi tersebut belum diberikan oleh kontrak ini.
7. Daftar file, urutan build, manifest terpisah, acceptance gates, dan rollback tetap berlaku. Phase 1B tidak mengubah production; push main/staging, deployment, dan rilis hanya boleh dilakukan sesuai otorisasi task fase terkait, bukan disimpulkan dari persetujuan kontrak ini.

Tidak ditemukan blocker teknis untuk arsitektur statis ini dari source/probe, tetapi probe bukan bukti implementasi adapter akan tetap kecil atau seluruh baseline regresi akan PASS. Jika batas adapter terlampaui, hentikan bagian tersebut dan minta review alternatif refactor terfokus. Approval copy/metadata EN serta rilis production tetap merupakan gate terbuka di luar kesiapan teknis staging; jangan mengganti keputusan arsitektur atau menganggap gate tersebut terpenuhi secara diam-diam.

## 14. Status penyerahan Phase 1A

Artifact yang diizinkan berubah dan di-commit hanya `docs/bilingual-phase1a-architecture-contract.md`, pada branch lokal `feature/bilingual-website-seo-v1` yang berasal dari SHA Phase 0. Commit dokumen ini tidak mengubah source aplikasi atau generated output. Main dan staging tidak mendapat commit/push; tidak ada deployment atau perubahan production. Tidak menjalankan npm run build karena akan meregenerasi HTML, manifest Blog, dan sitemap. Kriteria acceptance teknis, baseline regresi ID, dan gate editorial/SEO di atas adalah kontrak untuk fase berikutnya dan belum dinyatakan PASS oleh finalisasi Phase 1A. SHA commit final dan status worktree dilaporkan pada hasil eksekusi, bukan disisipkan sebagai referensi diri dalam dokumen.
