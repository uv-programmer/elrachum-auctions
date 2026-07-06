'use client'

import { useState, useEffect, useMemo } from 'react'
import { Check, CalendarDays, Clock, AlertCircle } from 'lucide-react'

const STEPS = ['Your Info', 'Pickup Details', 'Confirm']
const DAY_NAMES  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Fallback if /api/schedule is unavailable
const FALLBACK_OPEN_DAYS = [2, 4, 6] // Tue, Thu, Sat

function getUpcomingDates(openDayNumbers, weeks = 4) {
  const dates = []
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const start = new Date(today); start.setDate(start.getDate() + 1)
  for (let i = 0; dates.length < weeks * openDayNumbers.length && i < 90; i++) {
    const date = new Date(start); date.setDate(start.getDate() + i)
    if (openDayNumbers.includes(date.getDay())) {
      dates.push({
        dateStr: date.toISOString().split('T')[0], // YYYY-MM-DD
        dow: date.getDay(),
        label: `${DAY_NAMES[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`,
      })
    }
  }
  return dates.slice(0, weeks * 3)
}

const inputClass = 'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all'
const inputStyle = { background: 'rgba(156,110,40,0.04)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }

export default function BookPickupPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', phone: '', lots: '', notes: '' })

  // Schedule from /api/schedule
  const [openDays, setOpenDays] = useState(null) // null = loading, [] = error/fallback

  // Selected date + live slots
  const [selectedDate, setSelectedDate] = useState(null)  // 'YYYY-MM-DD'
  const [slotsData, setSlotsData] = useState(null)        // { isOpen, slots }
  const [slotsLoading, setSlotsLoading] = useState(false)

  // Selected slot
  const [selectedSlot, setSelectedSlot] = useState(null)  // { time, timeLabel }

  // Custom mode
  const [customMode, setCustomMode] = useState(false)
  const [customDate, setCustomDate] = useState('')
  const [customTime, setCustomTime] = useState('')

  // Submission
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  // ── Load open days on mount ──────────────────────────────────
  useEffect(() => {
    fetch('/api/schedule')
      .then(r => r.json())
      .then(data => {
        if (data.days) {
          const open = data.days.filter(d => d.is_open).map(d => d.day_of_week)
          setOpenDays(open.length ? open : FALLBACK_OPEN_DAYS)
        } else {
          setOpenDays(FALLBACK_OPEN_DAYS)
        }
      })
      .catch(() => setOpenDays(FALLBACK_OPEN_DAYS))
  }, [])

  // ── Load slots when a date is selected ──────────────────────
  useEffect(() => {
    if (!selectedDate || customMode) return
    setSlotsLoading(true)
    setSlotsData(null)
    setSelectedSlot(null)
    fetch(`/api/slots?date=${selectedDate}`)
      .then(r => r.json())
      .then(data => setSlotsData(data))
      .catch(() => setSlotsData({ isOpen: false, slots: [], error: true }))
      .finally(() => setSlotsLoading(false))
  }, [selectedDate, customMode])

  const upcomingDates = useMemo(
    () => openDays ? getUpcomingDates(openDays) : [],
    [openDays]
  )

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const focusStyle = e => (e.currentTarget.style.borderColor = 'var(--c-accent)')
  const blurStyle  = e => (e.currentTarget.style.borderColor = 'var(--c-border)')

  // Human-readable slot label for display + email
  const slotLabel = useMemo(() => {
    if (customMode) {
      if (!customDate || !customTime) return ''
      const [y, m, d] = customDate.split('-').map(Number)
      const date = new Date(y, m - 1, d)
      const [h, min] = customTime.split(':').map(Number)
      const ampm = h >= 12 ? 'PM' : 'AM'
      const h12 = h % 12 || 12
      return `${DAY_NAMES[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${d} · ${h12}:${String(min).padStart(2, '0')} ${ampm} (custom request)`
    }
    if (!selectedDate || !selectedSlot) return ''
    const [y, m, d] = selectedDate.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    return `${DAY_NAMES[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${d} · ${selectedSlot.timeLabel}`
  }, [customMode, customDate, customTime, selectedDate, selectedSlot])

  const switchToCustom = () => {
    setCustomMode(true)
    setSelectedDate(null)
    setSlotsData(null)
    setSelectedSlot(null)
  }
  const switchToPreset = () => {
    setCustomMode(false)
    setCustomDate('')
    setCustomTime('')
  }

  const next = e => { e.preventDefault(); setStep(s => s + 1) }
  const back = () => setStep(s => s - 1)

  const submit = async e => {
    e.preventDefault()
    setSubmitting(true)
    const payload = {
      ...form,
      slot: slotLabel,
      slot_date: customMode ? (customDate || null) : (selectedDate || null),
      slot_time: customMode ? (customTime || null) : (selectedSlot?.time || null),
    }
    try {
      await fetch('/api/book-pickup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (_) {}
    setDone(true)
    setSubmitting(false)
  }

  // ── Success screen ───────────────────────────────────────────
  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--c-bg)' }}>
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(156,110,40,0.10)', border: '1px solid var(--c-border-s)' }}>
          <Check size={28} style={{ color: 'var(--c-accent)' }} />
        </div>
        <h2 className="font-serif text-3xl font-bold mb-3" style={{ color: 'var(--c-text)' }}>Booking Received!</h2>
        <p className="text-sm mb-2" style={{ color: 'var(--c-muted)' }}>A confirmation has been sent to <strong style={{ color: 'var(--c-text)' }}>{form.email}</strong>.</p>
        <p className="text-sm mb-1" style={{ color: 'var(--c-muted)' }}>Slot: <strong style={{ color: 'var(--c-text)' }}>{slotLabel}</strong></p>
        <p className="text-sm" style={{ color: 'var(--c-muted)' }}>Please bring your lot numbers and a valid photo ID.</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Hero */}
      <section className="py-12 text-center" style={{ background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="max-w-xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--c-gold)' }}>Schedule Your Visit</p>
          <h1 className="font-serif text-4xl font-bold mb-6" style={{ color: 'var(--c-text)' }}>
            Book a <span style={{ color: 'var(--c-gold)' }}>Pickup Slot</span>
          </h1>
          {/* Step progress */}
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
                  <span className="text-[10px] mt-1.5 uppercase tracking-wider font-medium" style={{ color: i === step ? 'var(--c-text)' : 'var(--c-muted)' }}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-14 h-px mx-2 mb-4" style={{ background: i < step ? 'var(--c-accent)' : 'var(--c-border)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 rounded-2xl" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>

            {/* ── STEP 0: Your Info ── */}
            {step === 0 && (
              <form onSubmit={next} className="space-y-4">
                <h2 className="font-serif text-xl font-bold mb-5" style={{ color: 'var(--c-text)' }}>Your Information</h2>
                {[
                  ['name',  'Full Name',      'text',  'John Smith'],
                  ['email', 'Email Address',   'email', 'you@email.com'],
                  ['phone', 'Phone Number',    'tel',   '(519) 000-0000'],
                ].map(([k, label, type, ph]) => (
                  <div key={k}>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--c-muted)' }}>{label}</label>
                    <input type={type} required placeholder={ph} value={form[k]} onChange={set(k)}
                      className={inputClass} style={{ ...inputStyle }} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                ))}
                <button type="submit" className="w-full py-3 mt-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: 'var(--c-accent)' }}>
                  Continue →
                </button>
              </form>
            )}

            {/* ── STEP 1: Pickup Details ── */}
            {step === 1 && (
              <form onSubmit={next} className="space-y-5">
                <h2 className="font-serif text-xl font-bold mb-1" style={{ color: 'var(--c-text)' }}>Pickup Details</h2>

                {/* Lot numbers */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--c-muted)' }}>Lot Numbers</label>
                  <input type="text" required placeholder="e.g. 1042, 1043, 1098" value={form.lots} onChange={set('lots')}
                    className={inputClass} style={{ ...inputStyle }} onFocus={focusStyle} onBlur={blurStyle} />
                  <p className="text-xs mt-1.5" style={{ color: 'var(--c-muted)' }}>Separate multiple lot numbers with commas.</p>
                </div>

                {/* Mode toggle */}
                <div className="flex gap-2">
                  <button type="button" onClick={switchToPreset}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: !customMode ? 'rgba(156,110,40,0.10)' : 'rgba(156,110,40,0.04)',
                      border: `1px solid ${!customMode ? 'var(--c-border-s)' : 'var(--c-border)'}`,
                      color: !customMode ? 'var(--c-accent)' : 'var(--c-muted)',
                    }}>
                    <CalendarDays size={13} /> Available Slots
                  </button>
                  <button type="button" onClick={switchToCustom}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: customMode ? 'rgba(156,110,40,0.10)' : 'rgba(156,110,40,0.04)',
                      border: `1px solid ${customMode ? 'var(--c-border-s)' : 'var(--c-border)'}`,
                      color: customMode ? 'var(--c-accent)' : 'var(--c-muted)',
                    }}>
                    <Clock size={13} /> Custom Request
                  </button>
                </div>

                {/* ── Preset mode ── */}
                {!customMode && (
                  <>
                    {/* Date grid */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--c-muted)' }}>
                        Select a Date
                        {openDays === null && <span className="normal-case font-normal ml-2 opacity-60">Loading…</span>}
                      </label>

                      {openDays !== null && upcomingDates.length === 0 && (
                        <div className="flex items-center gap-2 text-xs py-3 px-4 rounded-xl" style={{ background: 'rgba(156,110,40,0.06)', border: '1px solid var(--c-border)', color: 'var(--c-muted)' }}>
                          <AlertCircle size={14} style={{ color: 'var(--c-accent)' }} />
                          No pickup dates available. Please check back later or use Custom Request.
                        </div>
                      )}

                      {openDays === null ? (
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="py-3 rounded-xl animate-pulse" style={{ background: 'rgba(156,110,40,0.06)', height: 60 }} />
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {upcomingDates.map(({ dateStr, dow, label }) => {
                            const selected = selectedDate === dateStr
                            return (
                              <button key={dateStr} type="button" onClick={() => setSelectedDate(dateStr)}
                                className="py-3 px-2 rounded-xl text-center transition-all"
                                style={{
                                  background: selected ? 'rgba(156,110,40,0.10)' : 'rgba(156,110,40,0.04)',
                                  border: `1px solid ${selected ? 'var(--c-border-s)' : 'var(--c-border)'}`,
                                  color: selected ? 'var(--c-accent)' : 'var(--c-muted)',
                                }}>
                                <div className="text-[10px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: selected ? 'var(--c-gold)' : 'inherit' }}>
                                  {DAY_NAMES[dow]}
                                </div>
                                <div className="text-xs font-medium leading-tight">{label.split(', ')[1]}</div>
                              </button>
                            )
                          })}
                        </div>
                      )}
                      {/* Hidden required input to enforce selection */}
                      <input type="text" required={!customMode} value={selectedDate || ''} readOnly
                        style={{ opacity: 0, height: 0, padding: 0, position: 'absolute' }} tabIndex={-1} />
                    </div>

                    {/* Slot grid */}
                    {selectedDate && (
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--c-muted)' }}>
                          Select a Time Slot
                        </label>

                        {slotsLoading && (
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                              <div key={i} className="py-4 rounded-xl animate-pulse" style={{ background: 'rgba(156,110,40,0.06)' }} />
                            ))}
                          </div>
                        )}

                        {!slotsLoading && slotsData && !slotsData.isOpen && (
                          <div className="flex items-center gap-2 text-xs py-3 px-4 rounded-xl" style={{ background: 'rgba(156,110,40,0.06)', border: '1px solid var(--c-border)', color: 'var(--c-muted)' }}>
                            <AlertCircle size={14} style={{ color: 'var(--c-accent)' }} />
                            No pickups scheduled for this date. Please choose another day.
                          </div>
                        )}

                        {!slotsLoading && slotsData?.isOpen && (
                          <div className="grid grid-cols-3 gap-2">
                            {slotsData.slots.map(slot => {
                              const selected = selectedSlot?.time === slot.time
                              const full = !slot.available
                              return (
                                <button
                                  key={slot.time}
                                  type="button"
                                  disabled={full}
                                  onClick={() => !full && setSelectedSlot(slot)}
                                  className="py-3 px-2 rounded-xl text-center transition-all relative"
                                  style={{
                                    background: full
                                      ? 'rgba(0,0,0,0.03)'
                                      : selected
                                        ? 'rgba(156,110,40,0.12)'
                                        : 'rgba(156,110,40,0.04)',
                                    border: `1px solid ${selected ? 'var(--c-border-s)' : 'var(--c-border)'}`,
                                    color: full ? '#ccc' : selected ? 'var(--c-accent)' : 'var(--c-muted)',
                                    cursor: full ? 'not-allowed' : 'pointer',
                                    opacity: full ? 0.6 : 1,
                                  }}>
                                  <div className="text-xs font-semibold">{slot.timeLabel}</div>
                                  {full ? (
                                    <div className="text-[10px] mt-0.5 font-medium" style={{ color: '#bbb' }}>Full</div>
                                  ) : (
                                    <div className="text-[10px] mt-0.5" style={{ color: selected ? 'var(--c-gold)' : 'var(--c-muted)', opacity: 0.7 }}>
                                      {slot.max - slot.booked} left
                                    </div>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        )}

                        {/* Hidden required input to enforce slot selection */}
                        <input type="text" required={!customMode && !!selectedDate} value={selectedSlot?.time || ''} readOnly
                          style={{ opacity: 0, height: 0, padding: 0, position: 'absolute' }} tabIndex={-1} />
                      </div>
                    )}
                  </>
                )}

                {/* ── Custom mode ── */}
                {customMode && (
                  <>
                    <div className="p-3 rounded-xl text-xs leading-relaxed" style={{ background: 'rgba(156,110,40,0.06)', border: '1px solid var(--c-border)', color: 'var(--c-muted)' }}>
                      Custom requests are subject to availability. We'll confirm your slot by email within 24 hours.
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--c-muted)' }}>Date</label>
                        <input type="date" required={customMode}
                          min={(() => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0] })()}
                          value={customDate} onChange={e => setCustomDate(e.target.value)}
                          className={inputClass} style={{ ...inputStyle, colorScheme: 'light' }}
                          onFocus={focusStyle} onBlur={blurStyle} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--c-muted)' }}>Preferred Time</label>
                        <input type="time" required={customMode} min="09:00" max="18:00"
                          value={customTime} onChange={e => setCustomTime(e.target.value)}
                          className={inputClass} style={{ ...inputStyle, colorScheme: 'light' }}
                          onFocus={focusStyle} onBlur={blurStyle} />
                      </div>
                    </div>
                  </>
                )}

                {/* Selected slot banner */}
                {slotLabel && (
                  <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(156,110,40,0.08)', border: '1px solid var(--c-border-s)', color: 'var(--c-gold)' }}>
                    ✓ &nbsp;<strong>{slotLabel}</strong>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--c-muted)' }}>Notes (optional)</label>
                  <textarea rows={3} placeholder="Large items, accessibility needs, or other requests…"
                    value={form.notes} onChange={set('notes')}
                    className={inputClass + ' resize-none'} style={{ ...inputStyle }}
                    onFocus={focusStyle} onBlur={blurStyle} />
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={back} className="flex-1 py-3 rounded-xl text-sm font-medium"
                    style={{ background: 'rgba(156,110,40,0.04)', color: 'var(--c-muted)', border: '1px solid var(--c-border)' }}>
                    ← Back
                  </button>
                  <button type="submit" disabled={!slotLabel}
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
                <div className="space-y-3 p-5 rounded-xl" style={{ background: 'rgba(156,110,40,0.04)', border: '1px solid var(--c-border)' }}>
                  {[
                    ['Name',        form.name],
                    ['Email',       form.email],
                    ['Phone',       form.phone],
                    ['Lots',        form.lots],
                    ['Pickup Slot', slotLabel],
                    form.notes && ['Notes', form.notes],
                  ].filter(Boolean).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 text-sm">
                      <span className="font-medium flex-shrink-0" style={{ color: 'var(--c-muted)' }}>{k}</span>
                      <span className="text-right break-words" style={{ color: 'var(--c-text)' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                  {customMode
                    ? "Custom slot requests are subject to availability. We'll confirm by email within 24 hours."
                    : 'By confirming, you agree to arrive within your chosen slot and bring valid photo ID. Payment must be completed before items are released.'}
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={back} className="flex-1 py-3 rounded-xl text-sm font-medium"
                    style={{ background: 'rgba(156,110,40,0.04)', color: 'var(--c-muted)', border: '1px solid var(--c-border)' }}>
                    ← Back
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'var(--c-accent)' }}>
                    {submitting ? 'Booking…' : 'Confirm Booking'}
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
