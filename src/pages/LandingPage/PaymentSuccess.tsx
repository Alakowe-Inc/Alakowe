import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { getOrder } from '../../data/orderData'
import type { Order } from '../../data/orderData'

function PaymentSuccess() {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (orderId) setOrder(getOrder(orderId))
  }, [orderId])

  return (
    <div className="bg-third min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle size={40} className="text-green-500" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-main text-3xl mb-3">Payment Successful</h1>
          <p className="text-main/55 text-sm leading-relaxed">
            We've notified the seller to drop off your book.<br />
            Please look forward to our emails — we'll keep you updated at every step.
          </p>
        </div>

        {/* Order summary card */}
        {order && (
          <div className="bg-white rounded-2xl border border-third p-6 mb-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-main/40 uppercase tracking-wider">Order ID</span>
              <span className="font-heading font-bold text-main text-sm">{order.id}</span>
            </div>

            <div className="flex flex-col gap-3 mb-4">
              {order.items.map(item => (
                <div key={item.bookId} className="flex items-center gap-3">
                  <div
                    className="w-7 h-10 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: item.coverColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-main truncate">{item.title}</p>
                    <p className="text-xs text-main/45">{item.author}</p>
                  </div>
                  <span className="text-sm text-main font-medium shrink-0">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-third pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-main/50">Subtotal</span>
                <span className="text-main">₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-main/50">Delivery</span>
                <span className="text-main">₦{order.deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-bold mt-1">
                <span className="text-main">Total</span>
                <span className="text-main">₦{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* What's next notice */}
        <div className="bg-secondary/8 border border-secondary/20 rounded-xl px-5 py-4 mb-8">
          <p className="text-sm text-main/70 leading-relaxed">
            <span className="font-semibold text-main">What happens next:</span> The seller has 48 hours
            to drop off your book at a collection centre. We'll email you at every key stage of the journey.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          {orderId && (
            <Link
              to={`/order/${orderId}`}
              className="w-full bg-main text-white font-semibold py-4 rounded-full hover:bg-main/90 transition-colors text-sm text-center flex items-center justify-center gap-2"
            >
              View Order Status <ArrowRight size={15} />
            </Link>
          )}
          <Link
            to="/browse"
            className="w-full text-center text-sm text-main/50 hover:text-main transition-colors font-medium py-2"
          >
            Browse more books
          </Link>
        </div>

      </div>
    </div>
  )
}

export default PaymentSuccess
