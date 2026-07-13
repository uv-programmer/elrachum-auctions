'use client'

import { useState, useEffect } from 'react'

function getTimeLeft(target) {
  const diff = new Date(target) - new Date()
  if (diff <= 0) return null
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { d, h, m, s }
}

function Pad({ v, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-24 h-24 flex items-center justify-center rounded-2xl text-4xl font-bold tabular-nums"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', color: '#fff' }}
      >
        {String(v).padStart(2, '0')}
      </div>
      <span className="text-xs uppercase tracking-widest" style={{ color: '#b07c20' }}>{label}</span>
    </div>
  )
}

export default function LaunchingSoonPage() {
  const [launchDate, setLaunchDate] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const [launched, setLaunched] = useState(false)

  // Fetch launch date from Supabase
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return
    fetch(`${url}/rest/v1/site_settings?key=eq.launch_date&select=value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
      .then(r => r.json())
      .then(data => {
        const val = data?.[0]?.value
        if (val) setLaunchDate(val)
      })
      .catch(() => {})
  }, [])

  // Tick countdown
  useEffect(() => {
    if (!launchDate) return
    const tick = () => {
      const tl = getTimeLeft(launchDate)
      if (!tl) { setLaunched(true); window.location.href = '/' }
      else setTimeLeft(tl)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [launchDate])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: '#1a2744' }}
    >
      {/* Logo */}
      <img src="/logo.png" alt="El Rachum Auctions" className="w-20 h-20 object-contain rounded-xl mb-8"
        style={{ mixBlendMode: 'screen', filter: 'brightness(1.3)' }} />

      <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: '#b07c20' }}>
        Coming Soon
      </p>

      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">
        El Rachum <span style={{ color: '#b07c20' }}>Auctions</span>
      </h1>
      <p className="text-sm max-w-md mb-12" style={{ color: 'rgba(255,255,255,0.5)' }}>
        We're putting the finishing touches on something special. Our online auction platform launches very soon — stay tuned.
      </p>

      {/* Countdown */}
      {timeLeft ? (
        <div className="flex items-start gap-4 sm:gap-6 mb-14">
          <Pad v={timeLeft.d} label="Days" />
          <div className="text-4xl font-bold text-white/30 mt-5">:</div>
          <Pad v={timeLeft.h} label="Hours" />
          <div className="text-4xl font-bold text-white/30 mt-5">:</div>
          <Pad v={timeLeft.m} label="Minutes" />
          <div className="text-4xl font-bold text-white/30 mt-5">:</div>
          <Pad v={timeLeft.s} label="Seconds" />
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center mb-14">
          <div className="w-8 h-8 border-2 rounded-full animate-spin"
            style={{ borderColor: '#b07c20', borderTopColor: 'transparent' }} />
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col items-center gap-2">
        <a href="mailto:contact@elrachumauctions.com"
          className="text-sm hover:opacity-80 transition-opacity"
          style={{ color: 'rgba(255,255,255,0.4)' }}>
          contact@elrachumauctions.com
        </a>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Windsor, Ontario · Canada
        </span>
      </div>
    </div>
  )
}
