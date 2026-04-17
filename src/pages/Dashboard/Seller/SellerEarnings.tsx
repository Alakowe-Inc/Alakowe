import { Wallet, TrendingUp, Clock } from 'lucide-react'
import { sellerEarnings } from '../../../data/dashboardMockData'

const fmt = (n: number) => `₦${n.toLocaleString()}`

function SellerEarnings() {
  const totalSales = sellerEarnings.reduce((s, e) => s + e.saleAmount, 0)
  const released = sellerEarnings
    .filter(e => e.status === 'released')
    .reduce((s, e) => s + e.netAmount, 0)
  const pending = sellerEarnings
    .filter(e => e.status === 'pending')
    .reduce((s, e) => s + e.netAmount, 0)

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-1">
          Seller Dashboard
        </p>
        <h1 className="font-heading font-bold text-main text-2xl md:text-3xl">Earnings</h1>
        <p className="text-main/45 text-sm mt-1">
          Alakowe charges a 10% platform fee per sale.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Total Sales',
            value: fmt(totalSales),
            sub: 'Gross before fees',
            Icon: TrendingUp,
            color: 'bg-secondary/10 text-secondary',
          },
          {
            label: 'Released to You',
            value: fmt(released),
            sub: 'In your bank account',
            Icon: Wallet,
            color: 'bg-green-100 text-green-600',
          },
          {
            label: 'In Escrow',
            value: fmt(pending),
            sub: 'Pending delivery confirmation',
            Icon: Clock,
            color: 'bg-amber-100 text-amber-600',
          },
        ].map(({ label, value, sub, Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-third p-5">
            <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <Icon size={17} />
            </div>
            <p className="font-heading font-bold text-main text-2xl leading-tight">{value}</p>
            <p className="text-main/50 text-xs mt-0.5">{label}</p>
            <p className="text-main/35 text-[11px] mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-xl border border-third overflow-hidden">
        <div className="px-5 py-4 border-b border-third">
          <h2 className="font-heading font-semibold text-main text-base">Transaction History</h2>
        </div>

        {sellerEarnings.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Wallet size={32} className="text-main/20 mx-auto mb-3" />
            <p className="text-main/40 text-sm">No transactions yet</p>
          </div>
        ) : (
          <>
            {/* Table header — desktop */}
            <div className="hidden md:grid grid-cols-[1fr_100px_100px_90px_90px] gap-4 px-5 py-2.5 border-b border-third bg-third/50">
              {['Book', 'Sale Price', 'Platform Fee', 'You Receive', 'Status'].map(h => (
                <p key={h} className="text-[11px] font-semibold uppercase tracking-widest text-main/40">
                  {h}
                </p>
              ))}
            </div>

            <div className="divide-y divide-third">
              {sellerEarnings.map(earning => (
                <div
                  key={earning.id}
                  className="px-5 py-4 md:grid md:grid-cols-[1fr_100px_100px_90px_90px] md:gap-4 md:items-center"
                >
                  {/* Book + date */}
                  <div className="mb-2 md:mb-0">
                    <p className="text-sm font-semibold text-main">{earning.bookTitle}</p>
                    <p className="text-xs text-main/40 mt-0.5">
                      {new Date(earning.date).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Sale price */}
                  <div className="flex md:block items-center justify-between mb-1 md:mb-0">
                    <span className="text-xs text-main/40 md:hidden">Sale</span>
                    <p className="text-sm text-main">{fmt(earning.saleAmount)}</p>
                  </div>

                  {/* Fee */}
                  <div className="flex md:block items-center justify-between mb-1 md:mb-0">
                    <span className="text-xs text-main/40 md:hidden">Fee (10%)</span>
                    <p className="text-sm text-red-500">−{fmt(earning.platformFee)}</p>
                  </div>

                  {/* Net */}
                  <div className="flex md:block items-center justify-between mb-2 md:mb-0">
                    <span className="text-xs text-main/40 md:hidden">You receive</span>
                    <p className="text-sm font-bold text-main">{fmt(earning.netAmount)}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        earning.status === 'released'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {earning.status === 'released' ? 'Released' : 'In Escrow'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Escrow note */}
      <div className="mt-4 bg-secondary/5 border border-secondary/15 rounded-xl px-5 py-4">
        <p className="text-xs text-main/60 leading-relaxed">
          <span className="font-semibold text-main">How payouts work:</span> Your earnings are held
          in escrow until the buyer confirms receipt (or 5 days after delivery if no response).
          Once released, funds are transferred to your linked bank account within 1–2 business days.
        </p>
      </div>
    </div>
  )
}

export default SellerEarnings
