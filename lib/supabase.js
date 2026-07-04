import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Guard: don't crash if env vars are missing (e.g. during local dev without .env.local)
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

// Server-side client (uses service role key — never expose on client)
export const supabaseAdmin = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) return null
  return createClient(supabaseUrl, serviceKey)
}
