export function myMapsUrl(value: unknown, kind: 'embed' | 'viewer'): URL | null {
  if (typeof value !== 'string' || !/^https:\/\/www\.google\.com\/maps\/d\//i.test(value.trim())) return null
  try {
    const url = new URL(value.trim())
    const ids = url.searchParams.getAll('mid')
    if (url.origin !== 'https://www.google.com' || url.username || url.password ||
        url.pathname !== `/maps/d/${kind}` ||
        ids.length !== 1 || !/^[A-Za-z0-9_-]{1,128}$/.test(ids[0])) return null
    return url
  } catch {
    return null
  }
}
