import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Truck, Package, AlertCircle } from 'lucide-react'
import { getAllSellerOrders, seedSellerOrders } from '../../data/sellerData'
import { seedDemoOrder } from '../../data/orderData'
import type { SellerOrder } from '../../data/sellerData'

const STATUS_CONFIG: Record<SellerOrder['status'], { label: string; class: string; icon: React.ElementType }> = {
  awaiting_seller: {
    label: 'Action Required',
    class: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    icon: AlertCircle,
  },
  dropoff_scheduled: {
    label: 'Drop-off Scheduled',
    class: 'bg-blue-50 text-blue-700 border border-blue-200',
    icon: Clock,
  },
  received_by_alakowe: {
    label: 'Received by Alakowe',
    class: 'bg-purple-50 text-purple-700 border border-purple-200',
    icon: Package,
  },
  dispatched: {
    label: 'Dispatched',
    class: 'bg-secondary/8 text-secondary border border-secondary/20',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    class: 'bg-orange-50 text-orange-700 border border-orange-200',
    icon: Package,
  },
  confirmed: {
    label: 'Buyer Confirmed',
    class: 'bg-green-50 text-green-700 border border-green-200',
    icon: CheckCircle,
  },
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  const d = Math.floor(diff / 86_400_000)
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  return 'Just now'
}

export default function SellerOrders() {
  const [orders, setOrders] = useState<SellerOrder[]>([])

  useEffect(() => {
    seedDemoOrder()
    seedSellerOrders()
    setOrders(Object.values(getAllSellerOrders()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ))
  }, [])

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

        {/* Action required banner */}
        {orders.some(o => o.status === 'awaiting_seller') && (
          <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 mb-6">
            <AlertCircle size={16} className="text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">You have books to drop off</p>
              <p className="text-xs text-yellow-700 mt-0.5">
                One or more buyers are waiting. Please drop off your book within 48 hours of the sale.
              </p>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-third p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-main/6 flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-main/30" />
            </div>
            <h2 className="font-heading font-bold text-main text-lg mb-2">No sales yet</h2>
            <p className="text-main/50 text-sm">Your sales will appear here once buyers start ordering your books.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => {
              const cfg = STATUS_CONFIG[order.status]
              const Icon = cfg.icon
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-third p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-heading font-bold text-main text-base leading-snug">
                        {order.bookTitle}
                      </p>
                      <p className="text-xs text-main/45 mt-0.5">
                        Order {order.orderId} · Buyer: {order.buyerInitials} · {timeAgo(order.createdAt)}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${cfg.class}`}>
                      <Icon size={11} /> {cfg.label}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm border-t border-third pt-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-main/40 mb-0.5">Sale Price</p>
                        <p className="font-semibold text-main">₦{order.saleAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-main/40 mb-0.5">Platform Fee</p>
                        <p className="font-semibold text-main/55">−₦{order.platformFee.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-main/40 mb-0.5">Your Payout</p>
                        <p className="font-heading font-bold text-main">₦{order.netAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    {order.status === 'awaiting_seller' && (
                      <div className="sm:ml-auto">
                        <Link
                          to={`/my-sales/${order.id}/dropoff`}
                          className="inline-flex bg-main text-white font-semibold text-xs px-4 py-2 rounded-full hover:bg-main/90 transition-colors"
                        >
                          Schedule Drop-off
                        </Link>
                      </div>
                    )}
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
