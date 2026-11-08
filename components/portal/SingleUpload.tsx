'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { recordReports, sendReportNotifications } from '@/lib/actions/reports'
import { reportPath, validatePdf } from '@/lib/pdf'
import { sessionLabel, termName } from '@/lib/format'
import { Notice } from './kit'

const PROBLEM: Record<string, string> = {
  'Larger than 5MB': 'That file is too big (over 5MB).',
  'Not a PDF': 'That is not a PDF file.',
  'File is empty': 'That file is empty.',
}

// Upload (or replace) one child's report sheet.
export default function SingleUpload({
  studentId, sessions, defaultSession,
}: { studentId: string; sessions: string[]; defaultSession: string }) {
  const [session, setSession] = useState(defaultSession)
  const [term, setTerm] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [notify, setNotify] = useState(true)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({})
  const router = useRouter()
  const [, startTransition] = useTransition()

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMsg({})
    if (!term) return setMsg({ error: 'Please choose the term.' })
    if (!file) return setMsg({ error: 'Please choose the PDF file.' })
    const problem = await validatePdf(file)
    if (problem) return setMsg({ error: PROBLEM[problem] ?? problem })

    setBusy(true)
    try {
      const t = Number(term)
      const { error } = await createClient()
        .storage.from('report-sheets')
        .upload(reportPath(studentId, session, t), file, { contentType: 'application/pdf', upsert: true })
      if (error) throw new Error('The file did not upload. You may not be allowed to add reports for this child.')

      const rec = await recordReports({ studentIds: [studentId], session, term: t })
      if (rec.failed.length) throw new Error('The file uploaded but could not be saved. Please try again.')

      // Show "Saved" straight away; the emails can take a few seconds.
      const saved = `Saved: ${termName(t)}, ${sessionLabel(session)}.`
      setMsg({ ok: notify ? `${saved} Emailing the parents…` : saved })
      setFile(null)
      ;(e.target as HTMLFormElement).reset()
      startTransition(() => router.refresh())
      if (notify) {
        const n = await sendReportNotifications({ studentIds: [studentId], session, term: t })
        const note = n.blocked ? ` ${n.blocked}` : n.emailed ? ` ${n.emailed} parent${n.emailed === 1 ? ' was' : 's were'} emailed.` : ' No parent email was sent.'
        setMsg({ ok: `${saved}${note}` })
      }
    } catch (err) {
      setMsg({ error: err instanceof Error ? err.message : 'Something went wrong. Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  const id = `su-${studentId}`
  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor={`${id}-s`} className="ks-label">School year</label>
          <select id={`${id}-s`} value={session} onChange={(e) => setSession(e.target.value)} className="ks-input">
            {sessions.map((s) => (<option key={s} value={s}>{sessionLabel(s)}</option>))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-t`} className="ks-label">Term</label>
          <select id={`${id}-t`} value={term} onChange={(e) => setTerm(e.target.value)} className="ks-input">
            <option value="" disabled>Choose the term…</option>
            <option value="1">First term</option>
            <option value="2">Second term</option>
            <option value="3">Third term</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-f`} className="ks-label">The PDF file</label>
        <input id={`${id}-f`} type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="ks-input !py-3" />
        <p className="ks-hint mt-2">Choosing a file for a term that already has one will replace it.</p>
      </div>
      <label className="flex items-start gap-3 text-[1.0625rem] cursor-pointer">
        <input type="checkbox" className="ks-check mt-0.5" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
        <span>Send the parents an email to say it is ready</span>
      </label>
      <button type="submit" disabled={busy} className="ks-btn ks-btn-primary w-full sm:w-auto">{busy ? 'Uploading…' : 'Upload this report sheet'}</button>
      <div aria-live="polite">
        {msg.error && <Notice tone="bad">{msg.error}</Notice>}
        {msg.ok && <Notice tone="ok">{msg.ok}</Notice>}
      </div>
    </form>
  )
}
