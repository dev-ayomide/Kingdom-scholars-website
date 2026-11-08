import type { Metadata } from 'next'
import { Inter, Playfair_Display, Source_Sans_3 } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Playfair Display: loaded with italic style — the italic variant at large sizes
// is the typographic signature of this site.
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

// Source Sans 3: a plain, highly legible typeface (the one used by many
// government websites). Used for the staff/parent portal.
const read = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-read',
  weight: ['400', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Kingdom Scholars Private School | Abeokuta',
    template: '%s | Kingdom Scholars Private School',
  },
  description:
    'A government-approved Nursery and Primary School in Abeokuta, Ogun State. Educating world leaders from the cradle.',
  keywords: [
    'Kingdom Scholars Private School',
    'private school Abeokuta',
    'nursery school Ogun State',
    'primary school Abeokuta',
    'KSPS',
  ],
  openGraph: {
    siteName: 'Kingdom Scholars Private School',
    locale: 'en_NG',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${read.variable}`}>
      <body className="bg-cream font-sans antialiased">{children}</body>
    </html>
  )
}
