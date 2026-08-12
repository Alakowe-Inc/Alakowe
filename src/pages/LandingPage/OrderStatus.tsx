import { useParams, Link, useNavigate } from 'react-router-dom'
import { CheckCircle, Circle, ExternalLink, MapPin, Package, Copy, ClipboardCheck, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import {
  backendStatusKey,
  formatPickupPreferredDates,
  getOrderDeliveryAddress,
  isPickupOrder,
  moneyInNaira,
  normalizeOrderStatus,
  orderStatusDescription,
  orderStatusLabel,
  orderTotalInNaira,
  pickupMapsUrl,
  sellerDisplayName,
} from '../../lib/orders'
import { useConfirmOrderDelivery, useOrder } from '../../lib/api/orders/orders.hooks'
import { useAuth } from '../../context/AuthContext'
import { formatPrice } from '../../lib/utils'
import type { OrderDto, OrderStatusEventResponse } from '../../lib/api/types'

const SPEEDAF_TRACKING_URL = 'https://speedaf.com/cn-en/send-parcel'

function WaybillFootnote({
  waybillNumber,
  label,
}: {
  waybillNumber: string | null
  label: string
}) {
  const [copied, setCopied] = useState(false)

  if (!waybillNumber) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(waybillNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-2.5 ml-12 text-xs text-main/50 flex items-center gap-2 flex-wrap">
      <span className="font-medium">{label}:</span>
      <code className="bg-main/5 px-2 py-0.5 rounded font-mono text-main">{waybillNumber}</code>
      <button
        onClick={handleCopy}
        className="text-secondary hover:text-secondary/80 transition-colors p-1"
        aria-label={copied ? 'Copied' : 'Copy waybill number'}
      >
        {copied ? <ClipboardCheck size={14} /> : <Copy size={14} />}
      </button>
      <a
        href={SPEEDAF_TRACKING_URL}
        target="_blank"
        rel="noreferrer"
        className="text-secondary hover:text-secondary/80 transition-colors flex items-center gap-1"
        aria-label="Track on Speedaf"
      >
        <ExternalLink size={12} />
        <span className="underline">Track</span>
      </a>
    </div>
  )
}

type EventNote = { waybillNumber?: string; courier?: string; leg?: string; reason?: string }

function parseEventNote(note?: string | null): EventNote | null {
  if (!note) return null
  try {
    const parsed = JSON.parse(note)
    if (parsed && typeof parsed === 'object') return parsed as EventNote
    return null
  } catch {
    return null
  }
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const day = date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
  const time = date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
  return `${day}, ${time}`
}

function ConfirmDeliveryCard({ order }: { order: OrderDto }) {
  const confirm = useConfirmOrderDelivery()
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl border border-secondary/25 shadow-sm px-5 py-6 mb-8">
      <h2 className="font-heading font-bold text-main text-base mb-1">Confirm your delivery</h2>
      <p className="text-sm text-main/55 mb-5">
        Did you receive your book? Confirming closes the order and releases the seller's payout.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => confirm.mutate({ orderId: order.id, confirm: true })}
          disabled={confirm.isPending}
          className="flex-1 bg-secondary text-white font-semibold text-sm py-3 rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {confirm.isPending ? 'Confirming…' : 'Yes, I received my book'}
        </button>
        <button
          type="button"
          onClick={() => navigate(`/order/${order.id}/dispute`)}
          disabled={confirm.isPending}
          className="flex-1 inline-flex items-center justify-center gap-2 border border-main/15 text-main font-semibold text-sm py-3 rounded-xl hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-60"
        >
          <ShieldAlert size={15} className="text-red-500" />
          Report a problem
        </button>
      </div>
    </div>
  )
}

function OrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const numericOrderId = Number(orderId)
  const { data: order, isLoading, error } = useOrder(numericOrderId)
  const { user } = useAuth()

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
  const delivery = getOrderDeliveryAddress(order)
  const cityState = [delivery.city, delivery.state].filter(Boolean).join(', ')
  const pickup = isPickupOrder(order)
  const pickupDatesLabel = formatPickupPreferredDates(order.pickupPreferredDates)
  const pickupMaps = pickupMapsUrl(order.pickupAddress)
  const isBuyer = !!user?.userId && user.userId === String(order.userId)

  const events: OrderStatusEventResponse[] = order.statusEvents?.length ? order.statusEvents : []
  const timeline: OrderStatusEventResponse[] =
    events.length > 0
      ? events
      : [{ id: 0, status: order.status, occurredAt: order.orderDate }]

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">

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

        <div className="bg-secondary/10 border border-secondary/20 rounded-2xl px-5 py-4 mb-8">
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
            Current Status
          </p>
          <p className="font-heading font-bold text-main text-base md:text-lg">
            {orderStatusLabel(status, order.fulfillmentType)}
          </p>
          <p className="text-main/55 text-sm mt-0.5">
            {orderStatusDescription(status, order.fulfillmentType)}
          </p>
          {pickup && order.pickupCode && status !== 'delivered' && status !== 'confirmed' && status !== 'disputed' && (
            <p className="mt-3 text-sm text-main">
              Your pickup code:{' '}
              <span className="font-mono font-bold tracking-widest text-lg">{order.pickupCode}</span>
            </p>
          )}
        </div>

        {status === 'delivered' && isBuyer && (
          <ConfirmDeliveryCard order={order} />
        )}

        {status === 'confirmed' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-8 flex items-start gap-3">
            <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">
              This order is complete. Thank you for buying on Alákò̩wé!
            </p>
          </div>
        )}

        {status === 'disputed' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-8 flex items-start gap-3">
            <ShieldAlert size={16} className="text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 leading-relaxed">
              A dispute has been opened for this order. Your payment is held in escrow while we
              investigate — we'll get back to you within 24–48 hours.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          <div className="md:col-span-3 flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-third p-6">
              <h2 className="font-heading font-bold text-main text-base mb-6">Order Timeline</h2>
              <div>
                {timeline.map((evt, i) => {
                  const isLast = i === timeline.length - 1
                  const isActive = isLast
                  const isComplete = !isActive
                  const displayStatus = normalizeOrderStatus(evt.status)
                  const note = parseEventNote(evt.note)
                  const isDispute = backendStatusKey(evt.status) === 'disputed'
                  const timestamp = evt.occurredAt ? formatTimestamp(evt.occurredAt) : ''

                  return (
                    <div key={`${evt.id}-${i}`} className="flex items-start gap-4">
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
                          ) : isDispute ? (
                            <ShieldAlert size={15} className="text-white" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
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

                      <div className="pb-5 min-w-0">
                        <p
                          className={`text-sm font-semibold leading-snug ${
                            isComplete
                              ? 'text-main/50'
                              : isActive
                              ? isDispute ? 'text-red-600' : 'text-main'
                              : 'text-main/25'
                          }`}
                        >
                          {orderStatusLabel(displayStatus, order.fulfillmentType)}
                        </p>
                        {timestamp && (
                          <p className={`text-xs mt-0.5 ${isComplete ? 'text-main/35' : 'text-main/45'}`}>
                            {timestamp}
                          </p>
                        )}
                        {isActive && (
                          <p className="text-xs text-main/45 mt-0.5 leading-relaxed">
                            {orderStatusDescription(displayStatus, order.fulfillmentType)}
                          </p>
                        )}
                        {isComplete && (
                          <p className="text-xs text-green-600/70 mt-0.5">Completed</p>
                        )}
                        {note?.waybillNumber && (
                          <WaybillFootnote
                            waybillNumber={note.waybillNumber}
                            label={`${note.leg === 'Outbound' ? 'Outbound' : 'Inbound'} Waybill`}
                          />
                        )}
                        {isDispute && note?.reason && (
                          <p className="mt-2 text-xs text-red-600/80 leading-relaxed flex items-start gap-1.5">
                            <ShieldAlert size={12} className="shrink-0 mt-0.5" />
                            <span>{note.reason}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-4">

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
                  <span className="text-main/50">{pickup ? 'Pickup' : 'Delivery'}</span>
                  <span className="text-main">
                    {(order.deliveryFee ?? 0) > 0
                      ? formatPrice(moneyInNaira(order.deliveryFee))
                      : pickup
                        ? 'No fee'
                        : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold mt-0.5">
                  <span className="text-main">Total</span>
                  <span className="text-main">{formatPrice(orderTotalInNaira(order))}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-third p-5">
              <h3 className="font-heading font-bold text-main text-sm mb-3 flex items-center gap-2">
                <MapPin size={13} className="text-secondary" />
                {pickup ? 'Pickup details' : 'Delivery Address'}
              </h3>
              {pickup ? (
                <>
                  {order.pickupAddress && (
                    <p className="text-sm text-main leading-relaxed inline-flex items-start gap-1.5">
                      <span>{order.pickupAddress}</span>
                      {pickupMaps && (
                        <a
                          href={pickupMaps}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Open pickup address in Google Maps"
                          className="shrink-0 mt-0.5 text-secondary hover:text-secondary/80 transition-colors"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </p>
                  )}
                  {pickupDatesLabel && (
                    <p className="text-xs text-main/55 mt-2">Preferred days: {pickupDatesLabel}</p>
                  )}
                  {order.pickupCode && (
                    <p className="text-xs text-main/55 mt-2">
                      Code:{' '}
                      <span className="font-mono font-semibold tracking-wider text-main">
                        {order.pickupCode}
                      </span>
                    </p>
                  )}
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

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
