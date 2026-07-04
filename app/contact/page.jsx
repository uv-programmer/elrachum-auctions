'use client'

import { useState } from 'react'
import { MapPin, Mail, Clock, Phone } from 'lucide-react'

const info = [
  { icon: <MapPin size={16} />, label: 'Location', text: '[Client Address], Ontario, Canada' },
  { icon: <Mail size={16} />,   label: 'Email',    text: 'info@example.ca' },
  { icon: <Phone size={16} />,  label: 'Phone',    text: '(519) 000-0000' },
  { icon: <Clock size={16} />,  label: 'Pickup Hours', text: 'Tue & Thu: 11AM–5PM · Sat: 10AM–2PM' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { setStatus('sent'); setForm({ name: '', email: '', subject: '', message: '' }) }
      else setStatus('error')
    } catch { setStatus('error') }
    setLoading(false)
  }

  return (
    <>
      <section className="py-16 text-center" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(192,57,43,0.06) 0%, transparent 60%), var(--c-surface)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--c-gold)' }}>Get In Touch</p>
          <h1 className="font-serif text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-sm" style={{ color: 'var(--c-muted)' }}>Questions about an auction, a pickup, or anything else? We're happy to help.</p>
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Info sidebar */}
            <div className="lg:col-span-2 space-y-4">
              {info.map(({ icon, label, text }) => (
                <div key={label} className="flex gap-4 items-start p-5 rounded-2xl" style={{ background: 'var(--c-card)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--c-gold)' }}>{icon}</div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--c-muted)' }}>{label}</div>
                    <div className="text-sm text-white">{text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-3 p-8 rounded-2xl" style={{ background: 'var(--c-card)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {status === 'sent' ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-3">✅</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Message Sent!</h3>
                  <p className="text-sm" style={{ color: 'var(--c-muted)' }}>We'll get back to you within 1-2 business days.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[['name', 'Name', 'Your name'], ['email', 'Email', 'your@email.com']].map(([id, label, ph]) => (
                      <div key={id}>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--c-muted)' }}>{label}</label>
                        <input
                          type={id === 'email' ? 'email' : 'text'}
                          required
                          placeholder={ph}
                          value={form[id]}
                          onChange={e => setForm(p => ({ ...p, [id]: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                          onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
                          onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--c-muted)' }}>Subject</label>
                    <input
                      type="text" required placeholder="What's this about?"
                      value={form.subject}
                      onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--c-muted)' }}>Message</label>
                    <textarea
                      required rows={5} placeholder="Tell us more…"
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                  {status === 'error' && <p className="text-xs" style={{ color: 'var(--c-accent)' }}>Something went wrong. Please try again or email us directly.</p>}
                  <button
                    type="submit" disabled={loading}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'var(--c-accent)' }}
                  >
                    {loading ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
