# Design System — Conscioustravel.id

## Overview

Design system ini adalah referensi utama untuk semua keputusan visual di website Conscioustravel.id.
Setiap komponen, halaman, dan layout harus mengikuti panduan ini agar tampilan tetap konsisten di seluruh website.

Brand direction: **clean, natural, premium, warm, meaningful, trustworthy, modern.**
Bukan travel agent generik. Bukan korporat kaku. Tapi juga bukan terlalu kasual.

---

## 1. CSS Variables (Design Tokens)

Semua nilai di bawah ini harus didefinisikan sebagai CSS custom properties di `css/variables.css`
dan diimport di awal `css/style.css`. Tidak boleh ada hardcode warna atau spacing di komponen.

```css
:root {
  /* === COLORS === */
  --color-primary:        #2D6A4F;   /* Green utama — CTA, heading accent */
  --color-primary-light:  #45C95A;   /* Green terang — badge, tag, highlight */
  --color-cream:          #F9F5EF;   /* Background section alternating */
  --color-dark:           #1A1A1A;   /* Body text, heading utama */
  --color-grey:           #6B7280;   /* Subtext, caption, placeholder */
  --color-grey-light:     #E5E7EB;   /* Border, divider */
  --color-white:          #FFFFFF;   /* Card background, navbar */
  --color-amber:          #D4A853;   /* Accent kecil, star rating */
  --color-error:          #DC2626;   /* Form error state */

  /* === TYPOGRAPHY === */
  --font-family:          'Plus Jakarta Sans', sans-serif;

  --text-xs:    12px;
  --text-sm:    13px;
  --text-base:  15px;
  --text-md:    16px;
  --text-lg:    18px;
  --text-xl:    20px;
  --text-2xl:   24px;
  --text-3xl:   28px;
  --text-4xl:   32px;
  --text-5xl:   40px;
  --text-6xl:   56px;

  --weight-regular:    400;
  --weight-medium:     500;
  --weight-semibold:   600;
  --weight-bold:       700;
  --weight-extrabold:  800;

  /* === SPACING === */
  --space-1:   4px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;
  --space-14:  56px;
  --space-16:  64px;
  --space-20:  80px;

  --section-padding-desktop:  80px;
  --section-padding-mobile:   56px;
  --container-max-width:      1200px;
  --container-padding:        24px;

  /* === BORDER RADIUS === */
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-full: 9999px;

  /* === SHADOWS === */
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.08);
  --shadow-md:  0 4px 16px rgba(0,0,0,0.10);
  --shadow-lg:  0 8px 32px rgba(0,0,0,0.12);

  /* === TRANSITIONS === */
  --transition-fast:   150ms ease;
  --transition-base:   250ms ease;
  --transition-slow:   400ms ease;

  /* === Z-INDEX === */
  --z-navbar:   100;
  --z-floating: 90;
  --z-modal:    200;
  --z-overlay:  150;
}
```

---

## 2. Typography

### Penggunaan

| Element | Font Weight | Ukuran Desktop | Ukuran Mobile |
|---|---|---|---|
| H1 | ExtraBold (800) | 56px | 32px |
| H2 | Bold (700) | 40px | 24px |
| H3 | Bold (700) | 28px | 20px |
| H4 | SemiBold (600) | 20px | 18px |
| Eyebrow / Label | Medium (500) | 13px | 12px |
| Body | Regular (400) | 16px | 15px |
| Caption | Regular (400) | 13px | 12px |

### Aturan Typography
- H1 hanya boleh ada **satu per halaman**
- Eyebrow label selalu uppercase, letter-spacing 0.08em, warna `--color-primary-light` atau `--color-grey`
- Line height: heading 1.2, body 1.6
- Paragraph maksimal 65 karakter per baris di desktop (gunakan `max-width`)

---

## 3. Button Styles

```css
/* Base */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: var(--radius-full);
  font-family: var(--font-family);
  font-weight: var(--weight-semibold);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all var(--transition-base);
  text-decoration: none;
  border: 2px solid transparent;
}

/* Primary — CTA utama */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}
.btn-primary:hover {
  background: #235a42;
  border-color: #235a42;
  transform: translateY(-1px);
}

/* Secondary — alternatif outline */
.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.btn-secondary:hover {
  background: var(--color-primary);
  color: var(--color-white);
}

/* Cream — dipakai di section putih */
.btn-cream {
  background: var(--color-cream);
  color: var(--color-dark);
  border-color: var(--color-cream);
}

/* White — dipakai di section gelap / hijau */
.btn-white {
  background: var(--color-white);
  color: var(--color-primary);
  border-color: var(--color-white);
}
.btn-white:hover {
  background: var(--color-cream);
}

/* Ghost — link style */
.btn-ghost {
  background: transparent;
  color: var(--color-primary);
  border-color: transparent;
  padding-left: 0;
  padding-right: 0;
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

**Aturan Button:**
- Tidak boleh ada lebih dari 2 CTA button berdampingan
- Hierarki selalu: Primary kiri, Secondary kanan
- Di mobile, button full-width jika dalam CTA section
- Tidak ada animasi bounce atau glow — hover cukup lift ringan atau color change

---

## 4. Card Styles

### Package Card
- Background: `--color-white`
- Border radius: `--radius-lg` (16px)
- Shadow: `--shadow-md`
- Hover: `translateY(-4px)` + `--shadow-lg`
- Foto atas (aspect ratio 4:3), konten bawah
- Tidak ada border warna — shadow sudah cukup

### Experience Card
- Foto dominan (aspect ratio 3:2 atau 4:3)
- Overlay label di pojok kiri bawah foto (kategori)
- Judul, lokasi, harga mulai, tombol CTA
- Border radius `--radius-lg`

### Blog Card (Phase 2)
- Thumbnail + tag + judul + tanggal
- Hover underline pada judul

---

## 5. Section Layout Patterns

```
Pattern A — Split 50/50:
  [Teks kiri] [Visual kanan]
  Di mobile: visual atas, teks bawah

Pattern B — Full-width Background:
  Background color berbeda, konten centered
  Dipakai untuk trust strip, final CTA, impact block

Pattern C — Card Grid:
  Desktop: 3 kolom
  Tablet:  2 kolom
  Mobile:  1 kolom
  Gap: var(--space-6)

Pattern D — Centered CTA:
  Teks + CTA di tengah, max-width 640px
  Dipakai untuk section transisi dan final CTA

Pattern E — Split dengan Foto Dominan:
  Foto 55% kanan, konten 45% kiri
  Di mobile: foto atas full-width, konten bawah
```

### Section Background Alternating
```
Section 1: --color-white
Section 2: --color-cream
Section 3: --color-white
Section 4: --color-primary (teks putih)
Section 5: --color-cream
```
Pola ini menjaga ritme visual tanpa terasa monoton.

---

## 6. Image Treatment

- Format: WebP diutamakan, fallback PNG/JPG
- Semua foto dalam card: `border-radius: var(--radius-lg)`
- Semua foto wajib `loading="lazy"` kecuali hero (above the fold)
- Aspect ratio konsisten per tipe:
  - Hero: 16:9 (landscape) atau 3:4 (portrait di mobile)
  - Package card foto: 4:3
  - Experience card foto: 3:2
  - Gallery: 1:1 atau 4:3
- Tidak ada filter warna artifisial (tidak ada overlay hijau/kuning di foto)
- Tidak ada teks overlay berat di atas foto — gunakan caption di bawah
- Foto harus natural, candid, genuine — bukan stock photo generik

---

## 7. Icon Style

- Style: line icon, stroke ringan (stroke-width 1.5–2)
- Ukuran: 20px untuk inline teks, 32px untuk feature block, 48px untuk section icon besar
- Library rekomendasi: Lucide Icons atau Heroicons (open source, clean)
- Warna mengikuti konteks:
  - Di background putih/cream: `--color-primary`
  - Di background hijau gelap: `--color-white`
- Emoji boleh dipakai sebagai accent (bukan sebagai icon utama UI)

---

## 8. Spacing & Layout Rules

- Container: `max-width: 1200px`, `margin: 0 auto`, `padding: 0 24px`
- Section padding: `80px 0` (desktop), `56px 0` (mobile)
- Gap antar card: `24px` (desktop), `16px` (mobile)
- Tidak ada section yang padding-nya kurang dari `40px`
- Whitespace adalah bagian dari design — jangan isi setiap pixel

---

## 9. Animation & Motion Rules

- Hanya gunakan scroll fade-in yang subtle (`opacity 0 → 1`, `translateY 20px → 0`)
- Durasi animasi: `400ms ease`
- Tidak ada carousel auto-play
- Tidak ada parallax scroll
- Tidak ada animasi bounce, pulse, atau glow
- FAQ accordion: slide down smooth, `300ms ease`
- Hover state button: `150ms ease`
- Mobile: kurangi animasi (prefer `prefers-reduced-motion`)

---

## 10. Responsive Breakpoints

```css
/* Mobile first */
/* Default: 375px ke atas */

@media (min-width: 640px)  { /* Tablet kecil */ }
@media (min-width: 768px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Desktop lebar */ }
```
