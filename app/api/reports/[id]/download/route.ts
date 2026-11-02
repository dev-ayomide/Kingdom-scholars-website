import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!UUID.test(params.id)) return new NextResponse('Not found', { status: 404 })

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  // RLS: returns nothing unless this user is the child's parent, the class
  // teacher, or an admin. Same 404 either way so IDs can't be probed.
  const { data: report } = await supabase
    .from('reports')
    .select('file_path, session, term, students(full_name)')
    .eq('id', params.id)
    .single<{
      file_path: string
      session: string
      term: number
      students: { full_name: string } | null
    }>()
  if (!report) return new NextResponse('Not found', { status: 404 })

  const safeName = (report.students?.full_name ?? 'report').replace(/[^a-z0-9]+/gi, '-')
  const { data: signed, error } = await supabase.storage
    .from('report-sheets')
    .createSignedUrl(report.file_path, 60, {
      download: `${safeName}-${report.session}-Term${report.term}.pdf`,
    })
  if (error || !signed) return new NextResponse('Not found', { status: 404 })

  const res = NextResponse.redirect(signed.signedUrl)
  res.headers.set('Cache-Control', 'no-store')
  return res
}
