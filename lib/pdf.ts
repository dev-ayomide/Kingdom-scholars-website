// Shared by browser upload components and server actions.

export const MAX_PDF_BYTES = 5 * 1024 * 1024
export const SESSION_RE = /^[0-9]{4}-[0-9]{4}$/

export function reportPath(studentId: string, session: string, term: number) {
  return `${studentId}/${session}-T${term}.pdf`
}

// Returns an error message, or null if the file looks like a valid PDF.
export async function validatePdf(file: File): Promise<string | null> {
  if (file.size === 0) return 'File is empty'
  if (file.size > MAX_PDF_BYTES) return 'Larger than 5MB'
  const head = new Uint8Array(await file.slice(0, 5).arrayBuffer())
  const text = String.fromCharCode(...head)
  return text === '%PDF-' ? null : 'Not a PDF'
}

// Lower-case letters and digits only, so "KSPS-023", "ksps 023" and "KSPS/023" match.
export function normaliseKey(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}
