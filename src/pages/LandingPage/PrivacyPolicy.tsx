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

export default function PrivacyPolicy() {
  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">Legal</p>
          <h1 className="font-heading font-bold text-main text-4xl mb-3">Privacy Policy</h1>
          <p className="text-xs text-main/40">Last updated: {lastUpdated}</p>
        </div>

        <div className="bg-white rounded-2xl border border-third p-6 md:p-10 flex flex-col gap-8">

          <p className="text-sm text-main/60 leading-relaxed">
            Alákọ̀wé ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains what we collect, how we use it, and the choices you have. By using our platform, you agree to the practices described below.
          </p>

          <Section title="1. Information we collect">
            <p>We collect information you provide directly when you:</p>
            <List items={[
              'Create an account (email address)',
              'Complete your profile (full name, phone number, state of residence)',
              'List a book (book details, pricing, photos)',
              'Place an order (delivery address, payment information)',
              'Set up payout details (bank name, account number — securely stored)',
              'Contact our support team',
            ]} />
            <p>We also automatically collect limited technical data such as your IP address, browser type, and pages visited, to help us improve the platform.</p>
          </Section>

          <Section title="2. How we use your information">
            <List items={[
              'To create and manage your account',
              'To process orders, payments, and payouts',
              'To coordinate book collection and delivery logistics',
              'To send order updates, notifications, and receipts by email',
              'To notify you when a requested book is listed',
              'To resolve disputes and provide customer support',
              'To detect fraud and keep the platform secure',
              'To improve our service based on usage patterns',
            ]} />
          </Section>

          <Section title="3. Sharing your information">
            <p>We do not sell your personal data. We share information only where necessary:</p>
            <List items={[
              'With logistics partners to coordinate pickup and delivery',
              'With payment processors (Paystack) to handle transactions securely',
              'With buyers or sellers only the details needed to complete a transaction (e.g., buyer initials shown to seller)',
              'With law enforcement if required by Nigerian law',
            ]} />
          </Section>

          <Section title="4. Data storage and security">
            <p>
              Your data is stored securely. Payout details and payment information are encrypted. We use industry-standard security measures to prevent unauthorised access, disclosure, or loss of your data.
            </p>
            <p>
              Currently, certain non-sensitive data (such as order history and listings) is stored in your browser's local storage for app functionality. This data remains on your device and is not transmitted to external servers except where needed to process a transaction.
            </p>
          </Section>

          <Section title="5. Your rights">
            <p>You have the right to:</p>
            <List items={[
              'Access the personal data we hold about you',
              'Correct inaccurate or incomplete data',
              'Request deletion of your account and associated data',
              'Withdraw consent for marketing emails at any time',
              'Lodge a complaint with a relevant data protection authority',
            ]} />
            <p>To exercise any of these rights, email us at <a href="mailto:privacy@alakowe.com" className="text-secondary font-medium hover:underline">privacy@alakowe.com</a>.</p>
          </Section>

          <Section title="6. Cookies">
            <p>
              We use minimal cookies to keep you signed in and remember your preferences. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, though this may affect how the platform functions.
            </p>
          </Section>

          <Section title="7. Children's privacy">
            <p>
              Alákọ̀wé is not intended for users under 13 years of age. We do not knowingly collect personal data from children. If you believe a child has provided us with their data, please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="8. Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the "last updated" date at the top of this page and, for significant changes, notify you by email. Continued use of the platform after changes constitutes your acceptance of the updated policy.
            </p>
          </Section>

          <Section title="9. Contact us">
            <p>
              For any privacy-related questions or requests, contact us at{' '}
              <a href="mailto:privacy@alakowe.com" className="text-secondary font-medium hover:underline">privacy@alakowe.com</a>{' '}
              or visit our <a href="/customer-service" className="text-secondary font-medium hover:underline">Customer Service</a> page.
            </p>
          </Section>

        </div>
      </div>
    </div>
  )
}
