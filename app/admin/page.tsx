import type { Metadata } from 'next'
import Link from 'next/link'
import { requireRole } from '@/lib/auth'
import { listAuthUsers } from '@/lib/accounts'
import PortalShell from '@/components/portal/PortalShell'
import ActionForm, { inputClass, labelClass } from '@/components/portal/ActionForm'
import CsvImporter from '@/components/portal/CsvImporter'
import {
  createClass,
  createStudent,
  moveStudent,
  inviteAccount,
  resendInvite,
  assignTeacher,
  unassignTeacher,
  linkParent,
  unlinkParent,
  importStudentRows,
  importParentRows,
} from './actions'
import type { Profile, SchoolClass, Student } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const STUDENT_FIELDS = [
  { key: 'full_name', label: 'full_name', aliases: ['name', 'student_name', 'student'] },
  { key: 'admission_no', label: 'admission_no', aliases: ['admission_number', 'admission', 'adm_no'] },
  { key: 'class', label: 'class', aliases: ['class_name'] },
]

const PARENT_FIELDS = [
  { key: 'parent_name', label: 'parent_name', aliases: ['name', 'guardian_name', 'parent'] },
  { key: 'parent_email', label: 'parent_email', aliases: ['email', 'guardian_email'] },
  { key: 'admission_no', label: 'admission_no', aliases: ['admission_number', 'admission', 'child_admission_no', 'child_admission_number', 'childs_admission_number'] },
]

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-navy/[0.09] p-6 md:p-8">
      <h2 className="font-display font-bold text-navy text-xl tracking-tight mb-5">{title}</h2>
      {children}
    </div>
  )
}

function Sub({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-navy/50 font-semibold text-[11px] tracking-[0.18em] uppercase mt-8 mb-3">
      {children}
    </h3>
  )
}

function Select({
  name,
  label,
  options,
}: {
  name: string
  label: string
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <select name={name} required defaultValue="" className={inputClass}>
        <option value="" disabled>Choose…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

export default async function AdminPage() {
  const { supabase, profile } = await requireRole(['admin'])

  const [classes, students, people, teacherClasses, parentStudents, authUsers] = await Promise.all([
    supabase.from('classes').select('id, name').order('name'),
    supabase.from('students').select('id, full_name, admission_no, class_id').order('full_name'),
    supabase.from('profiles').select('id, role, full_name').order('full_name'),
    supabase.from('teacher_classes').select('teacher_id, class_id'),
    supabase.from('parent_students').select('parent_id, student_id'),
    listAuthUsers(),
  ])

  const cls = (classes.data ?? []) as SchoolClass[]
  const stu = (students.data ?? []) as Student[]
  const profiles = (people.data ?? []) as Profile[]
  const teachers = profiles.filter((p) => p.role === 'teacher')
  const staff = profiles.filter((p) => p.role === 'teacher' || p.role === 'admin')
  const parents = profiles.filter((p) => p.role === 'parent')
  const tc = (teacherClasses.data ?? []) as { teacher_id: string; class_id: string }[]
  const ps = (parentStudents.data ?? []) as { parent_id: string; student_id: string }[]

  const userById = new Map(authUsers.map((u) => [u.id, u]))
  const className = (id: string) => cls.find((c) => c.id === id)?.name ?? '?'
  const classOptions = cls.map((c) => ({ value: c.id, label: c.name }))
  const studentOptions = stu.map((s) => ({
    value: s.id,
    label: `${s.full_name} (${className(s.class_id)})`,
  }))

  const accountRows = (list: Profile[]) =>
    list.map((p) => {
      const u = userById.get(p.id)
      const active = !!u?.lastSignIn
      return (
        <li key={p.id} className="flex items-center justify-between gap-3 py-2 text-sm">
          <span className="text-navy min-w-0">
            {p.full_name}
            {p.role === 'admin' && (
              <span className="ml-2 text-[10px] font-semibold tracking-wider uppercase text-wine">Admin</span>
            )}
            <span className="text-navy/40 ml-2 break-all">{u?.email}</span>
          </span>
          <span className="flex items-center gap-4 shrink-0">
            <span className={active ? 'text-green-700' : 'text-amber-600'}>
              {active ? 'Active' : 'Invite pending'}
            </span>
            {!active && (
              <form action={resendInvite}>
                <input type="hidden" name="profileId" value={p.id} />
                <button type="submit" className="text-wine font-semibold hover:underline underline-offset-4">
                  Resend invite
                </button>
              </form>
            )}
          </span>
        </li>
      )
    })

  return (
    <PortalShell label="School Admin" title="Manage Portal" userName={profile.full_name}>
      <p className="text-navy/55 text-sm">
        Set up in this order: classes → students → teacher &amp; parent accounts → assignments.
        Teachers and admins upload reports from the{' '}
        <Link href="/teacher" className="text-wine font-semibold hover:underline underline-offset-4">
          upload page
        </Link>
        , one at a time or many at once, for any class.
      </p>

      <Card title="1. Classes">
        <ActionForm action={createClass} submitLabel="Add class">
          <div>
            <label className={labelClass}>Class name</label>
            <input name="name" placeholder="e.g. Primary 3" required className={inputClass} />
          </div>
        </ActionForm>
        <p className="text-navy/50 text-sm mt-5">{cls.map((c) => c.name).join(' · ') || 'None yet.'}</p>
      </Card>

      <Card title="2. Students">
        <Sub>Import many from a spreadsheet</Sub>
        <CsvImporter
          fields={STUDENT_FIELDS}
          chunkSize={100}
          run={importStudentRows}
          buttonLabel="Import students"
          sampleName="students-example.csv"
          sample={'full_name,admission_no,class\nTolu Adeyemi,KSPS-001,Primary 3\nKemi Eze,KSPS-002,Primary 5\n'}
        />

        <Sub>Or add one</Sub>
        <ActionForm action={createStudent} submitLabel="Add student">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Full name</label>
              <input name="fullName" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Admission no.</label>
              <input name="admissionNo" required className={inputClass} />
            </div>
            <Select name="classId" label="Class" options={classOptions} />
          </div>
        </ActionForm>

        <Sub>Promote / move a student</Sub>
        <ActionForm action={moveStudent} submitLabel="Move">
          <div className="grid sm:grid-cols-2 gap-4">
            <Select name="studentId" label="Student" options={studentOptions} />
            <Select name="classId" label="New class" options={classOptions} />
          </div>
        </ActionForm>
        <p className="text-navy/50 text-sm mt-5">{stu.length} student{stu.length === 1 ? '' : 's'}</p>
      </Card>

      <Card title="3. Staff (admins & teachers)">
        <ActionForm action={inviteAccount} submitLabel="Create & email invite">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full name</label>
              <input name="fullName" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input name="email" type="email" required className={inputClass} />
            </div>
            <Select
              name="role"
              label="Role"
              options={[
                { value: 'admin', label: 'Admin (manages everything, uploads for any class)' },
                { value: 'teacher', label: 'Teacher (uploads for assigned classes only)' },
              ]}
            />
          </div>
        </ActionForm>
        <p className="text-navy/50 text-sm mt-4">
          They get an email with a link to choose their own password. Admins can see every child and every
          report, so give this role only to people who need it.
        </p>
        {staff.length > 0 && <ul className="mt-4 divide-y divide-navy/[0.07]">{accountRows(staff)}</ul>}
      </Card>

      <Card title="4. Assign teachers to classes">
        <ActionForm action={assignTeacher} submitLabel="Assign">
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              name="teacherId"
              label="Teacher"
              options={teachers.map((t) => ({ value: t.id, label: t.full_name }))}
            />
            <Select name="classId" label="Class" options={classOptions} />
          </div>
        </ActionForm>
        <ul className="mt-5 divide-y divide-navy/[0.07]">
          {tc.map((r) => (
            <li key={`${r.teacher_id}-${r.class_id}`} className="flex items-center justify-between py-2 text-sm">
              <span className="text-navy">
                {teachers.find((t) => t.id === r.teacher_id)?.full_name} → {className(r.class_id)}
              </span>
              <form action={unassignTeacher}>
                <input type="hidden" name="teacherId" value={r.teacher_id} />
                <input type="hidden" name="classId" value={r.class_id} />
                <button type="submit" className="text-navy/40 hover:text-red-600">Remove</button>
              </form>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="5. Parents">
        <Sub>Import parents and link them to their children</Sub>
        <p className="text-navy/55 text-sm mb-4">
          One row per parent-and-child pair. A parent with two children has two rows with the same email. Each
          new parent gets an account and an invite email; existing parents are just linked to the extra child.
        </p>
        <CsvImporter
          fields={PARENT_FIELDS}
          groupKey="parent_email"
          chunkSize={15}
          run={importParentRows}
          inviteOption
          buttonLabel="Import parents"
          sampleName="parents-example.csv"
          sample={'parent_name,parent_email,admission_no\nBola Adeyemi,bola@example.com,KSPS-001\nBola Adeyemi,bola@example.com,KSPS-014\nChuka Eze,chuka@example.com,KSPS-002\n'}
        />

        <Sub>Or add one parent</Sub>
        <ActionForm action={inviteAccount} submitLabel="Create & email invite">
          <input type="hidden" name="role" value="parent" />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full name</label>
              <input name="fullName" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input name="email" type="email" required className={inputClass} />
            </div>
          </div>
        </ActionForm>

        <Sub>Link a parent to a child</Sub>
        <ActionForm action={linkParent} submitLabel="Link">
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              name="parentId"
              label="Parent"
              options={parents.map((p) => ({ value: p.id, label: p.full_name }))}
            />
            <Select name="studentId" label="Child" options={studentOptions} />
          </div>
        </ActionForm>

        <details className="mt-6">
          <summary className="cursor-pointer text-navy/60 text-sm font-semibold">
            {parents.length} parent account{parents.length === 1 ? '' : 's'} ·{' '}
            {parents.filter((p) => userById.get(p.id)?.lastSignIn).length} signed in
          </summary>
          <ul className="mt-3 divide-y divide-navy/[0.07]">{accountRows(parents)}</ul>
        </details>

        <details className="mt-4">
          <summary className="cursor-pointer text-navy/60 text-sm font-semibold">
            {ps.length} parent–child link{ps.length === 1 ? '' : 's'}
          </summary>
          <ul className="mt-3 divide-y divide-navy/[0.07]">
            {ps.map((r) => (
              <li key={`${r.parent_id}-${r.student_id}`} className="flex items-center justify-between py-2 text-sm">
                <span className="text-navy">
                  {parents.find((p) => p.id === r.parent_id)?.full_name} →{' '}
                  {stu.find((s) => s.id === r.student_id)?.full_name}
                </span>
                <form action={unlinkParent}>
                  <input type="hidden" name="parentId" value={r.parent_id} />
                  <input type="hidden" name="studentId" value={r.student_id} />
                  <button type="submit" className="text-navy/40 hover:text-red-600">Remove</button>
                </form>
              </li>
            ))}
          </ul>
        </details>
      </Card>
    </PortalShell>
  )
}
