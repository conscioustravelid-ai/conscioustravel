import {escapeAttribute, escapeHtml} from './html-utils.mjs'

const TOC_HEADING_STYLES = new Set(['h2', 'h3'])
export const BLOG_TOC_PRIMARY_LIMIT = 6

export function headingPlainText(block) {
  if (block?._type !== 'block' || !TOC_HEADING_STYLES.has(block.style) || !Array.isArray(block.children)) return null
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
  const orphanHeadings = []
  const used = new Set()
  const counters = new Map()
  let currentPrimary = null
  for (const [index, block] of (Array.isArray(blocks) ? blocks : []).entries()) {
    if (block?._type !== 'block' || !TOC_HEADING_STYLES.has(block.style)) continue
    const text = headingPlainText(block)
    if (!text) throw new Error(`Invalid ${block.style.toUpperCase()} in article "${articleSlug}" — heading at body[${index}] is empty or malformed.`)
    const base = headingAnchorBase(text)
    let count = (counters.get(base) || 0) + 1
    let id = count === 1 ? base : `${base}-${count}`
    while (used.has(id)) { count += 1; id = `${base}-${count}` }
    counters.set(base, count)
    used.add(id)
    headingIds.set(index, id)
    const heading = {level:block.style === 'h2' ? 2 : 3,text,id,blockIndex:index}
    if (heading.level === 2) {
      currentPrimary = {...heading,children:[]}
      items.push(currentPrimary)
    } else if (currentPrimary) currentPrimary.children.push(heading)
    else orphanHeadings.push(heading)
  }
  const primaryCount = items.length
  return {items,headingIds,orphanHeadings,primaryCount,primaryLimit:BLOG_TOC_PRIMARY_LIMIT,visible:primaryCount >= 3,collapsible:primaryCount > BLOG_TOC_PRIMARY_LIMIT}
}

function renderChildren(children) {
  if (!children.length) return ''
  return `<ul class="blog-toc-children">${children.map((item) => `<li><a href="#${escapeAttribute(item.id)}">${escapeHtml(item.text)}</a></li>`).join('')}</ul>`
}

export function renderBlogToc(toc, titleId) {
  if (!toc?.visible) return ''
  const listId = `${titleId}-list`
  const longAttributes = toc.collapsible ? ' data-blog-toc data-blog-toc-long' : ''
  const list = toc.items.map((item,index) => `<li class="blog-toc-primary"${index >= toc.primaryLimit ? ' data-blog-toc-overflow' : ''}><a href="#${escapeAttribute(item.id)}">${escapeHtml(item.text)}</a>${renderChildren(item.children)}</li>`).join('')
  const toggle = toc.collapsible ? `<button class="blog-toc-toggle" type="button" aria-expanded="false" aria-controls="${escapeAttribute(listId)}" data-blog-toc-toggle hidden>Lihat semua bagian</button>` : ''
  return `<div class="container narrow"><nav class="blog-toc" aria-labelledby="${escapeAttribute(titleId)}"${longAttributes}><p class="blog-toc-title" id="${escapeAttribute(titleId)}">Dalam Artikel Ini</p><ol class="blog-toc-list" id="${escapeAttribute(listId)}">${list}</ol>${toggle}</nav></div>`
}
