'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { matchReportFiles, recordReports, sendReportNotifications } from '@/lib/actions/reports'
import { reportPath, SESSION_RE, validatePdf } from '@/lib/pdf'
import type { FileMatch } from '@/lib/types'
import { inputClass, labelClass } from './ActionForm'

interface Row {
  file: File
  match: FileMatch
  problem: string | null
  state: 'pending' | 'uploaded' | 'failed'
  note?: string
}

const STATUS_TEXT: Record<FileMatch['status'], string> = {
  ok: 'Matched',
  unknown: 'No student with this admission number (in your classes)',
  ambiguous: 'More than one student matches this name',
  duplicate: 'Another file in this batch is for the same student',
}

export default function BatchUploader({ defaultSession }: { defaultSession: string }) {
  const [session, setSession] = useState(defaultSession)
  const [term, setTerm] = useState('')
  const [notify, setNotify] = useState(true)
  const [rows, setRows] = useState<Row[]>([])
  const [busy, setBusy] = useState(false)
  const [summary, setSummary] = useState('')
  const [error, setError] = useState('')

  async function onPick(files: FileList | null) {
    setSummary('')
    setError('')
    setRows([])
    if (!files || files.length === 0) return
    if (files.length > 300) return setError('Please upload at most 300 files at a time.')
    setBusy(true)
    try {
      const list = Array.from(files)
      const matches = await matchReportFiles(list.map((f) => f.name))
      const next: Row[] = []
      for (let i = 0; i < list.length; i++) {
        next.push({ file: list[i], match: matches[i], problem: await validatePdf(list[i]), state: 'pending' })
      }
      setRows(next)
    } catch {
      setError('Could not check the files. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const ready = rows.filter((r) => r.match.status === 'ok' && !r.problem && r.state === 'pending')

  async function upload() {
    setError('')
    setSummary('')
    if (!term) return setError('Choose a term first.')
    if (!SESSION_RE.test(session)) return setError('Session must look like 2025-2026.')
    const t = Number(term)
    setBusy(true)

    const storage = createClient().storage.from('report-sheets')
    const uploaded: string[] = []
    const copy = [...rows]

    for (let i = 0; i < copy.length; i++) {
      const r = copy[i]
      if (r.match.status !== 'ok' || r.problem || r.state !== 'pending') continue
      const { error: upErr } = await storage.upload(reportPath(r.match.studentId!, session, t), r.file, {
        contentType: 'application/pdf',
        upsert: true,
      })
      if (upErr) copy[i] = { ...r, state: 'failed', note: 'Upload failed' }
      else {
        copy[i] = { ...r, state: 'uploaded' }
        uploaded.push(r.match.studentId!)
      }
      setRows([...copy])
    }

    // Record in groups of 25, then email each parent once at the end.
    const recorded: string[] = []
    for (let i = 0; i < uploaded.length; i += 25) {
      const res = await recordReports({ studentIds: uploaded.slice(i, i + 25), session, term: t })
      recorded.push(...res.recorded)
      for (const f of res.failed) {
        const at = copy.findIndex((c) => c.match.studentId === f.studentId)
        if (at >= 0) copy[at] = { ...copy[at], state: 'failed', note: f.reason }
      }
    }
    setRows([...copy])

    let mailNote = ''
    if (notify && recorded.length) {
      const n = await sendReportNotifications({ studentIds: recorded, session, term: t })
      mailNote = n.blocked
        ? ` ${n.blocked}`
        : ` ${n.emailed} parent email${n.emailed === 1 ? '' : 's'} sent${n.failed ? `, ${n.failed} failed` : ''}.`
    }
    const failedCount = copy.filter((c) => c.state === 'failed').length
    setSummary(
      `${recorded.length} report${recorded.length === 1 ? '' : 's'} saved for ${session} Term ${t}.` +
        (failedCount ? ` ${failedCount} failed.` : '') +
        mailNote
    )
    setBusy(false)
  }

  return (
    <div className="space-y-4">
      <p className="text-navy/55 text-sm leading-relaxed">
        Name each PDF with the child&apos;s admission number, for example <strong>KSPS-2025-119.pdf</strong> for
        KSPS/2025/119 (a file name can&apos;t contain a slash), then select all the files at once. Dashes, spaces
        and capital letters don&apos;t matter.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Session</label>
          <input value={session} onChange={(e) => setSession(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Term</label>
          <select value={term} onChange={(e) => setTerm(e.target.value)} className={inputClass}>
            <option value="" disabled>Choose…</option>
            <option value="1">First term</option>
            <option value="2">Second term</option>
            <option value="3">Third term</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>PDF files (max 5MB each)</label>
        <input
          type="file"
          accept="application/pdf"
          multiple
          disabled={busy}
          onChange={(e) => onPick(e.target.files)}
          className={inputClass}
        />
      </div>

      {rows.length > 0 && (
        <div className="rounded-xl border border-navy/[0.09] overflow-hidden">
          <ul className="divide-y divide-navy/[0.07] max-h-80 overflow-y-auto text-sm">
            {rows.map((r, i) => {
              const bad = r.match.status !== 'ok' || r.problem || r.state === 'failed'
              return (
                <li key={i} className="flex items-start justify-between gap-4 px-4 py-2.5">
                  <span className="text-navy break-all">{r.file.name}</span>
                  <span className={`text-right shrink-0 ${bad ? 'text-red-600' : 'text-green-700'}`}>
                    {r.state === 'uploaded'
                      ? 'Uploaded'
                      : r.state === 'failed'
                      ? r.note
                      : r.problem
                      ? r.problem
                      : r.match.status === 'ok'
                      ? `${r.match.studentName} · ${r.match.className}`
                      : STATUS_TEXT[r.match.status]}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {rows.length > 0 && (
        <p className="text-navy/55 text-sm">
          {ready.length} of {rows.length} file{rows.length === 1 ? '' : 's'} ready. Files in red will be skipped;
          rename them and select again.
        </p>
      )}

      <label className="flex items-center gap-2 text-sm text-navy/70">
        <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
        Email the parents that reports are ready
      </label>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={upload}
          disabled={busy || ready.length === 0}
          className="inline-flex items-center justify-center font-semibold tracking-wide rounded px-6 py-3 text-sm bg-wine text-white hover:bg-wine/90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy ? 'Working…' : `Upload ${ready.length || ''} report${ready.length === 1 ? '' : 's'}`}
        </button>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        {summary && <p role="status" className="text-sm text-green-700">{summary}</p>}
      </div>
    </div>
  )
}
