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
  const [{ profile }, d] = await Promise.all([
    requireRole(['admin']),
    loadAdminData({ classes: true, profiles: true, teacherClasses: true, users: true }),
  ])
  const className = (id: string) => titleCase(d.classes.find((c) => c.id === id)?.name ?? '')

  return (
    <PortalFrame role={profile.role} name={profile.full_name}>
      <PageHeader
        title="Teachers and staff"
        intro="Give each person a login. Administrators can do everything. Teachers can only upload report sheets for their own classes."
      />

      <Container className="py-8 space-y-8">
        <Section id="people" title={`People with staff logins (${d.staff.length})`}>
          <div className="ks-panel overflow-x-auto">
            <table className="ks-table">
              <thead>
                <tr><th scope="col">Name</th><th scope="col">Role</th><th scope="col">Email</th><th scope="col">Sign-in</th><th scope="col"><span className="sr-only">Action</span></th></tr>
              </thead>
              <tbody>
                {d.staff.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{titleCase(p.full_name)}</strong></td>
                    <td>{p.role === 'admin' ? 'Administrator' : 'Teacher'}</td>
                    <td className="break-all">{d.emailOf(p.id)}</td>
                    <td><SignedInMark signedIn={d.signedIn(p.id)} /></td>
                    <td>
                      {!d.signedIn(p.id) && (
                        <form action={resendInvite}>
                          <input type="hidden" name="profileId" value={p.id} />
                          <button type="submit" className="ks-btn ks-btn-quiet ks-btn-small">Send email again</button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="add" title="Add a teacher or administrator" hint="They receive an email with a button to choose their own password.">
          <ActionForm action={inviteAccount} submitLabel="Add them and send a welcome email">
            <div className="grid sm:grid-cols-2 gap-5">
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
            <p className="ks-muted">Add a teacher above first. Administrators do not need a class.</p>
          ) : (
            <ActionForm action={assignTeacher} submitLabel="Give this class">
              <div className="grid sm:grid-cols-2 gap-5">
                <SelectField id="t-teacher" name="teacherId" label="Which teacher?" options={d.teachers.map((t) => ({ value: t.id, label: titleCase(t.full_name) }))} />
                <SelectField id="t-class" name="classId" label="Which class?" options={d.classes.map((c) => ({ value: c.id, label: titleCase(c.name) }))} />
              </div>
            </ActionForm>
          )}
          {d.teacherClasses.length > 0 && (
            <div className="ks-panel overflow-x-auto mt-6">
              <table className="ks-table">
                <thead><tr><th scope="col">Teacher</th><th scope="col">Class</th><th scope="col"><span className="sr-only">Action</span></th></tr></thead>
                <tbody>
                  {d.teacherClasses.map((r) => (
                    <tr key={`${r.teacher_id}-${r.class_id}`}>
                      <td><strong>{titleCase(d.teachers.find((t) => t.id === r.teacher_id)?.full_name ?? '')}</strong></td>
                      <td>{className(r.class_id)}</td>
                      <td>
                        <form action={unassignTeacher}>
                          <input type="hidden" name="teacherId" value={r.teacher_id} />
                          <input type="hidden" name="classId" value={r.class_id} />
                          <ConfirmSubmit label="Remove" message="Take this class away from this teacher?" />
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </Container>
    </PortalFrame>
  )
}
