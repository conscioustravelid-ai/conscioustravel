const H2_STYLE = 'h2'

export function headingPlainText(block) {
  if (block?._type !== 'block' || block.style !== H2_STYLE || !Array.isArray(block.children)) return null
  return block.children
    .filter((child) => child?._type === 'span' && typeof child.text === 'string')
    .map((child) => child.text)
    .join('')
    .replace(/\s+/gu, ' ')
    .trim()
}

export function headingAnchorBase(value) {
  const normalized = String(value || '')
    .normalize('NFKC')
    .toLocaleLowerCase('id-ID')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return normalized || 'bagian'
}

export function createBlogToc(blocks, articleSlug = '(unknown)') {
  const items = []
  const headingIds = new Map()
  const used = new Set()
  const counters = new Map()
  for (const [index, block] of (Array.isArray(blocks) ? blocks : []).entries()) {
    if (block?._type !== 'block' || block.style !== H2_STYLE) continue
    const text = headingPlainText(block)
    if (!text) throw new Error(`Invalid H2 in article "${articleSlug}" — heading at body[${index}] is empty or malformed.`)
    const base = headingAnchorBase(text)
    let count = (counters.get(base) || 0) + 1
    let id = count === 1 ? base : `${base}-${count}`
    while (used.has(id)) { count += 1; id = `${base}-${count}` }
    counters.set(base, count)
    used.add(id)
    headingIds.set(index, id)
    items.push({text, id, blockIndex:index})
  }
  return {items, headingIds, visible:items.length >= 3}
}

export function renderBlogToc(toc, titleId) {
  if (!toc?.visible) return ''
  return `<div class="container narrow"><nav class="blog-toc" aria-labelledby="${escapeAttribute(titleId)}"><p class="blog-toc-title" id="${escapeAttribute(titleId)}">Dalam Artikel Ini</p><ol>${toc.items.map((item) => `<li><a href="#${escapeAttribute(item.id)}">${escapeHtml(item.text)}</a></li>`).join('')}</ol></nav></div>`
}
import {escapeAttribute, escapeHtml} from './html-utils.mjs'
