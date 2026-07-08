'use client'

import Link from 'next/link'

const perks = [
  { icon: '🏠', label: 'Flexible Hours', desc: 'Part-time schedules that work around your life.' },
  { icon: '🍁', label: 'Canadian Company', desc: 'Locally owned and operated — not a franchise.' },
  { icon: '📦', label: 'Employee Perks', desc: 'Staff access to preview lots before auctions go live.' },
  { icon: '📈', label: 'Growth', desc: 'Small team means real responsibility and room to grow.' },
]

export default function CareersPage() {
  return (
    <>
      <section className="py-16 text-center" style={{ background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--c-gold)' }}>Join Our Team</p>
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: 'var(--c-text)' }}>Careers at <span style={{ color: 'var(--c-gold)' }}>El Rachum Auctions</span></h1>
          <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--c-muted)' }}>We're a small, hardworking team building something great. If you love auctions, logistics, or customer service — we'd love to hear from you.</p>
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Perks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
            {perks.map(({ icon, label, desc }) => (
              <div key={label} className="p-5 rounded-2xl text-center" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-sm font-semibold mb-1" style={{ color: 'var(--c-text)' }}>{label}</div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* No open positions */}
          <div className="p-8 rounded-2xl text-center" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
            <div className="text-3xl mb-4">💼</div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--c-gold)' }}>Open Positions</p>
            <h3 className="font-serif text-2xl font-bold mb-3" style={{ color: 'var(--c-text)' }}>No Current Openings</h3>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--c-muted)' }}>
              There are no open positions at the moment — but we're always happy to hear from talented people. Send us your resume and tell us how you'd contribute to our team.
            </p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--c-accent)' }}
            >
              Get In Touch
            </Link>
          </div>

        </div>
      </section>
    </>
  )
}
