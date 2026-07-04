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
    router.push('/admin?tab=bookings')
  }

  const handlePrint = () => window.print()

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
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-card { box-shadow: none !important; border: 1px solid #ddd !important; }
          body { background: white !important; }
        }
      `}</style>

      <div className="min-h-screen" style={{ background: 'var(--c-bg)' }}>

        {/* Header */}
        <header className="no-print px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10" style={{ background: '#1e1810' }}>
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <button onClick={() => router.push('/admin')} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <div className="flex items-center gap-2">
              <button onClick={handlePrint}
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg font-medium text-white transition-colors"
                style={{ background: '#9c6e28' }}>
                <Printer size={15} /> Print
              </button>
              <button onClick={handleDelete}
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors">
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

          {/* Print header (only shows when printing) */}
          <div className="hidden print:block mb-8 text-center">
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#1e1810' }}>El Rachum Auctions LLC</h1>
            <p style={{ color: '#7a6a50', fontSize: 13 }}>2825 County Road 42, Windsor, Ontario N8V 0A4 · (519) 982-3332</p>
            <p style={{ color: '#9c6e28', fontSize: 13, marginTop: 4 }}>Pickup Booking Confirmation</p>
          </div>

          <div className="print-card bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>

            {/* Booking header */}
            <div className="px-8 py-6" style={{ background: '#faf7f2', borderBottom: '1px solid #e8e0cc' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#9c6e28' }}>Pickup Booking</p>
                  <h2 className="font-serif text-2xl font-bold" style={{ color: '#1e1810' }}>{booking.name}</h2>
                  <p className="text-sm mt-1" style={{ color: '#7a6a50' }}>Booked on {bookedOn}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#7a6a50' }}>Booking ID</p>
                  <p className="font-mono text-xs" style={{ color: '#1e1810' }}>{booking.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="px-8 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a6a50' }}>Contact</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#1e1810' }}>
                        <Mail size={14} style={{ color: '#9c6e28', flexShrink: 0 }} />
                        <a href={`mailto:${booking.email}`} style={{ color: '#9c6e28' }}>{booking.email}</a>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#1e1810' }}>
                        <Phone size={14} style={{ color: '#9c6e28', flexShrink: 0 }} />
                        <a href={`tel:${booking.phone}`} style={{ color: '#1e1810' }}>{booking.phone}</a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a6a50' }}>Pickup Slot</p>
                    <div className="flex items-start gap-2">
                      <Clock size={14} style={{ color: '#9c6e28', flexShrink: 0, marginTop: 2 }} />
                      <p className="text-sm font-medium" style={{ color: '#1e1810' }}>{booking.slot}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a6a50' }}>Lot Numbers</p>
                    <div className="flex items-start gap-2">
                      <Package size={14} style={{ color: '#9c6e28', flexShrink: 0, marginTop: 2 }} />
                      <p className="text-sm" style={{ color: '#1e1810' }}>{booking.lots}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7a6a50' }}>Pickup Location</p>
                    <div className="flex items-start gap-2">
                      <MapPin size={14} style={{ color: '#9c6e28', flexShrink: 0, marginTop: 2 }} />
                      <p className="text-sm" style={{ color: '#1e1810' }}>2825 County Road 42<br />Windsor, Ontario N8V 0A4</p>
                    </div>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-6 pt-6" style={{ borderTop: '1px solid #e8e0cc' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7a6a50' }}>Notes</p>
                  <p className="text-sm leading-relaxed p-4 rounded-xl" style={{ background: '#faf7f2', color: '#1e1810', border: '1px solid #e8e0cc' }}>
                    {booking.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-4" style={{ background: '#faf7f2', borderTop: '1px solid #e8e0cc' }}>
              <p className="text-xs" style={{ color: '#7a6a50' }}>
                Please bring a valid photo ID and this confirmation. Payment must be completed before items are released. · <span style={{ color: '#9c6e28' }}>contact@elrachumauctions.com</span> · (519) 982-3332
              </p>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}
