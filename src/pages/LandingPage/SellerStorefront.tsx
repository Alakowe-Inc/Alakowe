import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, BookOpen, ShoppingBag } from 'lucide-react'
import { getSellerListings, getPublicSellerProfile } from '../../data/sellerData'
import type { Listing, PublicSellerProfile } from '../../data/sellerData'

function ListingCard({ listing }: { listing: Listing }) {
  const discountedPrice = listing.discount > 0
    ? Math.round(listing.price * (1 - listing.discount / 100))
    : null

  return (
    <div className="bg-white rounded-2xl border border-third overflow-hidden hover:shadow-md transition-shadow">
      <div
        className="h-40 flex items-center justify-center"
        style={{ backgroundColor: listing.coverColor + '22' }}
      >
        <div
          className="w-20 h-28 rounded-xl shadow-lg"
          style={{ backgroundColor: listing.coverColor }}
        />
      </div>
      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-main/45 truncate mb-0.5">
          {listing.author}
        </p>
        <h3 className="font-heading font-bold text-main text-sm leading-snug line-clamp-2 mb-2">
          {listing.title}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-main text-sm">
            ₦{(discountedPrice ?? listing.price).toLocaleString()}
          </span>
          {discountedPrice && (
            <span className="text-xs text-main/40 line-through">
              ₦{listing.price.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-main/40">
          <span>{listing.condition}</span>
          <span>·</span>
          <span>{listing.genre}</span>
        </div>
        <Link
          to="/browse"
          className="mt-4 block w-full text-center bg-main text-white text-xs font-semibold py-2.5 rounded-full hover:bg-main/90 transition-colors"
        >
          Buy on Alakowe
        </Link>
      </div>
    </div>
  )
}

export default function SellerStorefront() {
  const { email } = useParams<{ email: string }>()
  const decodedEmail = email ? decodeURIComponent(email) : ''

  const [listings, setListings] = useState<Listing[]>([])
  const [profile, setProfile] = useState<PublicSellerProfile | null>(null)

  useEffect(() => {
    if (!decodedEmail) return
    setListings(getSellerListings(decodedEmail).filter(l => l.status === 'live'))
    setProfile(getPublicSellerProfile(decodedEmail))
  }, [decodedEmail])

  const displayName = profile?.fullName || profile?.username || decodedEmail.split('@')[0]
  const location = [profile?.city, profile?.state].filter(Boolean).join(', ')

  if (!decodedEmail) {
    return (
      <div className="bg-third min-h-screen flex items-center justify-center">
        <p className="text-main/50 text-sm">Store not found.</p>
      </div>
    )
  }

  return (
    <div className="bg-third min-h-screen">
      {/* Store header */}
      <div className="bg-white border-b border-third">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-main flex items-center justify-center shrink-0">
              <span className="text-white font-heading font-bold text-2xl">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-heading font-bold text-main text-2xl leading-snug">
                {displayName}'s Bookstore
              </h1>
              {location && (
                <div className="flex items-center gap-1.5 mt-1 text-main/50">
                  <MapPin size={13} />
                  <span className="text-sm">{location}</span>
                </div>
              )}
              {profile?.bio && (
                <p className="text-sm text-main/60 mt-2 leading-relaxed max-w-lg">
                  {profile.bio}
                </p>
              )}
              <div className="flex items-center gap-1.5 mt-3">
                <BookOpen size={13} className="text-secondary" />
                <span className="text-xs text-main/50 font-medium">
                  {listings.length} book{listings.length !== 1 ? 's' : ''} available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
        {listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-third p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-main/6 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={24} className="text-main/30" />
            </div>
            <h2 className="font-heading font-bold text-main text-lg mb-2">No books listed yet</h2>
            <p className="text-main/50 text-sm">
              This seller hasn't listed any books yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-xs text-main/35">
            Powered by{' '}
            <Link to="/" className="font-semibold text-main/50 hover:text-secondary transition-colors">
              Alakowe
            </Link>
            {' '}— Nigeria's peer-to-peer book marketplace
          </p>
        </div>
      </div>
    </div>
  )
}
