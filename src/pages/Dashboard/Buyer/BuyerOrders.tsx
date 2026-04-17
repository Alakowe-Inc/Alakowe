import { useState } from 'react'
import { ChevronDown, ChevronUp, Package, CheckCircle, AlertTriangle, ExternalLink, ShoppingBag } from 'lucide-react'
import {
  buyerOrders,
  BUYER_ORDER_STATUSES,
  BUYER_ORDER_STATUS_LABELS,
} from '../../../data/dashboardMockData'
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
  confirmed: 'bg-emerald-100 text-emerald-700',
  funds_released: 'bg-emerald-100 text-emerald-700',
}

const STATUS_BADGE_LABELS: Record<OrderStatus, string> = {
  payment_received: 'Payment Confirmed',
  awaiting_seller: 'Awaiting Seller',
  dropoff_scheduled: 'Drop-off Scheduled',
  received_by_alakowe: 'At Alakowe',
  processing: 'Processing',
  dispatched: 'On the Way',
  delivered: 'Delivered',
  confirmed: 'Confirmed',
  funds_released: 'Complete',
}

// Progress accent color per status bucket
const PROGRESS_COLOR: Partial<Record<OrderStatus, string>> = {
  payment_received: 'bg-amber-400',
  awaiting_seller: 'bg-amber-400',
  dropoff_scheduled: 'bg-blue-400',
  received_by_alakowe: 'bg-blue-400',
  processing: 'bg-secondary',
  dispatched: 'bg-secondary',
  delivered: 'bg-green-500',
  confirmed: 'bg-emerald-500',
  funds_released: 'bg-emerald-500',
}

function BuyerOrders() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState<string[]>([])

  function toggle(id: string) {
    setExpanded(prev => (prev === id ? null : id))
  }

  function handleConfirm(id: string) {
    setConfirmed(prev => [...prev, id])
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-1">
          Buyer Dashboard
        </p>
        <h1 className="font-heading font-bold text-main text-2xl md:text-3xl">My Orders</h1>
        <p className="text-main/40 text-sm mt-1">
          Track your purchases and confirm deliveries.
        </p>
      </div>

      {/* Empty state */}
      {buyerOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-third/60 px-6 py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-third flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={24} className="text-main/25" />
          </div>
          <p className="font-heading font-semibold text-main text-base">No orders yet</p>
          <p className="text-main/40 text-sm mt-1">Books you purchase will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {buyerOrders.map(order => {
            const isExpanded = expanded === order.id
            const isDelivered = order.status === 'delivered'
            const isConfirmed =
              confirmed.includes(order.id) ||
              order.status === 'confirmed' ||
              order.status === 'funds_released'

            const statusIndex = BUYER_ORDER_STATUSES.indexOf(order.status)
            const progressPct = Math.max(
              ((statusIndex + 1) / BUYER_ORDER_STATUSES.length) * 100,
              8
            )
            const progressColor = PROGRESS_COLOR[order.status] ?? 'bg-secondary'

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border overflow-hidden transition-shadow ${
                  isDelivered && !isConfirmed
                    ? 'border-green-300 shadow-sm shadow-green-100'
                    : 'border-third/60'
                }`}
              >
                {/* Delivery banner */}
                {isDelivered && !isConfirmed && (
                  <div className="bg-green-50 border-b border-green-100 px-5 py-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                    <p className="text-xs font-semibold text-green-800">
                      Your book has arrived — please confirm receipt below.
                    </p>
                  </div>
                )}

                <div className="px-5 py-4">
                  {/* Main row */}
                  <div className="flex items-start gap-4">
                    {/* Cover */}
                    <div
                      className="w-10 h-14 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-base shadow-sm"
                      style={{ backgroundColor: order.coverColor }}
                    >
                      {order.bookTitle.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="text-[10px] text-main/35 font-mono bg-third px-2 py-0.5 rounded-full">
                          {order.orderId}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
                            isConfirmed ? 'bg-emerald-100 text-emerald-700' : STATUS_STYLES[order.status]
                          }`}
                        >
                          {isConfirmed ? 'Confirmed' : STATUS_BADGE_LABELS[order.status]}
                        </span>
                      </div>
                      <p className="font-heading font-semibold text-main text-[15px] leading-snug truncate">
                        {order.bookTitle}
                      </p>
                      <p className="text-xs text-main/40 mt-0.5">
                        {order.author} · Seller: {order.sellerInitials}
                      </p>
                      <p className="text-[11px] text-main/30 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-NG', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </div>

                    {/* Price + toggle */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="font-heading font-bold text-main text-lg">{fmt(order.amount)}</p>
                      <button
                        onClick={() => toggle(order.id)}
                        className="flex items-center gap-1 text-xs text-main/40 hover:text-secondary transition-colors font-medium"
                      >
                        {isExpanded ? (
                          <><ChevronUp size={13} /> Hide</>
                        ) : (
                          <><ChevronDown size={13} /> Track</>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3.5 flex items-center gap-2.5">
                    <div className="flex-1 h-1 bg-third rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                        style={{ width: `${isConfirmed ? 100 : progressPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-main/30 font-medium shrink-0 tabular-nums">
                      {isConfirmed ? `${BUYER_ORDER_STATUSES.length}/${BUYER_ORDER_STATUSES.length}` : `${statusIndex + 1}/${BUYER_ORDER_STATUSES.length}`}
                    </span>
                  </div>

                  {/* Delivery action buttons */}
                  {isDelivered && !isConfirmed && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleConfirm(order.id)}
                        className="flex items-center justify-center gap-2 text-sm font-semibold bg-main text-white py-2.5 rounded-xl hover:bg-main/90 transition-colors"
                      >
                        <CheckCircle size={14} /> Yes, all good
                      </button>
                      <button className="flex items-center justify-center gap-2 text-sm font-semibold bg-amber-50 border border-amber-200 text-amber-700 py-2.5 rounded-xl hover:border-amber-300 transition-colors">
                        <AlertTriangle size={14} /> There's an issue
                      </button>
                    </div>
                  )}

                  {/* Confirmed message */}
                  {isConfirmed && (
                    <div className="mt-3.5 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-2.5">
                      <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                      <p className="text-xs text-emerald-700 leading-snug">
                        <span className="font-semibold">Delivery confirmed.</span>{' '}
                        You've helped a book find a new home.
                      </p>
                    </div>
                  )}

                  {/* Full status link */}
                  <div className="mt-3">
                    <button className="flex items-center gap-1.5 text-[11px] text-secondary hover:text-main transition-colors font-medium">
                      <ExternalLink size={11} /> View full order status page
                    </button>
                  </div>
                </div>

                {/* Expanded timeline */}
                {isExpanded && (
                  <div className="border-t border-third/60 px-5 py-5 bg-third/20">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-main/30 mb-5">
                      Order Progress
                    </p>
                    <OrderTimeline
                      statuses={BUYER_ORDER_STATUSES}
                      current={isConfirmed ? 'delivered' : order.status}
                      labels={BUYER_ORDER_STATUS_LABELS}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Email notice */}
      <div className="mt-5 bg-white border border-third/60 rounded-2xl px-5 py-4 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Package size={13} className="text-secondary" />
        </div>
        <p className="text-xs text-main/50 leading-relaxed">
          <span className="font-semibold text-main">Email updates:</span> We email you at key
          milestones — payment confirmed, book at Alakowe, dispatched, and on delivery. Check your
          inbox for secure links to your order status page.
        </p>
      </div>
    </div>
  )
}

export default BuyerOrders
