import type { Metadata } from 'next'
import { requireRole } from '@/lib/auth'
import { loadAdminData } from '@/lib/admin-data'
import { titleCase } from '@/lib/format'
import { isLocalSite, siteUrl } from '@/lib/email'
import PortalFrame from '@/components/portal/PortalFrame'
import ActionForm from '@/components/portal/ActionForm'
import CsvImporter from '@/components/portal/CsvImporter'
import ConfirmSubmit from '@/components/portal/ConfirmSubmit'
import FilterTable from '@/components/portal/FilterTable'
import { Container, Notice, PageHeader, Section, SelectField, SignedInMark, TextField } from '@/components/portal/kit'
import { importParentRows, inviteAccount, linkParent, resendAllPending, resendInvite, unlinkParent, updateAccount } from '../actions'

export const metadata: Metadata = {
  title: 'Parents',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const PARENT_FIELDS = [
  { key: 'parent_name', label: 'parent_name', aliases: ['name', 'guardian_name', 'parent'] },
  { key: 'parent_email', label: 'parent_email', aliases: ['email', 'guardian_email'] },
  { key: 'admission_no', label: 'admission_no', aliases: ['admission_number', 'admission', 'child_admission_no', 'child_admission_number', 'childs_admission_number'] },
]

export default async function ParentsPage() {
  const [{ profile }, d] = await Promise.all([
    requireRole(['admin']),
    loadAdminData({ classes: true, students: true, profiles: true, parentStudents: true, users: true }),
  ])

  const waiting = d.profiles.filter((p) => !d.signedIn(p.id))
  const className = (id: string) => titleCase(d.classes.find((c) => c.id === id)?.name ?? '')
  const studentOptions = d.students.map((s) => ({ value: s.id, label: `${titleCase(s.full_name)} (${className(s.class_id)})` }))
  const roleWord = (r: string) => (r === 'parent' ? 'Parent' : r === 'teacher' ? 'Teacher' : 'Administrator')

  return (
    <PortalFrame role={profile.role} name={profile.full_name}>
      <PageHeader
        title="Parents"
        intro="Add each parent, connect them to their children, then send them a welcome email so they can choose a password and sign in."
      />

      <Container className="py-8 space-y-8">
        <Section id="list" title={`Parents and their children (${d.parents.length})`} hint="Type in the box to find a parent by name, email or child.">
          <FilterTable
            label="Search for a parent"
            columns={['Parent', 'Email', 'Children', 'Sign-in']}
            rows={d.parents.map((p) => {
              const kids = d.parentStudents.filter((l) => l.parent_id === p.id)
              const names = kids.map((l) => d.students.find((x) => x.id === l.student_id)?.full_name ?? '')
              return {
                key: p.id,
                search: `${p.full_name} ${d.emailOf(p.id)} ${names.join(' ')}`.toLowerCase(),
                cells: [
                  <strong key="n">{titleCase(p.full_name)}</strong>,
                  <span key="e" className="break-all">{d.emailOf(p.id)}</span>,
                  <ul key="k" className="space-y-2">
                    {kids.length === 0 && <li className="text-[#6B4A00] font-semibold">Not connected to a child yet</li>}
                    {kids.map((l) => {
                      const s = d.students.find((x) => x.id === l.student_id)
                      return (
                        <li key={l.student_id} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>{s ? `${titleCase(s.full_name)} (${className(s.class_id)})` : 'Unknown child'}</span>
                          <form action={unlinkParent}>
                            <input type="hidden" name="parentId" value={p.id} />
                            <input type="hidden" name="studentId" value={l.student_id} />
                            <ConfirmSubmit
                              label="Disconnect"
                              message={`Disconnect ${titleCase(p.full_name)} from ${titleCase(s?.full_name ?? 'this child')}? They will no longer see this child's report sheets.`}
                            />
                          </form>
                        </li>
                      )
                    })}
                  </ul>,
                  <SignedInMark key="s" signedIn={d.signedIn(p.id)} />,
                ],
              }
            })}
            empty="No parents have been added yet."
          />
        </Section>

        <Section
          id="welcome"
          title="Welcome emails"
          hint="The welcome email has a button that lets a person choose their own password. Each person only needs it once."
        >
          {waiting.length === 0 ? (
            <Notice tone="ok" lead="Everyone has signed in.">Nobody needs a welcome email.</Notice>
          ) : (
            <div className="space-y-6">
              {isLocalSite() ? (
                <Notice tone="bad" lead="Do not send yet.">
                  The website address in the settings is still a test address ({siteUrl()}), so the buttons in the emails would not work for parents.
                </Notice>
              ) : (
                <Notice tone="info" lead="The button in each email will open:">
                  <strong>{siteUrl()}</strong>
                </Notice>
              )}
              <Notice tone="warn" lead={`${waiting.length} ${waiting.length === 1 ? 'person has' : 'people have'} not signed in yet.`}>
                Sending the emails cannot be taken back, and anyone who already had an older email will get a new one. The old link then stops working.
              </Notice>
              <ActionForm
                action={resendAllPending}
                submitLabel={`Send a welcome email to ${waiting.length} ${waiting.length === 1 ? 'person' : 'people'}`}
                confirm={`This will send a welcome email to ${waiting.length} people right now. The button in each email opens ${siteUrl()}. It cannot be taken back. Continue?`}
              >
                <span />
              </ActionForm>

              <details className="ks-panel group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-5 py-4">
                  <span className="font-semibold text-[1.125rem]">See who has not signed in</span>
                  <span className="ks-link group-open:hidden">Open</span>
                  <span className="ks-link hidden group-open:inline">Close</span>
                </summary>
                <div className="border-t border-[#E3E7EC] overflow-x-auto">
                  <table className="ks-table">
                    <thead><tr><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Role</th><th scope="col"><span className="sr-only">Action</span></th></tr></thead>
                    <tbody>
                      {waiting.map((p) => (
                        <tr key={p.id}>
                          <td><strong>{titleCase(p.full_name)}</strong></td>
                          <td className="break-all">{d.emailOf(p.id)}</td>
                          <td>{roleWord(p.role)}</td>
                          <td>
                            <form action={resendInvite}>
                              <input type="hidden" name="profileId" value={p.id} />
                              <button type="submit" className="ks-btn ks-btn-quiet ks-btn-small">Send again</button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          )}
        </Section>

        <Section
          id="spreadsheet"
          title="Add many parents from a spreadsheet"
          hint="Each row is one parent and one child. A parent with two children has two rows, with the same email address."
        >
          <CsvImporter
            fields={PARENT_FIELDS}
            columns="Parent name, Parent email, Child's admission number"
            groupKey="parent_email"
            chunkSize={15}
            run={importParentRows}
            inviteOption
            buttonLabel="Add these parents"
            sampleName="parents-example.csv"
            sample={"Parent name,Parent email,Child's admission number\nBola Adeyemi,bola@example.com,KSPS/2025/001\nBola Adeyemi,bola@example.com,KSPS/2025/014\nChuka Eze,chuka@example.com,KSPS/2025/002\n"}
          />
        </Section>

        <Section id="one" title="Add one parent">
          <ActionForm action={inviteAccount} submitLabel="Add this parent and send a welcome email">
            <input type="hidden" name="role" value="parent" />
            <div className="grid sm:grid-cols-2 gap-5">
              <TextField id="p-name" name="fullName" label="Parent's full name" />
              <TextField id="p-email" name="email" type="email" label="Email address" hint="Check the spelling. The welcome email goes here." />
            </div>
          </ActionForm>
        </Section>

        <Section
          id="correct"
          title="Correct a parent's name or email"
          hint="Use this when a name or email address was typed wrongly. Their children stay connected. Leave a box empty to keep it as it is."
        >
          <ActionForm action={updateAccount} submitLabel="Save the correction">
            <div className="max-w-xl">
              <SelectField
                id="u-who"
                name="profileId"
                label="Which parent?"
                options={d.parents.map((p) => ({ value: p.id, label: `${titleCase(p.full_name)} · ${d.emailOf(p.id)}` }))}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <TextField id="u-name" name="fullName" label="Correct name" required={false} hint="Optional" />
              <TextField id="u-email" name="email" type="email" label="Correct email address" required={false} hint="Optional. Check the spelling carefully." />
            </div>
            <label className="flex items-start gap-3 text-[1.0625rem] cursor-pointer">
              <input type="checkbox" name="resend" defaultChecked className="ks-check mt-0.5" />
              <span>Send a welcome email to the new address now</span>
            </label>
          </ActionForm>
        </Section>

        <Section id="connect" title="Connect a parent to a child" hint="Do this for each child. A child can have more than one parent, and a parent can have more than one child.">
          <ActionForm action={linkParent} submitLabel="Connect them">
            <div className="grid sm:grid-cols-2 gap-5">
              <SelectField id="l-parent" name="parentId" label="Which parent?" options={d.parents.map((p) => ({ value: p.id, label: titleCase(p.full_name) }))} />
              <SelectField id="l-child" name="studentId" label="Which child?" options={studentOptions} />
            </div>
          </ActionForm>
        </Section>
      </Container>
    </PortalFrame>
  )
}
