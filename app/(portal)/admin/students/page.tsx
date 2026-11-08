import type { Metadata } from 'next'
import { requireRole } from '@/lib/auth'
import { loadAdminData } from '@/lib/admin-data'
import { titleCase } from '@/lib/format'
import PortalFrame from '@/components/portal/PortalFrame'
import ActionForm from '@/components/portal/ActionForm'
import CsvImporter from '@/components/portal/CsvImporter'
import { Container, PageHeader, Section, SelectField, TextField } from '@/components/portal/kit'
import { createClass, createStudent, importStudentRows, moveStudent } from '../actions'

export const metadata: Metadata = {
  title: 'Children and classes',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const STUDENT_FIELDS = [
  { key: 'full_name', label: 'full_name', aliases: ['name', 'student_name', 'student'] },
  { key: 'admission_no', label: 'admission_no', aliases: ['admission_number', 'admission', 'adm_no'] },
  { key: 'class', label: 'class', aliases: ['class_name'] },
]

export default async function StudentsPage() {
  const [{ profile }, d] = await Promise.all([requireRole(['admin']), loadAdminData({ classes: true, students: true })])

  const className = (id: string) => titleCase(d.classes.find((c) => c.id === id)?.name ?? '')
  const classOptions = d.classes.map((c) => ({ value: c.id, label: titleCase(c.name) }))
  const studentOptions = d.students.map((s) => ({ value: s.id, label: `${titleCase(s.full_name)} (${className(s.class_id)})` }))

  return (
    <PortalFrame role={profile.role} name={profile.full_name}>
      <PageHeader
        back={{ href: '/admin', label: 'Back to the contents' }}
        kicker="Children and classes"
        title="Children and"
        accent="classes"
        intro="Add the school's classes first, then the children. Parents are connected to their children on the Parents page."
      />

      <Container className="py-12 md:py-16 space-y-20">
        <Section
          id="classes"
          title="Classes"
          hint={`The school has ${d.classes.length} ${d.classes.length === 1 ? 'class' : 'classes'}: ${d.classes.map((c) => titleCase(c.name)).join(', ') || 'none yet'}.`}
        >
          <ActionForm action={createClass} submitLabel="Add this class">
            <div className="max-w-md">
              <TextField id="class-name" name="name" label="Name of the new class" hint="For example: Primary 3" />
            </div>
          </ActionForm>
        </Section>

        <Section
          id="spreadsheet"
          title="Add many children from a spreadsheet"
          hint="The quickest way to add a whole school. Children who are already on the portal are skipped, so nothing is added twice."
        >
          <CsvImporter
            fields={STUDENT_FIELDS}
            columns="Full name, Admission number, Class"
            chunkSize={100}
            run={importStudentRows}
            buttonLabel="Add these children"
            sampleName="children-example.csv"
            sample={'Full name,Admission number,Class\nTolu Adeyemi,KSPS/2025/001,Primary 3\nKemi Eze,KSPS/2025/002,Primary 5\n'}
          />
        </Section>

        <Section id="one" title="Add one child">
          <ActionForm action={createStudent} submitLabel="Add this child">
            <div className="grid sm:grid-cols-2 gap-6">
              <TextField id="child-name" name="fullName" label="Child's full name" />
              <TextField id="child-adm" name="admissionNo" label="Admission number" hint="For example: KSPS/2025/001" />
            </div>
            <div className="max-w-md">
              <SelectField id="child-class" name="classId" label="Class" options={classOptions} />
            </div>
          </ActionForm>
        </Section>

        <Section
          id="move"
          title="Move a child to another class"
          hint="Use this when a child moves up. Their earlier report sheets stay with them."
        >
          <ActionForm action={moveStudent} submitLabel="Move this child">
            <div className="grid sm:grid-cols-2 gap-6">
              <SelectField id="move-child" name="studentId" label="Which child?" options={studentOptions} />
              <SelectField id="move-class" name="classId" label="Move to which class?" options={classOptions} />
            </div>
          </ActionForm>
        </Section>

        <Section id="all" title={`All children (${d.students.length})`} hint="Open a class to see who is in it.">
          <div className="space-y-4">
            {d.classes.map((c) => {
              const kids = d.students.filter((s) => s.class_id === c.id)
              return (
                <details key={c.id} className="ks-panel group">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 p-5 sm:p-6">
                    <span className="font-display font-bold text-[1.6rem]">{titleCase(c.name)}</span>
                    <span className="text-[1.1rem] text-navy/80">
                      {kids.length} {kids.length === 1 ? 'child' : 'children'}
                      <span className="ml-3 ks-link group-open:hidden">Open</span>
                      <span className="ml-3 ks-link hidden group-open:inline">Close</span>
                    </span>
                  </summary>
                  <ul className="border-t border-navy/15 divide-y divide-navy/10">
                    {kids.length === 0 && <li className="p-5 text-navy/70">No children in this class yet.</li>}
                    {kids.map((s) => (
                      <li key={s.id} className="flex flex-wrap justify-between gap-x-6 px-5 sm:px-6 py-3 text-[1.2rem]">
                        <span className="font-bold">{titleCase(s.full_name)}</span>
                        <span className="text-navy/70">{s.admission_no}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )
            })}
          </div>
        </Section>
      </Container>
    </PortalFrame>
  )
}
