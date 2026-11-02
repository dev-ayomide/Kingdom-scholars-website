import { createBrowserClient } from '@supabase/ssr'

// Browser client, used only to upload PDFs straight to storage (avoids
// Vercel's request-size limit). Row-level security still applies.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
