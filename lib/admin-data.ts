import type { SupabaseClient } from '@supabase/supabase-js'
import { listAuthUsers } from '@/lib/accounts'
import type { Profile, SchoolClass, Student } from '@/lib/types'

// Everything the admin pages need, read through the admin's own session
// (row-level security still applies).
export async function loadAdminData(supabase: SupabaseClient) {
  const [classes, students, people, teacherClasses, parentStudents, reports, authUsers] = await Promise.all([
    supabase.from('classes').select('id, name').order('name'),
    supabase.from('students').select('id, full_name, admission_no, class_id').order('full_name'),
    supabase.from('profiles').select('id, role, full_name').order('full_name'),
    supabase.from('teacher_classes').select('teacher_id, class_id'),
    supabase.from('parent_students').select('parent_id, student_id'),
    supabase.from('reports').select('*', { count: 'exact', head: true }),
    listAuthUsers(),
  ])
  const profiles = (people.data ?? []) as Profile[]
  const userById = new Map(authUsers.map((u) => [u.id, u]))
  return {
    classes: (classes.data ?? []) as SchoolClass[],
    students: (students.data ?? []) as Student[],
    profiles,
    teachers: profiles.filter((p) => p.role === 'teacher'),
    parents: profiles.filter((p) => p.role === 'parent'),
    staff: profiles.filter((p) => p.role === 'teacher' || p.role === 'admin'),
    teacherClasses: (teacherClasses.data ?? []) as { teacher_id: string; class_id: string }[],
    parentStudents: (parentStudents.data ?? []) as { parent_id: string; student_id: string }[],
    reportCount: reports.count ?? 0,
    userById,
    signedIn: (id: string) => !!userById.get(id)?.lastSignIn,
    emailOf: (id: string) => userById.get(id)?.email ?? '',
  }
}
