import {myMapsUrl} from '../../sanity-studio/lib/my-maps-url.ts'
import {escapeAttribute, escapeHtml} from './html-utils.mjs'

export function renderMap(block) {
  const title = typeof block.title === 'string' && block.title.trim() || 'Peta Google My Maps'
  const caption = typeof block.caption === 'string' && block.caption.trim()
  const embed = myMapsUrl(block.embedUrl, 'embed')
  const open = myMapsUrl(block.openUrl, 'viewer') ??
    (embed && new URL(`https://www.google.com/maps/d/viewer?mid=${embed.searchParams.get('mid')}`))
  const frame = embed
    ? `<iframe class="blog-map-frame" src="${escapeAttribute(embed.href)}" title="${escapeAttribute(title)}" width="640" height="480" loading="lazy"></iframe>`
    : '<p>Peta sematan tidak tersedia.</p>'
  const link = open
    ? `<p><a href="${escapeAttribute(open.href)}" target="_blank" rel="noopener noreferrer">Buka peta lengkap: ${escapeHtml(title)}</a></p>`
    : ''
  return `<figure class="blog-map">${frame}${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}${link}</figure>`
}

export function stripAllowedMapFrames(html) {
  return html.replace(
    /<iframe class="blog-map-frame" src="([^"<>]+)" title="[^"<>]+" width="640" height="480" loading="lazy"><\/iframe>/g,
    (frame, src) => myMapsUrl(src.replaceAll('&amp;', '&'), 'embed') ? '' : frame,
  )
}
