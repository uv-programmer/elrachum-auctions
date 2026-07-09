'use client'

import { useState, useEffect } from 'react'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function fmt12(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return m ? `${hour}:${String(m).padStart(2, '0')}${period}` : `${hour}${period}`
}

export function formatHours(days, separator = ' · ') {
  const open = days.filter(d => d.is_open)
  if (!open.length) return 'Currently closed'
  const groups = {}
  open.forEach(d => {
    const key = `${d.open_time}|${d.close_time}`
    if (!groups[key]) groups[key] = { open: d.open_time, close: d.close_time, days: [] }
    groups[key].days.push(d.day_of_week)
  })
  return Object.values(groups)
    .map(g => `${g.days.map(n => DAY_NAMES[n]).join(' & ')}: ${fmt12(g.open)}–${fmt12(g.close)}`)
    .join(separator)
}

export function useWorkingHours(fallback = 'See website for hours') {
  const [text, setText] = useState(fallback)

  useEffect(() => {
    fetch('/api/schedule')
      .then(r => r.json())
      .then(({ days }) => { if (days?.length) setText(formatHours(days)) })
      .catch(() => {})
  }, [])

  return text
}
