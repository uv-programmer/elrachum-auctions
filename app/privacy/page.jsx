export const metadata = { title: 'Privacy Policy' }

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-serif text-xl font-bold mb-3" style={{ color: 'var(--c-text)' }}>{title}</h2>
    <div className="text-sm leading-[1.85]" style={{ color: 'var(--c-muted)' }}>{children}</div>
  </div>
)

export default function PrivacyPage() {
  return (
    <>
      <section className="py-16 text-center" style={{ background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--c-gold)' }}>Legal</p>
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: 'var(--c-text)' }}>Privacy <span style={{ color: 'var(--c-gold)' }}>Policy</span></h1>
          <p className="text-sm" style={{ color: 'var(--c-muted)' }}>Last updated: January 2025 · Compliant with PIPEDA (Canada)</p>
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="p-8 rounded-2xl" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>

            <Section title="1. Who We Are">
              El Rachum Auctions LLC ("we", "us", "our") is a Canadian online auction company based in Ontario, Canada. We operate this website and coordinate auctions through the HiBid platform. This Privacy Policy explains how we collect, use, and protect your personal information in accordance with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA).
            </Section>

            <Section title="2. Information We Collect">
              We collect information you provide directly, including: your name, email address, phone number, and pickup details when you register for auctions or book a pickup slot. We also collect limited usage data through cookies and analytics tools (PostHog) to improve our website experience.
            </Section>

            <Section title="3. How We Use Your Information">
              <ul className="space-y-1 list-disc list-inside">
                <li>To process and confirm auction registrations and pickup bookings</li>
                <li>To send transactional emails (booking confirmations, pickup reminders)</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To improve our website and auction operations through aggregate analytics</li>
                <li>To comply with legal obligations</li>
              </ul>
            </Section>

            <Section title="4. Cookies">
              We use essential cookies required to operate the site (e.g., session management). We also use analytics cookies (PostHog) to understand aggregate visitor behaviour. You may decline non-essential cookies via our cookie banner — essential cookies cannot be disabled as the site requires them to function.
            </Section>

            <Section title="5. Third-Party Services">
              Our site integrates with HiBid (auction platform), Resend (transactional email), Supabase (secure database hosting), and PostHog (privacy-friendly analytics). Each of these services has its own privacy policy governing their handling of data. We do not sell your personal information to third parties.
            </Section>

            <Section title="6. Data Retention">
              We retain your personal information for as long as necessary to provide our services and comply with applicable legal requirements. Booking records are retained for a minimum of 12 months. You may request deletion of your data at any time by contacting us.
            </Section>

            <Section title="7. Your Rights">
              Under PIPEDA, you have the right to: access the personal information we hold about you, request corrections to inaccurate data, withdraw consent for non-essential data processing, and request deletion of your data. To exercise any of these rights, contact us at the email below.
            </Section>

            <Section title="8. Security">
              We implement industry-standard technical and organizational measures to protect your data, including encrypted storage (Supabase with RLS), TLS/HTTPS for all data in transit, and access controls limiting who can view personal information.
            </Section>

            <div className="mt-10 pt-8" style={{ borderTop: '1px solid var(--c-border)' }}>
              <h2 className="font-serif text-xl font-bold mb-4" style={{ color: 'var(--c-text)' }}>Return Policy</h2>
              <div className="text-sm leading-[1.85] space-y-3" style={{ color: 'var(--c-muted)' }}>
                <p>All items are sold <strong style={{ color: 'var(--c-text)' }}>as-is, where-is</strong>. We make every effort to accurately describe and photograph each lot; however, we do not offer refunds or exchanges after an item has been picked up.</p>
                <p>If an item is materially different from its description (e.g., a lot number mismatch), please contact us within <strong style={{ color: 'var(--c-text)' }}>48 hours</strong> of pickup with photos. We will review each case individually and, at our discretion, may offer a partial credit toward a future auction.</p>
                <p>Unclaimed lots after <strong style={{ color: 'var(--c-text)' }}>7 calendar days</strong> from auction close will be forfeited. No refunds will be issued for unclaimed items.</p>
              </div>
            </div>

            <div className="mt-10 pt-8" style={{ borderTop: '1px solid var(--c-border)' }}>
              <h2 className="font-serif text-xl font-bold mb-4" style={{ color: 'var(--c-text)' }}>Shipping Policy</h2>
              <div className="text-sm leading-[1.85] space-y-3" style={{ color: 'var(--c-muted)' }}>
                <p>El Rachum Auctions LLC operates on a <strong style={{ color: 'var(--c-text)' }}>pickup-only</strong> basis. We do not offer shipping or delivery services at this time.</p>
                <p>Winning bidders must pick up their items at our facility during scheduled pickup hours: <strong style={{ color: 'var(--c-text)' }}>Tuesday & Thursday 11AM–5PM</strong> and <strong style={{ color: 'var(--c-text)' }}>Saturday 10AM–2PM</strong>.</p>
                <p>We encourage bidders to book a pickup slot in advance using our online booking form to minimize wait times. Please bring a valid photo ID and your lot numbers (or winning bid confirmation email) when you arrive.</p>
                <p>Buyers are responsible for bringing appropriate packaging and transportation for large or fragile items. We are not liable for damage that occurs during transport after pickup.</p>
              </div>
            </div>

            <div className="mt-10 p-5 rounded-xl" style={{ background: 'rgba(156,110,40,0.04)', border: '1px solid var(--c-border)' }}>
              <p className="text-xs" style={{ color: 'var(--c-muted)' }}>
                Questions about this policy? Email us at{' '}
                <a href="mailto:contact@elrachumauctions.com" className="underline hover:opacity-80" style={{ color: 'var(--c-accent)' }}>
                  contact@elrachumauctions.com
                </a>. We will respond within 5 business days.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
