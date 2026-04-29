export interface Testimonial {
  id: number
  name: string
  role: string
  content?: string
  image?: string
  category: 'student' | 'parent'
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Oluwole Akintubuwa',
    role: 'Head Prefect, 2025/26 Academic Session',
    content: 'I want to sincerely thank and appreciate Kingdom Scholars Private School for everything they have done in my life. They taught me appropriate manners of behaviour (Etiquette) in the midst of my peers in the school, amongst elders and the society at large. I was also taught how to manage my emotions (Emotional intelligence), how to be bold, confident, committed and focused in my studies.',
    image: '/images/testimonials/Oluwole Akintubuwa_.jpg',
    category: 'student',
  },
  {
    id: 2,
    name: 'Dominion Showunmi',
    role: 'Assistant Head Prefect, 2025/26 Academic Session',
    content: 'KSPS is the best place to be! At KSPS, I was taught how to prepare for the future from today. Class is like the teacher takes us on the journey of life. For example, we have life lessons in the morning where our class teacher tells us stories about his life. There are friendly teachers to keep you going. KSPS is like home to me. I love my school.',
    image: '/images/testimonials/Dominion Showunmi_.jpg',
    category: 'student',
  },
  {
    id: 3,
    name: 'ELDER (LION) OLUJIMI, OLANREWAJU JOSEPH, MBA, HND, MCIHRM, CHRP.',
    role: 'Parent',
    content: "The 'impact' of KSPS cannot be totally enumerated. KSPS has been a driving force academically in the lives of my children which has great effects on them wherever they find themselves. The school has shaped the kids in no little way as they can stand, and compete with their peers anywhere, any time. KSPS does not only teach academics, they teach morals, respect, and culture too. I dish out a great kudos to the school teachers and the management for the good job they are doing. Greater KSPS, in Jesus Mighty Name.",
    image: '/images/testimonials/Elder Olujimi_.jpg',
    category: 'parent',
  },
  {
    id: 4,
    name: 'Mrs. Modupe Oladiran',
    role: 'KSPS, PTA Vice Chairperson',
    content: 'Wearing two hats, as a parent and as Vice Chairperson of the PTA, I can confidently say this school is outstanding. The staff’s commitment to academic excellence and character development is unmatched. My children are direct beneficiaries of the nurturing environment here. I am proud to partner with KSPS.',
    image: '/images/testimonials/Mrs. Oladiran.jpg',
    category: 'parent',
  },
]
