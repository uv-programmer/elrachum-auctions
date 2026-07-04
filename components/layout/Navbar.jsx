'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Gavel } from 'lucide-react'
import clsx from 'clsx'

const links = [
  { href: '/',         label: 'Home' },
  { href: '/about',    label: 'About Us' },
  { href: '/auctions', label: 'Auctions' },
  { href: '/faq',      label: "FAQ's" },
  { href: '/careers',  label: 'Careers' },
  { href: '/contact',  label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
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
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md'
            : 'bg-transparent'
        )}
        style={{
          height: 68,
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--c-accent)' }}
            >
              <Gavel size={18} className="text-white" />
            </div>
            <div>
              <div className="font-serif text-base font-bold leading-none" style={{ color: 'var(--c-gold)' }}>
                El Rachum Auctions
              </div>
              <div className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--c-muted)' }}>
                Canada
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-0.5">
            {links.map(({ href, label }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={clsx(
                      'block px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-white/[0.06]'
                        : 'text-[#888] hover:text-white hover:bg-white/[0.04]'
                    )}
                    style={active ? { color: 'var(--c-accent)' } : {}}
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
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'var(--c-accent)' }}
            >
              Book Pickup
            </Link>
          </div>

          {/* Burger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
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
          style={{
            background: 'rgba(10,10,10,0.98)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <ul className="flex flex-col gap-1 mt-2">
            {links.map(({ href, label }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={clsx(
                      'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                      active ? 'bg-white/[0.06]' : 'text-[#888] hover:text-white'
                    )}
                    style={active ? { color: 'var(--c-accent)' } : {}}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <Link
              href="/book-pickup"
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
