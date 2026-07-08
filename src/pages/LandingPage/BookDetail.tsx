import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  ShoppingBag,
  ShoppingCart,
  ShieldCheck,
  BadgeCheck,
  Heart,
  Search,
  BookOpen,
  FileText,
  Globe,
  Tag,
  Clock,
  Hash,
  Star,
} from 'lucide-react'
import { useListing, useListings } from '../../lib/api/listings/listings.hooks'
import { listingToBookDisplay } from '../../lib/api/adapters'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../lib/utils'
import { Button } from '@/components/ui/button'

type DetailTab = 'details' | 'about' | 'shipping'

function BookDetail() {
  const { id } = useParams()
  const { data: listing, isLoading } = useListing(Number(id))
  const { addToCart } = useCart()

  const [activeIdx, setActiveIdx] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [activeTab, setActiveTab] = useState<DetailTab>('details')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [relatedWishlist, setRelatedWishlist] = useState<Set<number>>(new Set())

  const book = useMemo(() => (listing ? listingToBookDisplay(listing) : null), [listing])
  const images = useMemo(() => {
    if (!book?.coverImageUrl) return []
    return [book.coverImageUrl, ...(book.imageUrls ?? [])]
  }, [book])

  // "You may also like" — swap `pageSize`/filter for a real category filter once
  // ListingFilterParams supports one (e.g. { categoryId: listing?.categoryId }).
  const { data: relatedResult } = useListings({ pageSize: 5 } as any)
  const relatedBooks = useMemo(() => {
    if (!relatedResult) return []
    return relatedResult.result
      .filter((l) => l.id !== Number(id))
      .slice(0, 5)
      .map(listingToBookDisplay)
  }, [relatedResult, id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-third">
        <p className="text-main/50 text-sm">Loading…</p>
      </div>
    )
  }

  if (!listing || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-third">
        <div className="text-center">
          <p className="font-heading font-bold text-main text-2xl mb-3">Book not found</p>
          <Link to="/browse" className="text-sm text-secondary hover:underline font-semibold">
            Back to Browse
          </Link>
        </div>
      </div>
    )
  }

  const hasDiscount = !!(book.isDiscountApplied && book.discount && book.discount > 0)
  const quantity = listing.quantity ?? 1
  const copiesLabel = `${quantity} ${quantity === 1 ? 'copy' : 'copies'} available`

  const toggleRelatedWishlist = (relatedId: number) => {
    setRelatedWishlist((prev) => {
      const next = new Set(prev)
      next.has(relatedId) ? next.delete(relatedId) : next.add(relatedId)
      return next
    })
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12 py-6 md:py-12">
        {/* Back link */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-sm text-main/40 hover:text-main mb-6 md:mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={14} /> Back to browse
        </Link>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-start">
          {/* LEFT — Images */}
          <div className="flex flex-col gap-2">
            <div
              className="relative aspect-[4/3] overflow-hidden bg-third rounded-xl cursor-zoom-in"
              onClick={() => images.length > 0 && setIsZoomed(true)}
            >
              {images.length > 0 ? (
                <img
                  key={activeIdx}
                  src={images[activeIdx]}
                  alt={book.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: book.coverColor }}
                />
              )}

              {hasDiscount && (
                <span className="absolute top-3 left-3 bg-main text-white text-[10px] font-semibold px-2.5 py-1 tracking-widest uppercase rounded">
                  {book.discount}% off
                </span>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsWishlisted((v) => !v)
                }}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                aria-label="Toggle wishlist"
                title="Toggle wishlist"
              >
                <Heart
                  size={16}
                  className={isWishlisted ? 'fill-main text-main' : 'text-main/60'}
                />
              </button>

              {images.length > 0 && (
                <span className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 text-white text-xs px-2.5 py-1.5 rounded-md">
                  <Search size={12} /> Tap to zoom
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`w-14 h-14 shrink-0 overflow-hidden border-2 rounded-md transition-all duration-150 ${
                      i === activeIdx ? 'border-main' : 'border-transparent opacity-40 hover:opacity-70'
                    }`}
                    aria-label={`View image ${i + 1} of ${images.length}`}
                    title={`View image ${i + 1} of ${images.length}`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Purchase panel */}
          <div className="lg:sticky lg:top-24">
            <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-secondary mb-3">
              {book.genre}
            </p>

            <h1 className="font-heading font-bold text-main text-2xl md:text-3xl leading-tight mb-1">
              {book.title}
            </h1>

            <p className="text-sm text-main/50 mb-4">by {book.author}</p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-secondary/10 text-main text-xs font-medium px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                {book.condition}
              </span>
              <span className="bg-third text-main/60 text-xs font-medium px-3 py-1.5 rounded-full">
                {copiesLabel}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2.5">
                <span className="font-heading font-bold text-main text-3xl">
                  {formatPrice(book.price)}
                </span>
              </div>
              {book.originalPrice !== book.price && (
                <div className="mt-1.5 space-y-0.5">
                  <p className="text-sm text-main/40">
                    New price: <span className="line-through">{formatPrice(book.originalPrice)}</span>
                  </p>
                  {hasDiscount && (
                    <p className="text-sm text-main/40">
                      You save:{' '}
                      <span className="text-secondary font-semibold">
                        {formatPrice(book.originalPrice - book.price)} ({book.discount}%)
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="space-y-3 mb-3">
              <Button
                onClick={() => {
                  addToCart(Number(id))
                  // TODO: route straight to checkout for "buy now" flow
                }}
                className="w-full gap-2 bg-main text-white text-sm font-semibold h-auto py-3.5 tracking-wide hover:bg-main/90 rounded-xl"
              >
                <ShoppingBag size={15} />
                Buy this copy
              </Button>

              <Button
                onClick={() => addToCart(Number(id))}
                variant="outline"
                className="w-full gap-2 border-main/15 text-main text-sm font-semibold h-auto py-3.5 tracking-wide hover:bg-third rounded-xl"
              >
                <ShoppingCart size={15} />
                Add to cart
              </Button>
            </div>

            <p className="flex items-center gap-1.5 text-xs text-main/30 mb-8">
              <ShieldCheck size={12} className="shrink-0" />
              Secure checkout · Buyer protection included
            </p>

            {/* Condition note */}
            {book.conditionDetail && (
              <div className="bg-third rounded-xl p-5 mb-6">
                <p className="font-heading font-semibold text-main text-sm mb-2">Condition note</p>
                <p className="text-sm text-main/60 leading-relaxed">{book.conditionDetail}</p>
              </div>
            )}

            {/* Seller card */}
            <div className="bg-third rounded-xl p-5 flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3 min-w-0">
                {book.sellerAvatarUrl ? (
                  <img
                    src={book.sellerAvatarUrl}
                    alt={book.sellerName}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm font-semibold text-main shrink-0">
                    {book.sellerName[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-main truncate">{book.sellerName}</p>
                    {/* TODO: wire real verified flag once available on BookDisplay */}
                    {(book.sellerVerified ?? true) && (
                      <BadgeCheck size={13} className="text-secondary shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 mt-0.5 text-xs text-main/40">
                    <span className="flex items-center gap-1">
                      <Star size={11} className="fill-secondary text-secondary" />
                      {/* TODO: replace fallback with real seller rating/sales count */}
                      {(book.sellerRating ?? 4.8).toFixed(1)} rating ({book.sellerSalesCount ?? 0} books
                      sold)
                    </span>
                  </div>
                  {book.location && (
                    <span className="flex items-center gap-1 text-xs text-main/40 mt-0.5">
                      <MapPin size={11} className="shrink-0" />
                      {book.location}
                    </span>
                  )}
                </div>
              </div>
              <Link
                to={`/sellers/${book.sellerId ?? ''}`}
                className="text-xs font-semibold text-secondary hover:underline shrink-0 flex items-center gap-1"
              >
                View profile
              </Link>
            </div>

            {/* Sticky-note quote */}
            {book.loveNote && (
              <div className="relative bg-[#FBF3E4] rounded-md p-5 shadow-sm rotate-[-0.5deg]">
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-main/10 rounded-sm" />
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-main/40 mb-3">
                  A note from the seller
                </p>
                <p className="text-sm text-main/70 italic leading-relaxed">&ldquo;{book.loveNote}&rdquo;</p>
                <p className="text-sm text-main/70 italic mt-2">— {book.sellerName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 md:mt-14 border-t border-main/8 pt-8 md:pt-10">
          <div className="flex gap-6 border-b border-main/8 mb-6 overflow-x-auto">
            {(
              [
                { key: 'details', label: 'Details' },
                { key: 'about', label: 'About this book' },
                { key: 'shipping', label: 'Shipping & Returns' },
              ] as { key: DetailTab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                  activeTab === tab.key
                    ? 'border-main text-main'
                    : 'border-transparent text-main/40 hover:text-main/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'details' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 max-w-xl">
              {[
                { icon: BookOpen, label: 'Format', value: book.format || 'Paperback' },
                // TODO: pages/language aren't on ListingResponse/BookDisplay yet — add once available
                { icon: FileText, label: 'Pages', value: book.pages ?? '—' },
                { icon: Globe, label: 'Language', value: book.language ?? 'English' },
                { icon: Tag, label: 'Category', value: listing.categoryName ?? book.genre },
                { icon: Clock, label: 'Condition', value: book.condition },
                { icon: Hash, label: 'ISBN', value: listing.isbn },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-2.5 text-sm">
                  <row.icon size={14} className="text-main/30 shrink-0" />
                  <span className="text-main/40">{row.label}</span>
                  <span className="ml-auto font-medium text-main">{row.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-2xl">
              <p className="text-sm text-main/60 leading-relaxed">{book.description}</p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="max-w-2xl text-sm text-main/60 leading-relaxed space-y-3">
              <p>Ships from {book.location ?? 'the seller\u2019s location'} within 1–2 business days.</p>
              <p>Returns are accepted within 7 days if the book doesn't match its condition note.</p>
            </div>
          )}
        </div>

        {/* You may also like */}
        {relatedBooks.length > 0 && (
          <div className="mt-12 md:mt-14 border-t border-main/8 pt-8 md:pt-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-bold text-main text-xl">You may also like</h2>
              <Link
                to="/browse"
                className="text-sm font-semibold text-secondary hover:underline flex items-center gap-1"
              >
                View more
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
              {relatedBooks.map((rb, i) => {
                const relatedId = relatedResult!.result[i].id
                const relatedDiscount = !!(rb.isDiscountApplied && rb.discount && rb.discount > 0)
                return (
                  <div key={relatedId} className="group">
                    <Link to={`/books/${relatedId}`} className="block relative aspect-[3/4] rounded-lg overflow-hidden bg-third mb-2.5">
                      {rb.coverImageUrl ? (
                        <img
                          src={rb.coverImageUrl}
                          alt={rb.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: rb.coverColor }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          toggleRelatedWishlist(relatedId)
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center"
                        aria-label="Toggle wishlist"
                        title="Toggle wishlist"
                      >
                        <Heart
                          size={13}
                          className={relatedWishlist.has(relatedId) ? 'fill-main text-main' : 'text-main/50'}
                        />
                      </button>
                    </Link>

                    <Link to={`/books/${relatedId}`}>
                      <p className="text-sm font-medium text-main truncate">{rb.title}</p>
                      <p className="text-xs text-main/40 truncate">{rb.author}</p>
                    </Link>

                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-semibold text-main">{formatPrice(rb.price)}</span>
                        {relatedDiscount && (
                          <span className="text-[11px] text-main/30 line-through">
                            {formatPrice(rb.originalPrice)}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCart(relatedId)}
                        className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors"
                        aria-label="Add to cart"
                        title="Add to cart"
                      >
                        <ShoppingCart size={12} className="text-secondary" />
                      </button>
                    </div>
                    {rb.location && (
                      <p className="flex items-center gap-1 text-[11px] text-main/30 mt-1">
                        <MapPin size={10} className="shrink-0" />
                        {rb.location}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isZoomed && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={images[activeIdx]}
            alt={book.title}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  )
}

export default BookDetail