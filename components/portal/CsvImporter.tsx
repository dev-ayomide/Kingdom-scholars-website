'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { parseCsv, tableToRows, type FieldSpec } from '@/lib/csv'
import type { ImportResult } from '@/lib/types'
import { DownloadIcon, Notice, UploadIcon } from './kit'

interface CsvImporterProps {
  fields: FieldSpec[]
  // Plain-words description of the columns, e.g. "Full name, Admission number, Class"
  columns: string
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
  fields, columns, groupKey, chunkSize = 20, sample, sampleName, run, inviteOption = false, buttonLabel,
}: CsvImporterProps) {
  const [rows, setRows] = useState<Record<string, string>[]>([])
  const [fileName, setFileName] = useState('')
  const [sendInvites, setSendInvites] = useState(false)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const [, startTransition] = useTransition()
  const input = useRef<HTMLInputElement>(null)

  async function onPick(file: File | null) {
    setResult(null)
    setError('')
    setRows([])
    setFileName('')
    if (!file) return
    setFileName(file.name)
    const parsed = tableToRows(parseCsv(await file.text()), fields)
    if (parsed.missing.length) {
      return setError(
        `This file is missing a column: ${parsed.missing.join(', ')}. Please use the example spreadsheet as a guide, and save it as "CSV".`
      )
    }
    if (parsed.rows.length === 0) return setError('The file has no rows in it.')
    if (parsed.rows.length > 2000) return setError('Please add at most 2,000 rows at a time.')
    setRows(parsed.rows)
  }

  async function start() {
    if (sendInvites) {
      const people = new Set(rows.map((r) => (groupKey ? r[groupKey] : '').toLowerCase())).size
      const ok = window.confirm(
        `This will send a welcome EMAIL to up to ${people} people (everyone in the file who does not have an account yet). An email cannot be taken back. Continue?`
      )
      if (!ok) return
    }
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
      total.errors.push('This was interrupted part-way. Check the numbers above, then try again. People already added are skipped, so nothing is added twice.')
    }
    setResult(total)
    setProgress('')
    setRows([])
    setFileName('')
    if (input.current) input.current.value = ''
    setBusy(false)
    startTransition(() => router.refresh())
  }

  const sampleHref = `data:text/csv;charset=utf-8,${encodeURIComponent(sample)}`

  return (
    <div className="space-y-8">
      <ol className="space-y-5 text-[1.2rem]">
        <li className="flex gap-4">
          <span className="font-display font-bold italic text-wine text-3xl leading-none w-6 shrink-0">1</span>
          <div>
            <p>Fill in a spreadsheet with these columns: <strong>{columns}</strong>.</p>
            <a href={sampleHref} download={sampleName} className="ks-btn ks-btn-quiet ks-btn-small mt-3">
              <DownloadIcon className="w-5 h-5" /> Download an example
            </a>
            <p className="ks-hint mt-3">
              In Excel: File, then Save As, then choose &ldquo;CSV&rdquo;. In Google Sheets: File, Download, Comma-separated values.
            </p>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="font-display font-bold italic text-wine text-3xl leading-none w-6 shrink-0">2</span>
          <div className="flex-1">
            <p>Choose your saved file.</p>
            <input
              ref={input}
              id={`csv-${sampleName}`}
              type="file"
              accept=".csv,text/csv"
              disabled={busy}
              onChange={(e) => onPick(e.target.files?.[0] ?? null)}
              className="sr-only"
            />
            <label htmlFor={`csv-${sampleName}`} className="ks-btn ks-btn-quiet mt-3 cursor-pointer">
              <UploadIcon className="w-6 h-6" /> {fileName ? 'Choose a different file' : 'Choose the file'}
            </label>
            {fileName && <p className="mt-3 text-[1.15rem]">Chosen: <strong className="break-all">{fileName}</strong></p>}
          </div>
        </li>
        <li className="flex gap-4">
          <span className="font-display font-bold italic text-wine text-3xl leading-none w-6 shrink-0">3</span>
          <div className="flex-1 space-y-4">
            {rows.length > 0 ? (
              <Notice tone="info" lead={`${rows.length} row${rows.length === 1 ? '' : 's'} found.`}>
                Nothing has been added yet. Press the button below when you are ready.
              </Notice>
            ) : (
              <p className="text-navy/70">Press the button once you have chosen a file.</p>
            )}
            {inviteOption && (
              <label className="flex items-start gap-3 text-[1.15rem] cursor-pointer">
                <input type="checkbox" className="ks-check mt-0.5" checked={sendInvites} onChange={(e) => setSendInvites(e.target.checked)} />
                <span>
                  Also send each new person a welcome email now.
                  <span className="block ks-hint">Leave this empty to add people quietly. You can send the emails later from the Parents page.</span>
                </span>
              </label>
            )}
            <button type="button" onClick={start} disabled={busy || rows.length === 0} className="ks-btn ks-btn-primary w-full sm:w-auto">
              {busy ? progress || 'Working…' : buttonLabel}
            </button>
          </div>
        </li>
      </ol>

      <div aria-live="polite" className="space-y-4">
        {error && <Notice tone="bad">{error}</Notice>}
        {result && (
          <>
            <Notice tone={result.errors.length ? 'warn' : 'ok'} lead={result.errors.length ? 'Finished, with some things to check.' : 'Finished.'}>
              {result.created} added
              {result.linked ? ` · ${result.linked} connected to a child` : ''}
              {result.skipped ? ` · ${result.skipped} already there` : ''}
              {result.emailed ? ` · ${result.emailed} welcome emails sent` : ''}
            </Notice>
            {result.errors.length > 0 && (
              <div className="ks-panel p-5">
                <p className="font-bold mb-2">
                  {result.errors.length} row{result.errors.length === 1 ? '' : 's'} could not be used:
                </p>
                <ul className="list-disc pl-6 space-y-1 max-h-72 overflow-y-auto text-[1.1rem]">
                  {result.errors.map((e, i) => (<li key={i}>{e}</li>))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
