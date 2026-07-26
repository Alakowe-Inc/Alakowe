import { Link } from 'react-router-dom'
import { PlusCircle, Pencil, BookOpen, TrendingUp, ShoppingBag, Wallet, Share2, Check, Tag, ThumbsDown, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useMyListings, useMyListingSummary, useSetDiscount } from '../../lib/api/listings/listings.hooks'
import { useSellerStoreProfile } from '../../lib/api/store/store.hooks'
import { listingToBookDisplay } from '../../lib/api/adapters'
import { formatPrice } from '../../lib/utils'

function StatCard({ icon: Icon, label, value, sub }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-third p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={15} className="text-secondary" />
        <span className="text-xs font-semibold text-main/45 uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-heading font-bold text-main text-2xl">{value}</p>
      {sub && <p className="text-xs text-main/40 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function MyListings() {
  const { data: pagedResult } = useMyListings()
  const { data: summary } = useMyListingSummary()
  const { data: storeProfile } = useSellerStoreProfile()
  const listings = pagedResult?.result ?? []
  const [copied, setCopied] = useState(false)
  const [discountId, setDiscountId] = useState<number | null>(null)
  const setDiscount = useSetDiscount()

  const storeSlug = storeProfile?.storeSlug ?? ''
  const storeUrl = storeSlug
    ? `${window.location.origin}/store/${storeSlug}`
    : ''

  function copyStoreLink() {
    navigator.clipboard.writeText(storeUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  async function handleToggleDiscount(listingId: number, currentlyApplied: boolean) {
    setDiscountId(listingId)
    try {
      await setDiscount.mutateAsync({ id: listingId, body: { isDiscountApplied: !currentlyApplied } })
    } finally {
      setDiscountId(null)
    }
  }

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-main text-3xl">My Listings</h1>
            <p className="text-main/50 text-sm mt-1">Books you've listed on Alakowe</p>
          </div>
          <Link to="/list"
            className="flex items-center gap-2 bg-main text-white font-semibold px-5 py-2.5 rounded-full hover:bg-main/90 transition-colors text-sm"
          >
            <PlusCircle size={15} /> List a Book
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard icon={BookOpen} label="Total" value={summary?.totalListings ?? 0} />
          <StatCard icon={TrendingUp} label="Live" value={summary?.activePublished ?? 0} sub="Visible to buyers" />
          <StatCard icon={Wallet} label="Under Review" value={summary?.pendingApproval ?? 0} sub="Within 24hrs" />
          <StatCard icon={ThumbsDown} label="Rejected" value={summary?.rejected ?? 0} />
        </div>

        {/* Share My Store */}
        <div className="bg-white rounded-2xl border border-third p-5 mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-heading font-bold text-main text-sm">My Bookstore</p>
              <p className="text-xs text-main/50 mt-0.5">Share this link with buyers so they can browse all your live books</p>
            </div>
            <button onClick={copyStoreLink}
              className="flex items-center gap-2 bg-main text-white font-semibold text-xs px-4 py-2.5 rounded-full hover:bg-main/90 transition-colors shrink-0"
            >
              {copied ? <Check size={13} /> : <Share2 size={13} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
          <div className="mt-3 bg-third rounded-xl px-4 py-2.5 text-xs text-main/50 font-mono break-all flex items-center justify-between gap-4">
            <span className="truncate">{storeUrl}</span>
            <Link
              to={`/store/${encodeURIComponent(storeSlug)}`}
              className="text-xs font-semibold text-secondary hover:underline shrink-0"
            >
              Visit Store &rarr;
            </Link>
          </div>
        </div>

        {/* Listings */}
        {listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-third p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-main/6 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} className="text-main/30" />
            </div>
            <h2 className="font-heading font-bold text-main text-lg mb-2">No listings yet</h2>
            <p className="text-main/50 text-sm mb-6">
              You haven't listed any books yet. Start turning your shelf into earnings.
            </p>
            <Link to="/list"
              className="inline-flex items-center gap-2 bg-main text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-main/90 transition-colors"
            >
              <PlusCircle size={15} /> List Your First Book
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-2xl border border-third p-5 flex items-start gap-4">
                {/* Cover + Info — clickable to view details */}
                <Link to={`/my-listings/${listing.id}`} className="flex items-start gap-4 flex-1 min-w-0 group">
                  {listing.coverImageFileName ? (
                    <img src={listing.coverImageFileName} alt={listing.title ?? ''}
                      className="w-12 h-[72px] rounded-xl shrink-0 shadow-sm object-cover group-hover:opacity-80 transition-opacity" />
                  ) : (
                    <div className="w-12 h-[72px] rounded-xl shrink-0 shadow-sm bg-main/10 group-hover:bg-main/20 transition-colors" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="min-w-0">
                        <p className="font-heading font-bold text-main text-base leading-snug truncate group-hover:text-secondary transition-colors">
                          {listing.title}
                        </p>
                        <p className="text-main/50 text-sm">by {listing.author}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                        listing.status === 'Published' ? 'bg-green-100 text-green-700' :
                        listing.status === 'PendingApproval' ? 'bg-amber-100 text-amber-700' :
                        listing.status === 'Sold' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {listing.status ?? 'Unknown'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-main/45">
                      {(() => {
                        const book = listingToBookDisplay(listing)
                        return (
                          <span className="font-semibold text-main text-sm">
                            {formatPrice(book.price)}
                            {book.originalPrice !== book.price && (
                              <span className="text-main/40 line-through ml-1.5 font-normal">
                                {formatPrice(book.originalPrice)}
                              </span>
                            )}
                          </span>
                        )
                      })()}
                      <span>{listing.categoryName}</span>
                      <span>{listing.bookCondition}</span>
                      {listing.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={11} /> {listing.location}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Discount badge */}
                <div className="flex items-center gap-1 shrink-0">
                  {listing.isDiscountApplied && (
                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                      {listing.discount ?? 0}% OFF
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {listing.isPublished && (
                    <button
                      title={`Discount: ${listing.discount ?? 0}%`}
                      onClick={() => handleToggleDiscount(listing.id!, listing.isDiscountApplied!)}
                      disabled={setDiscount.isPending && discountId === listing.id}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                        listing.isDiscountApplied
                          ? 'border-green-300 text-green-600 hover:border-green-500 hover:text-green-700'
                          : 'border-main/15 text-main/50 hover:border-secondary hover:text-secondary'
                      }`}
                    >
                      <Tag size={13} />
                    </button>
                  )}
                  <Link to={`/my-listings/${listing.id}/edit`}
                    className="w-8 h-8 rounded-full border border-main/15 flex items-center justify-center text-main/50 hover:border-secondary hover:text-secondary transition-colors"
                  >
                    <Pencil size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
