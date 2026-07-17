import { Link } from 'react-router-dom'
import { Package, Truck, CheckCircle, Clock, AlertCircle, ShoppingBag } from 'lucide-react'
import { useCart } from '../../lib/api/cart/cart.hooks'
import { useOrdersByUser } from '../../lib/api/orders/orders.hooks'
import {
  ORDER_STATUS_LABELS,
  formatOrderShippingAddress,
  normalizeOrderStatus,
  orderTotalInNaira,
  sellerDisplayName,
  type DisplayOrderStatus,
} from '../../lib/orders'

const STATUS_CONFIG: Record<DisplayOrderStatus, { class: string; icon: React.ElementType }> = {
  payment_received:    { class: 'bg-blue-50 text-blue-700 border border-blue-200',       icon: Clock },
  awaiting_seller:     { class: 'bg-yellow-50 text-yellow-700 border border-yellow-200', icon: AlertCircle },
  dropoff_scheduled:   { class: 'bg-blue-50 text-blue-700 border border-blue-200',       icon: Clock },
  received_by_alakowe: { class: 'bg-purple-50 text-purple-700 border border-purple-200', icon: Package },
  processing:          { class: 'bg-purple-50 text-purple-700 border border-purple-200', icon: Package },
  dispatched:          { class: 'bg-secondary/8 text-secondary border border-secondary/20', icon: Truck },
  delivered:           { class: 'bg-orange-50 text-orange-700 border border-orange-200', icon: Package },
  confirmed:           { class: 'bg-green-50 text-green-700 border border-green-200',    icon: CheckCircle },
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86_400_000)
  const h = Math.floor(diff / 3_600_000)
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  return 'Just now'
}

export default function MyPurchases() {

  const { data: cart, isLoading: isCartLoading } = useCart()
  const numericUserId = cart?.userId ? String(cart.userId) : ''
  const { data, isLoading: isOrdersLoading, error } = useOrdersByUser(numericUserId)
  const isLoading = isCartLoading || isOrdersLoading
  const orders = [...(data ?? [])].sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  )

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">

        <div className="mb-8">
          <h1 className="font-heading font-bold text-main text-3xl">My Purchases</h1>
          <p className="text-main/50 text-sm mt-1">Books you've bought on Alakowe</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-third p-12 text-center">
            <p className="text-main/50 text-sm">Loading your purchases…</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-third p-12 text-center">
            <p className="text-red-500 text-sm">{error.message}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-third p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-main/6 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} className="text-main/30" />
            </div>
            <h2 className="font-heading font-bold text-main text-lg mb-2">No purchases yet</h2>
            <p className="text-main/50 text-sm mb-6">
              When you buy a book it'll show up here so you can track it.
            </p>
            <Link
              to="/browse"
              className="inline-block bg-main text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-main/90 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => {
              const status = normalizeOrderStatus(order.status)
              const cfg = STATUS_CONFIG[status]
              const Icon = cfg.icon
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-third p-5">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs text-main/40 mb-0.5">Order {order.orderNumber || 'N/A'} · {timeAgo(order.orderDate)}</p>
                      <p className="font-heading font-bold text-main text-base leading-snug">
                        {order.items.length === 1
                          ? order.items[0].bookTitle
                          : `${order.items[0]?.bookTitle ?? 'Order'} + ${order.items.length - 1} more`}
                      </p>
                      <p className="text-xs text-main/45 mt-0.5">
                        {Array.from(new Set(order.items.map(i => sellerDisplayName(i)))).join(', ')}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${cfg.class}`}>
                      <Icon size={11} /> {ORDER_STATUS_LABELS[status]}
                    </span>
                  </div>

                  {/* Book covers */}
                  <div className="flex gap-2 mb-4">
                    {order.items.map(item => (
                      <div
                        key={item.id}
                        className="w-10 h-14 rounded-lg shrink-0 overflow-hidden bg-main/8 flex items-center justify-center"
                      >
                        {item.coverImageFileName ? (
                          <img
                            src={item.coverImageFileName}
                            alt={item.bookTitle}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={16} className="text-main/25" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-4 border-t border-third pt-4">
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <p className="text-xs text-main/40 mb-0.5">Total Paid</p>
                        <p className="font-heading font-bold text-main">₦{orderTotalInNaira(order).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-main/40 mb-0.5">Delivery to</p>
                        <p className="font-semibold text-main text-xs">{formatOrderShippingAddress(order)}</p>
                      </div>
                    </div>
                    <Link
                      to={`/order/${order.id}`}
                      className="text-xs font-semibold text-secondary hover:underline"
                    >
                      Track Order
                    </Link>
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
