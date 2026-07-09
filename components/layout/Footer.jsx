'use client'

import Link from 'next/link'
import { Facebook, Instagram, MapPin, Mail, Clock, Phone } from 'lucide-react'

const navigate = [
  { href: '/',         label: 'Home' },
  { href: '/about',    label: 'About Us' },
  { href: '/auctions', label: 'Auctions' },
  { href: '/careers',  label: 'Careers' },
]

const support = [
  { href: '/faq',      label: "FAQ's" },
  { href: '/contact',  label: 'Contact Us' },
  { href: '/privacy',  label: 'Privacy Policy' },
  { href: '/terms',    label: 'Terms & Conditions' },
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center mb-4">
              <img
                src="/logo.png"
                alt="El Rachum Auctions"
                style={{ height: 110, width: 110, objectFit: 'contain', borderRadius: 6, mixBlendMode: 'multiply' }}
              />
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--c-muted)' }}>
              Discover quality lots at prices that make sense — every auction, every week.
            </p>
            <div className="flex gap-2">
              {[
                { icon: <Facebook size={15} />, label: 'Facebook' },
                { icon: <Instagram size={15} />, label: 'Instagram' },
                { icon: <span className="text-xs font-bold">G</span>, label: 'Google' },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(156,110,40,0.06)', border: '1px solid var(--c-border)', color: 'var(--c-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--c-accent)'; e.currentTarget.style.borderColor = 'var(--c-border-s)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--c-muted)'; e.currentTarget.style.borderColor = 'var(--c-border)' }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--c-muted)' }}>Navigate</h4>
            <ul className="space-y-2.5">
              {navigate.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors" style={{ color: 'var(--c-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--c-accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--c-muted)'}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--c-muted)' }}>Support</h4>
            <ul className="space-y-2.5">
              {support.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors" style={{ color: 'var(--c-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--c-accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--c-muted)'}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--c-muted)' }}>Contact</h4>
            <ul className="space-y-3">
              {[
                { icon: <Mail size={13} />,   text: 'contact@elrachumauctions.com' },
                { icon: <Phone size={13} />,  text: '(519) 982-3332' },
                { icon: <MapPin size={13} />, text: '2825 County Road 42, Windsor, Ontario N8V 0A4' },
                { icon: <Clock size={13} />,  text: 'Tue & Thu: 11AM–5PM · Sat: 10AM–2PM' },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-shrink-0" style={{ color: 'var(--c-gold)' }}>{icon}</span>
                  <span className="text-sm" style={{ color: 'var(--c-muted)' }}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 text-xs"
          style={{ borderTop: '1px solid var(--c-border)', color: 'var(--c-muted)' }}
        >
          <span>© {new Date().getFullYear()} El Rachum Auctions LLC · All Rights Reserved</span>
          <span>Local roots. Canadian values. 🍁</span>
        </div>
      </div>
    </footer>
  )
}
