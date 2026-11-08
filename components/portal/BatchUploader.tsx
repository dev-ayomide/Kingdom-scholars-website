'use client'

import { useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { matchReportFiles, recordReports, sendReportNotifications } from '@/lib/actions/reports'
import { reportPath, SESSION_RE, validatePdf } from '@/lib/pdf'
import { sessionLabel, termName, titleCase } from '@/lib/format'
import type { FileMatch } from '@/lib/types'
import { AlertIcon, CheckIcon, Notice, Step, UploadIcon } from './kit'

interface Row {
  file: File
  match: FileMatch
  problem: string | null
  state: 'pending' | 'uploaded' | 'failed'
  note?: string
}

// Plain-words reasons, so nobody has to guess what went wrong.
const WHY: Record<FileMatch['status'], string> = {
  ok: '',
  unknown: 'We cannot find a child with this admission number. Rename the file and choose it again.',
  ambiguous: 'More than one child matches this file name. Please ask the school office.',
  duplicate: 'Another file in this list is for the same child.',
}
const PROBLEM: Record<string, string> = {
  'Larger than 5MB': 'This file is too big (over 5MB).',
  'Not a PDF': 'This is not a PDF file.',
  'File is empty': 'This file is empty.',
}

export default function BatchUploader({ sessions, defaultSession }: { sessions: string[]; defaultSession: string }) {
  const [session, setSession] = useState(defaultSession)
  const [term, setTerm] = useState('')
  const [notify, setNotify] = useState(true)
  const [rows, setRows] = useState<Row[]>([])
  const [busy, setBusy] = useState(false)
  const [checking, setChecking] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [summary, setSummary] = useState<{ tone: 'ok' | 'warn' | 'bad'; text: string } | null>(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const picker = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [, startTransition] = useTransition()

  async function onPick(files: FileList | File[] | null) {
    setSummary(null)
    setError('')
    setRows([])
    const list = files ? Array.from(files) : []
    if (list.length === 0) return
    if (list.length > 300) return setError('Please choose at most 300 files at a time.')
    setChecking(true)
    try {
      const matches = await matchReportFiles(list.map((f) => f.name))
      const next: Row[] = []
      for (let i = 0; i < list.length; i++) {
        next.push({ file: list[i], match: matches[i], problem: await validatePdf(list[i]), state: 'pending' })
      }
      setRows(next)
    } catch {
      setError('We could not check the files. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  const usable = (r: Row) => r.match.status === 'ok' && !r.problem
  const ready = rows.filter((r) => usable(r) && r.state === 'pending')
  const termChosen = term !== ''

  function reset() {
    setRows([])
    setSummary(null)
    setError('')
    if (picker.current) picker.current.value = ''
  }

  async function upload() {
    setError('')
    setSummary(null)
    if (!termChosen) return setError('Please choose the term first (step 1).')
    if (!SESSION_RE.test(session)) return setError('Please choose the year first (step 1).')
    const t = Number(term)
    setBusy(true)
    setProgress({ done: 0, total: ready.length })

    const storage = createClient().storage.from('report-sheets')
    const uploaded: string[] = []
    const copy = [...rows]
    let done = 0

    for (let i = 0; i < copy.length; i++) {
      const r = copy[i]
      if (!usable(r) || r.state !== 'pending') continue
      const { error: upErr } = await storage.upload(reportPath(r.match.studentId!, session, t), r.file, {
        contentType: 'application/pdf',
        upsert: true,
      })
      if (upErr) copy[i] = { ...r, state: 'failed', note: 'This file did not upload. Please try it again.' }
      else {
        copy[i] = { ...r, state: 'uploaded' }
        uploaded.push(r.match.studentId!)
      }
      done++
      setProgress({ done, total: ready.length })
      setRows([...copy])
    }

    // Record in groups of 25, then email each parent once at the end.
    const recorded: string[] = []
    for (let i = 0; i < uploaded.length; i += 25) {
      const res = await recordReports({ studentIds: uploaded.slice(i, i + 25), session, term: t })
      recorded.push(...res.recorded)
      for (const f of res.failed) {
        const at = copy.findIndex((c) => c.match.studentId === f.studentId)
        if (at >= 0) copy[at] = { ...copy[at], state: 'failed', note: 'This file uploaded but could not be saved. Please try it again.' }
      }
    }
    setRows([...copy])

    let mailNote = ''
    if (notify && recorded.length) {
      const n = await sendReportNotifications({ studentIds: recorded, session, term: t })
      mailNote = n.blocked
        ? ` ${n.blocked}`
        : ` ${n.emailed} parent${n.emailed === 1 ? ' was' : 's were'} emailed${n.failed ? `, and ${n.failed} email${n.failed === 1 ? '' : 's'} could not be sent` : ''}.`
    }
    const failedCount = copy.filter((c) => c.state === 'failed').length
    setSummary({
      tone: failedCount ? 'warn' : 'ok',
      text:
        `${recorded.length} report sheet${recorded.length === 1 ? '' : 's'} saved for ${termName(t)}, ${sessionLabel(session)}.` +
        (failedCount ? ` ${failedCount} did not work: see the list below.` : '') +
        mailNote,
    })
    setBusy(false)
    startTransition(() => router.refresh())
  }

  return (
    <div>
      {/* ---------------------------------------------------------- step 1 */}
      <Step n={1} title="Which term are these report sheets for?" done={termChosen}>
        <div className="grid sm:grid-cols-2 gap-5 max-w-xl">
          <div>
            <label htmlFor="b-session" className="ks-label">School year</label>
            <select id="b-session" value={session} onChange={(e) => setSession(e.target.value)} className="ks-input" disabled={busy}>
              {sessions.map((s) => (<option key={s} value={s}>{sessionLabel(s)}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="b-term" className="ks-label">Term</label>
            <select id="b-term" value={term} onChange={(e) => setTerm(e.target.value)} className="ks-input" disabled={busy}>
              <option value="" disabled>Choose the term…</option>
              <option value="1">First term</option>
              <option value="2">Second term</option>
              <option value="3">Third term</option>
            </select>
          </div>
        </div>
      </Step>

      {/* ---------------------------------------------------------- step 2 */}
      <Step
        n={2}
        title="Choose the report sheets"
        done={rows.length > 0}
        hint={
          <>
            Each file must be a PDF, named with the child&apos;s admission number, for example{' '}
            <strong>KSPS-2025-XXX.pdf</strong>. You can choose many files at once.{' '}
            <Link href="/help#naming" className="ks-link">How do I name the files?</Link>
          </>
        }
      >
        <input
          ref={picker}
          id="b-files"
          type="file"
          accept="application/pdf"
          multiple
          disabled={busy || !termChosen}
          onChange={(e) => onPick(e.target.files)}
          className="sr-only"
        />
        <label
          htmlFor="b-files"
          onDragOver={(e) => { e.preventDefault(); if (termChosen && !busy) setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); if (termChosen && !busy) onPick(e.dataTransfer.files) }}
          aria-disabled={!termChosen || busy}
          className={`block text-center px-6 py-10 rounded-lg border-2 border-dashed transition-colors ${
            !termChosen || busy
              ? 'border-navy/25 bg-navy/[0.03] cursor-not-allowed text-navy/50'
              : dragging
              ? 'border-wine bg-wine/10 cursor-pointer'
              : 'border-navy/50 bg-white hover:border-wine hover:bg-wine/[0.04] cursor-pointer'
          }`}
        >
          <UploadIcon className="w-10 h-10 mx-auto mb-3 text-wine" />
          <span className="block text-[1.4rem] font-bold">
            {termChosen ? 'Choose the files from this computer' : 'Choose the term first (step 1)'}
          </span>
          {termChosen && <span className="block ks-hint mt-1">or drag the files and drop them here</span>}
        </label>
        {checking && <p className="mt-4 text-[1.2rem]" role="status">Checking your files…</p>}
        {error && <div className="mt-4"><Notice tone="bad">{error}</Notice></div>}
      </Step>

      {/* ---------------------------------------------------------- step 3 */}
      <Step n={3} title="Check the list, then upload" last done={!!summary && summary.tone === 'ok'}>
        {rows.length === 0 ? (
          <p className="text-navy/65 text-[1.2rem]">Your files will appear here so you can check them before anything is uploaded.</p>
        ) : (
          <div className="space-y-6">
            <Notice
              tone={ready.length === rows.length || summary ? 'info' : 'warn'}
              lead={`${rows.filter(usable).length} of ${rows.length} file${rows.length === 1 ? ' is' : 's are'} ready.`}
            >
              {rows.filter((r) => !usable(r)).length > 0
                ? 'Files marked in red will be left out. Rename them and choose them again.'
                : 'Everything looks right.'}
            </Notice>

            <ul className="ks-panel divide-y divide-navy/15 overflow-hidden">
              {rows.map((r, i) => {
                const good = usable(r) && r.state !== 'failed'
                const why = r.state === 'failed' ? r.note : r.problem ? PROBLEM[r.problem] ?? r.problem : WHY[r.match.status]
                return (
                  <li key={i} className="flex gap-4 p-4 sm:p-5">
                    <span className={`mt-1 shrink-0 ${good ? 'text-[#2B7A4B]' : 'text-[#A32A2A]'}`}>
                      {good ? <CheckIcon className="w-7 h-7" /> : <AlertIcon className="w-7 h-7" />}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold break-all">{r.file.name}</p>
                      {good ? (
                        <p className="text-[1.15rem]">
                          {r.state === 'uploaded' ? 'Uploaded for ' : 'For '}
                          <strong>{titleCase(r.match.studentName ?? '')}</strong>
                          {r.match.className ? `, ${titleCase(r.match.className)}` : ''}
                        </p>
                      ) : (
                        <p className="text-[1.15rem] text-[#7A1B1B]">{why}</p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>

            {!summary && (
              <div className="space-y-5">
                <label className="flex items-start gap-3 text-[1.2rem] cursor-pointer">
                  <input type="checkbox" className="ks-check mt-0.5" checked={notify} onChange={(e) => setNotify(e.target.checked)} disabled={busy} />
                  <span>
                    Send each parent an email to say the report sheet is ready.
                    <span className="block ks-hint">The email does not contain the report. It only asks them to sign in.</span>
                  </span>
                </label>
                <button type="button" onClick={upload} disabled={busy || ready.length === 0 || !termChosen} className="ks-btn ks-btn-primary w-full sm:w-auto">
                  {busy ? 'Uploading…' : `Upload ${ready.length} report sheet${ready.length === 1 ? '' : 's'}`}
                </button>
                {!termChosen && <p className="text-[#7A1B1B] font-bold">Please go back to step 1 and choose the term.</p>}
              </div>
            )}

            {busy && (
              <div role="progressbar" aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.done} aria-label="Upload progress">
                <p className="mb-2 font-bold">Uploading {progress.done} of {progress.total}…</p>
                <div className="h-4 rounded-full bg-navy/15 overflow-hidden">
                  <div className="h-full bg-wine transition-all" style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }} />
                </div>
                <p className="ks-hint mt-2">Please keep this page open until it finishes.</p>
              </div>
            )}

            {summary && (
              <div className="space-y-4" aria-live="polite">
                <Notice tone={summary.tone}>{summary.text}</Notice>
                <button type="button" onClick={reset} className="ks-btn ks-btn-quiet">Upload more report sheets</button>
              </div>
            )}
          </div>
        )}
      </Step>
    </div>
  )
}
