import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Package, Wallet, TrendingUp, AlertCircle, Plus } from 'lucide-react'
import { sellerListings, sellerOrders, sellerEarnings } from '../../../data/dashboardMockData'

const fmt = (n: number) => `₦${n.toLocaleString()}`

const COVER_PALETTE = [
  '#172131', '#6B6FFF', '#E63946', '#F4A261',
  '#2D6A4F', '#457B9D', '#9B5DE5', '#1D3557',
]
const coverColor = (id: string) => COVER_PALETTE[parseInt(id) % COVER_PALETTE.length]

const LISTING_STATUS_STYLES: Record<string, string> = {
  live: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-700',
  sold: 'bg-blue-100 text-blue-700',
}
const LISTING_STATUS_LABELS: Record<string, string> = {
  live: 'Live', pending: 'Under Review', rejected: 'Rejected', sold: 'Sold',
}
const ORDER_STATUS_STYLES: Record<string, string> = {
  payment_received: 'bg-amber-100 text-amber-700',
  awaiting_seller: 'bg-amber-100 text-amber-700',
  dropoff_scheduled: 'bg-blue-100 text-blue-700',
  received_by_alakowe: 'bg-blue-100 text-blue-700',
  processing: 'bg-secondary/15 text-secondary',
  dispatched: 'bg-secondary/15 text-secondary',
  delivered: 'bg-green-100 text-green-700',
  confirmed: 'bg-green-100 text-green-700',
  funds_released: 'bg-emerald-100 text-emerald-700',
}
const ORDER_STATUS_LABELS: Record<string, string> = {
  payment_received: 'Payment Received', awaiting_seller: 'Action Required',
  dropoff_scheduled: 'Drop-off Scheduled', received_by_alakowe: 'At Alakowe',
  processing: 'Processing', dispatched: 'Dispatched', delivered: 'Delivered',
  confirmed: 'Buyer Confirmed', funds_released: 'Funds Released',
}

function SellerOverview() {
  const liveCount = sellerListings.filter(l => l.status === 'live').length
  const pendingCount = sellerListings.filter(l => l.status === 'pending').length
  const releasedTotal = sellerEarnings.filter(e => e.status === 'released').reduce((s, e) => s + e.netAmount, 0)
  const pendingTotal = sellerEarnings.filter(e => e.status === 'pending').reduce((s, e) => s + e.netAmount, 0)
  const actionNeeded = sellerOrders.filter(o => o.status === 'awaiting_seller')

  const stats = [
    {
      label: 'Total Listings',
      value: sellerListings.length,
      sub: `${liveCount} live · ${pendingCount} under review`,
      Icon: BookOpen,
      accent: 'bg-secondary',
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
    {
      label: 'Active Orders',
      value: sellerOrders.filter(o => o.status !== 'funds_released' && o.status !== 'confirmed').length,
      sub: actionNeeded.length > 0 ? `${actionNeeded.length} need your action` : 'All up to date',
      Icon: Package,
      accent: 'bg-amber-400',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      label: 'Total Earned',
      value: fmt(releasedTotal),
      sub: 'Released to your account',
      Icon: TrendingUp,
      accent: 'bg-emerald-500',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Pending Payout',
      value: fmt(pendingTotal),
      sub: 'Held in escrow',
      Icon: Wallet,
      accent: 'bg-blue-400',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
  ]

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-7">
        <div>
          <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-1">
            Seller Dashboard
          </p>
          <h1 className="font-heading font-bold text-main text-2xl md:text-3xl leading-tight">
            Good afternoon, Chidi
          </h1>
          <p className="text-main/40 text-sm mt-1">
            {new Date().toLocaleDateString('en-NG', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
        <Link
          to="/list"
          className="inline-flex items-center gap-2 bg-main text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-main/90 transition-colors shrink-0 self-start"
        >
          <Plus size={15} /> List a Book
        </Link>
      </div>

      {/* Action required banner */}
      {actionNeeded.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle size={16} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900">
              {actionNeeded.length} order{actionNeeded.length > 1 ? 's' : ''}{' '}
              {actionNeeded.length > 1 ? 'need' : 'needs'} your attention
            </p>
            <p className="text-xs text-amber-700/80 mt-0.5">
              Drop off or request pickup within 48 hours to avoid delays.
            </p>
          </div>
          <Link
            to="/dashboard/seller/orders"
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 transition-colors shrink-0"
          >
            Act now <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, value, sub, Icon, accent, iconBg, iconColor }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-third/60 overflow-hidden"
          >
            {/* Top accent line */}
            <div className={`h-0.5 ${accent}`} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-main/35 leading-tight">
                  {label}
                </p>
                <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center shrink-0 ml-2`}>
                  <Icon size={15} className={iconColor} />
                </div>
              </div>
              <p className="font-heading font-bold text-main text-2xl md:text-[1.75rem] leading-none mb-1.5">
                {value}
              </p>
              <p className="text-[11px] text-main/35 leading-snug">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom two-column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Listings */}
        <div className="bg-white rounded-2xl border border-third/60 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-third/70">
            <h2 className="font-heading font-semibold text-main text-[15px]">My Listings</h2>
            <Link
              to="/dashboard/seller/listings"
              className="text-xs font-semibold text-secondary hover:text-main transition-colors flex items-center gap-1"
            >
              View all <ArrowRight size={11} />
            </Link>
          </div>

          <div className="divide-y divide-third/60">
            {sellerListings.slice(0, 4).map(listing => (
              <div key={listing.id} className="flex items-center gap-3.5 px-5 py-3.5">
                {/* Colored cover */}
                <div
                  className="w-8 h-11 rounded-lg flex items-center justify-center shrink-0 text-white text-[11px] font-bold shadow-sm"
                  style={{ backgroundColor: coverColor(listing.id) }}
                >
                  {listing.title.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-main truncate">{listing.title}</p>
                  <p className="text-xs text-main/40 truncate">{listing.author}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <p className="text-[13px] font-bold text-main">{fmt(listing.price)}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${LISTING_STATUS_STYLES[listing.status]}`}>
                    {LISTING_STATUS_LABELS[listing.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-third/70">
            <Link
              to="/list"
              className="text-xs font-semibold text-secondary hover:text-main transition-colors flex items-center gap-1.5"
            >
              <Plus size={12} /> List a new book
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-third/60 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-third/70">
            <h2 className="font-heading font-semibold text-main text-[15px]">Recent Orders</h2>
            <Link
              to="/dashboard/seller/orders"
              className="text-xs font-semibold text-secondary hover:text-main transition-colors flex items-center gap-1"
            >
              View all <ArrowRight size={11} />
            </Link>
          </div>

          {sellerOrders.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="w-12 h-12 rounded-2xl bg-third flex items-center justify-center mx-auto mb-3">
                <Package size={22} className="text-main/25" />
              </div>
              <p className="text-main/40 text-sm font-medium">No orders yet</p>
              <p className="text-main/30 text-xs mt-1">Orders appear once a buyer purchases your book.</p>
            </div>
          ) : (
            <div className="divide-y divide-third/60">
              {sellerOrders.map(order => (
                <div key={order.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-main truncate">{order.bookTitle}</p>
                      <p className="text-[11px] text-main/40 mt-0.5 font-mono">{order.orderId}</p>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-1.5">
                      <p className="text-[13px] font-bold text-main">{fmt(order.amount)}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${ORDER_STATUS_STYLES[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </div>
                  </div>

                  {order.status === 'awaiting_seller' && (
                    <div className="mt-3 flex gap-2">
                      <Link
                        to="/dashboard/seller/orders"
                        className="flex-1 text-center text-xs font-semibold bg-main text-white py-2 rounded-lg hover:bg-main/90 transition-colors"
                      >
                        Choose Drop-off
                      </Link>
                      <Link
                        to="/dashboard/seller/orders"
                        className="flex-1 text-center text-xs font-semibold border border-main/15 text-main py-2 rounded-lg hover:border-main/30 transition-colors"
                      >
                        Request Pickup
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SellerOverview
