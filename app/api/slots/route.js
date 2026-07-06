import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function adminDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

function toMin(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}
function toHHMM(totalMin) {
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
function toLabel(totalMin) {
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  const h12 = h % 12 || 12
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const dateStr = searchParams.get('date')

  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json({ error: 'Use ?date=YYYY-MM-DD' }, { status: 400 })
  }

  // Parse date in local time — avoid UTC shift
  const [y, m, d] = dateStr.split('-').map(Number)
  const dayOfWeek = new Date(y, m - 1, d).getDay()

  const db = adminDb()
  if (!db) return NextResponse.json({ error: 'Server config error' }, { status: 500 })

  // Parallel fetch: working hours + breaks + existing bookings for this date
  const [
    { data: wh, error: whErr },
    { data: breaks },
    { data: existing },
  ] = await Promise.all([
    db.from('working_hours').select('*').eq('day_of_week', dayOfWeek).single(),
    db.from('break_hours').select('break_start, break_end').eq('day_of_week', dayOfWeek).order('break_start'),
    db.from('bookings').select('slot_time').eq('slot_date', dateStr),
  ])

  if (whErr || !wh) {
    return NextResponse.json({ error: 'Schedule not found' }, { status: 500 })
  }

  if (!wh.is_open) {
    return NextResponse.json({ date: dateStr, dayOfWeek, isOpen: false, slots: [] })
  }

  // Count bookings per time slot
  const counts = {}
  for (const b of existing || []) {
    if (b.slot_time) {
      const t = b.slot_time.slice(0, 5) // normalise to HH:MM
      counts[t] = (counts[t] || 0) + 1
    }
  }

  // Parse break ranges into minutes
  const breakRanges = (breaks || []).map(b => ({
    start: toMin(b.break_start),
    end: toMin(b.break_end),
  }))

  const dur = wh.slot_duration_minutes || 15
  const max = wh.max_per_slot || 4
  const openMin = toMin(wh.open_time)
  const closeMin = toMin(wh.close_time)
  const slots = []

  for (let cur = openMin; cur < closeMin; cur += dur) {
    // Skip slots that fall inside a break
    if (breakRanges.some(br => cur >= br.start && cur < br.end)) continue

    const time = toHHMM(cur)
    const booked = counts[time] || 0

    slots.push({
      time,                       // "14:00" — stored in DB
      timeLabel: toLabel(cur),    // "2:00 PM" — shown to user
      booked,
      max,
      available: booked < max,
    })
  }

  return NextResponse.json({
    date: dateStr,
    dayOfWeek,
    isOpen: true,
    slotDuration: dur,
    maxPerSlot: max,
    slots,
  })
}
