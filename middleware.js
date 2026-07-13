import { NextResponse } from 'next/server'

// Simple in-memory cache so we don't hammer Supabase on every request
let _cache = { settings: null, ts: 0 }
const CACHE_TTL = 30_000 // 30 seconds

async function fetchSettings(supabaseUrl, supabaseKey) {
  const now = Date.now()
  if (_cache.settings && now - _cache.ts < CACHE_TTL) return _cache.settings

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/site_settings?select=key,value`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        // Edge cache revalidation hint
        next: { revalidate: 30 },
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    _cache = { settings: data, ts: now }
    return data
  } catch {
    return null
  }
}

// Paths that are ALWAYS accessible — never redirect these
const BYPASS_PREFIXES = [
  '/admin',
  '/launching-soon',
  '/maintenance',
  '/api/',
  '/_next/',
]
const BYPASS_EXTENSIONS = /\.(png|jpe?g|svg|ico|webp|css|js|woff2?|ttf|map)$/i

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Always allow bypassed routes
  if (BYPASS_PREFIXES.some(p => pathname.startsWith(p))) return NextResponse.next()
  if (BYPASS_EXTENSIONS.test(pathname)) return NextResponse.next()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return NextResponse.next()

  const settings = await fetchSettings(supabaseUrl, supabaseKey)
  if (!settings) return NextResponse.next()

  const get = (key) => settings.find(s => s.key === key)?.value ?? null

  // 1. Maintenance takes priority
  if (get('maintenance_mode') === 'true') {
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  // 2. Launch countdown — only if date is in the future
  const launchDate = get('launch_date')
  if (launchDate) {
    const launch = new Date(launchDate)
    if (!isNaN(launch.getTime()) && launch > new Date()) {
      return NextResponse.redirect(new URL('/launching-soon', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
