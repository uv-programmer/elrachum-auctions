'use client'

import { useState, useEffect, useMemo } from 'react'
import { LogOut, Trash2, RefreshCw, Lock, Download, TrendingUp, Calendar, Clock, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ── tiny chart helpers (no library needed) ────────────────────
function SparkBar({ value, max, color = '#0F1E3C' }) {
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

function MiniLineChart({ data, color = '#0F1E3C' }) {
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

function DonutChart({ slices }) {
  const total = slices.reduce((s, x) => s + x.value, 0)
  if (!total) return <div className="text-slate-400 text-xs">No data</div>
  let offset = 0
  const R = 40, CX = 50, CY = 50, STROKE = 14
  const COLORS = ['#0F1E3C', '#C0392B', '#185FA5', '#1D9E75']
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" width={90} height={90}>
        {slices.map((s, i) => {
          const pct = s.value / total
          const dash = pct * (2 * Math.PI * R)
          const gap = (2 * Math.PI * R) - dash
          const el = (
            <circle key={i} cx={CX} cy={CY} r={R}
              fill="none" stroke={COLORS[i % COLORS.length]} strokeWidth={STROKE}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset * 2 * Math.PI * R}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
          )
          offset += pct
          return el
        })}
        <text x={CX} y={CY + 4} textAnchor="middle" fontSize="13" fontWeight="600" fill="#0F1E3C">{total}</text>
      </svg>
      <div className="flex flex-col gap-1.5">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: ['#0F1E3C','#C0392B','#185FA5','#1D9E75'][i % 4] }} />
            <span className="truncate max-w-[120px]">{s.label}</span>
            <span className="font-medium ml-auto">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── CSV export ─────────────────────────────────────────────────
function exportCSV(bookings) {
  const headers = ['Name', 'Phone', 'Email', 'Service', 'Date', 'Time', 'Created At']
  const rows = bookings.map(b => [
    b.name, b.phone, b.email, b.service, b.date, b.time,
    new Date(b.created_at).toLocaleString()
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `bookings-${new Date().toISOString().slice(0,10)}.csv`
  a.click(); URL.revokeObjectURL(url)
}

// ── main component ─────────────────────────────────────────────
export default function AdminPage() {
  const [session, setSession] = useState(undefined)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('overview') // overview | bookings

  useEffect(() => {
    if (!supabase) { setSession(null); return }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchBookings()
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault(); setLoggingIn(true); setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setLoginError(error.message)
    else fetchBookings()
    setLoggingIn(false)
  }

  const handleLogout = async () => { await supabase.auth.signOut(); setBookings([]) }

  const fetchBookings = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
    if (!error) setBookings(data || [])
    setLoading(false)
  }

  const deleteBooking = async (id) => {
    if (!confirm('Delete this booking?')) return
    await supabase.from('bookings').delete().eq('id', id)
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  // ── analytics derivations ──────────────────────────────────
  const analytics = useMemo(() => {
    const today = new Date().toLocaleDateString('en-CA')
    const now = new Date()
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - 6)

    // bookings per day (last 7 days)
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      const key = d.toLocaleDateString('en-CA')
      const label = d.toLocaleDateString('en-CA', { weekday: 'short', day: 'numeric' })
      return { key, label, count: bookings.filter(b => b.date === key).length }
    })

    // service breakdown
    const svcMap = {}
    bookings.forEach(b => { svcMap[b.service] = (svcMap[b.service] || 0) + 1 })
    const services = Object.entries(svcMap)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label: label.split('—')[0].trim(), value }))

    // time slot popularity
    const timeMap = {}
    bookings.forEach(b => { timeMap[b.time] = (timeMap[b.time] || 0) + 1 })
    const times = Object.entries(timeMap).sort((a, b) => b[1] - a[1]).slice(0, 5)
    const maxTime = times[0]?.[1] || 1

    // upcoming (future dates)
    const upcoming = bookings.filter(b => b.date >= today).length

    return {
      total: bookings.length,
      today: bookings.filter(b => b.date === today).length,
      upcoming,
      thisWeek: bookings.filter(b => b.date >= weekStart.toLocaleDateString('en-CA')).length,
      last7,
      services,
      times,
      maxTime,
    }
  }, [bookings])

  // ── Loading ────────────────────────────────────────────────
  if (session === undefined) {
    return <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin" />
    </div>
  }

  // ── No Supabase config ─────────────────────────────────────
  if (!supabase) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={22} className="text-amber-500" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-navy mb-2">Admin Setup Required</h1>
          <p className="text-slate-500 text-sm mb-4">
            Add your Supabase credentials to <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">.env.local</code> to activate the admin dashboard.
          </p>
          <div className="bg-slate-900 text-green-400 text-xs rounded-xl p-4 text-left font-mono leading-6">
            NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co<br />
            NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...<br />
            SUPABASE_SERVICE_ROLE_KEY=eyJ...
          </div>
          <p className="text-slate-400 text-xs mt-3">Copy <code className="bg-slate-100 px-1 rounded">.env.local.example</code> and restart <code className="bg-slate-100 px-1 rounded">pnpm dev</code>.</p>
        </div>
      </div>
    )
  }

  // ── Login ──────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-white" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-navy mb-1">Admin Login</h1>
            <p className="text-slate-400 text-sm">El Rachum Auctions LLC</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@example.ca"
                className="w-full border-2 border-slate-100 focus:border-navy rounded-xl px-4 py-3 text-sm outline-none transition-colors" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                className="w-full border-2 border-slate-100 focus:border-navy rounded-xl px-4 py-3 text-sm outline-none transition-colors" />
            </div>
            {loginError && <p className="text-brand-red text-sm bg-red-50 rounded-xl px-4 py-2">{loginError}</p>}
            <button type="submit" disabled={loggingIn}
              className="w-full bg-navy hover:bg-navy-light disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors">
              {loggingIn ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Dashboard ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-navy px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-semibold text-lg">Admin Dashboard</h1>
            <p className="text-slate-400 text-xs">El Rachum Auctions LLC</p>
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
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex gap-0">
          {[['overview', 'Overview'], ['bookings', 'All Bookings']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === key ? 'border-brand-red text-brand-red' : 'border-transparent text-slate-500 hover:text-navy'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div className="space-y-6">

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <Users size={18} className="text-navy" />, label: 'Total Bookings', value: analytics.total, bg: 'bg-slate-50' },
                { icon: <Calendar size={18} className="text-blue-600" />, label: 'Today', value: analytics.today, bg: 'bg-blue-50' },
                { icon: <TrendingUp size={18} className="text-green-600" />, label: 'This Week', value: analytics.thisWeek, bg: 'bg-green-50' },
                { icon: <Clock size={18} className="text-amber-600" />, label: 'Upcoming', value: analytics.upcoming, bg: 'bg-amber-50' },
              ].map(({ icon, label, value, bg }) => (
                <div key={label} className="bg-white rounded-2xl border border-slate-100 p-5">
                  <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>{icon}</div>
                  <div className="font-serif text-3xl font-bold text-navy mb-1">{value}</div>
                  <div className="text-slate-400 text-xs">{label}</div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid lg:grid-cols-2 gap-6">

              {/* Bookings per day */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="font-semibold text-navy text-sm mb-1">Bookings — last 7 days</h3>
                <p className="text-slate-400 text-xs mb-4">Scheduled pickup dates</p>
                <MiniLineChart data={analytics.last7} color="#0F1E3C" />
                <div className="flex justify-between mt-2">
                  {analytics.last7.map((d, i) => (
                    <span key={i} className="text-slate-400 text-[10px] text-center" style={{ width: `${100 / 7}%` }}>
                      {d.label.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Service breakdown */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="font-semibold text-navy text-sm mb-1">Service breakdown</h3>
                <p className="text-slate-400 text-xs mb-4">Bookings by pickup type</p>
                {analytics.services.length ? (
                  <DonutChart slices={analytics.services} />
                ) : (
                  <div className="text-slate-400 text-sm">No bookings yet</div>
                )}
              </div>
            </div>

            {/* Time slot popularity */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-semibold text-navy text-sm mb-1">Popular time slots</h3>
              <p className="text-slate-400 text-xs mb-4">Most requested pickup times</p>
              {analytics.times.length ? (
                <div className="space-y-3 max-w-sm">
                  {analytics.times.map(([time, count]) => (
                    <div key={time}>
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span className="font-medium">{time}</span>
                      </div>
                      <SparkBar value={count} max={analytics.maxTime} color="#C0392B" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 text-sm">No data yet</div>
              )}
            </div>

          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {tab === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-navy">All Bookings ({bookings.length})</h2>
              <button onClick={() => exportCSV(bookings)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-navy bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                <Download size={13} /> Export CSV
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              {loading ? (
                <div className="py-16 text-center">
                  <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm">No bookings yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="bg-navy text-left">
                        {['Name', 'Phone', 'Email', 'Service', 'Date', 'Time', 'Booked On', ''].map(h => (
                          <th key={h} className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-navy">{b.name}</td>
                          <td className="px-4 py-3 text-sm text-slate-500 font-mono">{b.phone}</td>
                          <td className="px-4 py-3 text-sm text-blue-600">{b.email}</td>
                          <td className="px-4 py-3 text-xs text-slate-500 max-w-[150px] truncate">{b.service}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{b.date}</td>
                          <td className="px-4 py-3 text-sm font-medium text-navy">{b.time}</td>
                          <td className="px-4 py-3 text-xs text-slate-400">
                            {new Date(b.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => deleteBooking(b.id)} title="Delete"
                              className="w-8 h-8 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg flex items-center justify-center transition-colors">
                              <Trash2 size={14} />
                            </button>
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
