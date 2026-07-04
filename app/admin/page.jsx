'use client'

import { useState, useEffect, useMemo } from 'react'
import { LogOut, Trash2, RefreshCw, Lock, Download, TrendingUp, Calendar, Clock, Users, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// ── Spark bar ────────────────────────────────────────────────
function SparkBar({ value, max, color = '#9c6e28' }) {
  const pct = max ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-medium text-slate-600 w-5 text-right">{value}</span>
    </div>
  )
}

// ── Mini line chart ───────────────────────────────────────────
function MiniLineChart({ data, color = '#9c6e28' }) {
  if (!data.length) return null
  const max = Math.max(...data.map(d => d.count), 1)
  const W = 280, H = 60, PAD = 8
  const pts = data.map((d, i) => {
    const x = PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2)
    const y = H - PAD - ((d.count / max) * (H - PAD * 2))
    return `${x},${y}`
  })
  const poly = pts.join(' ')
  const area = `${PAD},${H - PAD} ${poly} ${W - PAD},${H - PAD}`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="overflow-visible">
      <polygon points={area} fill={color} opacity="0.08" />
      <polyline points={poly} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {data.map((d, i) => {
        const [x, y] = pts[i].split(',').map(Number)
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />
      })}
    </svg>
  )
}

// ── CSV export (uses actual schema columns) ───────────────────
function exportCSV(bookings) {
  const headers = ['Name', 'Email', 'Phone', 'Lots', 'Pickup Slot', 'Notes', 'Booked On']
  const rows = bookings.map(b => [
    b.name, b.email, b.phone, b.lots, b.slot, b.notes || '',
    new Date(b.created_at).toLocaleString(),
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url
  a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`
  a.click(); URL.revokeObjectURL(url)
}

// ── Main ──────────────────────────────────────────────────────
export default function AdminPage() {
  const [session, setSession] = useState(undefined)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('overview')
  const router = useRouter()

  useEffect(() => {
    if (!supabase) { setSession(null); return }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchBookings()
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      if (s) fetchBookings()
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault(); setLoggingIn(true); setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setLoginError(error.message)
    setLoggingIn(false)
  }

  const handleLogout = async () => { await supabase.auth.signOut(); setBookings([]) }

  const fetchBookings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error('Fetch error:', error.message)
    else setBookings(data || [])
    setLoading(false)
  }

  const deleteBooking = async (id) => {
    if (!confirm('Delete this booking?')) return
    await supabase.from('bookings').delete().eq('id', id)
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  // ── Analytics (based on created_at + slot text) ───────────
  const analytics = useMemo(() => {
    const todayStr = new Date().toLocaleDateString('en-CA')
    const now = new Date()
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 6)

    const toDate = (b) => new Date(b.created_at).toLocaleDateString('en-CA')

    // Bookings created per day (last 7 days)
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      const key = d.toLocaleDateString('en-CA')
      const label = d.toLocaleDateString('en-CA', { weekday: 'short', day: 'numeric' })
      return { key, label, count: bookings.filter(b => toDate(b) === key).length }
    })

    // Slot popularity (use full slot string)
    const slotMap = {}
    bookings.forEach(b => {
      const slot = b.slot || 'Unknown'
      slotMap[slot] = (slotMap[slot] || 0) + 1
    })
    const topSlots = Object.entries(slotMap).sort((a, b) => b[1] - a[1]).slice(0, 5)
    const maxSlot = topSlots[0]?.[1] || 1

    // Day-of-week breakdown
    const dayMap = { Tue: 0, Thu: 0, Sat: 0, Other: 0 }
    bookings.forEach(b => {
      const slot = b.slot || ''
      if (slot.startsWith('Tue')) dayMap.Tue++
      else if (slot.startsWith('Thu')) dayMap.Thu++
      else if (slot.startsWith('Sat')) dayMap.Sat++
      else dayMap.Other++
    })
    const daySlices = Object.entries(dayMap)
      .filter(([, v]) => v > 0)
      .map(([label, value]) => ({ label, value }))

    return {
      total: bookings.length,
      today: bookings.filter(b => toDate(b) === todayStr).length,
      thisWeek: bookings.filter(b => new Date(b.created_at) >= weekAgo).length,
      withNotes: bookings.filter(b => b.notes && b.notes.trim()).length,
      last7,
      topSlots,
      maxSlot,
      daySlices,
    }
  }, [bookings])

  // ── States ─────────────────────────────────────────────────
  if (session === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: '#9c6e28', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!supabase) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <Lock size={32} className="mx-auto mb-4 text-amber-500" />
          <h1 className="font-serif text-2xl font-bold mb-2" style={{ color: '#1e1810' }}>Admin Setup Required</h1>
          <p className="text-slate-500 text-sm">Add Supabase credentials to <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">.env.local</code> and restart the server.</p>
        </div>
      </div>
    )
  }

  // ── Login ───────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4" style={{ background: 'var(--c-bg)' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--c-accent)' }}>
              <Lock size={22} className="text-white" />
            </div>
            <h1 className="font-serif text-2xl font-bold mb-1" style={{ color: 'var(--c-text)' }}>Admin Login</h1>
            <p className="text-sm" style={{ color: 'var(--c-muted)' }}>El Rachum Auctions LLC</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--c-muted)' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="contact@elrachumauctions.com"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                style={{ border: '1px solid var(--c-border)', background: 'rgba(156,110,40,0.04)', color: 'var(--c-text)' }}
                onFocus={e => e.target.style.borderColor = 'var(--c-accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--c-border)'}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--c-muted)' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                style={{ border: '1px solid var(--c-border)', background: 'rgba(156,110,40,0.04)', color: 'var(--c-text)' }}
                onFocus={e => e.target.style.borderColor = 'var(--c-accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--c-border)'}
              />
            </div>
            {loginError && <p className="text-sm bg-red-50 text-red-700 rounded-xl px-4 py-2">{loginError}</p>}
            <button type="submit" disabled={loggingIn}
              className="w-full font-semibold py-3 rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--c-accent)' }}>
              {loggingIn ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Dashboard ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10" style={{ background: '#1e1810' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-semibold text-lg">Admin Dashboard</h1>
            <p className="text-xs" style={{ color: '#9c6e28' }}>El Rachum Auctions LLC</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs hidden sm:block">{session.user.email}</span>
            <button onClick={fetchBookings} title="Refresh"
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => exportCSV(bookings)} title="Export CSV"
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors">
              <Download size={14} />
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex">
          {[['overview', 'Overview'], ['bookings', 'All Bookings']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === key ? 'border-[#9c6e28] text-[#9c6e28]' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-6">

            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <Users size={18} style={{ color: '#9c6e28' }} />, label: 'Total Bookings', value: analytics.total, bg: 'bg-amber-50' },
                { icon: <Calendar size={18} className="text-blue-600" />, label: 'Booked Today', value: analytics.today, bg: 'bg-blue-50' },
                { icon: <TrendingUp size={18} className="text-green-600" />, label: 'This Week', value: analytics.thisWeek, bg: 'bg-green-50' },
                { icon: <Clock size={18} className="text-purple-600" />, label: 'With Notes', value: analytics.withNotes, bg: 'bg-purple-50' },
              ].map(({ icon, label, value, bg }) => (
                <div key={label} className="bg-white rounded-2xl border border-slate-100 p-5">
                  <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>{icon}</div>
                  <div className="font-serif text-3xl font-bold mb-1" style={{ color: '#1e1810' }}>{value}</div>
                  <div className="text-slate-400 text-xs">{label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">

              {/* Bookings per day */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="font-semibold text-sm mb-1" style={{ color: '#1e1810' }}>Bookings — last 7 days</h3>
                <p className="text-slate-400 text-xs mb-4">When bookings were submitted</p>
                <MiniLineChart data={analytics.last7} color="#9c6e28" />
                <div className="flex justify-between mt-2">
                  {analytics.last7.map((d, i) => (
                    <span key={i} className="text-slate-400 text-[10px] text-center" style={{ width: `${100 / 7}%` }}>
                      {d.label.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pickup day breakdown */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="font-semibold text-sm mb-1" style={{ color: '#1e1810' }}>Pickup day breakdown</h3>
                <p className="text-slate-400 text-xs mb-4">Tue / Thu / Sat distribution</p>
                {analytics.daySlices.length ? (
                  <div className="space-y-3">
                    {analytics.daySlices.map(({ label, value }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span className="font-medium">{label}</span>
                          <span>{value} booking{value !== 1 ? 's' : ''}</span>
                        </div>
                        <SparkBar value={value} max={analytics.total || 1} color="#9c6e28" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-400 text-sm">No bookings yet</div>
                )}
              </div>
            </div>

            {/* Top pickup slots */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-semibold text-sm mb-1" style={{ color: '#1e1810' }}>Most popular slots</h3>
              <p className="text-slate-400 text-xs mb-4">Top requested pickup times</p>
              {analytics.topSlots.length ? (
                <div className="space-y-3 max-w-lg">
                  {analytics.topSlots.map(([slot, count]) => (
                    <div key={slot}>
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span className="font-medium truncate pr-4">{slot}</span>
                        <span className="flex-shrink-0">{count}×</span>
                      </div>
                      <SparkBar value={count} max={analytics.maxSlot} color="#9c6e28" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 text-sm">No data yet</div>
              )}
            </div>
          </div>
        )}

        {/* ── ALL BOOKINGS ── */}
        {tab === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ color: '#1e1810' }}>All Bookings ({bookings.length})</h2>
              <button onClick={() => exportCSV(bookings)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                <Download size={13} /> Export CSV
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              {loading ? (
                <div className="py-16 text-center">
                  <div className="w-6 h-6 border-2 rounded-full animate-spin mx-auto" style={{ borderColor: '#9c6e28', borderTopColor: 'transparent' }} />
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm">No bookings yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[750px]">
                    <thead>
                      <tr style={{ background: '#1e1810' }} className="text-left">
                        {['Name', 'Email', 'Phone', 'Lots', 'Pickup Slot', 'Notes', 'Booked On', ''].map(h => (
                          <th key={h} className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-amber-50/40 transition-colors cursor-pointer" onClick={() => router.push(`/admin/booking/${b.id}`)}>
                          <td className="px-4 py-3 text-sm font-medium" style={{ color: '#1e1810' }}>{b.name}</td>
                          <td className="px-4 py-3 text-sm text-blue-600">{b.email}</td>
                          <td className="px-4 py-3 text-sm text-slate-500 font-mono">{b.phone}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{b.lots}</td>
                          <td className="px-4 py-3 text-xs font-medium max-w-[180px]" style={{ color: '#9c6e28' }}>{b.slot}</td>
                          <td className="px-4 py-3 text-xs text-slate-400 max-w-[140px] truncate">{b.notes || '—'}</td>
                          <td className="px-4 py-3 text-xs text-slate-400">
                            {new Date(b.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              <button onClick={() => router.push(`/admin/booking/${b.id}`)} title="View detail"
                                className="w-8 h-8 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center justify-center transition-colors" style={{ color: '#9c6e28' }}>
                                <ExternalLink size={13} />
                              </button>
                              <button onClick={() => deleteBooking(b.id)} title="Delete"
                                className="w-8 h-8 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg flex items-center justify-center transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
