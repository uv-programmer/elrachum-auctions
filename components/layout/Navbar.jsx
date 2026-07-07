'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import clsx from 'clsx'

const links = [
  { href: '/',         label: 'Home' },
  { href: '/about',    label: 'About Us' },
  { href: '/auctions', label: 'Auctions' },
  { href: '/faq',      label: "FAQ's" },
  { href: '/careers',  label: 'Careers' },
  { href: '/contact',  label: 'Contact' },
]

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 46, height: 46, flexShrink: 0 }}>
        <circle cx="40" cy="43" r="33" stroke="#9c6e28" strokeWidth="1.5" fill="none"/>
        <circle cx="40" cy="43" r="28" stroke="#9c6e28" strokeWidth="0.6" fill="none" opacity="0.5"/>
        <g fill="#9c6e28">
          <polygon points="25,20 28,12 31,17 34,10 37,17 40,10 43,17 46,10 49,17 52,12 55,20" opacity="0.95"/>
          <rect x="24" y="19" width="32" height="3" rx="1" opacity="0.9"/>
        </g>
        <text x="19" y="60" fontFamily="Georgia, serif" fontSize="36" fontWeight="700" fill="#1e1810" opacity="0.9">E</text>
        <text x="38" y="60" fontFamily="Georgia, serif" fontSize="36" fontWeight="700" fill="#9c6e28">R</text>
      </svg>
      <div>
        <div className="font-serif text-base font-bold leading-none" style={{ color: 'var(--c-accent)' }}>
          El Rachum
        </div>
        <div className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--c-muted)' }}>
          Auctions · Canada
        </div>
      </div>
    </Link>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()
  const [open, setOpen] = useState(false)

  // If already on /book-pickup, refresh the route so the form resets
  function handleBookPickup(e) {
    if (pathname === '/book-pickup') {
      e.preventDefault()
      router.refresh()
    }
    setOpen(false)
  }
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <nav
        className={clsx('fixed top-0 left-0 right-0 z-50 transition-all duration-300', scrolled ? 'backdrop-blur-md' : 'bg-transparent')}
        style={{
          height: 68,
          background: scrolled ? 'rgba(250,247,242,0.96)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--c-border)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

          <Logo />

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-0.5">
            {links.map(({ href, label }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className="block px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      color: active ? 'var(--c-accent)' : 'var(--c-muted)',
                      background: active ? 'rgba(156,110,40,0.08)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--c-text)'; e.currentTarget.style.background = 'rgba(156,110,40,0.06)' } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--c-muted)'; e.currentTarget.style.background = 'transparent' } }}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* CTA */}
          <div className="hidden md:block">
            <Link
              href="/book-pickup"
              onClick={handleBookPickup}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'var(--c-accent)' }}
            >
              Book Pickup
            </Link>
          </div>

          {/* Burger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg"
            style={{ color: 'var(--c-muted)' }}
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 top-[68px] z-40 flex flex-col p-4"
          style={{ background: 'rgba(250,247,242,0.98)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--c-border)' }}
        >
          <ul className="flex flex-col gap-1 mt-2">
            {links.map(({ href, label }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className="block px-4 py-3 rounded-xl text-base font-medium transition-colors"
                    style={{
                      color: active ? 'var(--c-accent)' : 'var(--c-muted)',
                      background: active ? 'rgba(156,110,40,0.08)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--c-text)'; e.currentTarget.style.background = 'rgba(156,110,40,0.06)' } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--c-muted)'; e.currentTarget.style.background = 'transparent' } }}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--c-border)' }}>
            <Link
              href="/book-pickup"
              onClick={handleBookPickup}
              className="block w-full text-center px-5 py-3.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'var(--c-accent)' }}
            >
              Book Pickup
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
