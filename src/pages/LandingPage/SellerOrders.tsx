import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Truck, Package, AlertCircle, Wallet } from 'lucide-react'
import { useRequestSellerPayout, useSellerSales } from '../../lib/api/orders/orders.hooks'
import { moneyInNaira, normalizeSellerSaleStatus, type SellerSaleDisplayStatus } from '../../lib/orders'
import type { SellerSaleResponse } from '../../lib/api/types'
import { ScheduleDropoffModal } from './ScheduleDropoffModal'
import { ConfirmPickupModal } from './ConfirmPickupModal'

const STATUS_CONFIG: Record<SellerSaleDisplayStatus, { label: string; class: string; icon: React.ElementType }> = {
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

function isPickupSale(sale: SellerSaleResponse): boolean {
  return (sale.fulfillmentType ?? '').toLowerCase() === 'pickup'
}

function formatPickupDates(dates?: string[] | null): string | null {
  if (!dates?.length) return null
  return dates
    .map((iso) => {
      const [y, m, d] = iso.split('-').map(Number)
      if (!y || !m || !d) return iso
      const date = new Date(y, m - 1, d)
      return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    })
    .join(', ')
}

const PAGE_SIZE = 10

export default function SellerOrders() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useSellerSales(page, PAGE_SIZE)
  const sales = data?.result ?? []
  const totalPages = data?.totalPages ?? 1
  const [schedulingSale, setSchedulingSale] = useState<SellerSaleResponse | null>(null)
  const [pickupSale, setPickupSale] = useState<SellerSaleResponse | null>(null)
  const requestPayout = useRequestSellerPayout()

  const awaitingSales = sales.filter((s) => normalizeSellerSaleStatus(s) === 'awaiting_seller')
  const hasPickupAwaiting = awaitingSales.some(isPickupSale)
  const hasCourierAwaiting = awaitingSales.some((s) => !isPickupSale(s))

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

        {error && (
          <div className="bg-white rounded-2xl border border-third p-5 mb-6 text-red-500 text-sm">
            {error.message}
          </div>
        )}

        {awaitingSales.length > 0 && (
          <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 mb-6">
            <AlertCircle size={16} className="text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">You have orders that need action</p>
              <p className="text-xs text-yellow-700 mt-0.5">
                {hasCourierAwaiting && hasPickupAwaiting
                  ? 'Schedule a Speedaf drop-off for delivery orders, or confirm pickup when the buyer collects.'
                  : hasPickupAwaiting
                    ? 'Confirm pickup when the buyer collects their book and shows you the code.'
                    : 'Choose a Speedaf station near you so Alákọ̀wé can prepare your drop-off details.'}
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-third p-12 text-center">
            <p className="text-main/50 text-sm">Loading your sales…</p>
          </div>
        ) : sales.length === 0 ? (
          <div className="bg-white rounded-2xl border border-third p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-main/6 flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-main/30" />
            </div>
            <h2 className="font-heading font-bold text-main text-lg mb-2">No sales yet</h2>
            <p className="text-main/50 text-sm">Your sales will appear here once buyers start ordering your books.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sales.map(sale => {
              const status = normalizeSellerSaleStatus(sale)
              const cfg = STATUS_CONFIG[status]
              const Icon = cfg.icon
              const pickup = isPickupSale(sale)
              const pickupDatesLabel = formatPickupDates(sale.pickupPreferredDates)

              return (
                <div key={sale.orderId} className="bg-white rounded-2xl border border-third p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-heading font-bold text-main text-base leading-snug">
                        {sale.bookTitle}
                      </p>
                      <p className="text-xs text-main/45 mt-0.5">
                        Order {sale.orderNumber} · Buyer: {sale.buyerInitials} · {timeAgo(sale.orderDate)}
                      </p>
                      {pickup ? (
                        <>
                          {sale.pickupAddress && (
                            <p className="text-xs text-main/50 mt-1">
                              Pickup: <span className="font-semibold text-main">{sale.pickupAddress}</span>
                            </p>
                          )}
                          {pickupDatesLabel && (
                            <p className="text-xs text-main/45 mt-0.5">
                              Preferred days: {pickupDatesLabel}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          {sale.preferredSpeedafStationName && (
                            <p className="text-xs text-main/50 mt-1">
                              Drop-off: <span className="font-semibold text-main">{sale.preferredSpeedafStationName}</span>
                              {sale.speedafBillCode ? (
                                <span className="text-main/40"> · Waybill {sale.speedafBillCode}</span>
                              ) : null}
                            </p>
                          )}
                          {sale.labelUrl && (
                            <a
                              href={sale.labelUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block text-xs font-semibold text-secondary mt-1 hover:underline"
                            >
                              View / print label
                            </a>
                          )}
                        </>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${cfg.class}`}>
                        <Icon size={11} /> {cfg.label}
                      </span>
                      <Link
                        to={`/order/${sale.orderId}`}
                        className="text-xs font-semibold text-secondary hover:underline"
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm border-t border-third pt-4">
                    <div>
                      <p className="text-xs text-main/40 mb-0.5">Sale Price</p>
                      <p className="font-semibold text-main">₦{moneyInNaira(sale.saleAmount).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-main/40 mb-0.5">Platform Fee</p>
                      <p className="font-semibold text-main/55">−₦{moneyInNaira(sale.platformFee).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-main/40 mb-0.5">Your Payout</p>
                      <p className="font-heading font-bold text-main">₦{moneyInNaira(sale.sellerPayout).toLocaleString()}</p>
                    </div>
                    {status === 'awaiting_seller' && (
                      <div className="ml-auto">
                        {pickup ? (
                          <button
                            type="button"
                            onClick={() => setPickupSale(sale)}
                            className="bg-main text-white font-semibold text-xs px-4 py-2 rounded-xl hover:bg-main/90 transition-colors"
                          >
                            Mark as picked up
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSchedulingSale(sale)}
                            className="bg-main text-white font-semibold text-xs px-4 py-2 rounded-xl hover:bg-main/90 transition-colors"
                          >
                            Schedule Drop-off
                          </button>
                        )}
                      </div>
                    )}

                    {status === 'confirmed' && !sale.isSettled && (
                      <div className="ml-auto">
                        {sale.payoutRequested ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-main/40">
                            <Clock size={13} /> Payout requested
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => requestPayout.mutate(sale.orderId)}
                            disabled={requestPayout.isPending}
                            className="inline-flex items-center gap-1.5 bg-green-600 text-white font-semibold text-xs px-4 py-2 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <Wallet size={13} />
                            {requestPayout.isPending ? 'Requesting…' : 'Request payout'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="text-xs font-semibold px-4 py-2 rounded-xl border border-third text-main disabled:opacity-40 hover:bg-white transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs text-main/50">Page {page} of {totalPages}</span>
                <button
                  type="button"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="text-xs font-semibold px-4 py-2 rounded-xl border border-third text-main disabled:opacity-40 hover:bg-white transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      <ScheduleDropoffModal
        sale={schedulingSale}
        open={!!schedulingSale}
        onOpenChange={(open) => {
          if (!open) setSchedulingSale(null)
        }}
      />

      <ConfirmPickupModal
        sale={pickupSale}
        open={!!pickupSale}
        onOpenChange={(open) => {
          if (!open) setPickupSale(null)
        }}
      />
    </div>
  )
}