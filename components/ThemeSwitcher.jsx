'use client'

import { useState, useEffect } from 'react'

const themes = [
  {
    id: 'original',
    name: 'A — Original',
    desc: 'Ivory · Brass · Navy',
    swatches: ['#faf7f2', '#9c6e28', '#b07c20', '#1a2744'],
    vars: {
      '--c-bg':         '#faf7f2',
      '--c-surface':    '#f0ead8',
      '--c-card':       'rgba(156,110,40,0.05)',
      '--c-card-h':     'rgba(156,110,40,0.09)',
      '--c-accent':     '#9c6e28',
      '--c-accent-dark':'#6a4a18',
      '--c-gold':       '#b07c20',
      '--c-text':       '#1a2744',
      '--c-muted':      '#7a6a50',
      '--c-border':     'rgba(156,110,40,0.18)',
      '--c-border-s':   'rgba(156,110,40,0.38)',
    },
  },
  {
    id: 'navy-primary',
    name: 'B — Navy Primary',
    desc: 'Ivory · Navy CTAs · Gold',
    swatches: ['#faf7f2', '#1a2744', '#b07c20', '#7a6a50'],
    vars: {
      '--c-bg':         '#faf7f2',
      '--c-surface':    '#f0ead8',
      '--c-card':       'rgba(26,39,68,0.04)',
      '--c-card-h':     'rgba(26,39,68,0.08)',
      '--c-accent':     '#1a2744',
      '--c-accent-dark':'#0f1628',
      '--c-gold':       '#b07c20',
      '--c-text':       '#1a2744',
      '--c-muted':      '#7a6a50',
      '--c-border':     'rgba(26,39,68,0.15)',
      '--c-border-s':   'rgba(26,39,68,0.35)',
    },
  },
  {
    id: 'dark-navy',
    name: 'C — Dark Navy',
    desc: 'Navy bg · Ivory text · Gold',
    swatches: ['#1a2744', '#243560', '#c8922a', '#faf7f2'],
    vars: {
      '--c-bg':         '#1a2744',
      '--c-surface':    '#243560',
      '--c-card':       'rgba(255,255,255,0.05)',
      '--c-card-h':     'rgba(255,255,255,0.09)',
      '--c-accent':     '#c8922a',
      '--c-accent-dark':'#a07020',
      '--c-gold':       '#c8922a',
      '--c-text':       '#faf7f2',
      '--c-muted':      'rgba(250,247,242,0.6)',
      '--c-border':     'rgba(255,255,255,0.1)',
      '--c-border-s':   'rgba(255,255,255,0.22)',
    },
  },
  {
    id: 'slate-navy',
    name: 'D — Slate Navy',
    desc: 'Soft ivory · Slate · Warm gold',
    swatches: ['#f5f2ec', '#2c3e6b', '#d4a843', '#8a7a60'],
    vars: {
      '--c-bg':         '#f5f2ec',
      '--c-surface':    '#ebe5d8',
      '--c-card':       'rgba(44,62,107,0.04)',
      '--c-card-h':     'rgba(44,62,107,0.08)',
      '--c-accent':     '#2c3e6b',
      '--c-accent-dark':'#1e2d52',
      '--c-gold':       '#d4a843',
      '--c-text':       '#2c3e6b',
      '--c-muted':      '#8a7a60',
      '--c-border':     'rgba(44,62,107,0.15)',
      '--c-border-s':   'rgba(44,62,107,0.32)',
    },
  },
  {
    id: 'maritime',
    name: 'E — Maritime',
    desc: 'White · Deep navy · Gold',
    swatches: ['#ffffff', '#0a1628', '#c49a38', '#6b7a96'],
    vars: {
      '--c-bg':         '#ffffff',
      '--c-surface':    '#f0f4fa',
      '--c-card':       'rgba(10,22,40,0.04)',
      '--c-card-h':     'rgba(10,22,40,0.07)',
      '--c-accent':     '#0a1628',
      '--c-accent-dark':'#050d18',
      '--c-gold':       '#c49a38',
      '--c-text':       '#0a1628',
      '--c-muted':      '#6b7a96',
      '--c-border':     'rgba(10,22,40,0.12)',
      '--c-border-s':   'rgba(10,22,40,0.28)',
    },
  },
]

function applyTheme(vars) {
  Object.entries(vars).forEach(([k, v]) =>
    document.documentElement.style.setProperty(k, v)
  )
}

export default function ThemeSwitcher() {
  const [open, setOpen]   = useState(false)
  const [active, setActive] = useState('original')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('er-theme')
      if (saved) {
        const t = themes.find(t => t.id === saved)
        if (t) { applyTheme(t.vars); setActive(t.id) }
      }
    } catch {}
  }, [])

  function pick(theme) {
    applyTheme(theme.vars)
    setActive(theme.id)
    try { localStorage.setItem('er-theme', theme.id) } catch {}
    setOpen(false)
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'absolute', bottom: 52, right: 0,
          width: 230,
          background: '#fff',
          borderRadius: 14,
          border: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '10px 14px 8px',
            borderBottom: '1px solid #f0f0f0',
            background: '#1a2744',
          }}>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#c8922a' }}>
              Client Preview
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>
              Pick a colour scheme
            </p>
          </div>

          {themes.map(t => {
            const isActive = active === t.id
            return (
              <button
                key={t.id}
                onClick={() => pick(t)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '9px 14px',
                  background: isActive ? 'rgba(26,39,68,0.07)' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? '3px solid #1a2744' : '3px solid transparent',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.15s',
                }}
              >
                {/* Swatches */}
                <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                  {t.swatches.map((s, i) => (
                    <div key={i} style={{
                      width: 13, height: 13, borderRadius: 3,
                      background: s,
                      border: '0.5px solid rgba(0,0,0,0.12)',
                    }} />
                  ))}
                </div>
                {/* Labels */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3 }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 10, color: '#888', lineHeight: 1.3 }}>
                    {t.desc}
                  </div>
                </div>
                {/* Active tick */}
                {isActive && (
                  <div style={{ marginLeft: 'auto', fontSize: 12, color: '#1a2744' }}>✓</div>
                )}
              </button>
            )
          })}

          <div style={{ padding: '8px 14px', borderTop: '1px solid #f0f0f0' }}>
            <p style={{ margin: 0, fontSize: 9, color: '#aaa', textAlign: 'center' }}>
              Selection saved in browser
            </p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        title="Try colour themes"
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: '#1a2744',
          border: '2px solid #c8922a',
          boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, lineHeight: 1,
          transition: 'transform 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        🎨
      </button>
    </div>
  )
}
