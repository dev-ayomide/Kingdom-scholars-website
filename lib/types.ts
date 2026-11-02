export interface StaffMember {
  name: string
  role: string
  bio: string
  image: string
}

export interface NewsPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
}

export interface AdmissionsFormData {
  parentName: string
  email: string
  phone: string
  numberOfChildren: number
  classApplyingFor: string
  questions?: string
}

export interface ContactFormData {
  name: string
  email: string
  message: string
}

export interface PaymentInquiryFormData {
  parentName: string
  email: string
  phone: string
  classInterestedIn: string
  message: string
}

export type UserRole = 'parent' | 'teacher' | 'admin'

export interface Profile {
  id: string
  role: UserRole
  full_name: string
}

export interface SchoolClass {
  id: string
  name: string
}

export interface Student {
  id: string
  full_name: string
  admission_no: string
  class_id: string
}

export interface Report {
  id: string
  student_id: string
  term: 1 | 2 | 3
  session: string
  created_at: string
}

export interface ActionState {
  ok?: string
  error?: string
}

export interface FileMatch {
  name: string
  status: 'ok' | 'unknown' | 'ambiguous' | 'duplicate'
  studentId?: string
  studentName?: string
  className?: string
}

export interface ImportResult {
  created: number
  linked: number
  skipped: number
  emailed: number
  errors: string[]
}
