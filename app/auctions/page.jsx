export const metadata = { title: 'Auctions' }

const HIBID_COMPANY_ID = process.env.NEXT_PUBLIC_HIBID_COMPANY_ID || '0'

export default function AuctionsPage() {
  return (
    <>
      <section className="py-12 text-center" style={{ background: 'var(--c-surface)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--c-gold)' }}>Live Bidding</p>
          <h1 className="font-serif text-4xl font-bold text-white mb-4">Current Auctions</h1>
          <p className="text-sm" style={{ color: 'var(--c-muted)' }}>Browse and bid on live lots powered by HiBid — Canada's leading auction platform</p>
        </div>
      </section>

      <section className="py-8" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {HIBID_COMPANY_ID === '0' ? (
            <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--c-card)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-4xl mb-4">🔨</div>
              <h2 className="font-serif text-2xl font-bold text-white mb-3">Auctions Coming Soon</h2>
              <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--c-muted)' }}>
                Our HiBid integration is being configured. Check back soon to browse and bid on live lots.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <iframe
                src={`https://www.hibid.com/company/${HIBID_COMPANY_ID}/auctions`}
                title="El Rachum Auctions — Live Auctions on HiBid"
                className="w-full"
                style={{ height: 'calc(100vh - 180px)', minHeight: 600, border: 'none' }}
                allowFullScreen
              />
            </div>
          )}
        </div>
      </section>
    </>
  )
}
