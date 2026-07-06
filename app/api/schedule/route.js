import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Returns which days of week are open and their config.
// Called by the book-pickup page on load to build the date grid.
// Cached at the CDN edge for 5 minutes so it's fast.

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    return NextResponse.json({ error: 'Server config error' }, { status: 500 })
  }

  const { data, error } = await createClient(url, key)
    .from('working_hours')
    .select('day_of_week, is_open, open_time, close_time, slot_duration_minutes, max_per_slot')
    .order('day_of_week')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(
    { days: data || [] },
    { headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=60' } }
  )
}
