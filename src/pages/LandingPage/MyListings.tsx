import { Link } from 'react-router-dom'
import { PlusCircle, Pencil, BookOpen, TrendingUp, ShoppingBag, Wallet, Share2, Check } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useListings } from '../../lib/api/listings/listings.hooks'

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
  const { data: pagedResult } = useListings()
  const listings = pagedResult?.result ?? []
  const [copied, setCopied] = useState(false)

  const storeUrl = user
    ? `${window.location.origin}/store/${encodeURIComponent(user.email)}`
    : ''

  function copyStoreLink() {
    navigator.clipboard.writeText(storeUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const live = listings.filter(l => l.isPublished).length
  const pending = listings.filter(l => l.status === 'PendingApproval').length
  const sold = listings.filter(l => l.status === 'Sold').length

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
          <StatCard icon={BookOpen} label="Total" value={listings.length} />
          <StatCard icon={TrendingUp} label="Live" value={live} sub="Visible to buyers" />
          <StatCard icon={ShoppingBag} label="Sold" value={sold} />
          <StatCard icon={Wallet} label="Under Review" value={pending} sub="Within 24hrs" />
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
          <div className="mt-3 bg-third rounded-xl px-4 py-2.5 text-xs text-main/50 font-mono break-all">
            {storeUrl}
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
                {/* Cover */}
                <div className="w-12 h-[72px] rounded-xl shrink-0 shadow-sm bg-main/10" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="min-w-0">
                      <p className="font-heading font-bold text-main text-base leading-snug truncate">
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
                    <span className="font-semibold text-main text-sm">₦{(listing.price ?? 0).toLocaleString()}</span>
                    <span>{listing.categoryName}</span>
                    <span>{listing.bookCondition}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
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
