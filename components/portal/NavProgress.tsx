'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

// Shows "Opening the page…" the moment a link is pressed, so the wait is never
// silent. Hidden again as soon as the new page has arrived.
export default function NavProgress() {
  const pathname = usePathname()
  const [opening, setOpening] = useState(false)

  useEffect(() => setOpening(false), [pathname])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement | null)?.closest('a')
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin || url.pathname.startsWith('/api/')) return
      if (url.pathname === window.location.pathname && url.search === window.location.search) return
      setOpening(true)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // Safety net: never leave the message up for more than 15 seconds.
  useEffect(() => {
    if (!opening) return
    const t = setTimeout(() => setOpening(false), 15000)
    return () => clearTimeout(t)
  }, [opening])

  if (!opening) return null
  return (
    <div role="status" aria-live="polite" className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div className="h-1.5 bg-[#E9C6A0] animate-pulse" />
      <div className="flex justify-center pt-3 px-4">
        <span className="bg-navy text-white text-[1.15rem] font-bold px-5 py-3 rounded-md shadow-lg">Opening the page…</span>
      </div>
    </div>
  )
}
