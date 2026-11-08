// Display helpers. Data in the database stays exactly as the school wrote it;
// these only change how it looks on screen.

const SMALL = new Set(['of', 'and', '&'])
const ABBR: Record<string, string> = { 'mr.': 'Mr.', 'mrs.': 'Mrs.', 'dr.': 'Dr.', 'mr': 'Mr', 'mrs': 'Mrs', 'dr': 'Dr' }

// "OSOKOYA TAIWO" -> "Osokoya Taiwo", "MR. & MRS. BOLADE" -> "Mr. & Mrs. Bolade"
export function titleCase(input: string): string {
  return input
    .trim()
    .split(/\s+/)
    .map((w, i) => {
      const lower = w.toLowerCase()
      if (ABBR[lower]) return ABBR[lower]
      if (SMALL.has(lower)) return lower === 'of' && i > 0 ? 'of' : lower
      if (w.length <= 2 && /^[A-Z]+$/.test(w)) return w // KG, ZZ
      if (/^\d+[a-z]+$/i.test(w)) return w.toUpperCase() // 4B, 3A
      return lower.replace(/(^|[-'])([a-z])/g, (_, p, c) => p + c.toUpperCase())
    })
    .join(' ')
}

export const TERM_NAMES = ['First term', 'Second term', 'Third term'] as const
export const termName = (term: number) => TERM_NAMES[term - 1] ?? `Term ${term}`
export const sessionLabel = (s: string) => s.replace('-', '–')

// Nigeria time (UTC+1, no daylight saving)
export function greeting(now = new Date()): string {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Africa/Lagos' }).format(now)
  )
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
}

// The school year runs September to July: from September on it is "this year-next year".
export function sessionOptions(now = new Date()): string[] {
  const start = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1
  return [`${start - 1}-${start}`, `${start}-${start + 1}`, `${start + 1}-${start + 2}`]
}
export function currentSession(now = new Date()): string {
  return sessionOptions(now)[1]
}

export const SCHOOL_PHONE = '0816 488 9463'
export const SCHOOL_PHONE_HREF = 'tel:+2348164889463'
