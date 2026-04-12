import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

const faqs = [
  {
    section: 'Buying',
    id: 'buying',
    questions: [
      {
        q: 'How does buying work?',
        a: "Browse our catalog, add books to your cart, and checkout. Your payment is held securely in escrow until you confirm you've received your book in good condition. Only then is the seller paid.",
      },
      {
        q: 'How long does delivery take?',
        a: 'Estimated delivery is 3–7 business days. This covers the time for the seller to drop off the book at our collection centre, our team to inspect and process it, and delivery to your address.',
      },
      {
        q: "What if my book doesn't arrive or is in worse condition than described?",
        a: "You can report an issue after delivery. Our team will investigate and arrange a refund if needed. Your payment is always protected until you confirm satisfaction.",
      },
      {
        q: 'Do I need an account to buy?',
        a: "You'll need an account to checkout. However, order status updates are sent via email with secure links — you won't need to log in again to track your order.",
      },
    ],
  },
  {
    section: 'Selling',
    id: 'selling',
    questions: [
      {
        q: 'How does selling work?',
        a: 'Create an account, list your book with photos and details, and wait for our team to review and approve it (within 24 hours). Once approved, your book goes live on the platform.',
      },
      {
        q: 'When will I get paid?',
        a: "Payment is released from escrow once the buyer confirms they've received the book in good condition, or after the dispute window passes. You'll receive a notification when funds are released.",
      },
      {
        q: 'How do I send the book to the buyer?',
        a: 'You choose: drop the book at one of our collection centres (free), or request that we pick it up from you (a convenience fee applies, deducted from your payout). We handle the rest.',
      },
      {
        q: 'What happens if my listing is rejected?',
        a: "We'll tell you exactly why — whether it's pricing, photo quality, or wrong category — and give you the opportunity to edit and resubmit.",
      },
    ],
  },
  {
    section: 'Payment & Refunds',
    id: 'payment',
    questions: [
      {
        q: 'Is my payment secure?',
        a: 'Yes. All payments are processed through our secure payment gateway and held in escrow. Neither party can access funds until the transaction is complete.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'We accept debit cards, bank transfers, and other popular Nigerian payment methods via our payment gateway.',
      },
      {
        q: 'How long does a refund take?',
        a: 'Refunds are typically processed within 5–10 business days, depending on your bank.',
      },
    ],
  },
  {
    section: 'Trust & Safety',
    id: 'safety',
    questions: [
      {
        q: 'How does Alakowe ensure book quality?',
        a: 'All listings are reviewed by our team before going live. We also physically inspect books when they arrive at our collection centre before dispatching them to buyers.',
      },
      {
        q: 'What do the condition ratings mean?',
        a: 'Very Good: minimal wear, reads like new. Good: some visible use but fully intact. Average: noticeable wear, all pages present. Below Average: heavy wear but still readable.',
      },
      {
        q: 'How do I report a problem?',
        a: "Use the \"There's an issue\" button in your delivery confirmation email, or contact us via the Contact page. Our team reviews all disputes within 48 hours.",
      },
    ],
  },
]

function FAQ() {
  const [open, setOpen] = useState<string | null>(null)

  function toggle(key: string) {
    setOpen(prev => (prev === key ? null : key))
  }

  return (
    <div className="min-h-screen bg-third">

      {/* Header */}
      <div className="bg-white border-b border-third py-12">
        <div className="max-w-3xl mx-auto px-4 md:px-6 xl:px-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
            Help Centre
          </p>
          <h1 className="font-heading font-bold text-main text-4xl mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-main/55 text-sm">
            Can't find what you're looking for?{' '}
            <Link to="/contact" className="text-secondary hover:underline font-semibold">
              Contact us
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 xl:px-0 py-12">

        {/* Section jump links */}
        <div className="flex flex-wrap gap-2 mb-12">
          {faqs.map(({ section, id }) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-xs font-semibold px-4 py-2 rounded-full bg-white border border-third text-main hover:border-main transition-colors"
            >
              {section}
            </a>
          ))}
        </div>

        {/* Sections */}
        {faqs.map(({ section, id, questions }) => (
          <div key={id} id={id} className="mb-10 scroll-mt-24">
            <h2 className="font-heading font-bold text-main text-xl mb-4">{section}</h2>
            <div className="flex flex-col gap-3">
              {questions.map(({ q, a }) => {
                const key = `${id}-${q}`
                const isOpen = open === key
                return (
                  <div key={q} className="bg-white rounded-2xl border border-third overflow-hidden">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                    >
                      <span className="font-semibold text-main text-sm leading-snug">{q}</span>
                      <ChevronDown
                        size={17}
                        className={`text-main/45 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 border-t border-third pt-4">
                        <p className="text-sm text-main/65 leading-relaxed">{a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Policy links */}
        <div className="bg-main rounded-2xl p-8 mt-4">
          <h3 className="font-heading font-semibold text-white text-lg mb-5">More Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: 'Terms & Conditions', to: '/terms' },
              { label: 'Issue Resolution Policy', to: '/resolution' },
              { label: 'Privacy Policy', to: '/privacy' },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-secondary hover:underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
