import { Link } from 'react-router-dom'

const lastUpdated = 'April 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-heading font-bold text-main text-lg mb-3">{title}</h2>
      <div className="text-sm text-main/60 leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  )
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside space-y-1.5 text-main/60 text-sm">
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  )
}

export default function TermsConditions() {
  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">Legal</p>
          <h1 className="font-heading font-bold text-main text-4xl mb-3">Terms & Conditions</h1>
          <p className="text-xs text-main/40">Last updated: {lastUpdated}</p>
        </div>

        <div className="bg-white rounded-2xl border border-third p-6 md:p-10 flex flex-col gap-8">

          <p className="text-sm text-main/60 leading-relaxed">
            These Terms & Conditions ("Terms") govern your use of the Alákọ̀wé platform. By creating an account or using our services, you agree to these Terms. Please read them carefully.
          </p>

          <Section title="1. About Alákọ̀wé">
            <p>
              Alákọ̀wé is a peer-to-peer used book marketplace that connects individual sellers and buyers across Nigeria. We facilitate transactions, coordinate logistics, and hold payments in escrow — but we are not the seller of any book listed on the platform.
            </p>
          </Section>

          <Section title="2. Eligibility">
            <List items={[
              'You must be at least 13 years old to use the platform.',
              'You must provide accurate and complete information when creating your account.',
              'You are responsible for maintaining the security of your account.',
              'One person may not maintain multiple accounts.',
            ]} />
          </Section>

          <Section title="3. Seller responsibilities">
            <p>By listing a book on Alákọ̀wé, you agree to:</p>
            <List items={[
              'Only list books you personally own and have the right to sell.',
              'Accurately describe the book\'s condition, including any damage, markings, or missing pages.',
              'Set a fair and honest price.',
              'Drop off the book at a designated collection point within 48 hours of a confirmed sale.',
              'Not list counterfeit, pirated, or prohibited materials.',
              'Accept that Alákọ̀wé charges a 10% platform fee on every completed sale.',
            ]} />
          </Section>

          <Section title="4. Buyer responsibilities">
            <p>As a buyer, you agree to:</p>
            <List items={[
              'Provide an accurate delivery address at checkout.',
              'Confirm or dispute delivery within 48 hours of receiving your order.',
              'Not abuse the dispute system by making false claims.',
              'Pay the agreed price plus any applicable delivery fees.',
            ]} />
          </Section>

          <Section title="5. Payments and escrow">
            <p>
              All payments are processed securely via Paystack. When a buyer places an order, the full amount (including delivery fee) is held in escrow by Alákọ̀wé. Funds are released to the seller within 24–48 hours after the buyer confirms receipt of the book.
            </p>
            <p>
              If a buyer does not confirm or raise a dispute within 48 hours of the delivery status being updated to "Delivered", the payment is automatically released to the seller.
            </p>
            <p>
              Delivery fees are non-refundable except in cases of Alákọ̀wé's error (e.g., wrong book dispatched by us).
            </p>
          </Section>

          <Section title="6. Prohibited items">
            <p>The following may not be listed on the platform:</p>
            <List items={[
              'Counterfeit or pirated books',
              'Books with stolen or forged ownership marks',
              'Adult content not appropriate for a general audience',
              'Academic examination papers or leaked materials',
              'Any item that is not a physical book',
            ]} />
            <p>Listings that violate these rules will be removed and may result in account suspension.</p>
          </Section>

          <Section title="7. Reviews and disputes">
            <p>
              Alákọ̀wé reserves the right to mediate disputes between buyers and sellers. Our decision in disputes is final. We will not be liable for losses arising from disputes where both parties acted in good faith and evidence is inconclusive.
            </p>
          </Section>

          <Section title="8. Platform fees">
            <p>
              Alákọ̀wé charges a <span className="font-semibold text-main">10% platform fee</span> on every completed transaction. This fee is deducted from the seller's payout. There is no fee to list a book, browse, or purchase.
            </p>
          </Section>

          <Section title="9. Intellectual property">
            <p>
              All content on the Alákọ̀wé platform — including the logo, design, copy, and code — is the property of Alákọ̀wé and may not be reproduced without written permission. Book listings remain the responsibility of the individual seller.
            </p>
          </Section>

          <Section title="10. Limitation of liability">
            <p>
              Alákọ̀wé is a marketplace platform. We are not responsible for the quality of books sold, except where we have explicitly inspected and approved a listing. Our liability is limited to the value of the transaction in question.
            </p>
          </Section>

          <Section title="11. Termination">
            <p>
              We reserve the right to suspend or terminate any account that violates these Terms, engages in fraudulent activity, or is harmful to other users or the platform. Users may delete their own account at any time from their profile settings.
            </p>
          </Section>

          <Section title="12. Changes to these Terms">
            <p>
              We may update these Terms from time to time. Continued use of the platform after changes are published constitutes acceptance. For significant changes, we will notify you by email.
            </p>
          </Section>

          <Section title="13. Governing law">
            <p>
              These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from use of the platform shall be subject to the jurisdiction of Nigerian courts.
            </p>
          </Section>

          <Section title="14. Contact">
            <p>
              Questions about these Terms? Contact us at{' '}
              <a href="mailto:legal@alakowe.com" className="text-secondary font-medium hover:underline">legal@alakowe.com</a>{' '}
              or visit our <Link to="/customer-service" className="text-secondary font-medium hover:underline">Customer Service</Link> page.
            </p>
          </Section>

        </div>
      </div>
    </div>
  )
}
