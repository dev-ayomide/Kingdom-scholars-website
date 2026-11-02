// Minimal CSV parser: quoted fields, escaped quotes, CRLF, BOM, and comma,
// semicolon or tab delimiters (Excel in some locales exports semicolons).

export function parseCsv(input: string): string[][] {
  const text = input.replace(/^﻿/, '')
  const firstLine = text.split(/\r?\n/, 1)[0] ?? ''
  const delimiter = [',', ';', '\t'].sort(
    (a, b) => firstLine.split(b).length - firstLine.split(a).length
  )[0]

  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (c === '"') {
        inQuotes = false
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === delimiter) {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += c
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  // Blank rows are kept so line numbers in error messages match the spreadsheet.
  return rows
}

export interface FieldSpec {
  key: string
  label: string
  aliases: string[]
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

// Maps header names to field keys and returns one object per data row.
// Each row also carries `line` (1-based, as it appears in the spreadsheet).
export function tableToRows(
  table: string[][],
  fields: FieldSpec[]
): { rows: Record<string, string>[]; missing: string[] } {
  if (table.length === 0) return { rows: [], missing: fields.map((f) => f.label) }
  const header = table[0].map(norm)
  const index = new Map<string, number>()
  for (const f of fields) {
    const names = [f.key, f.label, ...f.aliases].map(norm)
    const at = header.findIndex((h) => names.includes(h))
    if (at >= 0) index.set(f.key, at)
  }
  const missing = fields.filter((f) => !index.has(f.key)).map((f) => f.label)
  if (missing.length) return { rows: [], missing }

  const rows = table
    .slice(1)
    .map((cells, i) => {
      const obj: Record<string, string> = { line: String(i + 2) }
      for (const f of fields) obj[f.key] = (cells[index.get(f.key)!] ?? '').trim()
      return obj
    })
    .filter((obj) => fields.some((f) => obj[f.key] !== ''))
  return { rows, missing: [] }
}
