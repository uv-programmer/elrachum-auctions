export const metadata = { title: 'Terms & Conditions' }

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-serif text-xl font-bold mb-3" style={{ color: 'var(--c-text)' }}>{title}</h2>
    <div className="text-sm leading-[1.85]" style={{ color: 'var(--c-muted)' }}>{children}</div>
  </div>
)

export default function TermsPage() {
  return (
    <>
      <section className="py-16 text-center" style={{ background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--c-gold)' }}>Legal</p>
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: 'var(--c-text)' }}>Terms & <span style={{ color: 'var(--c-gold)' }}>Conditions</span></h1>
          <p className="text-sm" style={{ color: 'var(--c-muted)' }}>Last updated: January 2025 · Governed by Ontario law</p>
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="p-8 rounded-2xl" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>

            <Section title="1. Acceptance of Terms">
              By accessing this website or participating in any El Rachum Auctions LLC auction, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
            </Section>

            <Section title="2. Eligibility">
              You must be at least 18 years of age and a resident of Canada to register as a bidder. By registering, you represent and warrant that you meet these requirements.
            </Section>

            <Section title="3. Auction Rules">
              <ul className="list-disc list-inside space-y-1">
                <li>All bids are legally binding. Placing a bid constitutes a commitment to purchase at that price.</li>
                <li>A buyer's premium of 15% is added to the hammer price on all lots.</li>
                <li>Applicable taxes (HST) will be added at the time of payment.</li>
                <li>The auctioneer's decision is final in all matters of dispute.</li>
                <li>El Rachum Auctions reserves the right to withdraw any lot at any time prior to the close of bidding.</li>
              </ul>
            </Section>

            <Section title="4. Payment">
              Payment in full is due within 48 hours of auction close. We accept Visa, Mastercard, cash, and Interac e-Transfer. Items will not be released for pickup until payment is received and confirmed. Non-payment may result in suspension of bidding privileges.
            </Section>

            <Section title="5. Pickup & Item Release">
              Items must be collected within 7 calendar days of auction close during scheduled pickup hours. Unclaimed items are forfeited with no refund. Buyers are responsible for the safe transport of all items after pickup. Please bring a valid government-issued photo ID.
            </Section>

            <Section title="6. Condition of Items">
              All items are sold as-is, where-is with no warranties expressed or implied. Descriptions and photographs are provided for guidance only and do not constitute a warranty of condition. Bidders are encouraged to review all available photos carefully before placing a bid.
            </Section>

            <Section title="7. Limitation of Liability">
              To the maximum extent permitted by applicable law, El Rachum Auctions LLC shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services or purchase of auction lots. Our total liability is limited to the amount paid for the lot in question.
            </Section>

            <Section title="8. Account Suspension">
              We reserve the right to suspend or permanently ban any bidder account for non-payment, fraudulent activity, abusive behaviour, or repeated violations of these terms. Suspended accounts will not be reinstated without management review.
            </Section>

            <Section title="9. Governing Law">
              These Terms are governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein. Any disputes shall be resolved in the courts of Ontario.
            </Section>

            <Section title="10. Changes to Terms">
              We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes constitutes acceptance of the updated Terms.
            </Section>

            <Section title="11. Contact">
              For questions about these Terms, contact us at{' '}
              <a href="mailto:contact@elrachumauctions.com" className="underline hover:opacity-80" style={{ color: 'var(--c-accent)' }}>
                contact@elrachumauctions.com
              </a>.
            </Section>
          </div>
        </div>
      </section>
    </>
  )
}
