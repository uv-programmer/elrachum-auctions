'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Calendar, Package, AlertTriangle, CreditCard, RotateCcw, Timer, Mail, Headphones, Share2 } from 'lucide-react'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function fmt12(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return m ? `${hour}:${String(m).padStart(2, '0')}${period}` : `${hour}${period}`
}

function formatHours(days) {
  const open = days.filter(d => d.is_open)
  if (!open.length) return 'Currently closed\nCheck back soon for updated hours'
  // Group days that share the same open/close time
  const groups = {}
  open.forEach(d => {
    const key = `${d.open_time}|${d.close_time}`
    if (!groups[key]) groups[key] = { open: d.open_time, close: d.close_time, days: [] }
    groups[key].days.push(d.day_of_week)
  })
  const lines = Object.values(groups).map(g => {
    const dayStr = g.days.map(n => DAY_NAMES[n]).join(' & ')
    return `${dayStr}: ${fmt12(g.open)} – ${fmt12(g.close)}`
  })
  const closedDays = days.filter(d => !d.is_open)
  if (closedDays.length) {
    const names = closedDays.map(d => DAY_NAMES[d.day_of_week]).join(', ')
    lines.push(`${names}: Closed`)
  }
  return lines.join('\n')
}

function Counter({ end, suffix = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    let start = 0
    const duration = 1800
    const step = (end / duration) * 16
    const tick = () => {
      start = Math.min(start + step, end)
      if (ref.current) ref.current.textContent = Math.floor(start).toLocaleString() + suffix
      if (start < end) requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { observer.disconnect(); tick() }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, suffix])
  return <span ref={ref}>0{suffix}</span>
}

function Label({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--c-gold)' }}>
      {children}
    </p>
  )
}

export default function HomePage() {
  const [hoursDesc, setHoursDesc] = useState('Loading hours…')

  useEffect(() => {
    fetch('/api/schedule')
      .then(r => r.json())
      .then(({ days }) => { if (days?.length) setHoursDesc(formatHours(days)) })
      .catch(() => setHoursDesc('See website for current hours'))
  }, [])

  return (
    <>
      {/* HERO */}
      <section
        className="relative flex items-center justify-center text-center overflow-hidden"
        style={{
          minHeight: 'calc(100vh - 68px)',
          background: 'radial-gradient(ellipse at 30% 60%, rgba(156,110,40,0.08) 0%, transparent 55%), radial-gradient(ellipse at 70% 20%, rgba(176,124,32,0.06) 0%, transparent 55%), var(--c-bg)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(156,110,40,0.10) 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest"
            style={{ background: 'rgba(156,110,40,0.08)', border: '1px solid var(--c-border-s)', color: 'var(--c-gold)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--c-gold)' }} />
            🍁 Canada's Trusted Auction House
          </div>
          <h1 className="font-serif font-bold leading-[1.06] mb-6" style={{ fontSize: 'clamp(2.8rem,6vw,5.5rem)', color: 'var(--c-text)' }}>
            Bid Smart.<br />
            <span style={{ color: 'var(--c-gold)' }}>Win Big.</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            Browse hundreds of live auction lots — electronics, furniture, tools, and more — at liquidation prices. Available to bid from anywhere in Canada.
          </p>
          {/* Bible quote */}
          <blockquote className="max-w-2xl mx-auto mb-10 px-6">
            <p className="font-serif text-base italic leading-relaxed mb-2" style={{ color: 'var(--c-muted)' }}>
              "The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness."
            </p>
            <cite className="text-xs font-semibold uppercase tracking-widest not-italic" style={{ color: 'var(--c-gold)' }}>
              — Lamentations 3:22–23
            </cite>
          </blockquote>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auctions"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'var(--c-accent)' }}
            >
              View Live Auctions <ArrowRight size={17} />
            </Link>
            <Link
              href="/book-pickup"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-colors"
              style={{ border: '1px solid var(--c-border-s)', background: 'rgba(156,110,40,0.06)', color: 'var(--c-accent)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(156,110,40,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(156,110,40,0.06)'}
            >
              <Calendar size={17} /> Book a Pickup
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              { n: 500,   s: '+', label: 'Lots per month' },
              { n: 2000,  s: '+', label: 'Registered bidders' },
              { n: 98,    s: '%', label: 'Satisfaction rate' },
              { n: 12000, s: '+', label: 'Items sold' },
            ].map(({ n, s, label }, i) => (
              <div key={label} className="text-center py-7" style={{ borderRight: i < 3 ? '1px solid var(--c-border)' : 'none' }}>
                <div className="font-serif text-3xl font-bold mb-1" style={{ color: 'var(--c-gold)' }}>
                  <Counter end={n} suffix={s} />
                </div>
                <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section className="py-20" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Label>What We Offer</Label>
            <h2 className="font-serif text-3xl font-bold mb-3" style={{ color: 'var(--c-text)' }}>
              Our Auction <span style={{ color: 'var(--c-gold)' }}>Services</span>
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--c-muted)' }}>
              A seamless, transparent bidding experience — curated items, detailed listings, and live auctions every week.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🕐', title: 'Operating Hours', desc: hoursDesc },
              { icon: '🔍', title: 'Condition Reports', desc: 'Bid with confidence through our detailed lot descriptions. Every item is carefully reviewed before listing.' },
              { icon: '🔨', title: 'Live Auctions on HiBid', desc: 'Browse ongoing and upcoming auctions on HiBid — register free and place bids from anywhere in Canada.' },
            ].map(({ icon, title, desc }) => (
              <div
                key={title} className="p-6 rounded-2xl transition-all"
                style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-border-s)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5" style={{ background: 'rgba(156,110,40,0.08)', border: '1px solid var(--c-border)' }}>
                  {icon}
                </div>
                <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--c-text)' }}>{title}</h3>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--c-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PICKUP UPDATES */}
      <section className="py-20" style={{ background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <Label>Logistics</Label>
              <h2 className="font-serif text-3xl font-bold mb-4" style={{ color: 'var(--c-text)' }}>
                Important <span style={{ color: 'var(--c-gold)' }}>Pickup</span> Updates
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                We have streamlined our pickup process to ensure a smooth experience for all winning bidders.
              </p>
              <Link href="/book-pickup" className="inline-flex items-center gap-2 mt-5 text-sm font-semibold transition-opacity hover:opacity-80" style={{ color: 'var(--c-accent)' }}>
                Book Pickup Appointment <ArrowRight size={15} />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { icon: <Calendar size={16} />, title: 'Advance Scheduling Required', desc: 'All pickups must be scheduled in advance. A booking link will be included in your invoice email.' },
                { icon: <Package size={16} />, title: 'Collection Window', desc: 'Items won must be collected within the timeframe specified on your invoice to avoid re-listing.' },
                { icon: <AlertTriangle size={16} />, title: 'Forfeiture Policy', desc: 'Uncollected items after the pickup period will be forfeited. Orders only released with a confirmed appointment.' },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title} className="flex gap-4 items-start p-4 rounded-xl transition-all"
                  style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--c-border-s)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--c-border)'}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(156,110,40,0.08)', color: 'var(--c-gold)' }}>
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--c-text)' }}>{title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PAYMENT INFO */}
      <section className="py-20" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Label>Payments</Label>
            <h2 className="font-serif text-3xl font-bold" style={{ color: 'var(--c-text)' }}>
              Payment <span style={{ color: 'var(--c-gold)' }}>Information</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <CreditCard size={20} />, title: 'Card Processing Fee', desc: 'Credit cards are not automatically charged after auctions. A 3% processing fee applies for all card payments.' },
              { icon: <RotateCcw size={20} />, title: 'Restocking Fee', desc: "Orders not completed within the pickup window will incur a restocking fee (buyer's premium + seller's commission)." },
              { icon: <Timer size={20} />, title: 'Collection Period', desc: 'You have up to 5 days to collect your items after the auction concludes to avoid any restocking fees.' },
            ].map(({ icon, title, desc }) => (
              <div
                key={title} className="p-6 rounded-2xl transition-all"
                style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-border-s)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(156,110,40,0.08)', border: '1px solid var(--c-border)', color: 'var(--c-gold)' }}>
                  {icon}
                </div>
                <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--c-text)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ TEASER */}
      <section className="py-20 text-center" style={{ background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <Label>Support</Label>
          <h2 className="font-serif text-3xl font-bold mb-3" style={{ color: 'var(--c-text)' }}>
            Have <span style={{ color: 'var(--c-gold)' }}>Questions?</span>
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            Review our full FAQ for a smooth bidding experience. Our team responds within 48 business hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/faq" className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'var(--c-accent)' }}>
              Browse FAQ's
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold transition-colors"
              style={{ border: '1px solid var(--c-border-s)', background: 'rgba(156,110,40,0.06)', color: 'var(--c-accent)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(156,110,40,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(156,110,40,0.06)'}
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* STAY CONNECTED */}
      <section className="py-20" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Label>Connect</Label>
            <h2 className="font-serif text-3xl font-bold mb-3" style={{ color: 'var(--c-text)' }}>
              Let's Stay <span style={{ color: 'var(--c-gold)' }}>Connected</span>
            </h2>
            <p className="text-sm" style={{ color: 'var(--c-muted)' }}>Stay updated with the latest auctions, offers, and announcements.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Mail size={20} />, title: 'Email Us', body: 'contact@elrachumauctions.com', cta: 'Send Email', href: 'mailto:contact@elrachumauctions.com' },
              { icon: <Headphones size={20} />, title: 'Support', body: 'Responds within 48 business hours via our contact form.', cta: 'Open Ticket', href: '/contact' },
              { icon: <Share2 size={20} />, title: 'Social Media', body: 'Facebook · Instagram · Google', cta: 'Follow Us', href: '#' },
            ].map(({ icon, title, body, cta, href }) => (
              <div
                key={title} className="p-6 rounded-2xl text-center transition-all"
                style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-border-s)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(156,110,40,0.08)', border: '1px solid var(--c-border)', color: 'var(--c-gold)' }}>
                  {icon}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--c-text)' }}>{title}</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--c-muted)' }}>{body}</p>
                <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--c-accent)' }}>
                  {cta} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOK PICKUP CTA BANNER */}
      <section className="py-16 text-center" style={{ background: 'var(--c-accent)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <Calendar size={36} className="mx-auto mb-4 text-white opacity-80" />
          <h2 className="font-serif text-3xl font-bold text-white mb-3">Won a lot? Book your pickup</h2>
          <p className="text-sm text-white/70 mb-8 max-w-lg mx-auto">
            Choose your service, pick a date and time that works, and skip the queue with a confirmed appointment.
          </p>
          <Link href="/book-pickup" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
            Schedule Pickup <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  )
}
