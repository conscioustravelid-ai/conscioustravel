# Legacy URL Redirect Recommendations

Status Phase 1.5: implemented in `vercel.json` after approval before deploy.

| Legacy URL | Status di codebase | Relevansi | Rekomendasi | Destination |
|---|---|---|---|---|
| `/bali/` | Tidak ada route live | Terlalu umum | Redirect 301 jika pernah dipakai di ads/SEO | `/` |
| `/company-trip/` | Tidak ada route live | Sama dengan B2B outing | Redirect 301 | `/company-outing/` |
| `/study-tour/` | Tidak ada route live | Bisa masuk inquiry institusi/sekolah | Redirect 301 | `/contact/` |
| `/private-trip/` | Tidak ada route live | Masuk B2C custom trip | Redirect 301 | `/experiences/` |
| `/open-trip/` | Tidak ada route live | Belum ada open trip/catalog final | Redirect 301 sementara | `/experiences/` |
| `/open-trip-europe/` | Tidak ada route live | Tidak sesuai fokus Bali Phase 1 | Redirect 301 atau 410 setelah cek data historis | `/experiences/` atau `410 Gone` |

## Vercel implementation

Redirect sudah ditambahkan di `vercel.json` seperti:

```json
{
  "redirects": [
    { "source": "/bali/", "destination": "/", "permanent": true },
    { "source": "/company-trip/", "destination": "/company-outing/", "permanent": true },
    { "source": "/study-tour/", "destination": "/contact/", "permanent": true },
    { "source": "/private-trip/", "destination": "/experiences/", "permanent": true },
    { "source": "/open-trip/", "destination": "/experiences/", "permanent": true },
    { "source": "/open-trip-europe/", "destination": "/experiences/", "permanent": true }
  ]
}
```

Catatan: `/study-tour/` diarahkan ke `/contact/` agar aman di Vercel. Jika
setelah deploy ingin langsung scroll ke form, bisa diuji opsi destination
`/contact/#inquiry`.
