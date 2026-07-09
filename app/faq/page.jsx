'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useWorkingHours } from '@/hooks/useWorkingHours'

const faqs = [
  {
    q: 'How do I register to bid?',
    a: 'Visit our auctions page and click the HiBid link. Registration is free and takes about 2 minutes. You will need a valid email address and a credit card on file for identity verification.',
  },
  {
    q: 'Where and when can I pick up my items?',
    a: 'HOURS_PLACEHOLDER',
  },
  {
    q: "What is the buyer's premium?",
    a: "A buyer's premium of 15% is added to the hammer price of each lot. This is standard practice in the auction industry and covers platform and processing costs.",
  },
  {
    q: 'Can I preview items before bidding?',
    a: "All lots are photographed and described in detail on HiBid. We strive to provide accurate, thorough listings so you know exactly what you're bidding on.",
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Visa, Mastercard, cash, and e-Transfer (Interac). Payment is due in full before items can be released for pickup.',
  },
  {
    q: 'What is the soft close feature?',
    a: 'If a bid is placed in the final 3 minutes of a lot closing, the timer automatically extends by 3 minutes. This prevents bid sniping and ensures everyone has a fair chance to respond.',
  },
  {
    q: 'Are all items sold as-is?',
    a: "Yes. All items are sold as-is, where-is. We do our best to accurately describe condition but strongly recommend reviewing all photos before bidding. No refunds are issued after pickup.",
  },
  {
    q: "What happens if I win but don't pick up?",
    a: 'Unclaimed lots after 7 days will be forfeited and re-listed. Repeat non-payers may have their bidding privileges suspended. Please contact us immediately if you have an issue.',
  },
]

export default function FAQPage() {
  const [open, setOpen] = useState(null)
  const hours = useWorkingHours('Tuesday & Thursday 11AM–5PM, Saturday 10AM–2PM')
  return (
    <>
      <section className="py-16 text-center" style={{ background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--c-gold)' }}>Help Center</p>
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: 'var(--c-text)' }}>Frequently Asked <span style={{ color: 'var(--c-gold)' }}>Questions</span></h1>
          <p className="text-sm" style={{ color: 'var(--c-muted)' }}>Everything you need to know about bidding, pickup, and payments</p>
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-2">
            {faqs.map(({ q, a }, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden transition-all"
                style={{ background: 'var(--c-card)', border: `1px solid ${open === i ? 'var(--c-border-s)' : 'var(--c-border)'}` }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{q}</span>
                  <span className="text-lg flex-shrink-0 transition-transform duration-200" style={{ color: 'var(--c-gold)', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                {open === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                      {a === 'HOURS_PLACEHOLDER'
                        ? `Pickup is available at our facility during scheduled hours: ${hours}. You can also book a specific pickup slot using our online booking form to avoid wait times.`
                        : a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl text-center" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--c-text)' }}>Still have questions?</p>
            <p className="text-xs mb-4" style={{ color: 'var(--c-muted)' }}>Our team is happy to help — reach out and we'll get back to you quickly.</p>
            <Link href="/contact" className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: 'var(--c-accent)' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
