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
    desc: 'Search thousands of pre-loved books by title, author, or genre. Filter by location, condition, and price.',
  },
  {
    step: '02',
    icon: ShoppingCart,
    title: 'Add to Cart & Pay',
    desc: 'Pay securely at checkout. Your money is held in escrow and only released once you confirm receipt.',
  },
  {
    step: '03',
    icon: Truck,
    title: 'We Coordinate Delivery',
    desc: 'We notify the seller, collect the book, inspect it, and dispatch it to you — no stress on your end.',
  },
  {
    step: '04',
    icon: BookOpen,
    title: 'Start Reading',
    desc: 'Your book arrives in 3–7 business days. Confirm receipt, the seller gets paid, and reading begins.',
  },
]

const sellerSteps = [
  {
    step: '01',
    icon: PlusCircle,
    title: 'List Your Book',
    desc: "Create a listing in minutes — add title, condition, price, and a short note. Goes live immediately.",
  },
  {
    step: '02',
    icon: Bell,
    title: 'Get Notified',
    desc: "When a buyer places an order, you'll get a notification to confirm you're ready to hand over the book.",
  },
  {
    step: '03',
    icon: PackageCheck,
    title: 'We Collect',
    desc: "An Alakowé agent comes to your location to collect and inspect the book. No packaging or shipping needed.",
  },
  {
    step: '04',
    icon: Wallet,
    title: 'Get Paid',
    desc: 'Once the buyer confirms delivery, your payment is released directly to your account — fast and transparent.',
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
    desc: 'Our team is available to resolve disputes, answer questions, and ensure every exchange goes smoothly.',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    desc: "If a book doesn't match its listing, we handle the return and refund process end-to-end.",
  },
]

function StepGrid({ steps }: { steps: typeof buyerSteps }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
      {steps.map(({ step, icon: Icon, title, desc }) => (
        <div key={step} className="flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-heading font-bold text-4xl text-main/10 leading-none select-none">
              {step}
            </span>
            <div className="w-9 h-9 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
              <Icon size={16} className="text-main" />
            </div>
          </div>
          <h3 className="font-heading font-bold text-main text-lg mb-2">{title}</h3>
          <p className="text-main/50 text-sm leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  )
}

function HowItWorks() {
  return (
    <div>

      {/* ── Page Header ─────────────────────────────────────────── */}
      <section className="bg-main min-h-[50vh] flex items-center justify-center py-20">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 w-full text-center">
          <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Simple process
          </p>
          <h1 className="font-heading font-bold text-white text-4xl md:text-5xl leading-tight mb-4 max-w-lg mx-auto">
            How Alakowé works
          </h1>
          <p className="text-white/50 max-w-lg text-sm leading-relaxed mx-auto">
            Whether you're looking for your next read or clearing your shelf, Alakowé makes the whole process easy, safe, and rewarding.
          </p>
        </div>
      </section>

      {/* ── Buyer Flow ──────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-third">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                For buyers
              </p>
              <h2 className="font-heading font-bold text-main text-3xl md:text-4xl">
                Find and buy a book in four easy steps
              </h2>
            </div>
            <Link
              to="/browse"
              className="hidden md:flex underline underline-offset-4 items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors shrink-0"
            >
              Browse Books
            </Link>
          </div>
          <StepGrid steps={buyerSteps} />
          <div className="mt-10 text-center md:hidden">
            <Link to="/browse" className="inline-flex underline underline-offset-4 items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors">
              Browse Books
            </Link>
          </div>
        </div>
      </section>

      {/* ── Seller Flow ─────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-third">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                For sellers
              </p>
              <h2 className="font-heading font-bold text-main text-3xl md:text-4xl">
                List your books and get paid hassle-free
              </h2>
            </div>
            <Link
              to="/register"
              className="hidden md:flex underline underline-offset-4 items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors shrink-0"
            >
              Start Selling
            </Link>
          </div>
          <StepGrid steps={sellerSteps} />
          <div className="mt-10 text-center md:hidden">
            <Link to="/register" className="inline-flex underline underline-offset-4 items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors">
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust & Safety ──────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-third">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                Built on trust
              </p>
              <h2 className="font-heading font-bold text-main text-3xl md:text-4xl">
                Your safety is built into every step
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {trustPoints.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col">
                <div className="w-9 h-9 rounded-full bg-main flex items-center justify-center mb-5 shrink-0">
                  <Icon size={15} className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-main text-lg mb-2">{title}</h3>
                <p className="text-main/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ teaser ──────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-third">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
              Still have questions?
            </p>
            <h2 className="font-heading font-bold text-main text-3xl md:text-4xl mb-3">
              Check our FAQ
            </h2>
            <p className="text-main/50 text-sm leading-relaxed max-w-md">
              From delivery timelines to payment questions, we've answered the things people ask most.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/faq"
              className="inline-flex items-center justify-center gap-2 border border-main text-main font-semibold px-8 py-3 text-xs tracking-widest uppercase hover:bg-main hover:text-white transition-all duration-200"
            >
              Read the FAQ
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-main/20 text-main font-semibold px-8 py-3 text-xs tracking-widest uppercase hover:border-main transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="bg-main py-28">
        <div className="max-w-2xl mx-auto px-4 md:px-6 lg:px-12 flex flex-col items-center text-center gap-8">
          <div>
            <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-4">
              Ready to start?
            </p>
            <h2 className="font-heading font-bold text-white text-4xl md:text-5xl leading-tight mb-5">
              Join thousands of readers across Nigeria.
            </h2>
            <p className="text-white/55 text-sm leading-relaxed">
              Start buying and selling used books today — it's free to join and takes less than a minute.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/browse"
              className="inline-flex items-center justify-center gap-2 bg-white text-main font-semibold px-8 py-3.5 text-sm hover:bg-white/90 transition-colors"
            >
              Browse Books <ArrowRight size={14} />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-8 py-3.5 text-sm hover:border-white transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default HowItWorks
