import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Pencil, Trash2, BookOpen, TrendingUp, Wallet, ShoppingBag } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getSellerListings,
  deleteListing,
  LISTING_STATUS_LABEL,
  LISTING_STATUS_CLASS,
} from '../../data/sellerData'
import type { Listing } from '../../data/sellerData'

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
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (user) setListings(getSellerListings(user.email))
  }, [user])

  function handleDelete(id: string) {
    deleteListing(id)
    setListings(prev => prev.filter(l => l.id !== id))
    setDeleting(null)
  }

  const live = listings.filter(l => l.status === 'live').length
  const pending = listings.filter(l => l.status === 'pending_review').length
  const sold = listings.filter(l => l.status === 'sold').length

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-main text-3xl">My Listings</h1>
            <p className="text-main/50 text-sm mt-1">Books you've listed on Alakowe</p>
          </div>
          <Link
            to="/list"
            className="flex items-center gap-2 bg-main text-white font-semibold px-5 py-2.5 rounded-full hover:bg-main/90 transition-colors text-sm"
          >
            <PlusCircle size={15} /> List a Book
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={BookOpen} label="Total" value={listings.length} />
          <StatCard icon={TrendingUp} label="Live" value={live} sub="Visible to buyers" />
          <StatCard icon={ShoppingBag} label="Sold" value={sold} />
          <StatCard icon={Wallet} label="Under Review" value={pending} sub="Within 24hrs" />
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            to="/my-sales"
            className="flex items-center gap-2 bg-white border border-third text-main font-semibold text-xs px-4 py-2.5 rounded-full hover:border-secondary/40 transition-colors"
          >
            <ShoppingBag size={13} className="text-secondary" /> My Sales
          </Link>
          <Link
            to="/my-earnings"
            className="flex items-center gap-2 bg-white border border-third text-main font-semibold text-xs px-4 py-2.5 rounded-full hover:border-secondary/40 transition-colors"
          >
            <Wallet size={13} className="text-secondary" /> My Earnings
          </Link>
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
            <Link
              to="/list"
              className="inline-flex items-center gap-2 bg-main text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-main/90 transition-colors"
            >
              <PlusCircle size={15} /> List Your First Book
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {listings.map(listing => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl border border-third p-5 flex items-start gap-4"
              >
                {/* Cover */}
                <div
                  className="w-12 h-[72px] rounded-xl shrink-0 shadow-sm"
                  style={{ backgroundColor: listing.coverColor }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="min-w-0">
                      <p className="font-heading font-bold text-main text-base leading-snug truncate">
                        {listing.title}
                      </p>
                      <p className="text-main/50 text-sm">by {listing.author}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${LISTING_STATUS_CLASS[listing.status]}`}>
                      {LISTING_STATUS_LABEL[listing.status]}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-main/45">
                    <span className="font-semibold text-main text-sm">₦{listing.price.toLocaleString()}</span>
                    {listing.discount > 0 && (
                      <span className="text-secondary font-medium">{listing.discount}% off</span>
                    )}
                    <span>{listing.genre}</span>
                    <span>{listing.condition}</span>
                    <span>{listing.views} views</span>
                  </div>

                  {listing.status === 'rejected' && listing.rejectionReason && (
                    <p className="text-xs text-red-600 mt-2 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">
                      Reason: {listing.rejectionReason}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {deleting === listing.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors px-2 py-1"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleting(null)}
                        className="text-xs font-semibold text-main/45 hover:text-main transition-colors px-2 py-1"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to={`/my-listings/${listing.id}/edit`}
                        className="w-8 h-8 rounded-full border border-main/15 flex items-center justify-center text-main/50 hover:border-secondary hover:text-secondary transition-colors"
                      >
                        <Pencil size={13} />
                      </Link>
                      <button
                        onClick={() => setDeleting(listing.id)}
                        className="w-8 h-8 rounded-full border border-main/15 flex items-center justify-center text-main/50 hover:border-red-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
