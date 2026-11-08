import type { Metadata } from 'next'
import { requireRole } from '@/lib/auth'
import { loadAdminData } from '@/lib/admin-data'
import { titleCase } from '@/lib/format'
import PortalFrame from '@/components/portal/PortalFrame'
import ActionForm from '@/components/portal/ActionForm'
import ConfirmSubmit from '@/components/portal/ConfirmSubmit'
import { Container, Notice, PageHeader, Section, SelectField, SignedInMark, TextField } from '@/components/portal/kit'
import { assignTeacher, inviteAccount, resendInvite, unassignTeacher } from '../actions'

export const metadata: Metadata = {
  title: 'Teachers and staff',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function StaffPage() {
  const { supabase, profile } = await requireRole(['admin'])
  const d = await loadAdminData(supabase)
  const className = (id: string) => titleCase(d.classes.find((c) => c.id === id)?.name ?? '')

  return (
    <PortalFrame role={profile.role} name={profile.full_name}>
      <PageHeader
        back={{ href: '/admin', label: 'Back to the contents' }}
        kicker="Teachers and staff"
        title="Teachers and"
        accent="staff"
        intro="Give each person a login. Administrators can do everything. Teachers can only upload report sheets for their own classes."
      />

      <Container className="py-12 md:py-16 space-y-20">
        <Section id="add" title="Add a teacher or administrator" hint="They receive an email with a button to choose their own password.">
          <ActionForm action={inviteAccount} submitLabel="Add them and send a welcome email">
            <div className="grid sm:grid-cols-2 gap-6">
              <TextField id="s-name" name="fullName" label="Full name" />
              <TextField id="s-email" name="email" type="email" label="Email address" hint="Check the spelling. The welcome email goes here." />
            </div>
            <div className="max-w-xl">
              <SelectField
                id="s-role"
                name="role"
                label="What should they be able to do?"
                placeholder="Choose one…"
                options={[
                  { value: 'admin', label: 'Administrator: sees everything, uploads for any class' },
                  { value: 'teacher', label: 'Teacher: uploads for their own classes only' },
                ]}
              />
            </div>
            <Notice tone="info" lead="Please be careful.">
              An administrator can see every child and every report sheet, and can add or remove people. Choose Administrator only for people who need it.
            </Notice>
          </ActionForm>
        </Section>

        <Section id="classes" title="Give a teacher a class" hint="A teacher sees only the children in the classes you give them. You can give one teacher several classes.">
          {d.teachers.length === 0 ? (
            <p className="text-[1.2rem] text-navy/75">Add a teacher above first. Administrators do not need a class.</p>
          ) : (
            <ActionForm action={assignTeacher} submitLabel="Give this class">
              <div className="grid sm:grid-cols-2 gap-6">
                <SelectField id="t-teacher" name="teacherId" label="Which teacher?" options={d.teachers.map((t) => ({ value: t.id, label: titleCase(t.full_name) }))} />
                <SelectField id="t-class" name="classId" label="Which class?" options={d.classes.map((c) => ({ value: c.id, label: titleCase(c.name) }))} />
              </div>
            </ActionForm>
          )}
          {d.teacherClasses.length > 0 && (
            <ul className="ks-panel divide-y divide-navy/10 mt-8">
              {d.teacherClasses.map((r) => (
                <li key={`${r.teacher_id}-${r.class_id}`} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 text-[1.2rem]">
                  <span><strong>{titleCase(d.teachers.find((t) => t.id === r.teacher_id)?.full_name ?? '')}</strong> teaches {className(r.class_id)}</span>
                  <form action={unassignTeacher}>
                    <input type="hidden" name="teacherId" value={r.teacher_id} />
                    <input type="hidden" name="classId" value={r.class_id} />
                    <ConfirmSubmit label="Remove" message="Take this class away from this teacher?" />
                  </form>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section id="people" title={`People with staff logins (${d.staff.length})`}>
          <ul className="ks-panel divide-y divide-navy/10">
            {d.staff.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 p-4 sm:p-5">
                <span className="min-w-0">
                  <span className="block font-bold text-[1.25rem]">
                    {titleCase(p.full_name)}{' '}
                    <span className="font-normal text-navy/65">· {p.role === 'admin' ? 'Administrator' : 'Teacher'}</span>
                  </span>
                  <span className="block text-[1.1rem] text-navy/75 break-all">{d.emailOf(p.id)}</span>
                </span>
                <span className="flex items-center gap-4">
                  <SignedInMark signedIn={d.signedIn(p.id)} />
                  {!d.signedIn(p.id) && (
                    <form action={resendInvite}>
                      <input type="hidden" name="profileId" value={p.id} />
                      <button type="submit" className="ks-btn ks-btn-quiet ks-btn-small">Send email again</button>
                    </form>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      </Container>
    </PortalFrame>
  )
}
