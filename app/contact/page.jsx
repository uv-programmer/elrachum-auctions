'use client'

import { useState } from 'react'
import { MapPin, Mail, Clock, Phone, Send, CheckCircle } from 'lucide-react'
import { useWorkingHours } from '@/hooks/useWorkingHours'

const inputCls = {
  background: 'rgba(156,110,40,0.04)',
  border: '1px solid var(--c-border)',
  color: 'var(--c-text)',
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const hours = useWorkingHours('Tue & Thu: 11AM–5PM · Sat: 10AM–2PM')

  const info = [
    { icon: <MapPin size={16} />, label: 'Location',     text: '2825 County Road 42, Windsor, Ontario N8V 0A4' },
    { icon: <Mail size={16} />,   label: 'Email',        text: 'contact@elrachumauctions.com', href: 'mailto:contact@elrachumauctions.com' },
    { icon: <Phone size={16} />,  label: 'Phone',        text: '(519) 982-3332', href: 'tel:+15199823332' },
    { icon: <Clock size={16} />,  label: 'Pickup Hours', text: hours },
  ]

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
      <section className="py-16 text-center" style={{ background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--c-gold)' }}>Get In Touch</p>
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: 'var(--c-text)' }}>Contact <span style={{ color: 'var(--c-gold)' }}>Us</span></h1>
          <p className="text-sm" style={{ color: 'var(--c-muted)' }}>Questions about an auction, a pickup, or anything else? We're happy to help.</p>
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Info sidebar */}
            <div className="lg:col-span-2 space-y-4">
              {info.map(({ icon, label, text, href }) => (
                <div key={label} className="flex gap-4 items-start p-5 rounded-2xl" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(156,110,40,0.08)', color: 'var(--c-gold)' }}>{icon}</div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--c-muted)' }}>{label}</div>
                    {href
                      ? <a href={href} className="text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--c-text)' }}>{text}</a>
                      : <div className="text-sm" style={{ color: 'var(--c-text)' }}>{text}</div>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-3 p-8 rounded-2xl" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
              {status === 'sent' ? (
                <div className="text-center py-8 flex flex-col items-center gap-4">
                  <CheckCircle size={48} style={{ color: 'var(--c-accent)' }} />
                  <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--c-text)' }}>Message Sent!</h3>
                  <p className="text-sm" style={{ color: 'var(--c-muted)' }}>We'll get back to you within 1–2 business days.</p>
                  <button onClick={() => setStatus(null)} className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--c-accent)' }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <h2 className="font-serif text-xl font-bold mb-5" style={{ color: 'var(--c-text)' }}>Send a Message</h2>
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
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                          style={inputCls}
                          onFocus={e => e.currentTarget.style.borderColor = 'var(--c-accent)'}
                          onBlur={e => e.currentTarget.style.borderColor = 'var(--c-border)'}
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
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={inputCls}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--c-accent)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--c-border)'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--c-muted)' }}>Message</label>
                    <textarea
                      required rows={5} placeholder="Tell us more…"
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                      style={inputCls}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--c-accent)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--c-border)'}
                    />
                  </div>
                  {status === 'error' && <p className="text-xs" style={{ color: '#b91c1c' }}>Something went wrong. Please try again or email us directly.</p>}
                  <button
                    type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'var(--c-accent)' }}
                  >
                    {loading ? 'Sending…' : <><Send size={15} /> Send Message</>}
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
