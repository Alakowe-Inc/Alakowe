import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  ShoppingCart,
  CheckCircle2,
  BookOpen,
  FileText,
  Globe,
  FolderOpen,
  Barcode,
  Heart,
  Search
} from 'lucide-react'
import { useListing, useListings } from '../../lib/api/listings/listings.hooks'
import { listingToBookDisplay } from '../../lib/api/adapters'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../lib/utils'
import BookCard from '../../components/BookCard'

function BookDetail() {
  const { id } = useParams()
  const { data: listing, isLoading } = useListing(Number(id))
  const { data: pagedResult } = useListings()
  const { addToCart } = useCart()

  const [activeIdx, setActiveIdx] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'shipping'>('details')
  const [isExpanded, setIsExpanded] = useState(false)

  const book = useMemo(() => (listing ? listingToBookDisplay(listing) : null), [listing])

  const images = useMemo(() => {
    if (!book?.coverImageUrl) return []
    return [book.coverImageUrl, ...(book.imageUrls ?? [])].filter(Boolean)
  }, [book])

  // Mocking 4 detail angles/pages if only cover exists to replicate mockup thumbnails
  const thumbnailImages = useMemo(() => {
    if (images.length === 0) return []
    if (images.length > 1) return images
    return [images[0], images[0], images[0], images[0]]
  }, [images])

  const relatedBooks = useMemo(() => {
    if (!pagedResult?.result) return []
    return pagedResult.result
      .filter((l) => String(l.id) !== id)
      .slice(0, 5)
      .map(listingToBookDisplay)
  }, [pagedResult, id])

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

  // Calculate pricing comparison math to match new/used savings layout
  const brandNewPrice = book.originalPrice > book.price ? book.originalPrice : Math.round(book.price * 2.4)
  const savings = brandNewPrice - book.price
  const savingsPercent = Math.round((savings / brandNewPrice) * 100)

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Back Link */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-xs text-secondary hover:underline mb-6 transition-colors font-semibold"
        >
          <ArrowLeft size={13} /> Back to browse
        </Link>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Cover Image, Thumbnails, Details Tab Panel */}
          <div className="flex flex-col max-w-[360px] w-full mx-auto lg:mx-0">
            {/* Big image with overlay badges */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-third rounded-2xl shadow-sm border border-main/5">
              {thumbnailImages.length > 0 ? (
                <img
                  key={activeIdx}
                  src={thumbnailImages[activeIdx]}
                  alt={book.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: book.coverColor }}
                />
              )}

              {/* Heart Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all border border-main/5"
              >
                <Heart
                  size={14}
                  className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-900'}
                />
              </button>

              {/* Tap to Zoom Badge */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 select-none">
                <Search size={11} />
                <span>Tap to zoom</span>
              </div>
            </div>

            {/* Thumbnail selector row */}
            {thumbnailImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2.5 mt-3">
                {thumbnailImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeIdx ? 'border-secondary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Details tabs wrapper panel */}
            <div className="border border-main/10 rounded-2xl overflow-hidden bg-white p-5 mt-5">
              {/* Tab Navigation */}
              <div className="flex border-b border-main/10 mb-4">
                {(['details', 'shipping'] as const).map((tab) => {
                  const labelMap = {
                    details: 'Details',
                    shipping: 'Shipping & Returns',
                  }
                  const isActive = activeTab === tab
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 text-center pb-2.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider border-b-2 transition-all ${
                        isActive
                          ? 'border-secondary text-main font-bold'
                          : 'border-transparent text-main/45 hover:text-main'
                      }`}
                    >
                      {labelMap[tab]}
                    </button>
                  )
                })}
              </div>

              {/* Tab Contents */}
              {activeTab === 'details' && (
                <div className="space-y-3">
                  {[
                    { icon: BookOpen, label: 'Format', value: book.format },
                    { icon: FolderOpen, label: 'Category', value: book.genre },
                    { icon: CheckCircle2, label: 'Condition', value: book.condition },
                    { icon: Barcode, label: 'ISBN', value: book.isbn },
                  ]
                    .filter((item) => !!item.value)
                    .map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-2.5 text-main/60">
                          <Icon size={14} className="text-main/40 shrink-0" />
                          <span className="font-medium">{label}</span>
                        </div>
                        <span className="font-semibold text-main text-right">{value}</span>
                      </div>
                    ))}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="text-[11px] text-main/60 leading-relaxed space-y-2">
                  {book.fulfillmentOption === 'Pickup' ? (
                    <>
                      <p className="font-semibold text-main">Pickup only</p>
                      <p>
                        Collect this book from the seller. Their contact details are sent after you pay.
                      </p>
                      {(book.pickupAddressLine || book.pickupCity) && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            [book.pickupAddressLine, book.pickupCity, book.pickupState].filter(Boolean).join(', '),
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-secondary hover:underline"
                        >
                          <MapPin size={11} />
                          View pickup location
                        </a>
                      )}
                    </>
                  ) : book.fulfillmentOption === 'Both' ? (
                    <>
                      <p>You choose at checkout:</p>
                      <p>
                        <span className="font-semibold text-main">Pickup</span>
                        {' '}at the seller&apos;s place (contact after payment)
                        {(book.pickupAddressLine || book.pickupCity) && (
                          <>
                            {' · '}
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                [book.pickupAddressLine, book.pickupCity, book.pickupState].filter(Boolean).join(', '),
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-secondary hover:underline"
                            >
                              see location
                            </a>
                          </>
                        )}
                      </p>
                      <p>
                        <span className="font-semibold text-main">Alákòwé delivery</span>
                        {' '}with our protected logistics flow (delivery fee applies).
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        ALÁKÒWÉ manages the entire logistics process. From seller collection and quality inspection to doorstep delivery, we ensure a secure transaction.
                      </p>
                      <p>
                        All purchases are covered under our Buyer Protection policy. If the book differs significantly from the description, report the issue within 12 hours of delivery for a full refund.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* About this book section (not toggled, below details tabs card) */}
            {book.description && (
              <div className="border border-main/10 rounded-2xl bg-white p-5 mt-5">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-secondary mb-2">
                  About this book
                </h3>
                <p className={`text-xs text-main/70 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                  {book.description}
                </p>
                {book.description.length > 150 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs font-semibold text-secondary hover:underline mt-2 block"
                  >
                    {isExpanded ? 'Read less' : 'Read more'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Book Details & Actions */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-main/50 block mb-1.5">
              {book.genre.toUpperCase()}
            </span>
            <h1 className="font-heading font-bold text-main text-2xl md:text-3xl leading-tight mb-1.5">
              {book.title}
            </h1>
            <p className="text-sm text-main/60 mb-4">
              by <span className="font-medium text-main">{book.author}</span>
            </p>

            {/* Badges Row */}
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                {book.condition}
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-main/5 text-main">
                {book.quantity} copy available
              </span>
            </div>

            {/* Pricing Card */}
            <div className="border border-main/10 rounded-2xl p-5 bg-white shadow-sm mb-4">
              <div className="mb-4">
                <div className="text-2xl font-extrabold text-main">{formatPrice(book.price)}</div>
                <div className="flex items-center gap-2 mt-1 text-[11px] flex-wrap">
                  <span className="text-main/45 line-through">New price: {formatPrice(brandNewPrice)}</span>
                  <span className="text-secondary font-semibold">
                    You save: {formatPrice(savings)} ({savingsPercent}%)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => addToCart(Number(id))}
                className="w-full bg-main hover:bg-main/90 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors mb-2.5 flex items-center justify-center gap-2"
              >
                Buy this copy
              </button>
              <button
                onClick={() => addToCart(Number(id))}
                className="w-full border border-main/20 hover:bg-main/5 text-main font-semibold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 bg-white"
              >
                <ShoppingCart size={14} />
                Add to cart
              </button>
            </div>

            {/* Condition Note Card */}
            <div className="bg-secondary/5 rounded-2xl p-4 border border-secondary/5 mb-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-secondary mb-1.5">Condition note</p>
              <p className="text-xs text-main/75 leading-relaxed">
                {book.conditionDetail ||
                  'The book has some creases on the front and back covers. Slight yellowing on the sides. But the pages are intact. Also, I highlighted some pages and my name is written on the first page.'}
              </p>
            </div>

            {/* Seller profile Card */}
            <div className="bg-secondary/5 rounded-2xl p-4 border border-secondary/5 mb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full bg-main/10 flex items-center justify-center font-heading font-bold text-main shrink-0 text-sm">
                  {book.sellerName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-main text-xs truncate max-w-[140px] sm:max-w-[200px] md:max-w-none">{book.sellerName}</span>
                    <div className="flex items-center gap-1 text-[9px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full shrink-0">
                      <span className="w-1 h-1 rounded-full bg-blue-600"></span>
                      Verified
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-main/45 mt-1">
                    <MapPin size={10} className="shrink-0" />
                    <span className="truncate">{book.location || 'Lagos Island'}</span>
                  </div>
                </div>
              </div>
              {book.sellerSlug && (
                <Link
                  to={`/store/${encodeURIComponent(book.sellerSlug)}`}
                  className="text-[10px] font-semibold text-secondary hover:underline shrink-0 flex items-center gap-0.5 self-end sm:self-auto"
                >
                  <span>View seller's profile</span>
                  <span>&rarr;</span>
                </Link>
              )}
            </div>

            {/* Handwritten Seller Sticky Note */}
            <div className="relative bg-[#FFFDF0] pt-8 pb-4 px-5 rounded-2xl shadow-sm border border-[#f7f4d7] flex flex-col min-h-[130px] overflow-hidden">
              {/* Tape decoration */}
              <div className="absolute -top-1 w-14 h-4 bg-slate-400/20 rounded-[3px] shadow-sm border border-white/20 left-1/2 -translate-x-1/2" />
              <p className="text-[9px] font-semibold uppercase tracking-widest text-main/40 mb-2">
                A note from the seller
              </p>
              <p className="font-handwritten text-[16px] text-main/90 leading-relaxed font-medium mb-3 flex-1">
                "{book.loveNote || 'This book changed how I see myself and my roots. I hope it does the same for you.'}"
              </p>
              <p className="font-handwritten text-sm text-main/75 text-right font-semibold">— {book.sellerName}</p>
            </div>
          </div>
        </div>

        {/* RELATED BOOKS: You May Also Like */}
        {relatedBooks.length > 0 && (
          <div className="mt-12 border-t border-main/10 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-main text-xl">You may also like</h2>
              <Link
                to="/browse"
                className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
              >
                <span>View more</span>
                <span>&rarr;</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedBooks.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookDetail
