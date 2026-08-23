export const CALLOUT_TYPES = ['tip', 'important', 'warning', 'goodToKnow'] as const
export const CTA_DESTINATIONS = ['whatsapp', 'contact', 'experiences', 'corporatePackages', 'customInternal'] as const
export const CTA_STYLES = ['soft', 'highlight', 'primary'] as const

export function validateAllowedValue(
  value: unknown,
  allowedValues: readonly string[],
  label: string,
): true | string {
  return typeof value === 'string' && allowedValues.includes(value)
    ? true
    : `${label} tidak valid.`
}
export const TRACKING_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const INTERNAL_PATH_PATTERN = /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*(?:[a-z0-9]+(?:-[a-z0-9]+)*\/?)?$/

type PortableTextItem = {_type?: string; style?: string}
type TableRow = {cells?: Array<{value?: PortableTextItem[]}>}
type ItineraryItem = {
  time?: string
  activity?: string
  area?: string
  notes?: string
}

const present = (value: unknown) => typeof value === 'string' && value.trim().length > 0

export function validateRequiredTrimmed(value: unknown, label: string) {
  if (!present(value)) return `${label} wajib diisi.`
  return value === (value as string).trim() ? true : `${label} tidak boleh diawali atau diakhiri spasi.`
}

export function validateOptionalTrimmed(value: unknown, label: string) {
  if (value === undefined || value === null || value === '') return true
  if (typeof value !== 'string') return `${label} tidak valid.`
  return value === value.trim() ? true : `${label} tidak boleh diawali atau diakhiri spasi.`
}

export function validateHeaderRows(value: unknown) {
  return value === 0 || value === 1 ? true : 'Header rows harus bernilai 0 atau 1.'
}

export function validateTableRows(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) return 'Tabel wajib memiliki minimal satu baris.'
  const rows = value as TableRow[]
  const counts = rows.map((row) => Array.isArray(row?.cells) ? row.cells.length : 0)
  if (counts.some((count) => count === 0)) return 'Setiap baris tabel wajib memiliki minimal satu cell.'
  if (new Set(counts).size !== 1) return 'Setiap baris tabel wajib memiliki jumlah cell yang sama.'
  if (rows.some((row) => row.cells?.some((cell) => !Array.isArray(cell.value) || cell.value.length === 0))) {
    return 'Setiap cell tabel wajib memiliki konten.'
  }
  return true
}

export function validateItineraryItems(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) return 'Itinerary wajib memiliki minimal satu agenda.'
  if (value.length > 12) return 'Itinerary maksimal memiliki 12 agenda.'
  for (const item of value as ItineraryItem[]) {
    if (!present(item?.time)) return 'Waktu agenda wajib diisi.'
    if (!present(item?.activity)) return 'Aktivitas agenda wajib diisi.'
    if (item.time!.trim().length > 40) return 'Waktu agenda maksimal 40 karakter.'
    if (item.activity!.trim().length > 140) return 'Aktivitas agenda maksimal 140 karakter.'
    if (typeof item.area === 'string' && item.area.trim().length > 80) return 'Area maksimal 80 karakter.'
    if (typeof item.notes === 'string' && item.notes.length > 240) return 'Catatan maksimal 240 karakter.'
  }
  return true
}

export function validateCalloutBody(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) return 'Isi callout wajib diisi.'
  if (value.length > 8) return 'Isi callout maksimal 8 block.'
  if ((value as PortableTextItem[]).some((item) => item?._type !== 'block' || !['normal', undefined].includes(item.style))) {
    return 'Callout hanya boleh berisi paragraf atau daftar sederhana.'
  }
  return true
}

export function validateCustomPath(value: unknown, destinationType: unknown) {
  if (destinationType !== 'customInternal') return true
  if (!present(value)) return 'Custom path wajib diisi untuk tujuan custom internal.'
  return value === (value as string).trim() && INTERNAL_PATH_PATTERN.test(value as string)
    ? true
    : 'Gunakan path internal root-relative, contoh /study-tour/.'
}

export function validateTrackingId(value: unknown) {
  if (!present(value)) return 'Tracking ID wajib diisi.'
  const normalized = (value as string).trim()
  if (normalized.length > 80) return 'Tracking ID maksimal 80 karakter.'
  return value === normalized && TRACKING_ID_PATTERN.test(normalized)
    ? true
    : 'Gunakan huruf kecil, angka, dan tanda hubung tanpa spasi.'
}
