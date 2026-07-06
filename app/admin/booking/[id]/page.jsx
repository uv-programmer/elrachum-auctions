'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Printer, Trash2, Mail, Phone, MapPin, Clock, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function BookingDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!supabase || !id) return
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/admin'); return }
      const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single()
      if (error || !data) setNotFound(true)
      else setBooking(data)
      setLoading(false)
    })
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Delete this booking permanently?')) return
    await supabase.from('bookings').delete().eq('id', id)
    router.push('/admin')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--c-bg)' }}>
      <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: '#9c6e28', borderTopColor: 'transparent' }} />
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--c-bg)' }}>
      <div className="text-center">
        <p className="text-lg font-semibold mb-2" style={{ color: 'var(--c-text)' }}>Booking not found</p>
        <button onClick={() => router.push('/admin')} className="text-sm" style={{ color: 'var(--c-accent)' }}>← Back to admin</button>
      </div>
    </div>
  )

  const bookedOn = new Date(booking.created_at).toLocaleString('en-CA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <>
      <style>{`
        /* ── Screen: hide site nav/footer on this admin page ── */
        nav, footer, [data-cookie-banner] {
          display: none !important;
        }
        main {
          padding-top: 0 !important;
        }

        /* ── Print: only show the slip ── */
        @media print {
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { background: white !important; margin: 0 !important; }
          .no-print { display: none !important; }
          .print-slip {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
            border-radius: 8px !important;
            margin: 0 !important;
          }
          .print-letterhead { display: block !important; }
        }
      `}</style>

      <div className="min-h-screen" style={{ background: '#f5f0e8' }}>

        {/* Top bar — hidden on print */}
        <div className="no-print sticky top-0 z-10 px-4 py-3 flex items-center justify-between" style={{ background: '#1e1810' }}>
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium text-white"
              style={{ background: '#9c6e28' }}
            >
              <Printer size={14} /> Print
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>

        {/* Slip */}
        <div className="px-4 py-6 max-w-xl mx-auto">

          {/* Print letterhead — hidden on screen, visible when printing */}
          <div className="print-letterhead mb-6 text-center" style={{ display: 'none' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: '#1e1810', margin: 0 }}>
              El Rachum Auctions LLC
            </p>
            <p style={{ fontSize: 12, color: '#7a6a50', margin: '4px 0 2px' }}>
              2825 County Road 42, Windsor, Ontario N8V 0A4
            </p>
            <p style={{ fontSize: 12, color: '#9c6e28', margin: 0 }}>
              (519) 982-3332 · contact@elrachumauctions.com
            </p>
            <div style={{ borderBottom: '1px solid #e8e0cc', marginTop: 12 }} />
          </div>

          <div
            className="print-slip bg-white overflow-hidden"
            style={{ borderRadius: 16, border: '1px solid #e8e0cc', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}
          >
            {/* Card header */}
            <div className="px-5 py-5" style={{ background: '#faf7f2', borderBottom: '1px solid #e8e0cc' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#9c6e28' }}>
                Pickup Booking
              </p>
              <p className="font-serif text-xl font-bold" style={{ color: '#1e1810' }}>{booking.name}</p>
              <p className="text-xs mt-1" style={{ color: '#7a6a50' }}>Booked on {bookedOn}</p>
              <p className="text-xs mt-1 font-mono" style={{ color: '#b0a090' }}>
                ID: {booking.id.slice(0, 8).toUpperCase()}
              </p>
            </div>

            {/* Details */}
            <div className="px-5 py-5 space-y-4">

              <Row icon={<Mail size={14} />} label="Email">
                <a href={`mailto:${booking.email}`} style={{ color: '#9c6e28', wordBreak: 'break-all' }}>
                  {booking.email}
                </a>
              </Row>

              <Row icon={<Phone size={14} />} label="Phone">
                <a href={`tel:${booking.phone}`} style={{ color: '#1e1810' }}>{booking.phone}</a>
              </Row>

              <Row icon={<Clock size={14} />} label="Pickup Slot">
                <span className="font-medium" style={{ color: '#1e1810' }}>{booking.slot}</span>
              </Row>

              <Row icon={<Package size={14} />} label="Lot Numbers">
                <span style={{ color: '#1e1810', wordBreak: 'break-word' }}>{booking.lots}</span>
              </Row>

              <Row icon={<MapPin size={14} />} label="Location">
                <span style={{ color: '#1e1810' }}>2825 County Road 42, Windsor, Ontario N8V 0A4</span>
              </Row>

              {booking.notes && (
                <div style={{ paddingTop: 12, borderTop: '1px solid #e8e0cc' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7a6a50' }}>Notes</p>
                  <p className="text-sm leading-relaxed px-3 py-3 rounded-xl" style={{ background: '#faf7f2', color: '#1e1810', border: '1px solid #e8e0cc', wordBreak: 'break-word' }}>
                    {booking.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Card footer */}
            <div className="px-5 py-4" style={{ background: '#faf7f2', borderTop: '1px solid #e8e0cc' }}>
              <p className="text-xs leading-relaxed" style={{ color: '#7a6a50' }}>
                Please bring a valid photo ID. Payment must be completed before items are released.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Row({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5" style={{ color: '#9c6e28' }}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#7a6a50' }}>{label}</p>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}
