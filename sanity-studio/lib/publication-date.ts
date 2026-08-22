export function resolvePublicationDate(value: unknown, nowIso: string): string {
  const now = Date.parse(nowIso)
  if (!Number.isFinite(now)) throw new Error('Waktu publish tidak valid.')

  if (typeof value !== 'string') return nowIso
  const current = Date.parse(value)
  return Number.isFinite(current) && current <= now ? value : nowIso
}
