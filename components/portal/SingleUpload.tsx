'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { recordReports, sendReportNotifications } from '@/lib/actions/reports'
import { reportPath, validatePdf } from '@/lib/pdf'
import { inputClass, labelClass } from './ActionForm'

export default function SingleUpload({ studentId, defaultSession }: { studentId: string; defaultSession: string }) {
  const [session, setSession] = useState(defaultSession)
  const [term, setTerm] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [notify, setNotify] = useState(true)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({})

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMsg({})
    if (!file || !term) return setMsg({ error: 'Choose a term and a PDF.' })
    if (!/^[0-9]{4}-[0-9]{4}$/.test(session)) return setMsg({ error: 'Session must look like 2025-2026.' })
    const problem = await validatePdf(file)
    if (problem) return setMsg({ error: problem + '.' })

    setBusy(true)
    try {
      const t = Number(term)
      const { error } = await createClient()
        .storage.from('report-sheets')
        .upload(reportPath(studentId, session, t), file, { contentType: 'application/pdf', upsert: true })
      if (error) throw new Error('Upload failed. You may not have access to this student.')

      const rec = await recordReports({ studentIds: [studentId], session, term: t })
      if (rec.failed.length) throw new Error(rec.failed[0].reason)

      let note = ''
      if (notify) {
        const n = await sendReportNotifications({ studentIds: [studentId], session, term: t })
        note = n.blocked ? ` ${n.blocked}` : n.emailed ? ` ${n.emailed} parent${n.emailed === 1 ? '' : 's'} emailed.` : ' No parent email sent.'
      }
      setMsg({ ok: `Uploaded ${session} Term ${t}.${note}` })
      setFile(null)
      ;(e.target as HTMLFormElement).reset()
    } catch (err) {
      setMsg({ error: err instanceof Error ? err.message : 'Something went wrong.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Session</label>
          <input value={session} onChange={(e) => setSession(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Term</label>
          <select value={term} onChange={(e) => setTerm(e.target.value)} required className={inputClass}>
            <option value="" disabled>Choose…</option>
            <option value="1">First term</option>
            <option value="2">Second term</option>
            <option value="3">Third term</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>PDF (max 5MB). Uploading again replaces the existing one.</label>
        <input type="file" accept="application/pdf" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} className={inputClass} />
      </div>
      <label className="flex items-center gap-2 text-sm text-navy/70">
        <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
        Email the parents that a report is ready
      </label>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center font-semibold tracking-wide rounded px-6 py-3 text-sm bg-wine text-white hover:bg-wine/90 disabled:opacity-60"
        >
          {busy ? 'Uploading…' : 'Upload report'}
        </button>
        {msg.error && <p role="alert" className="text-sm text-red-600">{msg.error}</p>}
        {msg.ok && <p role="status" className="text-sm text-green-700">{msg.ok}</p>}
      </div>
    </form>
  )
}
