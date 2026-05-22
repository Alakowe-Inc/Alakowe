import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const faqs: { section: string; id: string; questions: { q: string; a: React.ReactNode }[] }[] = [
  {
    section: 'For Buyers',
    id: 'buyers',
    questions: [
      {
        q: 'How do I buy a book?',
        a: (
          <ol className="list-decimal list-inside space-y-1.5">
            <li>Browse books by title, author, or category</li>
            <li>Select a book, view conditions and details</li>
            <li>Add to cart and make payment</li>
            <li>Seller drops the book at an Alákòwé collection centre closest to them or requests a home pickup</li>
            <li>We verify, pick up, and process delivery to you</li>
            <li>You can track your order status anytime</li>
          </ol>
        ),
      },
      {
        q: 'How does payment work?',
        a: (
          <div className="space-y-2">
            <p>When you pay for a book:</p>
            <ul className="list-disc list-inside space-y-1.5">
              <li>Your payment is held securely by Alákòwé</li>
              <li>The seller is <strong>not paid immediately</strong></li>
              <li>Payment is only released after you confirm delivery</li>
            </ul>
            <p className="mt-2">This protects you from receiving the wrong or damaged book.</p>
          </div>
        ),
      },
      {
        q: 'How long does delivery take?',
        a: 'Typically 2–8 working days depending on your location. Home delivery goes directly to your address, and your order comes as ONE delivery even if you buy from multiple sellers.',
      },
      {
        q: 'What if something is wrong with my order?',
        a: (
          <div className="space-y-2">
            <p>If your order is not as expected:</p>
            <ul className="list-disc list-inside space-y-1.5">
              <li>Click <strong>"Report Issue"</strong> on your order page within 12 hours to raise a dispute — if the wrong book was delivered, the condition is significantly worse than described, or the edition differs from the listing</li>
              <li>Upload photos and describe the issue</li>
              <li>Our team will review and resolve it</li>
              <li>Or email us at <a href="mailto:thealakowe@gmail.com" className="text-secondary hover:underline">thealakowe@gmail.com</a></li>
            </ul>
            <p className="mt-2 text-main/40 text-xs">Note: Disputes will not be upheld if you simply changed your mind, or if the book has minor wear consistent with the listed condition. Please read listings carefully before buying.</p>
          </div>
        ),
      },
      {
        q: 'Can I return a book?',
        a: 'Yes, you can report an issue with your book within 12 hours if the order does not meet the stated conditions on our site. Our team will assist.',
      },
      {
        q: 'Are the books new or used?',
        a: 'Most books are pre-owned but in good condition. Each listing clearly states the condition.',
      },
      {
        q: 'How do I know the book is genuine?',
        a: 'All books go through a basic verification process before delivery.',
      },
    ],
  },
  {
    section: 'For Sellers',
    id: 'sellers',
    questions: [
      {
        q: 'How do I sell a book?',
        a: (
          <ol className="list-decimal list-inside space-y-1.5">
            <li>Create a listing (title, conditions, price, photos)</li>
            <li>Submit for review</li>
            <li>Once approved, your book goes live</li>
            <li>A buyer places an order</li>
            <li>You are notified immediately on the next steps</li>
          </ol>
        ),
      },
      {
        q: 'How does the listing approval process work?',
        a: (
          <ul className="list-disc list-inside space-y-1.5">
            <li>All listings are reviewed before going live</li>
            <li>This helps maintain quality and trust</li>
            <li>You will be notified once your book is approved</li>
          </ul>
        ),
      },
      {
        q: 'What happens when my book sells?',
        a: (
          <ul className="list-disc list-inside space-y-1.5">
            <li>You receive a notification from us in-app and by email</li>
            <li>You prepare the book for drop-off or pickup</li>
            <li>The buyer's payment is secured in escrow</li>
          </ul>
        ),
      },
      {
        q: 'How do I send the book?',
        a: (
          <div className="space-y-3">
            <div>
              <p className="font-semibold mb-1">Drop-Off</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Select a nearby drop-off centre</li>
                <li>Take your book there with your unique drop-off code</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-1">Pickup Request</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Enter your address and schedule a pickup</li>
                <li>A logistics partner will collect the book</li>
                <li>A small convenience fee may apply</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        q: 'How do I get paid?',
        a: (
          <div className="space-y-2">
            <ul className="list-disc list-inside space-y-1.5">
              <li>Payment is held securely when the buyer pays</li>
              <li>Book is delivered to the buyer</li>
              <li>Buyer confirms receipt</li>
              <li>Funds are released to you</li>
            </ul>
            <p className="mt-2">Payments are made to your registered bank account.</p>
          </div>
        ),
      },
      {
        q: 'Can I edit my listing?',
        a: 'Yes, you can update your listing before or after it goes live.',
      },
      {
        q: 'What kind of books can I sell?',
        a: 'Fiction, academic, and non-fiction books in acceptable condition.',
      },
      {
        q: 'What if my book is not approved?',
        a: 'You will receive feedback on what to adjust.',
      },
      {
        q: 'How fast can my book sell?',
        a: 'It depends on demand, pricing, and condition.',
      },
    ],
  },
  {
    section: 'Trust & Safety',
    id: 'safety',
    questions: [
      {
        q: 'Is my money safe?',
        a: 'Yes. All payments are held securely and only released after delivery is confirmed.',
      },
      {
        q: 'What if a seller doesn\'t send the book?',
        a: 'If the seller fails to fulfil the order, your payment will not be released and you will be refunded.',
      },
      {
        q: 'What if the buyer doesn\'t confirm delivery?',
        a: 'Alákòwé monitors delivery status and ensures fair resolution before releasing funds.',
      },
      {
        q: 'How do you handle disputes?',
        a: 'We review evidence from both sides and make a fair decision based on our policies.',
      },
      {
        q: 'Can I trust Alákòwé?',
        a: 'Alákòwé is built to ensure safe transactions through escrow payments, structured logistics, and verified order handling.',
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
      <section className="bg-main text-white min-h-[50vh] flex items-center justify-center py-20">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 w-full text-center">
          <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
            Help Centre
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-white/55 max-w-lg text-sm leading-relaxed mx-auto">
            Can't find what you're looking for?{' '}
            <Link to="/contact" className="text-secondary hover:underline font-semibold">
              Contact us
            </Link>
          </p>
        </div>
      </section>

      {/* ── Content ────────────────────────────────────────────── */}
      <section className="bg-white py-28">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-12">

          {/* Section jump links */}
          <div className="flex flex-wrap gap-2 mb-14">
            {faqs.map(({ section, id }) => (
              <a
                key={id}
                href={`#${id}`}
                className="text-xs font-semibold px-4 py-2 rounded-full border border-main/20 text-main/60 hover:border-secondary hover:text-secondary transition-all duration-200"
              >
                {section}
              </a>
            ))}
          </div>

          {/* Sections */}
          {faqs.map(({ section, id, questions }) => (
            <div key={id} id={id} className="mb-14 scroll-mt-24">
              <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-6">
                {section}
              </p>
              <div className="flex flex-col">
                {questions.map(({ q, a }) => {
                  const key = `${id}-${q}`
                  const isOpen = open === key
                  return (
                    <div key={q} className="border-t border-main/15">
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between py-5 text-left gap-6"
                      >
                        <span className="font-heading font-bold text-main text-sm uppercase tracking-wide leading-snug">
                          {q}
                        </span>
                        <span className={`shrink-0 text-xs font-bold tracking-widest transition-colors duration-200 ${isOpen ? 'text-secondary' : 'text-main/45'}`}>
                          {isOpen ? 'LESS −' : 'MORE +'}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="pb-5">
                          <p className="text-sm text-main/55 leading-relaxed max-w-3xl">{a}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
                <div className="border-t border-main/15" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="bg-main py-28">
        <div className="max-w-2xl mx-auto px-4 md:px-6 lg:px-12 flex flex-col items-center text-center gap-8">
          <div>
            <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-4">
              Still need help?
            </p>
            <h2 className="font-heading font-bold text-white text-4xl md:text-5xl leading-tight mb-5">
              We're happy to answer your questions.
            </h2>
            <p className="text-white/55 text-sm leading-relaxed">
              Reach out to our team and we'll get back to you as soon as possible — no question is too small.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-main font-semibold px-8 py-3.5 text-sm hover:bg-white/90 transition-colors rounded-full"
            >
              Contact Us <ArrowRight size={14} />
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-8 py-3.5 text-sm hover:border-white transition-colors rounded-full"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default FAQ
