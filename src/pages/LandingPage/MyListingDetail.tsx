import { useParams, Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import {
  ArrowLeft,
  ShoppingCart,
  Pencil,
  Tag,
  BookOpen,
  Layers,
  Package,
  Percent,
  Eye,
  Heart,
  Calendar,
  CheckCircle,
  ImageIcon,
  MapPin,
} from 'lucide-react'
import { useMyListing, useSetDiscount } from '../../lib/api/listings/listings.hooks'
import { listingToBookDisplay } from '../../lib/api/adapters'
import { formatPrice } from '../../lib/utils'

const COVER_COLORS = ["#C8A97E", "#2E4057", "#6B4E3E", "#8B4513", "#4A6FA5", "#7C5C4D", "#9B6B43", "#5D7A5D"]

function pickColor(id?: number): string {
  return COVER_COLORS[(id ?? 1) % COVER_COLORS.length]
}

function DetailRow({ icon: Icon, label, value }: {
  icon: React.ElementType; label: string; value: string
}) {
  return (
    <div className="flex items-center justify-between py-3.5 px-1 rounded-lg hover:bg-third/40 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-third/60 flex items-center justify-center">
          <Icon size={14} className="text-main/65" />
        </div>
        <span className="text-sm text-main/60">{label}</span>
      </div>
      <span className="text-sm font-semibold text-main">{value}</span>
    </div>
  )
}

export default function MyListingDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: listing, isLoading } = useMyListing(Number(id))
  const setDiscount = useSetDiscount()
  const [selectedImage, setSelectedImage] = useState(0)
  const [discountInput, setDiscountInput] = useState('')
  const [discountInitialized, setDiscountInitialized] = useState(false)

  if (!discountInitialized && listing) {
    setDiscountInput(listing.discount != null ? String(listing.discount) : '0')
    setDiscountInitialized(true)
  }

  const allImages = useMemo(() => {
    if (!listing) return []
    const images: string[] = []
    if (listing.coverImageFileName) images.push(listing.coverImageFileName)
    if (listing.imageFileNames) {
      listing.imageFileNames.forEach(f => {
        if (f && !images.includes(f)) images.push(f)
      })
    }
    return images
  }, [listing])

  const bookDisplay = useMemo(() => listing ? listingToBookDisplay(listing) : null, [listing])

  async function handleSaveDiscount() {
    if (!listing) return
    const value = Math.min(50, Math.max(0, Math.round(Number(discountInput) || 0)))
    await setDiscount.mutateAsync({
      id: listing.id!,
      body: { discount: value, isDiscountApplied: listing.isDiscountApplied },
    })
  }

  async function handleToggleDiscount() {
    if (!listing) return
    const value = Math.min(50, Math.max(0, Math.round(Number(discountInput) || 0)))
    await setDiscount.mutateAsync({
      id: listing.id!,
      body: { isDiscountApplied: !listing.isDiscountApplied, discount: value },
    })
  }

  if (isLoading) {
    return (
      <div className="bg-third min-h-screen flex items-center justify-center">
        <p className="text-main/50 text-sm">Loading…</p>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="bg-third min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-heading font-bold text-main text-2xl mb-3">Listing not found</p>
          <Link to="/my-listings" className="text-sm text-secondary hover:underline font-semibold">
            Back to My Listings
          </Link>
        </div>
      </div>
    )
  }

  const statusColor =
    listing.status === 'Published' ? 'bg-green-100 text-green-700' :
    listing.status === 'PendingApproval' ? 'bg-amber-100 text-amber-700' :
    listing.status === 'Sold' ? 'bg-blue-100 text-blue-700' :
    'bg-gray-100 text-gray-600'

  const coverColor = pickColor(listing.id)

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">

        {/* Back */}
        <Link
          to="/my-listings"
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> Back to My Listings
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-heading font-bold text-main text-3xl">{listing.title}</h1>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
                {listing.status ?? 'Unknown'}
              </span>
            </div>
            <p className="text-main/50 text-sm">by {listing.author}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-third p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart size={15} className="text-secondary" />
              <span className="text-xs font-semibold text-main/45 uppercase tracking-wider">In Carts</span>
            </div>
            <p className="font-heading font-bold text-main text-2xl">{listing.cartItemCount ?? 0}</p>
          </div>
          <div className="bg-white rounded-2xl border border-third p-5">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={15} className="text-secondary" />
              <span className="text-xs font-semibold text-main/45 uppercase tracking-wider">Wishlisted</span>
            </div>
            <p className="font-heading font-bold text-main text-2xl">{listing.wishlistItemCount ?? 0}</p>
          </div>
          <div className="bg-white rounded-2xl border border-third p-5">
            <div className="flex items-center gap-2 mb-3">
              <Eye size={15} className="text-secondary" />
              <span className="text-xs font-semibold text-main/45 uppercase tracking-wider">Published</span>
            </div>
            <p className="font-heading font-bold text-main text-2xl">{listing.isPublished ? 'Yes' : 'No'}</p>
          </div>
          <div className="bg-white rounded-2xl border border-third p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={15} className="text-secondary" />
              <span className="text-xs font-semibold text-main/45 uppercase tracking-wider">Created</span>
            </div>
            <p className="font-heading font-bold text-main text-sm leading-tight">
              {listing.dateCreated
                ? new Date(listing.dateCreated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : '—'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover image */}
            {allImages.length > 0 && (
              <div className="bg-white rounded-2xl border border-third overflow-hidden">
                <div className="bg-[#f5f5f3] flex items-center justify-center p-8">
                  {allImages[selectedImage] ? (
                    <img
                      src={allImages[selectedImage]}
                      alt={listing.title ?? ''}
                      className="max-h-80 object-contain"
                    />
                  ) : (
                    <div
                      className="w-40 h-60 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: coverColor }}
                    >
                      <ImageIcon size={32} className="text-white/50" />
                    </div>
                  )}
                </div>
                {allImages.length > 1 && (
                  <div className="flex gap-3 px-6 pb-6 overflow-x-auto">
                    {allImages.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                          i === selectedImage ? 'border-secondary' : 'border-transparent hover:border-main/20'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Pricing card */}
            <div className="bg-white rounded-2xl border border-third p-6">
              <h3 className="font-heading font-bold text-main text-base mb-4">Pricing</h3>
              {bookDisplay && (
                <>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-heading font-bold text-main text-3xl">{formatPrice(bookDisplay.price)}</span>
                    {bookDisplay.originalPrice !== bookDisplay.price && (
                      <span className="text-sm text-main/40 line-through">
                        {formatPrice(bookDisplay.originalPrice)}
                      </span>
                    )}
                  </div>
                  {bookDisplay.discount && bookDisplay.discount > 0 && (
                    <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                      <Percent size={14} />
                      {bookDisplay.discount}% discount
                      {bookDisplay.isDiscountApplied && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full ml-1">
                          <CheckCircle size={10} /> Active
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-2xl border border-third p-6">
              <h3 className="font-heading font-bold text-main text-base mb-4">Product Details</h3>
              <div className="divide-y divide-third/70">
                <DetailRow icon={Tag} label="Category" value={listing.categoryName ?? '—'} />
                <DetailRow icon={BookOpen} label="Format" value={listing.format ?? 'Paperback'} />
                <DetailRow icon={Layers} label="Condition" value={listing.bookCondition ?? '—'} />
                <DetailRow icon={Package} label="Quantity" value={String(listing.quantity ?? 1)} />
                <DetailRow icon={BookOpen} label="ISBN" value={listing.isbn ?? '—'} />
                <DetailRow icon={MapPin} label="Location" value={listing.location ?? '—'} />
              </div>
              {listing.conditionDetail && (
                <div className="mt-4 pt-4 border-t border-third/70">
                  <p className="text-xs font-semibold text-main/50 uppercase tracking-widest mb-2">Condition Notes</p>
                  <p className="text-sm text-main/70 leading-relaxed">{listing.conditionDetail}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {listing.description && (
              <div className="bg-white rounded-2xl border border-third p-6">
                <h3 className="font-heading font-bold text-main text-base mb-4">Description</h3>
                <p className="text-sm text-main/70 leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>
            )}

            {/* Love Note */}
            {listing.loveNote && (
              <div className="bg-secondary/6 border border-secondary/20 rounded-2xl p-6">
                <h3 className="font-heading font-bold text-main text-base mb-1">Love Note to the Next Reader</h3>
                <p className="text-sm text-main/70 italic leading-relaxed">"{listing.loveNote}"</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Discount */}
            {listing.isPublished && (
              <div className="bg-white rounded-2xl border border-third p-6">
                <h3 className="font-heading font-bold text-main text-sm mb-3">Discount</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={discountInput}
                      onChange={e => setDiscountInput(e.target.value)}
                      className="w-full border border-main/15 rounded-xl px-3 py-2 text-sm text-main outline-none focus:border-secondary transition-colors"
                    />
                    <span className="text-sm text-main/50">%</span>
                    <button
                      onClick={handleSaveDiscount}
                      disabled={setDiscount.isPending}
                      className="bg-main text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-main/90 transition-colors disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-main/45">
                      {listing.isDiscountApplied ? 'Discount is active' : 'Discount is disabled'}
                    </p>
                    <button
                      onClick={handleToggleDiscount}
                      disabled={setDiscount.isPending || !Number(discountInput) || Number(discountInput) <= 0}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                        listing.isDiscountApplied
                          ? 'bg-green-100 border-green-300 text-green-600 hover:bg-green-200'
                          : 'border-main/15 text-main/50 hover:border-secondary hover:text-secondary'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      <Tag size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="bg-white rounded-2xl border border-third p-6">
              <h3 className="font-heading font-bold text-main text-sm mb-3">Actions</h3>
              <div className="flex flex-col gap-2">
                <Link
                  to={`/my-listings/${listing.id}/edit`}
                  className="flex items-center gap-2 bg-main text-white font-semibold text-sm px-4 py-3 rounded-xl hover:bg-main/90 transition-colors justify-center"
                >
                  <Pencil size={15} /> Edit Listing
                </Link>
                {listing.isPublished && (
                  <Link
                    to={`/books/${listing.id}`}
                    className="flex items-center gap-2 border border-main/15 text-main font-semibold text-sm px-4 py-3 rounded-xl hover:border-secondary hover:text-secondary transition-colors justify-center"
                  >
                    <Eye size={15} /> View as Buyer
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
