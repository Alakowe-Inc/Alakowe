import { Link } from 'react-router-dom'
import { ArrowLeft, Wallet, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import { useSellerPayoutSummary } from '../../lib/api/orders/orders.hooks'
import { moneyInNaira } from '../../lib/orders'

export default function SellerEarnings() {
  const { data: summary, isLoading, error } = useSellerPayoutSummary()
  const total = moneyInNaira(summary?.totalEarned)
  const released = moneyInNaira(summary?.totalPaidOut)
  const pending = moneyInNaira(summary?.pendingPayout)

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

        {error && (
          <div className="bg-white rounded-2xl border border-third p-5 mb-6 text-red-500 text-sm">
            {error.message}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-third p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={15} className="text-secondary" />
              <span className="text-xs font-semibold text-main/45 uppercase tracking-wider">Total Earned</span>
            </div>
            <p className="font-heading font-bold text-main text-2xl">{isLoading ? '—' : `₦${total.toLocaleString()}`}</p>
            <p className="text-xs text-main/40 mt-0.5">All time</p>
          </div>
          <div className="bg-white rounded-2xl border border-third p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={15} className="text-green-500" />
              <span className="text-xs font-semibold text-main/45 uppercase tracking-wider">Released</span>
            </div>
            <p className="font-heading font-bold text-main text-2xl">{isLoading ? '—' : `₦${released.toLocaleString()}`}</p>
            <p className="text-xs text-main/40 mt-0.5">In your account</p>
          </div>
          <div className="bg-white rounded-2xl border border-third p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={15} className="text-yellow-500" />
              <span className="text-xs font-semibold text-main/45 uppercase tracking-wider">Pending</span>
            </div>
            <p className="font-heading font-bold text-main text-2xl">{isLoading ? '—' : `₦${pending.toLocaleString()}`}</p>
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

        <div className="bg-white rounded-2xl border border-third p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-main/6 flex items-center justify-center mx-auto mb-4">
            <Wallet size={28} className="text-main/30" />
          </div>
          <h2 className="font-heading font-bold text-main text-lg mb-2">
            {summary?.orderCount ? `${summary.orderCount} earning order${summary.orderCount === 1 ? '' : 's'}` : 'No earnings yet'}
          </h2>
          <p className="text-main/50 text-sm">
            {summary?.orderCount
              ? 'Your payout totals are shown above.'
              : 'Earnings will appear here once buyers place orders for your books.'}
          </p>
        </div>

      </div>
    </div>
  )
}
