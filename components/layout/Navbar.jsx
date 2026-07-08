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
    <Link href="/" className="flex items-center">
      <img
        src="/logo.jpeg"
        alt="El Rachum Auctions"
        style={{ height: 56, width: 56, objectFit: 'contain', borderRadius: 6, mixBlendMode: 'multiply' }}
      />
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
