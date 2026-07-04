'use client'

import Link from 'next/link'

const roles = [
  {
    title: 'Warehouse Associate',
    type: 'Part-Time',
    desc: 'Sort, photograph, and catalogue incoming merchandise. Assist with pickup days and general warehouse operations.',
    reqs: ['Ability to lift 50 lbs', 'Attention to detail', 'Team player'],
  },
  {
    title: 'Auction Coordinator',
    type: 'Full-Time',
    desc: 'Manage auction listings on HiBid, coordinate with suppliers, and communicate with winning bidders.',
    reqs: ['Strong written communication', 'Comfortable with online tools', 'Organized and proactive'],
  },
  {
    title: 'Customer Service Rep',
    type: 'Part-Time',
    desc: 'Handle bidder inquiries via email and phone, assist during pickup hours, and maintain a welcoming facility.',
    reqs: ['Friendly and patient', 'Bilingual (FR/EN) a plus', 'Available weekends'],
  },
]

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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
            {perks.map(({ icon, label, desc }) => (
              <div key={label} className="p-5 rounded-2xl text-center" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-sm font-semibold mb-1" style={{ color: 'var(--c-text)' }}>{label}</div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>{desc}</div>
              </div>
            ))}
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--c-gold)' }}>Open Positions</p>
          <h2 className="font-serif text-3xl font-bold mb-8" style={{ color: 'var(--c-text)' }}>Current <span style={{ color: 'var(--c-gold)' }}>Openings</span></h2>

          <div className="space-y-4 mb-12">
            {roles.map(({ title, type, desc, reqs }) => (
              <div key={title} className="p-6 rounded-2xl" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-base font-semibold" style={{ color: 'var(--c-text)' }}>{title}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(156,110,40,0.10)', color: 'var(--c-accent)', border: '1px solid var(--c-border-s)' }}>{type}</span>
                </div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--c-muted)' }}>{desc}</p>
                <ul className="flex flex-wrap gap-2">
                  {reqs.map(r => (
                    <li key={r} className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(156,110,40,0.06)', color: 'var(--c-muted)', border: '1px solid var(--c-border)' }}>{r}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-2xl text-center" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--c-gold)' }}>Don't see your role?</p>
            <h3 className="font-serif text-2xl font-bold mb-3" style={{ color: 'var(--c-text)' }}>Send an Open Application</h3>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--c-muted)' }}>We're always open to talented people. Send us your resume and tell us how you'd contribute to our team.</p>
            <Link href="/contact" className="inline-block px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: 'var(--c-accent)' }}>
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
