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

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5zm2 0v.01L12 12l8-6.99V5H4zm16 14V7.51l-7.4 6.48a1 1 0 0 1-1.2 0L4 7.51V19h16z" />
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

const socialLinks = [
  { Icon: IconInstagram, label: 'Instagram', href: 'https://www.instagram.com/the_alakowe?igsh=ODJkcjd6cXh1bWNs&utm_source=qr' },
  { Icon: IconFacebook, label: 'Facebook', href: 'https://www.facebook.com/share/1BhTzfqmYv/?mibextid=wwXIfr' },
  { Icon: IconEmail, label: ' Email', href: 'igsh=ODJkcjd6cXh1bWNs&utm_source=qr' },
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

        {/* Social Media */}
        <div className="mb-12">
          <h2 className="font-heading font-bold text-main text-xl mb-4 text-center sm:text-left">Connect with us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {socialLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl border border-third p-4 flex items-center justify-center sm:justify-start gap-3 hover:border-secondary/40 transition-colors group"
              >
                <div className="text-secondary group-hover:scale-110 transition-transform">
                  <link.Icon />
                </div>
                <span className="font-bold text-main text-sm group-hover:text-secondary transition-colors">{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ CTA */}
        <div className="bg-white rounded-2xl border border-third p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-heading font-bold text-main text-base">Still have questions?</p>
            <p className="text-sm text-main/50 mt-0.5">Browse our full FAQ for answers to common questions.</p>
          </div>
          <Link
            to="/how-it-works#general-faq"
            className="inline-flex items-center gap-2 bg-secondary text-white font-semibold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-colors text-sm shrink-0"
          >
            View FAQ
          </Link>
        </div>

      </div>
    </div>
  )
}
