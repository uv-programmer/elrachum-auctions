'use client'

const stats = [
  { n: '500+',   label: 'Lots per month' },
  { n: '2,000+', label: 'Registered bidders' },
  { n: '4.8★',   label: 'Average rating' },
  { n: '3 yrs',  label: 'In business' },
]

const howItWorks = [
  { icon: '📅', title: 'Auction Closing Schedule', desc: 'Each auction begins closing in the evening, starting at 6:00 PM and continuing sequentially until approximately 11:00 PM. Lots close one at a time to allow competitive bidding.' },
  { icon: '🔨', title: 'Starting Bids', desc: 'All lots start at an accessible base bid, giving every bidder a fair opportunity to participate. Bid increments remain consistent and transparent throughout the auction.' },
  { icon: '🤖', title: 'Proxy (Max) Bidding', desc: 'Enter your maximum bid and our system places bids on your behalf — so you never miss a winning opportunity even when you are away.' },
  { icon: '⏳', title: 'Soft Close Feature', desc: 'If a bid is placed in the final minutes of a lot closing, the timer automatically extends — giving all bidders a fair chance to respond and preventing bid sniping.' },
  { icon: '🍁', title: 'Proudly Canadian', desc: 'Based in Ontario, we serve bidders across Canada. All transactions are in CAD and we understand Canadian buyer needs deeply.' },
]

export default function AboutPage() {
  return (
    <>
      <section className="py-16 text-center" style={{ background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--c-gold)' }}>Our Story</p>
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: 'var(--c-text)' }}>About <span style={{ color: 'var(--c-gold)' }}>El Rachum Auctions</span></h1>
          <p className="text-sm" style={{ color: 'var(--c-muted)' }}>Our story, values, and how we run our auctions</p>
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start mb-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--c-gold)' }}>Who We Are</p>
              <h2 className="font-serif text-3xl font-bold mb-4" style={{ color: 'var(--c-text)' }}>Connecting Buyers with <span style={{ color: 'var(--c-gold)' }}>Quality Lots</span></h2>
            </div>
            <div>
              <p className="text-sm leading-[1.8] mb-4" style={{ color: 'var(--c-muted)' }}>El Rachum Auctions LLC was founded with a simple idea: give Canadians access to quality merchandise at honest prices through a fair, open auction process.</p>
              <p className="text-sm leading-[1.8]" style={{ color: 'var(--c-muted)' }}>We source merchandise from retailers, warehouses, and overstock suppliers across the country. Every lot is catalogued, photographed, and made available to registered bidders on HiBid — one of Canada's leading auction platforms. Winners pick up in person at our facility during scheduled hours.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
            {stats.map(({ n, label }) => (
              <div key={label} className="p-6 rounded-2xl text-center" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
                <div className="font-serif text-3xl font-bold mb-1" style={{ color: 'var(--c-gold)' }}>{n}</div>
                <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>{label}</div>
              </div>
            ))}
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--c-gold)' }}>How It Works</p>
          <h2 className="font-serif text-3xl font-bold mb-4" style={{ color: 'var(--c-text)' }}>How Our Auctions <span style={{ color: 'var(--c-gold)' }}>Work</span></h2>
          <p className="text-sm leading-[1.75] mb-8 max-w-xl" style={{ color: 'var(--c-muted)' }}>We host auctions every week, each featuring a carefully curated selection of liquidation goods, retail returns, and overstock. The process is designed to be seamless, fair, and accessible to all bidders.</p>
          <div className="space-y-3">
            {howItWorks.map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 items-start p-5 rounded-2xl" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(156,110,40,0.08)', border: '1px solid var(--c-border)' }}>{icon}</div>
                <div>
                  <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--c-text)' }}>{title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
