import { Link } from 'react-router-dom'
import { ArrowLeft, Package } from 'lucide-react'
import { useSellerPayoutSummary } from '../../lib/api/orders/orders.hooks'

export default function SellerOrders() {
  const { data: summary, isLoading, error } = useSellerPayoutSummary()

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">

        <Link
          to="/my-listings"
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> Back to My Listings
        </Link>

        <div className="mb-8">
          <h1 className="font-heading font-bold text-main text-3xl">My Sales</h1>
          <p className="text-main/50 text-sm mt-1">Orders placed for your books</p>
        </div>

        {error && (
          <div className="bg-white rounded-2xl border border-third p-5 mb-6 text-red-500 text-sm">
            {error.message}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-third p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-main/6 flex items-center justify-center mx-auto mb-4">
            <Package size={28} className="text-main/30" />
          </div>
          <h2 className="font-heading font-bold text-main text-lg mb-2">
            {isLoading
              ? 'Loading your sales…'
              : summary?.orderCount
                ? `${summary.orderCount} sale${summary.orderCount === 1 ? '' : 's'} recorded`
                : 'No sales yet'}
          </h2>
          <p className="text-main/50 text-sm">
            {summary?.orderCount
              ? 'Your sales totals are available under My Earnings. Individual sale details require a seller-orders API.'
              : 'Your sales will appear here once buyers start ordering your books.'}
          </p>
        </div>

      </div>
    </div>
  )
}
