import {keyGenerator} from '@portabletext/editor'
import type {PortableTextInputProps} from 'sanity'

export type ParsedTable = {headerRows: 0 | 1; rows: string[][]}
type KeyGenerator = () => string

const normalizeCellText = (value: string) => value
  .replace(/\u00a0/gu, ' ')
  .replace(/[\t\r\n ]+/gu, ' ')
  .trim()

export function parseHtmlTable(html: string, createDocument?: (html: string) => Document): ParsedTable | undefined {
  if (!/<table[\s>]/iu.test(html)) return undefined
  const parse = createDocument || ((value: string) => new DOMParser().parseFromString(value, 'text/html'))
  const document = parse(html)
  const tables = [...document.querySelectorAll('table')]
  if (tables.length !== 1) return undefined
  const table = tables[0]
  if (table.querySelector('table')) return undefined

  const outside = document.body.cloneNode(true) as HTMLElement
  outside.querySelectorAll('table,style,meta,link').forEach((element) => element.remove())
  if (normalizeCellText(outside.textContent || '')) return undefined

  const rows = [...table.querySelectorAll(':scope > thead > tr, :scope > tbody > tr, :scope > tfoot > tr, :scope > tr')]
  const values = rows.map((row) => [...row.children]
    .filter((cell) => cell.matches('th,td'))
    .map((cell) => {
      const safeCell = cell.cloneNode(true) as HTMLElement
      safeCell.querySelectorAll('script,style,iframe,object,embed,img,svg').forEach((element) => element.remove())
      return normalizeCellText(safeCell.textContent || '')
    }))
  if (!isUsableTable(values)) return undefined

  const firstRow = rows[0]
  const explicitHeader = Boolean(firstRow.closest('thead')) || [...firstRow.children].some((cell) => cell.matches('th'))
  return {headerRows: explicitHeader ? 1 : 0, rows: values}
}

function splitMarkdownRow(line: string): string[] {
  const source = line.trim()
  const cells: string[] = []
  let current = ''
  let escaped = false
  for (const character of source) {
    if (escaped) {
      current += character === '|' ? '|' : `\\${character}`
      escaped = false
    } else if (character === '\\') escaped = true
    else if (character === '|') { cells.push(current); current = '' }
    else current += character
  }
  if (escaped) current += '\\'
  cells.push(current)
  if (source.startsWith('|')) cells.shift()
  if (source.endsWith('|') && !source.endsWith('\\|')) cells.pop()
  return cells.map(normalizeCellText)
}

const isSeparatorCell = (cell: string) => /^:?-{3,}:?$/u.test(cell.trim())

function isUsableTable(rows: string[][]): boolean {
  const columns = rows[0]?.length || 0
  return rows.length > 0 && columns > 0 && rows.every((row) => row.length === columns) && rows.some((row) => row.some(Boolean))
}

export function parseMarkdownTable(text: string): ParsedTable | undefined {
  const lines = text.replace(/\r\n?/gu, '\n').split('\n').map((line) => line.trim()).filter(Boolean)
  if (lines.length < 3) return undefined
  const rows = lines.map(splitMarkdownRow)
  if (!rows[1]?.length || !rows[1].every(isSeparatorCell)) return undefined
  const contentRows = [rows[0], ...rows.slice(2)]
  if (!isUsableTable(contentRows) || contentRows.length < 2 || rows[1].length !== contentRows[0].length) return undefined
  return {headerRows: 1, rows: contentRows}
}

export function toNativeTable(table: ParsedTable, createKey: KeyGenerator = keyGenerator) {
  return {
    _type: 'table',
    _key: createKey(),
    headerRows: table.headerRows,
    rows: table.rows.map((row) => ({
      _type: 'row',
      _key: createKey(),
      cells: row.map((text) => ({
        _type: 'cell',
        _key: createKey(),
        value: [{
          _type: 'block',
          _key: createKey(),
          style: 'normal',
          markDefs: [],
          children: [{_type: 'span', _key: createKey(), text, marks: []}],
        }],
      })),
    })),
  }
}

export function createBlogTablePasteHandler(options: {createDocument?: (html: string) => Document; createKey?: KeyGenerator} = {}): NonNullable<PortableTextInputProps['onPaste']> {
  return (data) => {
    const clipboard = data.event.clipboardData
    const html = clipboard?.getData('text/html') || ''
    if (html && /<table[\s>]/iu.test(html)) {
      const parsed = parseHtmlTable(html, options.createDocument)
      return parsed ? {insert: [toNativeTable(parsed, options.createKey)], path: data.path} : undefined
    }
    const text = clipboard?.getData('text/plain') || ''
    const parsed = parseMarkdownTable(text)
    return parsed ? {insert: [toNativeTable(parsed, options.createKey)], path: data.path} : undefined
  }
}

export const handleBlogTablePaste = createBlogTablePasteHandler()
