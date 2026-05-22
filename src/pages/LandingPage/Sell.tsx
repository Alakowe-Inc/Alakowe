import { Link } from 'react-router-dom'
import { 
BookOpen, 
Bell, 
Package, 
Banknote, 
CheckCircle, 
ArrowRight,
Sparkles,
ThumbsUp,
Check,
Minus,
AlertCircle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const steps = [
  {
    icon: BookOpen,
    title: 'List your book',
    desc: 'Fill out a short form. Title, condition, price, and a quick description. Add photos so buyers know what to expect.',
  },
  {
    icon: Bell,
    title: 'Get notified when it sells',
    desc: "We'll email you the moment a buyer places an order. You'll have 48 hours to drop off or schedule a pickup.",
  },
  {
    icon: Package,
    title: 'Drop off or request pickup',
    desc: 'Bring your book to the nearest ALÁKÒWÉ collection centre, or request a pickup for a small convenience fee.',
  },
  {
    icon: Banknote,
    title: 'Get paid',
    desc: 'Once the buyer confirms delivery, your earnings are released directly to your bank account. No waiting, no hassle.',
  },
]

const accepted = [
  'African Fiction', 'Foreign Fiction', 'Romance', 'Thriller',
  'Fantasy', 'Self Help', 'Business', 'Biography', 'Children', 'Academic',
]

const perks = [
  { label: 'Free to list', desc: 'No upfront fees. We only earn when you do.' },
  { label: 'Secure escrow', desc: "Buyer's payment is held until delivery is confirmed." },
  { label: 'We handle logistics', desc: 'You drop off. We deliver. Simple.' },
  { label: 'Fair pricing tools', desc: 'We flag listings that may be priced too high.' },
]

export default function Sell() {
  const { user } = useAuth()

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="bg-main text-white">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4">
              Sell on ALÁKÒWÉ
            </p>
            <h1 className="font-heading font-bold text-4xl md:text-5xl leading-tight mb-6">
              Your bookshelf is worth more than you think.
            </h1>
            <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
              List your used books and earn from readers who'll love them as much as you did.
              No fees to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={user ? '/list' : '/login?redirect=/list'}
                className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-semibold px-8 py-4 rounded-full hover:bg-secondary/90 transition-colors text-sm"
              >
                List Your Book <ArrowRight size={16} />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/80 font-semibold px-8 py-4 rounded-full hover:bg-white/8 transition-colors text-sm"
              >
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How selling works ── */}
      <section className="bg-third">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 py-20">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">
              The Process
            </p>
            <h2 className="font-heading font-bold text-main text-3xl md:text-4xl">
              Four steps to your first sale
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-third relative">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-secondary" />
                </div>
                <span className="absolute top-6 right-6 text-xs font-bold text-main/15 font-heading">
                  0{i + 1}
                </span>
                <h3 className="font-heading font-bold text-main text-base mb-2">{title}</h3>
                <p className="text-main/55 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we accept ── */}
      <section className="bg-white">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">
                What We Accept
              </p>
              <h2 className="font-heading font-bold text-main text-3xl md:text-4xl mb-5">
                Books readers actually want
              </h2>
              <p className="text-main/55 text-base leading-relaxed mb-8">
                We focus on adult reading, the genres Nigerian readers are buying right now.
                If your book is in readable condition, we'll list it.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {accepted.map(genre => (
                  <span
                    key={genre}
                    className="text-xs font-semibold text-main/70 bg-third border border-main/10 px-3 py-1.5 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <div className="bg-third border border-main/8 rounded-xl p-4">
                <p className="text-xs font-semibold text-main mb-1">Condition we accept</p>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2 text-sm text-main/55">
                    <Sparkles size={14} className="text-secondary" />
                    <span>Like New</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-main/55">
                    <ThumbsUp size={14} className="text-secondary" />
                    <span>Very Good</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-main/55">
                    <Check size={14} className="text-secondary" />
                    <span>Good</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-main/55">
                    <Minus size={14} className="text-secondary" />
                    <span>Average</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-main/55">
                    <AlertCircle size={14} className="text-secondary" />
                    <span>Below Average</span>
                  </div>

                  <p className="text-xs text-main/40 mt-2">
                    Be honest, our team inspects every book before delivery.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="grid grid-cols-3 gap-3">
              {['#C8A97E','#9B5DE5','#F4A261','#2D6A4F','#E63946','#457B9D','#1D3557','#E9C46A','#52B788'].map((color, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-2xl shadow-sm opacity-80"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="bg-third">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">
              Why Sell Here
            </p>
            <h2 className="font-heading font-bold text-main text-3xl md:text-4xl">
              Built to make selling easy
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {perks.map(({ label, desc }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-third">
                <CheckCircle size={18} className="text-secondary mb-3" />
                <p className="font-heading font-bold text-main text-sm mb-1">{label}</p>
                <p className="text-main/50 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fees ── */}
      <section className="bg-white">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">
              Pricing & Fees
            </p>
            <h2 className="font-heading font-bold text-main text-3xl md:text-4xl mb-5">
              Simple, transparent fees
            </h2>
            <p className="text-main/55 text-base leading-relaxed mb-10">
              Listing is always free. ALÁKÒWÉ takes a <span className="font-semibold text-main">10% platform fee</span> only
              when your book sells. You keep the rest.
            </p>
            <div className="bg-third rounded-2xl border border-main/8 p-6 text-left">
              {[
                { label: 'Listing fee', value: 'Free' },
                { label: 'Platform fee', value: '10% of sale price' },
                { label: 'Pickup fee (optional)', value: 'Deducted from payout' },
                { label: 'Payout method', value: 'Direct bank transfer' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-3 border-b border-main/8 last:border-0 last:pb-0 first:pt-0">
                  <span className="text-sm text-main/55">{label}</span>
                  <span className="text-sm font-semibold text-main">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-main text-white">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 py-20 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
            Ready to list your first book?
          </h2>
          <p className="text-white/55 text-base mb-10 max-w-md mx-auto">
            It takes less than 5 minutes. Your book could find a new home this week.
          </p>
          <Link
            to={user ? '/list' : '/login?redirect=/list'}
            className="inline-flex items-center gap-2 bg-secondary text-white font-semibold px-10 py-4 rounded-full hover:bg-secondary/90 transition-colors text-sm"
          >
            List Your Book <ArrowRight size={16} />
          </Link>
          <p className="text-white/30 text-xs mt-5">
            By listing, you agree to our{' '}
            <Link to="/faq" className="underline hover:text-white/60 transition-colors">
              seller terms
            </Link>
          </p>
        </div>
      </section>

    </div>
  )
}
