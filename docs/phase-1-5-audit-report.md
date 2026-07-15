# Phase 1.5 Audit Report

Date: 2026-07-16

## Summary

Website Phase 1 sudah berbentuk static multi-page site dengan halaman Home,
Company Outing, Experiences, Impact, About, Contact, dan inquiry form.
Struktur dasar sudah siap untuk traffic ads dan lead generation, dengan CTA
utama ke WhatsApp serta form Google Apps Script.

## Fixed In Phase 1.5

- WhatsApp final dipertahankan sebagai `6285195559749`.
- Legal name dipertahankan sebagai `PT Wisata Perjalanan Bermakna`.
- Alamat live diselaraskan ke dua alamat existing: Alamat PT Bekasi dan Kantor Bali.
- Draft Experience Catalog B2C disembunyikan dari halaman public.
- `data/experiences.json` dikosongkan sampai Phase 2 agar harga/route draft tidak terpublish.
- Tracking form dan CTA diarahkan ke `dataLayer` untuk GTM/GA4.
- `robots.txt` dan `sitemap.xml` ditambahkan.
- Asset gambar dibuatkan versi WebP dan reference halaman diarahkan ke WebP.
- Docs diselaraskan agar Experience Catalog/detail page jelas sebagai Phase 2.
- Rekomendasi redirect legacy URL ditambahkan di `docs/legacy-redirect-recommendations.md`.

## Remaining Manual Checks

- Cek row test `TEST PHASE 1.5 Codex` di Google Sheet dan hapus setelah verifikasi.
- Test semua CTA WhatsApp di mobile real device.
- Test GTM Preview untuk event:
  - `whatsapp_click`
  - `package_cta_click`
  - `inquiry_form_submit_attempt`
  - `inquiry_form_submit_success`
  - `booking_form_submit_success`
  - `contact_page_visit`
- Cek tampilan live setelah deploy di mobile 375px, tablet, dan desktop.
- Cek Open Graph preview karena `og:image` sekarang memakai WebP.
- Review rekomendasi redirect sebelum membuat `vercel.json`.

## Phase 2 Guardrail

Jangan publish Experience Catalog, experience detail page, harga B2C fixed,
itinerary detail, include/exclude, add-ons, gallery detail, atau FAQ per
experience sebelum data Phase 2 disetujui.
