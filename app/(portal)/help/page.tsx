import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalFrame, { PlainFrame } from '@/components/portal/PortalFrame'
import { CheckIcon, AlertIcon, Container, PageHeader, Section } from '@/components/portal/kit'
import { SCHOOL_PHONE, SCHOOL_PHONE_HREF } from '@/lib/format'
import type { UserRole } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Help',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

async function whoIsHere(): Promise<{ role: UserRole; name: string } | null> {
  try {
    const supabase = createClient()
    const { data: auth } = await supabase.auth.getClaims()
    const userId = auth?.claims?.sub
    if (!userId) return null
    const { data } = await supabase.from('profiles').select('role, full_name').eq('id', userId).single<{ role: UserRole; full_name: string }>()
    return data ? { role: data.role, name: data.full_name } : null
  } catch {
    return null
  }
}

function Example({ good, children, why }: { good: boolean; children: string; why?: string }) {
  return (
    <li className="flex gap-4 p-4 sm:p-5">
      <span className={good ? 'text-[#2B7A4B]' : 'text-[#A32A2A]'}>{good ? <CheckIcon className="w-7 h-7" /> : <AlertIcon className="w-7 h-7" />}</span>
      <span>
        <strong className="break-all">{children}</strong>
        {why && <span className="block text-[1rem] text-navy/80">{why}</span>}
      </span>
    </li>
  )
}

export default async function HelpPage() {
  const who = await whoIsHere()
  const Frame = ({ children }: { children: React.ReactNode }) =>
    who ? <PortalFrame role={who.role} name={who.name}>{children}</PortalFrame> : <PlainFrame>{children}</PlainFrame>
  const staff = who?.role === 'admin' || who?.role === 'teacher'

  return (
    <Frame>
      <PageHeader title="Help" intro="Short answers to the questions people ask most. If you are still stuck, please call the school office." />
      <Container className="py-8 space-y-8">
        <Section id="download" title="Downloading a report sheet (parents)">
          <ol className="space-y-4 text-[1.125rem] list-decimal pl-7 marker:font-bold marker:text-wine">
            <li>Sign in with your email address and password.</li>
            <li>Find your child&apos;s name. Under it is a line for each term.</li>
            <li>Press <strong>Download PDF</strong> next to the term you want.</li>
            <li>The report sheet opens. You can read it, print it, or save it on your phone.</li>
          </ol>
        </Section>

        {staff && (
          <>
            <Section id="upload" title="Uploading report sheets (staff)">
              <ol className="space-y-4 text-[1.125rem] list-decimal pl-7 marker:font-bold marker:text-wine">
                <li>Open <Link href="/teacher" className="ks-link">Report sheets</Link>.</li>
                <li><strong>Step 1:</strong> choose the school year and the term.</li>
                <li><strong>Step 2:</strong> choose the PDF files. You can choose many at once.</li>
                <li><strong>Step 3:</strong> check the list. A tick means the file is ready. A red mark means it will be left out, and tells you why.</li>
                <li>Press <strong>Upload</strong>. The parents are emailed, unless you untick that box.</li>
              </ol>
            </Section>

            <Section
              id="naming"
              title="Naming the files"
              hint="The computer finds the right child from the file's name, so each file must be named with the child's admission number."
            >
              <p className="text-[1.125rem] mb-6 max-w-2xl">
                A child with admission number <strong>KSPS/2025/XXX</strong> gets a file called <strong>KSPS-2025-XXX.pdf</strong>. A file name cannot
                contain a slash, so use a dash instead. Capital letters and spaces do not matter.
              </p>
              <ul className="ks-panel divide-y divide-navy/10">
                <Example good>KSPS-2025-XXX.pdf</Example>
                <Example good why="Capital letters and spaces are fine.">ksps 2025 XXX.pdf</Example>
                <Example good={false} why="This uses the child's name. The file must use the admission number.">Tolu Adeyemi Report.pdf</Example>
                <Example good={false} why="This is a Word document. Please save it as a PDF first.">KSPS-2025-119.docx</Example>
              </ul>
              <p className="mt-6 text-[1.125rem] max-w-2xl">
                One file for each child for each term. If you upload again for the same term, the new file replaces the old one.
              </p>
            </Section>
          </>
        )}

        <Section id="cant-sign-in" title="Someone cannot sign in">
          <ul className="space-y-4 text-[1.125rem] list-disc pl-7 marker:text-wine">
            <li>They should press <strong>I forgot my password</strong> on the sign-in page and use the email address the school has for them.</li>
            <li>If no email arrives, ask them to look in their spam or junk folder.</li>
            {staff && (
              <>
                <li>Check their email address is spelled correctly on the <Link href="/admin/parents" className="ks-link">Parents</Link> page.</li>
                <li>On that page you can press <strong>Send again</strong> next to their name to send a fresh welcome email.</li>
              </>
            )}
          </ul>
        </Section>

        <section className="ks-panel px-5 sm:px-7 py-6">
          <h2>Still stuck?</h2>
          <p className="mt-2">
            Call the school office on <a href={SCHOOL_PHONE_HREF} className="ks-link">{SCHOOL_PHONE}</a>. We are there Monday to Friday, 7:30am to 4:00pm.
          </p>
        </section>
      </Container>
    </Frame>
  )
}
