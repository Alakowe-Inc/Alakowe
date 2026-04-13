import { Link } from 'react-router-dom'
import {
  Search, ShoppingCart, Truck, BookOpen,
  PlusCircle, Bell, PackageCheck, Wallet,
  ArrowRight, ShieldCheck, Banknote, HeadphonesIcon, RefreshCw,
} from 'lucide-react'

const buyerSteps = [
  {
    step: '01',
    icon: Search,
    title: 'Browse & Find',
    desc: 'Search thousands of pre-loved books by title, author, or genre. Filter by location, condition, and price to find exactly what you need.',
  },
  {
    step: '02',
    icon: ShoppingCart,
    title: 'Add to Cart & Pay',
    desc: 'Add your book and pay securely at checkout. Your money is held in escrow and only released once you confirm receipt of your order.',
  },
  {
    step: '03',
    icon: Truck,
    title: 'We Coordinate Delivery',
    desc: 'We notify the seller, arrange collection from their location, inspect the book, and dispatch it to you — no stress on your end.',
  },
  {
    step: '04',
    icon: BookOpen,
    title: 'Start Reading',
    desc: 'Your book arrives at your door in 3–7 business days. Confirm receipt, the seller gets paid, and your reading begins.',
  },
]

const sellerSteps = [
  {
    step: '01',
    icon: PlusCircle,
    title: 'List Your Book',
    desc: 'Create a listing in minutes — add your book\'s title, condition, price, and a short note. Your listing goes live immediately.',
  },
  {
    step: '02',
    icon: Bell,
    title: 'Get Notified',
    desc: 'When a buyer places an order, you\'ll get a notification. Review the order and confirm you\'re ready to hand over the book.',
  },
  {
    step: '03',
    icon: PackageCheck,
    title: 'We Collect the Book',
    desc: 'An Alakowé agent comes to your location to collect and inspect the book. You don\'t need to worry about packaging or shipping.',
  },
  {
    step: '04',
    icon: Wallet,
    title: 'Get Paid',
    desc: 'Once the buyer confirms delivery, your payment is released directly to your account — fast, secure, and transparent.',
  },
]

const trustPoints = [
  {
    icon: ShieldCheck,
    title: 'Escrow Protection',
    desc: 'Buyer funds are held securely until delivery is confirmed. Neither party can be cheated.',
  },
  {
    icon: Banknote,
    title: 'Fair Pricing',
    desc: 'Sellers set their own prices. Buyers always know the full cost upfront — no hidden fees.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Support',
    desc: 'Our team is available to resolve disputes, answer questions, and make sure every exchange goes smoothly.',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    desc: 'If a book doesn\'t match its listing description, we handle the return and refund process end-to-end.',
  },
]

function HowItWorks() {
  return (
    <div>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="bg-main pt-14 pb-16">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">
          <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Simple process
          </p>
          <h1 className="font-heading font-bold text-white text-4xl md:text-5xl leading-tight mb-4 max-w-lg">
            How Alakowé works
          </h1>
          <p className="text-white/50 max-w-lg text-sm leading-relaxed">
            Whether you're looking for your next read or clearing your shelf, Alakowé makes the whole process easy, safe, and rewarding.
          </p>
        </div>
      </div>

      {/* ── Buyer Flow ───────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                For buyers
              </p>
              <h2 className="font-heading font-bold text-main text-3xl md:text-4xl leading-tight">
                Find and buy a book<br className="hidden md:block" /> in four easy steps
              </h2>
            </div>
            <Link
              to="/browse"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors shrink-0"
            >
              Browse Books <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {buyerSteps.map(({ step, icon: Icon, title, desc }) => (
              <div
                key={step}
                className="group flex flex-col p-6 rounded-lg border border-third hover:border-secondary/40 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-11 h-11 rounded-lg bg-secondary/15 border border-secondary/20 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-main" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary">
                    Step {step}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-main text-lg mb-3">{title}</h3>
                <p className="text-main/55 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
            >
              Browse Books <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────────── */}
      <div className="bg-third h-px" />

      {/* ── Seller Flow ──────────────────────────────────────────── */}
      <section className="py-20 bg-third">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                For sellers
              </p>
              <h2 className="font-heading font-bold text-main text-3xl md:text-4xl leading-tight">
                List your books and<br className="hidden md:block" /> get paid hassle-free
              </h2>
            </div>
            <Link
              to="/register"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors shrink-0"
            >
              Start Selling <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sellerSteps.map(({ step, icon: Icon, title, desc }) => (
              <div
                key={step}
                className="group flex flex-col p-6 rounded-lg bg-white border border-third hover:border-secondary/40 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-11 h-11 rounded-lg bg-secondary/15 border border-secondary/20 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-main" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary">
                    Step {step}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-main text-lg mb-3">{title}</h3>
                <p className="text-main/55 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
            >
              Start Selling <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust & Safety ───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

          <div className="mb-12">
            <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              Built on trust
            </p>
            <h2 className="font-heading font-bold text-main text-3xl md:text-4xl leading-tight max-w-md">
              Your safety is built into every step
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trustPoints.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col p-6 rounded-lg border border-third">
                <div className="w-10 h-10 rounded-lg bg-main flex items-center justify-center mb-5">
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-main text-base mb-2">{title}</h3>
                <p className="text-main/55 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ teaser ───────────────────────────────────────────── */}
      <section className="py-20 bg-third">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="bg-white rounded-lg border border-third p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                Still have questions?
              </p>
              <h2 className="font-heading font-bold text-main text-2xl md:text-3xl leading-tight mb-3">
                Check our FAQ
              </h2>
              <p className="text-main/55 text-sm leading-relaxed max-w-md">
                From delivery timelines to payment questions, we've answered the things people ask most.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to="/faq"
                className="inline-flex items-center justify-center gap-2 bg-main text-white font-semibold px-6 py-3 rounded-md hover:bg-main/90 transition-colors text-sm"
              >
                Read the FAQ <ArrowRight size={15} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 border border-main/20 text-main font-semibold px-6 py-3 rounded-md hover:border-main/50 transition-colors text-sm"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-main py-24">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
          <div className="text-center md:text-start">
            <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              Ready to start?
            </p>
            <h2 className="font-heading font-bold text-white text-4xl md:text-5xl max-w-md leading-tight">
              Join thousands of readers across Nigeria.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/browse"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-7 py-3.5 rounded-md hover:bg-white hover:text-main transition-all duration-200 text-sm"
            >
              Browse Books <ArrowRight size={15} />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-secondary text-main font-semibold px-7 py-3.5 rounded-md hover:bg-secondary/90 transition-colors text-sm"
            >
              Create Account <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default HowItWorks
