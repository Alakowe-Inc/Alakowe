import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Package } from 'lucide-react'
import { useOrder } from '../../lib/api/orders/orders.hooks'
import {
  isPickupOrder,
  moneyInNaira,
  orderTotalInNaira,
  sellerDisplayName,
} from '../../lib/orders'
import { formatPrice } from '../../lib/utils'

function PaymentSuccess() {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')
  const numericOrderId = Number(orderId)
  const { data: order } = useOrder(numericOrderId)
  const queryClient = useQueryClient()
  const pickup = order ? isPickupOrder(order) : false

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['cart'] })
  }, [queryClient])

  return (
    <div className="bg-third min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">

        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle size={40} className="text-green-500" strokeWidth={1.5} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-main text-3xl mb-3">Payment Successful</h1>
          <p className="text-main/55 text-sm leading-relaxed">
            {pickup ? (
              <>
                We've notified the seller that you're collecting this book.
                <br />
                Check your email for the pickup code and the seller's contact details.
              </>
            ) : (
              <>
                We've notified the seller to drop off your book.
                <br />
                Please look forward to our emails — we'll keep you updated at every step.
              </>
            )}
          </p>
        </div>

        {order && (
          <div className="bg-white rounded-2xl border border-third p-6 mb-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-main/40 uppercase tracking-wider">Order ID</span>
              <span className="font-heading font-bold text-main text-sm">{order.orderNumber || order.id}</span>
            </div>

            <div className="flex flex-col gap-3 mb-4">
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
                    <p className="text-sm font-semibold text-main truncate">{item.bookTitle}</p>
                    <p className="text-xs text-main/45">{sellerDisplayName(item)}</p>
                  </div>
                  <span className="text-sm text-main font-medium shrink-0">
                    {formatPrice(moneyInNaira(item.buyerPrice * item.quantity))}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-third pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-main/50">Subtotal</span>
                <span className="text-main">{formatPrice(moneyInNaira(order.baseAmount + order.markupTotal))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-main/50">{pickup ? 'Pickup' : 'Delivery'}</span>
                <span className="text-main">
                  {(order.deliveryFee ?? 0) > 0
                    ? formatPrice(moneyInNaira(order.deliveryFee))
                    : pickup
                      ? 'No fee'
                      : 'Free'}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold mt-1">
                <span className="text-main">Total</span>
                <span className="text-main">{formatPrice(orderTotalInNaira(order))}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-secondary/8 border border-secondary/20 rounded-xl px-5 py-4 mb-8">
          <p className="text-sm text-main/70 leading-relaxed">
            <span className="font-semibold text-main">What happens next:</span>{' '}
            {pickup
              ? "Contact the seller to arrange collection on one of your preferred days. Show your pickup code when you arrive. We'll email you if anything changes."
              : "The seller has 48 hours to drop off your book at a collection centre. We'll email you at every key stage of the journey."}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {orderId && (
            <Link
              to={`/order/${orderId}`}
              className="w-full bg-secondary text-white font-semibold py-4 rounded-xl hover:bg-secondary/90 transition-colors text-sm text-center flex items-center justify-center gap-2"
            >
              View Order Status
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
