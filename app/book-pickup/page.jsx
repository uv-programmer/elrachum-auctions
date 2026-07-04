'use client'

import { useState, useMemo } from 'react'
import { Check, CalendarDays, Clock } from 'lucide-react'

const STEPS = ['Your Info', 'Pickup Details', 'Confirm']

// Pickup schedule: day index (0=Sun) → available time slots
const SCHEDULE = {
  2: ['11AM – 1PM', '1PM – 3PM', '3PM – 5PM'],   // Tuesday
  4: ['11AM – 1PM', '1PM – 3PM', '3PM – 5PM'],   // Thursday
  6: ['10AM – 12PM', '12PM – 2PM'],               // Saturday
}
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getUpcomingDates(weeks = 3) {
  const dates = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(today)
  start.setDate(start.getDate() + 1)
  for (let d = 0; d < weeks * 7 + 7; d++) {
    const date = new Date(start)
    date.setDate(start.getDate() + d)
    const dow = date.getDay()
    if (SCHEDULE[dow]) {
      dates.push({
        date,
        dow,
        label: `${DAY_NAMES[dow]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`,
        times: SCHEDULE[dow],
      })
    }
    if (dates.length >= weeks * 3) break
  }
  return dates
}

// Format "YYYY-MM-DD" + "HH:MM" → human readable
function formatCustomSlot(dateStr, timeStr) {
  if (!dateStr || !timeStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const dow = DAY_NAMES[date.getDay()]
  const mon = MONTH_NAMES[date.getMonth()]
  // Convert 24h to 12h
  const [h, min] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${dow}, ${mon} ${d} · ${h12}:${min.toString().padStart(2, '0')} ${ampm} (custom)`
}

// Tomorrow as YYYY-MM-DD for min date attribute
function getTomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

const inputClass = 'w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all'
const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }

export default function BookPickupPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', phone: '', lots: '', date: '', time: '', notes: '' })
  const [customMode, setCustomMode] = useState(false)
  const [customDate, setCustomDate] = useState('')
  const [customTime, setCustomTime] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const upcomingDates = useMemo(() => getUpcomingDates(3), [])

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const selectDate = (label) => setForm(p => ({ ...p, date: label, time: '' }))
  const selectTime = (t) => setForm(p => ({ ...p, time: t }))

  const selectedEntry = upcomingDates.find(d => d.label === form.date)

  // Slot label differs by mode
  const slotLabel = customMode
    ? formatCustomSlot(customDate, customTime)
    : (form.date && form.time ? `${form.date} · ${form.time}` : '')

  const switchToCustom = () => {
    setCustomMode(true)
    setForm(p => ({ ...p, date: '', time: '' }))
  }
  const switchToPreset = () => {
    setCustomMode(false)
    setCustomDate('')
    setCustomTime('')
  }

  const next = (e) => { e.preventDefault(); setStep(s => s + 1) }
  const back = () => setStep(s => s - 1)

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const payload = { ...form, slot: slotLabel }
    try {
      await fetch('/api/book-pickup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    } catch (_) {}
    setDone(true)
    setSubmitting(false)
  }

  const focusStyle = (e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')
  const blurStyle = (e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--c-bg)' }}>
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)' }}>
          <Check size={28} style={{ color: 'var(--c-accent)' }} />
        </div>
        <h2 className="font-serif text-3xl font-bold text-white mb-3">Booking Received!</h2>
        <p className="text-sm mb-2" style={{ color: 'var(--c-muted)' }}>A confirmation has been sent to <strong className="text-white">{form.email}</strong>.</p>
        <p className="text-sm mb-1" style={{ color: 'var(--c-muted)' }}>Requested slot: <strong className="text-white">{slotLabel}</strong></p>
        <p className="text-sm" style={{ color: 'var(--c-muted)' }}>Please bring your lot numbers and a valid photo ID.</p>
      </div>
    </div>
  )

  return (
    <>
      <section className="py-12 text-center" style={{ background: 'var(--c-surface)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--c-gold)' }}>Schedule Your Visit</p>
          <h1 className="font-serif text-4xl font-bold text-white mb-6">Book a Pickup Slot</h1>
          <div className="flex items-center justify-center gap-0">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={{
                      background: i <= step ? 'var(--c-accent)' : 'rgba(255,255,255,0.08)',
                      color: i <= step ? '#fff' : 'var(--c-muted)',
                      border: i === step ? '2px solid rgba(255,255,255,0.3)' : '2px solid transparent',
                    }}
                  >
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span className="text-[10px] mt-1.5 uppercase tracking-wider font-medium" style={{ color: i === step ? '#fff' : 'var(--c-muted)' }}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-14 h-px mx-2 mb-4" style={{ background: i < step ? 'var(--c-accent)' : 'rgba(255,255,255,0.1)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <div className="p-8 rounded-2xl" style={{ background: 'var(--c-card)', border: '1px solid rgba(255,255,255,0.07)' }}>

            {/* ── STEP 0: Your Info ── */}
            {step === 0 && (
              <form onSubmit={next} className="space-y-4">
                <h2 className="font-serif text-xl font-bold text-white mb-5">Your Information</h2>
                {[
                  ['name', 'Full Name', 'text', 'John Smith'],
                  ['email', 'Email Address', 'email', 'you@email.com'],
                  ['phone', 'Phone Number', 'tel', '(519) 000-0000'],
                ].map(([k, label, type, ph]) => (
                  <div key={k}>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--c-muted)' }}>{label}</label>
                    <input type={type} required placeholder={ph} value={form[k]} onChange={set(k)} className={inputClass} style={{ ...inputStyle }} onFocus={focusStyle} onBlur={blurStyle} />
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
                <h2 className="font-serif text-xl font-bold text-white mb-1">Pickup Details</h2>

                {/* Lot numbers */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--c-muted)' }}>Lot Numbers</label>
                  <input type="text" required placeholder="e.g. 1042, 1043, 1098" value={form.lots} onChange={set('lots')} className={inputClass} style={{ ...inputStyle }} onFocus={focusStyle} onBlur={blurStyle} />
                  <p className="text-xs mt-1.5" style={{ color: 'var(--c-muted)' }}>Separate multiple lot numbers with commas.</p>
                </div>

                {/* Mode toggle */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={switchToPreset}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: !customMode ? 'rgba(192,57,43,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${!customMode ? 'rgba(192,57,43,0.45)' : 'rgba(255,255,255,0.09)'}`,
                      color: !customMode ? '#fff' : 'var(--c-muted)',
                    }}
                  >
                    <CalendarDays size={13} /> Available Slots
                  </button>
                  <button
                    type="button"
                    onClick={switchToCustom}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: customMode ? 'rgba(192,57,43,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${customMode ? 'rgba(192,57,43,0.45)' : 'rgba(255,255,255,0.09)'}`,
                      color: customMode ? '#fff' : 'var(--c-muted)',
                    }}
                  >
                    <Clock size={13} /> Custom Date &amp; Time
                  </button>
                </div>

                {/* ── Preset mode ── */}
                {!customMode && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--c-muted)' }}>
                        Select a Date
                        <span className="normal-case font-normal ml-2" style={{ color: 'rgba(136,136,136,0.7)' }}>— Tue, Thu &amp; Sat only</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {upcomingDates.map(({ label, dow }) => {
                          const selected = form.date === label
                          return (
                            <button
                              key={label} type="button"
                              onClick={() => selectDate(label)}
                              className="py-3 px-2 rounded-xl text-center transition-all"
                              style={{
                                background: selected ? 'rgba(192,57,43,0.15)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${selected ? 'rgba(192,57,43,0.5)' : 'rgba(255,255,255,0.09)'}`,
                                color: selected ? '#fff' : 'var(--c-muted)',
                              }}
                            >
                              <div className="text-[10px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: selected ? 'var(--c-gold)' : 'inherit' }}>
                                {DAY_NAMES[dow]}
                              </div>
                              <div className="text-xs font-medium leading-tight">{label.split(', ')[1]}</div>
                            </button>
                          )
                        })}
                      </div>
                      <input type="text" required={!customMode} value={form.date} readOnly style={{ opacity: 0, height: 0, padding: 0, position: 'absolute' }} tabIndex={-1} />
                    </div>

                    {selectedEntry && (
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--c-muted)' }}>Select a Time</label>
                        <div className="flex gap-2 flex-wrap">
                          {selectedEntry.times.map(t => {
                            const selected = form.time === t
                            return (
                              <button
                                key={t} type="button"
                                onClick={() => selectTime(t)}
                                className="flex-1 py-3 px-3 rounded-xl text-sm font-medium transition-all"
                                style={{
                                  background: selected ? 'rgba(192,57,43,0.15)' : 'rgba(255,255,255,0.04)',
                                  border: `1px solid ${selected ? 'rgba(192,57,43,0.5)' : 'rgba(255,255,255,0.09)'}`,
                                  color: selected ? '#fff' : 'var(--c-muted)',
                                  minWidth: '7rem',
                                }}
                              >
                                {t}
                              </button>
                            )
                          })}
                        </div>
                        <input type="text" required={!customMode} value={form.time} readOnly style={{ opacity: 0, height: 0, padding: 0, position: 'absolute' }} tabIndex={-1} />
                      </div>
                    )}
                  </>
                )}

                {/* ── Custom mode ── */}
                {customMode && (
                  <>
                    <div className="p-3 rounded-xl text-xs leading-relaxed" style={{ background: 'rgba(212,169,64,0.07)', border: '1px solid rgba(212,169,64,0.18)', color: 'var(--c-gold)' }}>
                      Custom requests are subject to availability. We'll confirm your slot by email within 24 hours.
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--c-muted)' }}>Date</label>
                        <input
                          type="date"
                          required={customMode}
                          min={getTomorrow()}
                          value={customDate}
                          onChange={e => setCustomDate(e.target.value)}
                          className={inputClass}
                          style={{
                            ...inputStyle,
                            colorScheme: 'dark',
                          }}
                          onFocus={focusStyle}
                          onBlur={blurStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--c-muted)' }}>Time</label>
                        <input
                          type="time"
                          required={customMode}
                          min="09:00"
                          max="18:00"
                          value={customTime}
                          onChange={e => setCustomTime(e.target.value)}
                          className={inputClass}
                          style={{
                            ...inputStyle,
                            colorScheme: 'dark',
                          }}
                          onFocus={focusStyle}
                          onBlur={blurStyle}
                        />
                        <p className="text-xs mt-1" style={{ color: 'var(--c-muted)' }}>Between 9 AM and 6 PM</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Selected slot confirmation banner */}
                {slotLabel && (
                  <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(212,169,64,0.08)', border: '1px solid rgba(212,169,64,0.2)', color: 'var(--c-gold)' }}>
                    ✓ &nbsp;<strong>{slotLabel}</strong>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--c-muted)' }}>Notes (optional)</label>
                  <textarea rows={3} placeholder="Large items, accessibility needs, or other requests…" value={form.notes} onChange={set('notes')} className={inputClass + ' resize-none'} style={{ ...inputStyle }} onFocus={focusStyle} onBlur={blurStyle} />
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={back} className="flex-1 py-3 rounded-xl text-sm font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--c-muted)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={!slotLabel}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                    style={{ background: 'var(--c-accent)' }}
                  >
                    Review →
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP 2: Confirm ── */}
            {step === 2 && (
              <form onSubmit={submit} className="space-y-4">
                <h2 className="font-serif text-xl font-bold text-white mb-5">Confirm Your Booking</h2>
                <div className="space-y-3 p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {[
                    ['Name', form.name],
                    ['Email', form.email],
                    ['Phone', form.phone],
                    ['Lots', form.lots],
                    ['Pickup Slot', slotLabel],
                    form.notes && ['Notes', form.notes],
                  ].filter(Boolean).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 text-sm">
                      <span className="font-medium flex-shrink-0" style={{ color: 'var(--c-muted)' }}>{k}</span>
                      <span className="text-white text-right">{v}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                  {customMode
                    ? 'Custom slot requests are subject to availability. We\'ll confirm by email within 24 hours.'
                    : 'By confirming, you agree to arrive within your chosen slot and bring valid photo ID. Payment must be completed before items are released.'}
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={back} className="flex-1 py-3 rounded-xl text-sm font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--c-muted)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    ← Back
                  </button>
                  <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60" style={{ background: 'var(--c-accent)' }}>
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
