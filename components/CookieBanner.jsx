'use client'

import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('cookie-consent')
    if (!dismissed) setVisible(true)
  }, [])

  const dismiss = (accepted) => {
    localStorage.setItem('cookie-consent', accepted ? 'accepted' : 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-5 left-5 z-[9999] max-w-sm w-[calc(100%-2.5rem)] sm:w-auto"
      style={{
        background: 'rgba(20,20,20,0.97)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 16,
        padding: '1.25rem',
        backdropFilter: 'blur(20px)',
        animation: 'slideUp 0.4s ease',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      }}
    >
      <p className="text-sm font-semibold text-white mb-1">🍪 Cookie Notice</p>
      <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--c-muted)' }}>
        We use essential cookies to operate this site. As required by PIPEDA (Canadian privacy law),
        we inform you of our data practices before collecting any information.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => dismiss(true)}
          className="flex-1 py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--c-accent)' }}
        >
          Accept Essential
        </button>
        <button
          onClick={() => dismiss(false)}
          className="py-2 px-4 rounded-lg text-xs font-medium transition-colors"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'var(--c-muted)',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--c-muted)'}
        >
          Decline
        </button>
      </div>
    </div>
  )
}
