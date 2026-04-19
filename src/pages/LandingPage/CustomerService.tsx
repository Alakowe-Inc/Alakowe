import { Link } from 'react-router-dom'
import { Mail, MessageCircle, Clock, AlertCircle, Package, CreditCard, ShieldCheck, ChevronRight } from 'lucide-react'

const channels = [
  {
    icon: Mail,
    title: 'Email Support',
    value: 'support@alakowe.com',
    desc: 'For general enquiries, account issues, and disputes.',
    responseTime: 'Reply within 24 hours',
    href: 'mailto:support@alakowe.com',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: '+234 800 000 0000',
    desc: 'Quick help with active orders and urgent issues.',
    responseTime: 'Mon–Sat, 9am–6pm',
    href: 'https://wa.me/2348000000000',
  },
]

const topics = [
  {
    icon: Package,
    title: 'Order & Delivery',
    questions: [
      { q: 'Where is my order?', to: '/order' },
      { q: 'My book hasn\'t arrived', to: '/contact' },
      { q: 'I received the wrong book', to: '/contact' },
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments & Payouts',
    questions: [
      { q: 'My payment failed', to: '/payment/failed' },
      { q: 'When will I receive my payout?', to: '/my-earnings' },
      { q: 'I was charged but didn\'t complete an order', to: '/contact' },
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Disputes & Refunds',
    questions: [
      { q: 'The book condition was misrepresented', to: '/contact' },
      { q: 'I want to raise a dispute', to: '/contact' },
      { q: 'How does the refund process work?', to: '/faq' },
    ],
  },
  {
    icon: AlertCircle,
    title: 'Account & Listings',
    questions: [
      { q: 'My listing was rejected', to: '/my-listings' },
      { q: 'I can\'t log in to my account', to: '/login' },
      { q: 'How do I delete my account?', to: '/account' },
    ],
  },
]

export default function CustomerService() {
  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">Support</p>
          <h1 className="font-heading font-bold text-main text-4xl mb-3">How can we help?</h1>
          <p className="text-main/50 text-sm max-w-md mx-auto">
            Our team is here to help with orders, payments, listings, and anything else you need.
          </p>
        </div>

        {/* Contact channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {channels.map(ch => (
            <a
              key={ch.title}
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl border border-third p-6 hover:border-secondary/40 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <ch.icon size={18} className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-main text-base mb-0.5 group-hover:text-secondary transition-colors">
                    {ch.title}
                  </h3>
                  <p className="text-sm font-semibold text-secondary mb-1">{ch.value}</p>
                  <p className="text-xs text-main/50 mb-2">{ch.desc}</p>
                  <div className="flex items-center gap-1.5 text-xs text-main/40">
                    <Clock size={11} />
                    {ch.responseTime}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Topic quick links */}
        <h2 className="font-heading font-bold text-main text-xl mb-5">Common topics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {topics.map(topic => (
            <div key={topic.title} className="bg-white rounded-2xl border border-third p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <topic.icon size={15} className="text-secondary" />
                </div>
                <h3 className="font-heading font-bold text-main text-sm">{topic.title}</h3>
              </div>
              <ul className="space-y-2">
                {topic.questions.map(({ q, to }) => (
                  <li key={q}>
                    <Link
                      to={to}
                      className="flex items-center justify-between gap-2 text-sm text-main/60 hover:text-secondary transition-colors py-1"
                    >
                      <span>{q}</span>
                      <ChevronRight size={13} className="shrink-0 text-main/30" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ CTA */}
        <div className="bg-white rounded-2xl border border-third p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-heading font-bold text-main text-base">Still have questions?</p>
            <p className="text-sm text-main/50 mt-0.5">Browse our full FAQ for answers to common questions.</p>
          </div>
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 bg-main text-white font-semibold px-6 py-3 rounded-full hover:bg-main/90 transition-colors text-sm shrink-0"
          >
            View FAQ
          </Link>
        </div>

      </div>
    </div>
  )
}
