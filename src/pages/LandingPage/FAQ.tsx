import { useState } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'
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
    <div>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="bg-main py-24">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">
          <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Help Centre
          </p>
          <h1 className="font-heading font-bold text-white text-4xl md:text-5xl max-w-md leading-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-white/55 text-sm">
            Can't find what you're looking for?{' '}
            <Link to="/contact" className="text-secondary hover:underline font-semibold">
              Contact us
            </Link>
          </p>
        </div>
      </section>

      {/* ── Content ────────────────────────────────────────────── */}
      <section className="bg-third py-28">
        <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-12">

          {/* Section jump links */}
          <div className="flex flex-wrap gap-2 mb-14">
            {faqs.map(({ section, id }) => (
              <a
                key={id}
                href={`#${id}`}
                className="text-xs font-semibold px-4 py-2 rounded-full bg-white border border-third text-main hover:border-secondary/40 hover:shadow-sm transition-all duration-200"
              >
                {section}
              </a>
            ))}
          </div>

          {/* Sections */}
          {faqs.map(({ section, id, questions }) => (
            <div key={id} id={id} className="mb-14 scroll-mt-24">
              <div className="mb-6">
                <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                  {section}
                </p>
                <h2 className="font-heading font-bold text-main text-2xl">{section} Questions</h2>
              </div>
              <div className="flex flex-col gap-3">
                {questions.map(({ q, a }) => {
                  const key = `${id}-${q}`
                  const isOpen = open === key
                  return (
                    <div
                      key={q}
                      className="bg-white rounded-lg border border-third overflow-hidden hover:border-secondary/40 hover:shadow-md transition-all duration-300"
                    >
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                      >
                        <span className="font-semibold text-main text-sm leading-snug">{q}</span>
                        <ChevronDown
                          size={17}
                          className={`text-main/45 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="bg-main py-24">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 flex flex-col items-center md:flex-row md:items-end justify-between gap-8">
          <div className="text-center md:text-start">
            <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              More Resources
            </p>
            <h2 className="font-heading font-bold text-white text-4xl md:text-5xl max-w-md leading-tight">
              Still have questions?
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { label: 'Terms & Conditions', to: '/terms' },
              { label: 'Issue Resolution Policy', to: '/resolution' },
              { label: 'Privacy Policy', to: '/privacy' },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-5 py-3 rounded-md hover:border-white hover:bg-white/10 transition-all duration-200 text-sm"
              >
                {label} <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default FAQ
