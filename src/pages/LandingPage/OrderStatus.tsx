import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Circle, MapPin, Package } from 'lucide-react'
import {
  getOrder,
  updateOrderStatus,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_DESCRIPTIONS,
  ORDER_STATUSES,
} from '../../data/orderData'
import type { Order, OrderStatus } from '../../data/orderData'

function OrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [justConfirmed, setJustConfirmed] = useState(false)

  useEffect(() => {
    if (!orderId) { setNotFound(true); return }
    const o = getOrder(orderId)
    if (!o) setNotFound(true)
    else setOrder(o)
  }, [orderId])

  function handleConfirmDelivery() {
    if (!orderId || !order) return
    setConfirming(true)
    setTimeout(() => {
      updateOrderStatus(orderId, 'confirmed')
      setOrder(prev => prev ? { ...prev, status: 'confirmed' } : null)
      setJustConfirmed(true)
      setConfirming(false)
    }, 1000)
  }

  /* ── Not found ── */
  if (notFound) {
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
            className="inline-flex items-center gap-2 bg-main text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-main/90 transition-colors"
          >
            Browse Books
          </Link>
        </div>
      </div>
    )
  }

  if (!order) return null

  const isConfirmed = order.status === 'confirmed'
  const isDelivered = order.status === 'delivered'
  const currentIndex = ORDER_STATUSES.indexOf(order.status as OrderStatus)

  /* ── Confirmed state ── */
  if (isConfirmed || justConfirmed) {
    return (
      <div className="bg-third min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-secondary/12 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📚</span>
          </div>
          <h1 className="font-heading font-bold text-main text-2xl mb-3">We're glad you love it!</h1>
          <p className="text-main/55 text-sm mb-8 leading-relaxed">
            You've helped a book find a new home.
          </p>
          <div className="bg-white rounded-2xl border border-third p-4 mb-7 text-left">
            <p className="text-xs font-semibold text-main/40 uppercase tracking-wider mb-1">Order</p>
            <p className="font-heading font-bold text-main">{order.id}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to="/browse"
              className="w-full bg-main text-white font-semibold py-4 rounded-full hover:bg-main/90 transition-colors text-sm text-center"
            >
              Browse More Books
            </Link>
            <Link
              to="/contact"
              className="w-full text-center text-sm text-main/50 hover:text-main transition-colors font-medium py-2"
            >
              Leave a note for the seller
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── Main status page ── */
  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-main/40 uppercase tracking-widest mb-1">
            Order Tracking
          </p>
          <h1 className="font-heading font-bold text-main text-2xl md:text-3xl">{order.id}</h1>
          <p className="text-main/45 text-xs mt-1.5">
            Placed{' '}
            {new Date(order.createdAt).toLocaleDateString('en-NG', {
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
            {ORDER_STATUS_LABELS[order.status]}
          </p>
          <p className="text-main/55 text-sm mt-0.5">{ORDER_STATUS_DESCRIPTIONS[order.status]}</p>
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

            {/* Delivery confirmation prompt */}
            {isDelivered && (
              <div className="bg-white rounded-2xl border border-secondary/25 p-6">
                <h3 className="font-heading font-bold text-main text-base mb-2">
                  Did you receive your book?
                </h3>
                <p className="text-main/55 text-sm mb-5 leading-relaxed">
                  Please confirm once you've received your order so we can release payment to the seller.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleConfirmDelivery}
                    disabled={confirming}
                    className="flex-1 bg-main text-white font-semibold py-3 rounded-full text-sm hover:bg-main/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {confirming ? 'Confirming…' : '✓  Yes, all good'}
                  </button>
                  <Link
                    to={`/order/${orderId}/dispute`}
                    className="flex-1 border border-main/20 text-main font-semibold py-3 rounded-full text-sm hover:bg-main/5 transition-colors text-center"
                  >
                    ⚠  There's an issue
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ── Side panel ── */}
          <div className="md:col-span-2 flex flex-col gap-4">

            {/* Items */}
            <div className="bg-white rounded-2xl border border-third p-5">
              <h3 className="font-heading font-bold text-main text-sm mb-4">Items</h3>
              <div className="flex flex-col gap-3">
                {order.items.map(item => (
                  <div key={item.bookId} className="flex items-center gap-3">
                    <div
                      className="w-7 h-10 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: item.coverColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-main truncate">{item.title}</p>
                      <p className="text-xs text-main/40">{item.author}</p>
                    </div>
                    <span className="text-xs font-semibold text-main shrink-0">
                      ₦{item.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-third mt-4 pt-3 flex justify-between text-sm font-bold">
                <span className="text-main">Total</span>
                <span className="text-main">₦{order.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery address */}
            <div className="bg-white rounded-2xl border border-third p-5">
              <h3 className="font-heading font-bold text-main text-sm mb-3 flex items-center gap-2">
                <MapPin size={13} className="text-secondary" /> Delivery Address
              </h3>
              <p className="text-sm font-semibold text-main">{order.customerName}</p>
              <p className="text-xs text-main/55 mt-1 leading-relaxed">
                {order.deliveryAddress.street}<br />
                {order.deliveryAddress.city}, {order.deliveryAddress.state}
              </p>
              <p className="text-xs text-main/40 mt-1">{order.customerPhone}</p>
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
