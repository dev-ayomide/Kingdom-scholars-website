'use client'

import { useState } from 'react'
import { parseCsv, tableToRows, type FieldSpec } from '@/lib/csv'
import type { ImportResult } from '@/lib/types'
import { inputClass, labelClass } from './ActionForm'

interface CsvImporterProps {
  fields: FieldSpec[]
  // Rows with the same value in this column are sent in the same chunk
  // (e.g. all of one parent's rows). A field name, not a function, so it can
  // be passed from a server component.
  groupKey?: string
  chunkSize?: number
  sample: string
  sampleName: string
  run: (rows: Record<string, string>[], opts: { sendInvites: boolean }) => Promise<ImportResult>
  inviteOption?: boolean
  buttonLabel: string
}

export default function CsvImporter({
  fields,
  groupKey,
  chunkSize = 20,
  sample,
  sampleName,
  run,
  inviteOption = false,
  buttonLabel,
}: CsvImporterProps) {
  const [rows, setRows] = useState<Record<string, string>[]>([])
  const [sendInvites, setSendInvites] = useState(true)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState('')

  async function onPick(file: File | null) {
    setResult(null)
    setError('')
    setRows([])
    if (!file) return
    const parsed = tableToRows(parseCsv(await file.text()), fields)
    if (parsed.missing.length) {
      return setError(`Missing column${parsed.missing.length > 1 ? 's' : ''}: ${parsed.missing.join(', ')}.`)
    }
    if (parsed.rows.length === 0) return setError('The file has no rows.')
    if (parsed.rows.length > 2000) return setError('Please import at most 2,000 rows at a time.')
    setRows(parsed.rows)
  }

  async function start() {
    setBusy(true)
    setResult(null)
    setError('')

    // Keep rows with the same group key together, then cut into chunks.
    const groupBy = groupKey ? (r: Record<string, string>) => (r[groupKey] ?? '').toLowerCase() : null
    const sorted = groupBy ? [...rows].sort((a, b) => groupBy(a).localeCompare(groupBy(b))) : rows
    const chunks: Record<string, string>[][] = []
    let current: Record<string, string>[] = []
    for (let i = 0; i < sorted.length; i++) {
      current.push(sorted[i])
      const nextSameGroup = groupBy && sorted[i + 1] && groupBy(sorted[i + 1]) === groupBy(sorted[i])
      if (current.length >= chunkSize && !nextSameGroup) {
        chunks.push(current)
        current = []
      }
    }
    if (current.length) chunks.push(current)

    const total: ImportResult = { created: 0, linked: 0, skipped: 0, emailed: 0, errors: [] }
    try {
      for (let i = 0; i < chunks.length; i++) {
        setProgress(`Working… ${Math.min((i + 1) * chunkSize, rows.length)} of ${rows.length}`)
        const r = await run(chunks[i], { sendInvites })
        total.created += r.created
        total.linked += r.linked
        total.skipped += r.skipped
        total.emailed += r.emailed
        total.errors.push(...r.errors)
      }
    } catch {
      total.errors.push('The import was interrupted. Check the results below, then run it again; people already added are skipped.')
    }
    setResult(total)
    setProgress('')
    setRows([])
    setBusy(false)
  }

  const sampleHref = `data:text/csv;charset=utf-8,${encodeURIComponent(sample)}`

  return (
    <div className="space-y-4">
      <p className="text-navy/55 text-sm">
        Columns needed: <strong>{fields.map((f) => f.label).join(', ')}</strong>. Export from Excel or Google
        Sheets as CSV.{' '}
        <a href={sampleHref} download={sampleName} className="text-wine font-semibold hover:underline underline-offset-4">
          Download an example
        </a>
      </p>
      <div>
        <label className={labelClass}>CSV file</label>
        <input
          type="file"
          accept=".csv,text/csv"
          disabled={busy}
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
          className={inputClass}
        />
      </div>
      {inviteOption && (
        <label className="flex items-center gap-2 text-sm text-navy/70">
          <input type="checkbox" checked={sendInvites} onChange={(e) => setSendInvites(e.target.checked)} />
          Email each new person an invite to set their password
        </label>
      )}
      {rows.length > 0 && <p className="text-navy/55 text-sm">{rows.length} rows read from the file.</p>}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={start}
          disabled={busy || rows.length === 0}
          className="inline-flex items-center justify-center font-semibold tracking-wide rounded px-6 py-3 text-sm bg-wine text-white hover:bg-wine/90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy ? progress || 'Working…' : buttonLabel}
        </button>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      </div>

      {result && (
        <div className="rounded-xl border border-navy/[0.09] p-4 text-sm space-y-2">
          <p className="text-green-700">
            {result.created} created
            {result.linked ? ` · ${result.linked} links saved` : ''}
            {result.skipped ? ` · ${result.skipped} already existed` : ''}
            {result.emailed ? ` · ${result.emailed} invite emails sent` : ''}
          </p>
          {result.errors.length > 0 && (
            <div>
              <p className="text-red-600 font-semibold">{result.errors.length} problem{result.errors.length === 1 ? '' : 's'}:</p>
              <ul className="list-disc pl-5 text-red-600 max-h-48 overflow-y-auto">
                {result.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
