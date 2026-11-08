'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { SearchIcon } from './kit'

export interface FilterRow {
  key: string
  search: string // lower-case text the search box looks in
  cells: ReactNode[]
}

// A plain table with a search box. Used for long lists (children, parents).
export default function FilterTable({
  columns, rows, label, empty = 'Nothing to show.', pageSize = 25,
}: { columns: string[]; rows: FilterRow[]; label: string; empty?: string; pageSize?: number }) {
  const [q, setQ] = useState('')
  const [shown, setShown] = useState(pageSize)
  const needle = q.trim().toLowerCase()
  const matches = useMemo(() => (needle ? rows.filter((r) => r.search.includes(needle)) : rows), [rows, needle])
  const visible = matches.slice(0, shown)

  return (
    <div>
      <div className="relative max-w-md mb-4">
        <label htmlFor={`f-${label}`} className="sr-only">{label}</label>
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A5568] pointer-events-none"><SearchIcon /></span>
        <input
          id={`f-${label}`}
          type="search"
          value={q}
          onChange={(e) => { setQ(e.target.value); setShown(pageSize) }}
          placeholder={label}
          className="ks-input !pl-11"
        />
      </div>
      <div className="ks-panel overflow-x-auto">
        <table className="ks-table">
          <thead>
            <tr>{columns.map((c) => (<th key={c} scope="col">{c}</th>))}</tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr><td colSpan={columns.length} className="ks-muted">{needle ? 'No match. Try a different spelling.' : empty}</td></tr>
            )}
            {visible.map((r) => (
              <tr key={r.key}>{r.cells.map((c, i) => (<td key={i}>{c}</td>))}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="ks-hint mt-3" aria-live="polite">
        Showing {visible.length} of {matches.length}{needle ? ' matching' : ''}.
        {matches.length > shown && (
          <> <button type="button" className="ks-link" onClick={() => setShown(shown + pageSize)}>Show more</button></>
        )}
      </p>
    </div>
  )
}
