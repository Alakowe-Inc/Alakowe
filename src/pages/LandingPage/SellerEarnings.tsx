import { Link } from 'react-router-dom'
import { ArrowLeft, Wallet, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import { MOCK_EARNINGS } from '../../data/sellerData'
import type { Earning } from '../../data/sellerData'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86_400_000)
  const h = Math.floor(diff / 3_600_000)
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  return 'Just now'
}

const STATUS_CONFIG: Record<Earning['status'], { label: string; class: string; icon: React.ElementType }> = {
  released: {
    label: 'Released',
    class: 'bg-green-50 text-green-700 border border-green-200',
    icon: CheckCircle,
  },
  pending: {
    label: 'Pending',
    class: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    icon: Clock,
  },
}

export default function SellerEarnings() {
  const earnings = MOCK_EARNINGS

  const total = earnings.reduce((s, e) => s + e.netAmount, 0)
  const released = earnings.filter(e => e.status === 'released').reduce((s, e) => s + e.netAmount, 0)
  const pending = earnings.filter(e => e.status === 'pending').reduce((s, e) => s + e.netAmount, 0)

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">

        <Link
          to="/my-listings"
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> Back to My Listings
        </Link>

        <div className="mb-8">
          <h1 className="font-heading font-bold text-main text-3xl">My Earnings</h1>
          <p className="text-main/50 text-sm mt-1">Your payout summary from completed sales</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-third p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={15} className="text-secondary" />
              <span className="text-xs font-semibold text-main/45 uppercase tracking-wider">Total Earned</span>
            </div>
            <p className="font-heading font-bold text-main text-2xl">₦{total.toLocaleString()}</p>
            <p className="text-xs text-main/40 mt-0.5">All time</p>
          </div>
          <div className="bg-white rounded-2xl border border-third p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={15} className="text-green-500" />
              <span className="text-xs font-semibold text-main/45 uppercase tracking-wider">Released</span>
            </div>
            <p className="font-heading font-bold text-main text-2xl">₦{released.toLocaleString()}</p>
            <p className="text-xs text-main/40 mt-0.5">In your account</p>
          </div>
          <div className="bg-white rounded-2xl border border-third p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={15} className="text-yellow-500" />
              <span className="text-xs font-semibold text-main/45 uppercase tracking-wider">Pending</span>
            </div>
            <p className="font-heading font-bold text-main text-2xl">₦{pending.toLocaleString()}</p>
            <p className="text-xs text-main/40 mt-0.5">Awaiting buyer confirmation</p>
          </div>
        </div>

        {/* Payout info banner */}
        <div className="flex items-start gap-3 bg-secondary/6 border border-secondary/20 rounded-xl px-5 py-4 mb-6">
          <Wallet size={16} className="text-secondary shrink-0 mt-0.5" />
          <p className="text-sm text-main/65 leading-relaxed">
            Funds are released to your bank account within{' '}
            <span className="font-semibold text-main">24–48 hours</span> after a buyer confirms delivery. Make sure your payout details are up to date in{' '}
            <Link to="/account" className="text-secondary font-semibold hover:underline">My Profile</Link>.
          </p>
        </div>

        {/* Transaction list */}
        {earnings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-third p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-main/6 flex items-center justify-center mx-auto mb-4">
              <Wallet size={28} className="text-main/30" />
            </div>
            <h2 className="font-heading font-bold text-main text-lg mb-2">No earnings yet</h2>
            <p className="text-main/50 text-sm">Earnings will appear here once buyers confirm their deliveries.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h2 className="font-heading font-bold text-main text-base">Transaction History</h2>
            {earnings.map(earning => {
              const cfg = STATUS_CONFIG[earning.status]
              const Icon = cfg.icon
              return (
                <div key={earning.id} className="bg-white rounded-2xl border border-third p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-heading font-bold text-main text-base leading-snug">
                        {earning.bookTitle}
                      </p>
                      <p className="text-xs text-main/45 mt-0.5">{timeAgo(earning.createdAt)}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${cfg.class}`}>
                      <Icon size={11} /> {cfg.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm border-t border-third pt-4">
                    <div>
                      <p className="text-xs text-main/40 mb-0.5">Sale Price</p>
                      <p className="font-semibold text-main">₦{earning.saleAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-main/40 mb-0.5">Platform Fee</p>
                      <p className="font-semibold text-main/55">−₦{earning.platformFee.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-main/40 mb-0.5">Your Payout</p>
                      <p className="font-heading font-bold text-main">₦{earning.netAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
