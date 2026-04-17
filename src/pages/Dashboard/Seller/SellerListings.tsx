import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Edit2, AlertCircle, RefreshCw, BookOpen } from 'lucide-react'
import { sellerListings } from '../../../data/dashboardMockData'
import type { ListingStatus } from '../../../data/dashboardMockData'

const fmt = (n: number) => `₦${n.toLocaleString()}`

const COVER_PALETTE = [
  '#172131', '#6B6FFF', '#E63946', '#F4A261',
  '#2D6A4F', '#457B9D', '#9B5DE5', '#1D3557',
]
const coverColor = (id: string) => COVER_PALETTE[parseInt(id) % COVER_PALETTE.length]

const STATUS_STYLES: Record<ListingStatus, { pill: string; bar: string }> = {
  live:     { pill: 'bg-green-100 text-green-700',  bar: 'bg-green-500' },
  pending:  { pill: 'bg-amber-100 text-amber-700',  bar: 'bg-amber-400' },
  rejected: { pill: 'bg-red-100 text-red-700',      bar: 'bg-red-500' },
  sold:     { pill: 'bg-blue-100 text-blue-700',    bar: 'bg-blue-500' },
}

const STATUS_LABELS: Record<ListingStatus, string> = {
  live: 'Live', pending: 'Under Review', rejected: 'Rejected', sold: 'Sold',
}

type Filter = 'all' | ListingStatus

function SellerListings() {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered =
    filter === 'all' ? sellerListings : sellerListings.filter(l => l.status === filter)

  const counts: Record<Filter, number> = {
    all:      sellerListings.length,
    live:     sellerListings.filter(l => l.status === 'live').length,
    pending:  sellerListings.filter(l => l.status === 'pending').length,
    rejected: sellerListings.filter(l => l.status === 'rejected').length,
    sold:     sellerListings.filter(l => l.status === 'sold').length,
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-1">
            Seller Dashboard
          </p>
          <h1 className="font-heading font-bold text-main text-2xl md:text-3xl">My Listings</h1>
        </div>
        <Link
          to="/list"
          className="inline-flex items-center gap-2 bg-main text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-main/90 transition-colors text-sm shrink-0"
        >
          <Plus size={15} /> List a Book
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap mb-5 bg-white border border-third/60 rounded-2xl p-1.5">
        {(['all', 'live', 'pending', 'rejected', 'sold'] as Filter[]).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === tab
                ? 'bg-main text-white shadow-sm'
                : 'text-main/45 hover:text-main hover:bg-third/70'
            }`}
          >
            {tab === 'all' ? 'All' : STATUS_LABELS[tab as ListingStatus]}
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4.5 text-center ${
                filter === tab ? 'bg-white/20 text-white' : 'bg-third text-main/40'
              }`}
            >
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-third/60 px-6 py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-third flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-main/25" />
          </div>
          <p className="font-heading font-semibold text-main text-base">No listings here</p>
          <p className="text-main/40 text-sm mt-1">
            {filter === 'all'
              ? "You haven't listed any books yet."
              : `No ${STATUS_LABELS[filter as ListingStatus].toLowerCase()} listings.`}
          </p>
          {filter === 'all' && (
            <Link
              to="/list"
              className="inline-flex items-center gap-2 mt-5 bg-main text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-main/90 transition-colors text-sm"
            >
              <Plus size={15} /> List your first book
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(listing => (
            <div
              key={listing.id}
              className="bg-white rounded-2xl border border-third/60 overflow-hidden"
            >
              {/* Status top bar */}
              <div className={`h-0.5 ${STATUS_STYLES[listing.status].bar}`} />

              {/* Rejection reason */}
              {listing.status === 'rejected' && (
                <div className="bg-red-50/70 border-b border-red-100 px-5 py-3 flex items-start gap-2.5">
                  <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 leading-relaxed">
                    <span className="font-semibold">Reason: </span>
                    {listing.rejectionReason}
                  </p>
                </div>
              )}

              {/* Pending notice */}
              {listing.status === 'pending' && (
                <div className="bg-amber-50/70 border-b border-amber-100 px-5 py-2.5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  <p className="text-xs text-amber-700">
                    Under review — we'll notify you within 24 hours.
                  </p>
                </div>
              )}

              <div className="px-5 py-4 flex items-center gap-4">
                {/* Book cover */}
                <div
                  className="w-11 h-15 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-base shadow-sm"
                  style={{ backgroundColor: coverColor(listing.id) }}
                >
                  {listing.title.charAt(0)}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${STATUS_STYLES[listing.status].pill}`}>
                      {STATUS_LABELS[listing.status]}
                    </span>
                    <span className="text-[10px] text-main/35 bg-third px-2 py-0.5 rounded-full">
                      {listing.genre}
                    </span>
                  </div>
                  <p className="font-heading font-semibold text-main text-[15px] leading-snug truncate">
                    {listing.title}
                  </p>
                  <p className="text-xs text-main/45 mt-0.5">{listing.author}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-main/35">
                    <span>{listing.condition}</span>
                    {listing.status === 'live' && (
                      <span className="flex items-center gap-1">
                        <Eye size={10} /> {listing.views} views
                      </span>
                    )}
                    <span>
                      {new Date(listing.createdAt).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Price + actions */}
                <div className="flex flex-col items-end gap-2.5 shrink-0">
                  <p className="font-heading font-bold text-main text-lg">{fmt(listing.price)}</p>
                  <div className="flex gap-1.5">
                    {(listing.status === 'live' || listing.status === 'pending') && (
                      <button className="flex items-center gap-1 text-[11px] font-semibold text-main/50 border border-main/15 px-2.5 py-1.5 rounded-lg hover:border-main/30 hover:text-main transition-all">
                        <Edit2 size={11} /> Edit
                      </button>
                    )}
                    {listing.status === 'rejected' && (
                      <button className="flex items-center gap-1 text-[11px] font-semibold text-white bg-main px-2.5 py-1.5 rounded-lg hover:bg-main/90 transition-colors">
                        <RefreshCw size={11} /> Resubmit
                      </button>
                    )}
                    {listing.status === 'live' && (
                      <Link
                        to={`/books/${listing.id}`}
                        className="flex items-center gap-1 text-[11px] font-semibold text-secondary border border-secondary/25 px-2.5 py-1.5 rounded-lg hover:border-secondary/50 transition-all"
                      >
                        <Eye size={11} /> View
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SellerListings
