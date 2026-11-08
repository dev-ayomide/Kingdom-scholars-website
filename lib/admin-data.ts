import { unstable_cache } from 'next/cache'
import { listAuthUsers } from '@/lib/accounts'
import { createClient } from '@/lib/supabase/server'
import type { Profile, SchoolClass, Student } from '@/lib/types'

// Listing every login is the slowest call, and who has signed in only changes
// now and then, so it is kept for 30 seconds. Actions that add people clear it.
export const AUTH_USERS_TAG = 'auth-users'
export const cachedAuthUsers = unstable_cache(async () => listAuthUsers(), ['auth-users'], {
  revalidate: 30,
  tags: [AUTH_USERS_TAG],
})

type Need = Partial<Record<'classes' | 'students' | 'profiles' | 'teacherClasses' | 'parentStudents' | 'users', true>>

// Reads only what a page needs, all at the same time, through the admin's own
// session (row-level security still applies).
export async function loadAdminData(need: Need) {
  const supabase = createClient()
  const [classes, students, people, teacherClasses, parentStudents, authUsers] = await Promise.all([
    need.classes ? supabase.from('classes').select('id, name').order('name') : null,
    need.students ? supabase.from('students').select('id, full_name, admission_no, class_id').order('full_name') : null,
    need.profiles ? supabase.from('profiles').select('id, role, full_name').order('full_name') : null,
    need.teacherClasses ? supabase.from('teacher_classes').select('teacher_id, class_id') : null,
    need.parentStudents ? supabase.from('parent_students').select('parent_id, student_id') : null,
    need.users ? cachedAuthUsers() : null,
  ])
  const profiles = (people?.data ?? []) as Profile[]
  const userById = new Map((authUsers ?? []).map((u) => [u.id, u]))
  return {
    classes: (classes?.data ?? []) as SchoolClass[],
    students: (students?.data ?? []) as Student[],
    profiles,
    teachers: profiles.filter((p) => p.role === 'teacher'),
    parents: profiles.filter((p) => p.role === 'parent'),
    staff: profiles.filter((p) => p.role === 'teacher' || p.role === 'admin'),
    teacherClasses: (teacherClasses?.data ?? []) as { teacher_id: string; class_id: string }[],
    parentStudents: (parentStudents?.data ?? []) as { parent_id: string; student_id: string }[],
    signedIn: (id: string) => !!userById.get(id)?.lastSignIn,
    emailOf: (id: string) => userById.get(id)?.email ?? '',
  }
}

// The home page only needs numbers, so it asks for counts, not whole tables.
export async function loadAdminCounts() {
  const supabase = createClient()
  const head = (table: string, role?: string[]) => {
    let q = supabase.from(table).select('*', { count: 'exact', head: true })
    if (role) q = q.in('role', role)
    return q
  }
  const [students, classes, reports, parents, staff, users] = await Promise.all([
    head('students'),
    head('classes'),
    head('reports'),
    head('profiles', ['parent']),
    head('profiles', ['teacher', 'admin']),
    cachedAuthUsers(),
  ])
  return {
    students: students.count ?? 0,
    classes: classes.count ?? 0,
    reports: reports.count ?? 0,
    parents: parents.count ?? 0,
    staff: staff.count ?? 0,
    waiting: users.filter((u) => !u.lastSignIn).length,
  }
}
