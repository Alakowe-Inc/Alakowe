import { useState } from 'react'
import { ChevronDown, ChevronUp, Package, Copy, Check } from 'lucide-react'
import { sellerOrders, SELLER_ORDER_STATUSES, ORDER_STATUS_LABELS } from '../../../data/dashboardMockData'
import type { OrderStatus } from '../../../data/dashboardMockData'
import OrderTimeline from '../../../components/OrderTimeline'

const fmt = (n: number) => `₦${n.toLocaleString()}`

const STATUS_STYLES: Record<OrderStatus, string> = {
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

const STATUS_BADGE_LABELS: Record<OrderStatus, string> = {
  payment_received: 'Payment Received',
  awaiting_seller: 'Action Required',
  dropoff_scheduled: 'Drop-off Scheduled',
  received_by_alakowe: 'At Alakowe',
  processing: 'Processing',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
  confirmed: 'Buyer Confirmed',
  funds_released: 'Funds Released',
}

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-2 bg-third border border-main/10 px-3 py-2 rounded-lg text-sm font-mono font-semibold text-main hover:border-secondary/40 transition-all"
    >
      {code}
      {copied ? (
        <Check size={13} className="text-green-600" />
      ) : (
        <Copy size={13} className="text-main/40" />
      )}
    </button>
  )
}

function SellerOrders() {
  const [expanded, setExpanded] = useState<string | null>(null)

  function toggle(id: string) {
    setExpanded(prev => (prev === id ? null : id))
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-1">
          Seller Dashboard
        </p>
        <h1 className="font-heading font-bold text-main text-2xl md:text-3xl">Orders</h1>
        <p className="text-main/45 text-sm mt-1">
          All orders from buyers who purchased your books.
        </p>
      </div>

      {/* Empty state */}
      {sellerOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-third px-6 py-16 text-center">
          <Package size={36} className="text-main/20 mx-auto mb-3" />
          <p className="font-heading font-semibold text-main text-base">No orders yet</p>
          <p className="text-main/40 text-sm mt-1">
            Once a buyer purchases your book, the order will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sellerOrders.map(order => {
            const isExpanded = expanded === order.id
            const needsAction = order.status === 'awaiting_seller'

            return (
              <div
                key={order.id}
                className={`bg-white rounded-xl border overflow-hidden transition-all ${
                  needsAction ? 'border-amber-300' : 'border-third'
                }`}
              >
                {/* Action required banner */}
                {needsAction && (
                  <div className="bg-amber-50 border-b border-amber-200 px-5 py-3">
                    <p className="text-xs font-semibold text-amber-800">
                      Action required — drop off or request pickup within 48 hours
                      {order.dropoffDeadline && (
                        <span className="font-normal text-amber-700">
                          {' '}
                          (by{' '}
                          {new Date(order.dropoffDeadline).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                          })}
                          )
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Order summary row */}
                <div className="px-5 py-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-14 rounded flex items-center justify-center shrink-0 text-white font-bold"
                      style={{ backgroundColor: '#172131' }}
                    >
                      {order.bookTitle.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] text-main/40 font-mono">{order.orderId}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status]}`}
                        >
                          {STATUS_BADGE_LABELS[order.status]}
                        </span>
                      </div>
                      <p className="font-heading font-semibold text-main text-base leading-snug">
                        {order.bookTitle}
                      </p>
                      <p className="text-xs text-main/45 mt-0.5">
                        {order.bookAuthor} · Buyer: {order.buyerInitials}
                      </p>
                      <p className="text-xs text-main/35 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-NG', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="font-heading font-bold text-main text-lg">{fmt(order.amount)}</p>
                      <button
                        onClick={() => toggle(order.id)}
                        className="text-xs text-main/50 hover:text-main flex items-center gap-1 transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            Hide <ChevronUp size={13} />
                          </>
                        ) : (
                          <>
                            View status <ChevronDown size={13} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Action buttons for awaiting_seller */}
                  {needsAction && (
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 text-center text-sm font-semibold bg-main text-white py-2.5 rounded-lg hover:bg-main/90 transition-colors">
                        Choose Drop-off Centre
                      </button>
                      <button className="flex-1 text-center text-sm font-semibold border border-main/20 text-main py-2.5 rounded-lg hover:border-main/40 transition-colors">
                        Request Pickup
                      </button>
                    </div>
                  )}

                  {/* Drop-off code */}
                  {order.dropoffCode && order.status !== 'awaiting_seller' && (
                    <div className="mt-4 bg-third rounded-lg px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-main/40 mb-2">
                        Your Drop-off Code
                      </p>
                      <CopyCode code={order.dropoffCode} />
                      <p className="text-[11px] text-main/40 mt-2">
                        Present this code at the collection centre.
                      </p>
                    </div>
                  )}
                </div>

                {/* Expanded timeline */}
                {isExpanded && (
                  <div className="border-t border-third px-5 py-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-main/35 mb-4">
                      Order Progress
                    </p>
                    <OrderTimeline
                      statuses={SELLER_ORDER_STATUSES}
                      current={order.status}
                      labels={ORDER_STATUS_LABELS}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SellerOrders
