'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Check, AlertTriangle, Loader2 } from 'lucide-react'

const STEPS = ['Your Info', 'Pickup Details', 'Confirm']
const DAY_NAMES  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY_SHORT  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getTomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

// Generate the next `count` open dates starting from tomorrow
function getUpcomingOpenDates(openDows, count = 12) {
  const dates = []
  const d = new Date()
  d.setDate(d.getDate() + 1)           // start tomorrow
  d.setHours(0, 0, 0, 0)
  let tries = 0
  while (dates.length < count && tries < 90) {
    if (openDows.includes(d.getDay())) {
      dates.push(new Date(d))
    }
    d.setDate(d.getDate() + 1)
    tries++
  }
  return dates
}

function formatDateKey(date) {
  // Returns YYYY-MM-DD without timezone shift
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDayPill(date) {
  return `${DAY_SHORT[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`
}

function fmt12(timeStr) {
  // "14:00" or "14:00:00" → "2:00 PM"
  const [h, m] = timeStr.split(':').map(Number)
  const h12 = h % 12 || 12
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

const inputClass = 'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all'
const inputStyle = {
  background: 'rgba(156,110,40,0.04)',
  border: '1px solid var(--c-border)',
  color: 'var(--c-text)',
}

// ── Capacity dots ──────────────────────────────────────────────
function CapDots({ booked, max, full }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 7, height: 7, borderRadius: '50%',
              background: i < booked
                ? (full ? '#c49a38' : '#9c6e28')
                : 'var(--c-border)',
            }}
          />
        ))}
      </div>
      {full
        ? <span style={{ fontSize: 11, color: '#9c6e28', fontWeight: 600 }}>Full</span>
        : <span style={{ fontSize: 11, color: 'var(--c-muted)' }}>{booked}/{max}</span>
      }
    </div>
  )
}

export default function BookPickupPage() {
  const router = useRouter()
  const [step, setStep]   = useState(0)
  const [form, setForm]   = useState({ name: '', email: '', phone: '', lots: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]   = useState(false)

  // Schedule
  const [schedule, setSchedule]     = useState(null)
  const [openDates, setOpenDates]   = useState([])

  // Selection
  const [selectedDate, setSelectedDate] = useState(null)
  const [slots, setSlots]               = useState(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)

  const resetAll = useCallback(() => {
    setStep(0)
    setForm({ name: '', email: '', phone: '', lots: '', notes: '' })
    setSelectedDate(null)
    setSelectedSlot(null)
    setSlots(null)
    setDone(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // ── Scroll to top on every step change ─────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  // ── Load schedule once on mount ─────────────────────────────
  useEffect(() => {
    fetch('/api/schedule')
      .then(r => r.json())
      .then(data => {
        const days = data.days || []
        setSchedule(days)
        const openDows = days.filter(d => d.is_open).map(d => d.day_of_week)
        setOpenDates(getUpcomingOpenDates(openDows, 12))
      })
      .catch(() => {
        // Fallback: Tue=2, Thu=4, Sat=6
        const openDows = [2, 4, 6]
        setOpenDates(getUpcomingOpenDates(openDows, 12))
      })
  }, [])

  // ── Load slots when date changes ─────────────────────────────
  useEffect(() => {
    if (!selectedDate) return
    setSlots(null)
    setSelectedSlot(null)
    setLoadingSlots(true)
    fetch(`/api/slots?date=${formatDateKey(selectedDate)}`)
      .then(r => r.json())
      .then(data => {
        setSlots(data.slots || [])
        setLoadingSlots(false)
      })
      .catch(() => {
        setSlots([])
        setLoadingSlots(false)
      })
  }, [selectedDate])

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const focusStyle = e => (e.currentTarget.style.borderColor = 'var(--c-accent)')
  const blurStyle  = e => (e.currentTarget.style.borderColor = 'var(--c-border)')

  const slotLabel = selectedDate && selectedSlot
    ? `${formatDayPill(selectedDate)} · ${fmt12(selectedSlot.time)}`
    : ''

  const next = e => {
    e.preventDefault()
    // On step 1, validate lots + slot before advancing
    if (step === 1) {
      if (!form.lots.trim()) {
        const lotsEl = document.getElementById('lots-input')
        if (lotsEl) { lotsEl.focus(); lotsEl.scrollIntoView({ behavior: 'smooth', block: 'center' }) }
        return
      }
      if (!selectedSlot) {
        const gridEl = document.getElementById('slot-grid')
        if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
    }
    setStep(s => s + 1)
  }
  const back = () => setStep(s => s - 1)

  const submit = async e => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch('/api/book-pickup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slot: slotLabel,
          slot_date: selectedDate ? formatDateKey(selectedDate) : null,
          slot_time: selectedSlot ? selectedSlot.time : null,
        }),
      })
    } catch (_) {}
    setDone(true)
    setSubmitting(false)
  }

  // ── Success screen ────────────────────────────────────────────
  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--c-bg)' }}>
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(156,110,40,0.10)', border: '1px solid var(--c-border-s)' }}>
          <Check size={28} style={{ color: 'var(--c-accent)' }} />
        </div>
        <h2 className="font-serif text-3xl font-bold mb-3" style={{ color: 'var(--c-text)' }}>Booking Confirmed!</h2>
        <p className="text-sm mb-2" style={{ color: 'var(--c-muted)' }}>
          A confirmation has been sent to <strong style={{ color: 'var(--c-text)' }}>{form.email}</strong>.
        </p>
        <p className="text-sm mb-1" style={{ color: 'var(--c-muted)' }}>
          Slot: <strong style={{ color: 'var(--c-text)' }}>{slotLabel}</strong>
        </p>
        <p className="text-sm mb-6" style={{ color: 'var(--c-muted)' }}>
          Please bring your lot numbers and a valid photo ID.
        </p>
        <button
          onClick={resetAll}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--c-accent)' }}
        >
          Book Another Pickup
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Hero */}
      <section className="py-12 text-center" style={{ background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--c-gold)' }}>
            Schedule Your Visit
          </p>
          <h1 className="font-serif text-4xl font-bold mb-6" style={{ color: 'var(--c-text)' }}>
            Book a <span style={{ color: 'var(--c-gold)' }}>Pickup Slot</span>
          </h1>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-0">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={{
                      background: i <= step ? 'var(--c-accent)' : 'rgba(156,110,40,0.08)',
                      color: i <= step ? '#fff' : 'var(--c-muted)',
                      border: i === step ? '2px solid var(--c-border-s)' : '2px solid transparent',
                    }}>
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span className="text-[10px] mt-1.5 uppercase tracking-wider font-medium"
                    style={{ color: i === step ? 'var(--c-text)' : 'var(--c-muted)' }}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-14 h-px mx-2 mb-4"
                    style={{ background: i < step ? 'var(--c-accent)' : 'var(--c-border)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 rounded-2xl" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>

            {/* ── STEP 0: Your Info ── */}
            {step === 0 && (
              <form onSubmit={next} className="space-y-4">
                <h2 className="font-serif text-xl font-bold mb-5" style={{ color: 'var(--c-text)' }}>Your Information</h2>
                {[
                  ['name',  'Full Name',     'text',  'John Smith'],
                  ['email', 'Email Address', 'email', 'you@email.com'],
                  ['phone', 'Phone Number',  'tel',   '(519) 000-0000'],
                ].map(([k, label, type, ph]) => (
                  <div key={k}>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: 'var(--c-muted)' }}>{label}</label>
                    <input type={type} required placeholder={ph} value={form[k]} onChange={set(k)}
                      className={inputClass} style={{ ...inputStyle }}
                      onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                ))}
                <button type="submit"
                  className="w-full py-3 mt-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'var(--c-accent)' }}>
                  Continue →
                </button>
              </form>
            )}

            {/* ── STEP 1: Pickup Details ── */}
            {step === 1 && (
              <form onSubmit={next} className="space-y-6">
                <h2 className="font-serif text-xl font-bold" style={{ color: 'var(--c-text)' }}>Choose a Pickup Slot</h2>

                {/* Lot numbers */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: 'var(--c-muted)' }}>Lot Numbers</label>
                  <input id="lots-input" type="text" required placeholder="e.g. 1042, 1043, 1098"
                    value={form.lots} onChange={set('lots')}
                    className={inputClass} style={{ ...inputStyle }}
                    onFocus={focusStyle} onBlur={blurStyle} />
                  <p className="text-xs mt-1.5" style={{ color: 'var(--c-muted)' }}>Separate multiple lot numbers with commas.</p>
                </div>

                {/* Day picker */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: 'var(--c-muted)' }}>Select a Day</label>

                  {openDates.length === 0 ? (
                    <div className="flex items-center gap-2 py-4" style={{ color: 'var(--c-muted)' }}>
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm">Loading available days…</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {openDates.map(date => {
                        const key = formatDateKey(date)
                        const isSelected = selectedDate && formatDateKey(selectedDate) === key
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setSelectedDate(date)}
                            style={{
                              padding: '7px 14px',
                              borderRadius: 20,
                              border: isSelected ? '2px solid var(--c-accent)' : '1px solid var(--c-border)',
                              background: isSelected ? 'rgba(156,110,40,0.10)' : 'var(--c-surface)',
                              color: isSelected ? 'var(--c-gold)' : 'var(--c-muted)',
                              fontSize: 13,
                              fontWeight: isSelected ? 600 : 400,
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                          >
                            {formatDayPill(date)}
                          </button>
                        )
                      })}

                      {/* Custom date picker pill */}
                      <label
                        style={{
                          padding: '7px 14px',
                          borderRadius: 20,
                          border: selectedDate && !openDates.some(d => formatDateKey(d) === formatDateKey(selectedDate))
                            ? '2px solid var(--c-accent)'
                            : '1px dashed var(--c-border)',
                          background: selectedDate && !openDates.some(d => formatDateKey(d) === formatDateKey(selectedDate))
                            ? 'rgba(156,110,40,0.10)'
                            : 'transparent',
                          color: selectedDate && !openDates.some(d => formatDateKey(d) === formatDateKey(selectedDate))
                            ? 'var(--c-gold)'
                            : 'var(--c-muted)',
                          fontSize: 13,
                          fontWeight: selectedDate && !openDates.some(d => formatDateKey(d) === formatDateKey(selectedDate)) ? 600 : 400,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          transition: 'all 0.15s',
                          userSelect: 'none',
                        }}
                      >
                        <span>📅</span>
                        {selectedDate && !openDates.some(d => formatDateKey(d) === formatDateKey(selectedDate))
                          ? formatDayPill(selectedDate)
                          : 'Pick a date'}
                        <input
                          type="date"
                          min={getTomorrow()}
                          style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
                          onChange={e => {
                            if (!e.target.value) return
                            const [y, m, d] = e.target.value.split('-').map(Number)
                            setSelectedDate(new Date(y, m - 1, d))
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Slot grid */}
                {selectedDate && (
                  <div id="slot-grid">
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1"
                      style={{ color: 'var(--c-muted)' }}>
                      {DAY_NAMES[selectedDate.getDay()]} · {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getDate()}
                    </label>

                    {/* Working hours label */}
                    {schedule && (() => {
                      const cfg = schedule.find(d => d.day_of_week === selectedDate.getDay())
                      if (cfg && cfg.is_open) return (
                        <p className="text-xs mb-3" style={{ color: 'var(--c-muted)' }}>
                          Open {fmt12(cfg.open_time)} – {fmt12(cfg.close_time)} · {cfg.slot_duration_minutes}-min slots
                        </p>
                      )
                    })()}

                    {loadingSlots ? (
                      <div className="flex items-center gap-2 py-6" style={{ color: 'var(--c-muted)' }}>
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-sm">Loading slots…</span>
                      </div>
                    ) : slots && slots.length === 0 ? (
                      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs leading-relaxed"
                        style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.3)', color: '#92400e' }}>
                        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
                        We don't typically do pickups on {DAY_NAMES[selectedDate.getDay()]}s. We'll contact you to arrange an alternative time.
                      </div>
                    ) : slots ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))', gap: 8 }}>
                        {slots.map(slot => {
                          const full = !slot.available
                          const isSelected = selectedSlot?.time === slot.time
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={full}
                              onClick={() => setSelectedSlot(slot)}
                              style={{
                                borderRadius: 10,
                                border: isSelected
                                  ? '2px solid var(--c-accent)'
                                  : '1px solid var(--c-border)',
                                padding: '10px 12px',
                                textAlign: 'left',
                                background: full
                                  ? 'var(--c-bg)'
                                  : isSelected
                                    ? 'rgba(156,110,40,0.08)'
                                    : 'var(--c-surface)',
                                opacity: full ? 0.5 : 1,
                                cursor: full ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s',
                              }}
                            >
                              <div style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: full ? 'var(--c-muted)' : isSelected ? 'var(--c-gold)' : 'var(--c-text)',
                                marginBottom: 2,
                              }}>
                                {fmt12(slot.time)}
                              </div>
                              <CapDots booked={slot.booked} max={slot.max} full={full} />
                            </button>
                          )
                        })}
                      </div>
                    ) : null}

                    {/* Legend */}
                    {slots && slots.length > 0 && (
                      <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                        {[
                          { label: 'Available', dots: [false, false, false, false] },
                          { label: 'Partial',   dots: [true, true, false, false] },
                          { label: 'Full',      dots: [true, true, true, true], full: true },
                        ].map(({ label, dots, full }) => (
                          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--c-muted)' }}>
                            <div style={{ display: 'flex', gap: 2 }}>
                              {dots.map((filled, i) => (
                                <div key={i} style={{
                                  width: 6, height: 6, borderRadius: '50%',
                                  background: filled ? (full ? '#c49a38' : '#9c6e28') : 'var(--c-border)',
                                }} />
                              ))}
                            </div>
                            {label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Selected slot pill */}
                {selectedSlot && selectedDate && (
                  <div className="px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                    style={{ background: 'rgba(156,110,40,0.08)', border: '1px solid var(--c-border-s)', color: 'var(--c-gold)' }}>
                    <Check size={14} />
                    <strong>{slotLabel}</strong>
                    <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.7 }}>
                      — {selectedSlot.max - selectedSlot.booked} spot{selectedSlot.max - selectedSlot.booked === 1 ? '' : 's'} remaining
                    </span>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: 'var(--c-muted)' }}>Notes (optional)</label>
                  <textarea rows={3} placeholder="Large items, accessibility needs, or other requests…"
                    value={form.notes} onChange={set('notes')}
                    className={inputClass + ' resize-none'} style={{ ...inputStyle }}
                    onFocus={focusStyle} onBlur={blurStyle} />
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={back}
                    className="flex-1 py-3 rounded-xl text-sm font-medium"
                    style={{ background: 'rgba(156,110,40,0.04)', color: 'var(--c-muted)', border: '1px solid var(--c-border)' }}>
                    ← Back
                  </button>
                  <button type="submit" disabled={!selectedSlot}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                    style={{ background: 'var(--c-accent)' }}>
                    Review →
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP 2: Confirm ── */}
            {step === 2 && (
              <form onSubmit={submit} className="space-y-4">
                <h2 className="font-serif text-xl font-bold mb-5" style={{ color: 'var(--c-text)' }}>Confirm Your Booking</h2>
                <div className="space-y-3 p-5 rounded-xl"
                  style={{ background: 'rgba(156,110,40,0.04)', border: '1px solid var(--c-border)' }}>
                  {[
                    ['Name',    form.name],
                    ['Email',   form.email],
                    ['Phone',   form.phone],
                    ['Lots',    form.lots],
                    ['Slot',    slotLabel],
                    form.notes && ['Notes', form.notes],
                  ].filter(Boolean).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 text-sm">
                      <span className="font-medium flex-shrink-0" style={{ color: 'var(--c-muted)' }}>{k}</span>
                      <span className="text-right break-words" style={{ color: 'var(--c-text)' }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Capacity warning if nearly full */}
                {selectedSlot && selectedSlot.max - selectedSlot.booked === 1 && (
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs"
                    style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.3)', color: '#92400e' }}>
                    <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
                    This is the last spot for this slot. Confirm quickly to secure it.
                  </div>
                )}

                <p className="text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                  Your slot is held pending confirmation. We'll email you within 24 hours. Please bring a valid photo ID — payment must be completed before items are released.
                </p>

                <div className="flex gap-3">
                  <button type="button" onClick={back}
                    className="flex-1 py-3 rounded-xl text-sm font-medium"
                    style={{ background: 'rgba(156,110,40,0.04)', color: 'var(--c-muted)', border: '1px solid var(--c-border)' }}>
                    ← Back
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'var(--c-accent)' }}>
                    {submitting ? 'Sending…' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </section>
    </>
  )
}
