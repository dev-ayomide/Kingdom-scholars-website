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
