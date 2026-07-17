import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Circle, MapPin, Package } from 'lucide-react'
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_DESCRIPTIONS,
  ORDER_STATUSES,
  getOrderDeliveryAddress,
  moneyInNaira,
  normalizeOrderStatus,
  orderTotalInNaira,
  sellerDisplayName,
} from '../../lib/orders'
import { useOrder } from '../../lib/api/orders/orders.hooks'
import { formatPrice } from '../../lib/utils'

function OrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const numericOrderId = Number(orderId)
  const { data: order, isLoading, error } = useOrder(numericOrderId)

  /* ── Not found ── */
  if (!Number.isInteger(numericOrderId) || error) {
    return (
      <div className="bg-third min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-main/8 flex items-center justify-center mx-auto mb-6">
            <Package size={28} className="text-main/40" />
          </div>
          <h2 className="font-heading font-bold text-main text-xl mb-2">Order not found</h2>
          <p className="text-main/50 text-sm mb-6">
            This link may have expired or the order ID is incorrect.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 bg-main text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-main/90 transition-colors"
          >
            Browse Books
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading || !order) {
    return (
      <div className="bg-third min-h-screen flex items-center justify-center px-4">
        <p className="text-main/50 text-sm">Loading order…</p>
      </div>
    )
  }

  const status = normalizeOrderStatus(order.status)
  const currentIndex = ORDER_STATUSES.indexOf(status)
  const delivery = getOrderDeliveryAddress(order)
  const cityState = [delivery.city, delivery.state].filter(Boolean).join(', ')

  /* ── Main status page ── */
  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-main/40 uppercase tracking-widest mb-1">
            Order Tracking
          </p>
          <h1 className="font-heading font-bold text-main text-2xl md:text-3xl">{order.orderNumber || order.id}</h1>
          <p className="text-main/45 text-xs mt-1.5">
            Placed{' '}
            {new Date(order.orderDate).toLocaleDateString('en-NG', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            <span className="mx-2 text-main/20">·</span>
            <span className="text-secondary/80 font-medium">Link expires in 3 days</span>
          </p>
        </div>

        {/* Current status banner */}
        <div className="bg-secondary/10 border border-secondary/20 rounded-2xl px-5 py-4 mb-8">
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
            Current Status
          </p>
          <p className="font-heading font-bold text-main text-base md:text-lg">
            {ORDER_STATUS_LABELS[status]}
          </p>
          <p className="text-main/55 text-sm mt-0.5">{ORDER_STATUS_DESCRIPTIONS[status]}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          {/* ── Timeline ── */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-third p-6">
              <h2 className="font-heading font-bold text-main text-base mb-6">Order Timeline</h2>
              <div>
                {ORDER_STATUSES.map((status, i) => {
                  const isComplete = i < currentIndex
                  const isActive = i === currentIndex
                  const isLast = i === ORDER_STATUSES.length - 1

                  return (
                    <div key={status} className="flex items-start gap-4">
                      {/* Dot + connector */}
                      <div className="flex flex-col items-center shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isComplete
                              ? 'bg-green-500'
                              : isActive
                              ? 'bg-secondary'
                              : 'bg-main/8 border border-main/15'
                          }`}
                        >
                          {isComplete ? (
                            <CheckCircle size={15} className="text-white" />
                          ) : isActive ? (
                            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                          ) : (
                            <Circle size={13} className="text-main/25" />
                          )}
                        </div>
                        {!isLast && (
                          <div
                            className={`w-0.5 h-8 mt-1 ${
                              isComplete ? 'bg-green-300' : 'bg-main/10'
                            }`}
                          />
                        )}
                      </div>

                      {/* Label */}
                      <div className={`pb-5 ${isLast ? '' : ''}`}>
                        <p
                          className={`text-sm font-semibold leading-snug ${
                            isComplete
                              ? 'text-main/50'
                              : isActive
                              ? 'text-main'
                              : 'text-main/25'
                          }`}
                        >
                          {ORDER_STATUS_LABELS[status]}
                        </p>
                        {isActive && (
                          <p className="text-xs text-main/45 mt-0.5 leading-relaxed">
                            {ORDER_STATUS_DESCRIPTIONS[status]}
                          </p>
                        )}
                        {isComplete && (
                          <p className="text-xs text-green-600/70 mt-0.5">Completed</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

          {/* ── Side panel ── */}
          <div className="md:col-span-2 flex flex-col gap-4">

            {/* Items */}
            <div className="bg-white rounded-2xl border border-third p-5">
              <h3 className="font-heading font-bold text-main text-sm mb-4">Items</h3>
              <div className="flex flex-col gap-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-7 h-10 rounded-lg shrink-0 overflow-hidden bg-main/8 flex items-center justify-center">
                      {item.coverImageFileName ? (
                        <img
                          src={item.coverImageFileName}
                          alt={item.bookTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={12} className="text-main/25" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-main truncate">{item.bookTitle}</p>
                      <p className="text-xs text-main/40">{sellerDisplayName(item)}</p>
                    </div>
                    <span className="text-xs font-semibold text-main shrink-0">
                      {formatPrice(moneyInNaira(item.buyerPrice * item.quantity))}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-third mt-4 pt-3 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-main/50">Subtotal</span>
                  <span className="text-main">{formatPrice(moneyInNaira(order.baseAmount + order.markupTotal))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-main/50">Delivery</span>
                  <span className="text-main">
                    {(order.deliveryFee ?? 0) > 0
                      ? formatPrice(moneyInNaira(order.deliveryFee))
                      : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold mt-0.5">
                  <span className="text-main">Total</span>
                  <span className="text-main">{formatPrice(orderTotalInNaira(order))}</span>
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div className="bg-white rounded-2xl border border-third p-5">
              <h3 className="font-heading font-bold text-main text-sm mb-3 flex items-center gap-2">
                <MapPin size={13} className="text-secondary" /> Delivery Address
              </h3>
              {delivery.fullName && (
                <p className="text-sm font-semibold text-main">{delivery.fullName}</p>
              )}
              <p className="text-xs text-main/55 mt-1 leading-relaxed">
                {delivery.street && <>{delivery.street}<br /></>}
                {cityState || 'Address saved with this order'}
              </p>
              {delivery.phone && (
                <p className="text-xs text-main/40 mt-1">{delivery.phone}</p>
              )}
            </div>

            {/* Support */}
            <div className="bg-white rounded-2xl border border-third p-5">
              <p className="text-xs text-main/45 leading-relaxed">
                Need help?{' '}
                <Link to="/contact" className="text-secondary font-semibold hover:underline">
                  Contact Support
                </Link>
                {' '}or visit our{' '}
                <Link to="/faq" className="text-secondary font-semibold hover:underline">
                  FAQ
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderStatusPage
