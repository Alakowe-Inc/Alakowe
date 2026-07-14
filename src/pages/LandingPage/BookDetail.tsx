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
  const [activeTab, setActiveTab] = useState<'details' | 'about' | 'shipping'>('details')

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
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-10">
        {/* Back Link */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-sm text-secondary hover:underline mb-8 transition-colors font-semibold"
        >
          <ArrowLeft size={14} /> Back to browse
        </Link>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* LEFT COLUMN: Cover Image, Thumbnails, Details Tab Panel */}
          <div className="flex flex-col">
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
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all border border-main/5"
              >
                <Heart
                  size={15}
                  className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-900'}
                />
              </button>

              {/* Tap to Zoom Badge */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 select-none">
                <Search size={12} />
                <span>Tap to zoom</span>
              </div>
            </div>

            {/* Thumbnail selector row */}
            {thumbnailImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
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
            <div className="border border-main/10 rounded-2xl overflow-hidden bg-white p-6 mt-6">
              {/* Tab Navigation */}
              <div className="flex border-b border-main/10 mb-6">
                {(['details', 'about', 'shipping'] as const).map((tab) => {
                  const labelMap = {
                    details: 'Details',
                    about: 'About this book',
                    shipping: 'Shipping & Returns',
                  }
                  const isActive = activeTab === tab
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 text-center pb-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
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
                <div className="space-y-4">
                  {[
                    { icon: BookOpen, label: 'Format', value: book.format || 'Paperback' },
                    { icon: FileText, label: 'Pages', value: '209' },
                    { icon: Globe, label: 'Language', value: 'English' },
                    { icon: FolderOpen, label: 'Category', value: book.genre },
                    { icon: CheckCircle2, label: 'Condition', value: book.condition },
                    { icon: Barcode, label: 'ISBN', value: book.isbn || '9780385474542' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm py-1">
                      <div className="flex items-center gap-3 text-main/60">
                        <Icon size={16} className="text-main/40 shrink-0" />
                        <span className="font-medium">{label}</span>
                      </div>
                      <span className="font-semibold text-main text-right">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'about' && (
                <div className="text-sm text-main/70 leading-relaxed space-y-3">
                  <p>{book.description || 'No summary is available for this listing.'}</p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="text-xs text-main/60 leading-relaxed space-y-3">
                  <p>
                    ALÁKÒWÉ manages the entire logistics process. From seller collection and quality inspection to doorstep delivery, we ensure a secure transaction.
                  </p>
                  <p>
                    All purchases are covered under our Buyer Protection policy. If the book differs significantly from the description, report the issue within 12 hours of delivery for a full refund.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Book Details & Actions */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-main/50 block mb-2">
              {book.genre.toUpperCase()}
            </span>
            <h1 className="font-heading font-bold text-main text-3xl md:text-4xl leading-tight mb-2">
              {book.title}
            </h1>
            <p className="text-base text-main/60 mb-5">
              by <span className="font-medium text-main">{book.author}</span>
            </p>

            {/* Badges Row */}
            <div className="flex items-center gap-2.5 mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary/10 text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                {book.condition}
              </span>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-main/5 text-main">
                {book.quantity} copy available
              </span>
            </div>

            {/* Pricing Card */}
            <div className="border border-main/10 rounded-2xl p-6 bg-white shadow-sm mb-6">
              <div className="mb-5">
                <div className="text-3xl font-extrabold text-main">{formatPrice(book.price)}</div>
                <div className="flex items-center gap-2 mt-1.5 text-xs flex-wrap">
                  <span className="text-main/45 line-through">New price: {formatPrice(brandNewPrice)}</span>
                  <span className="text-secondary font-semibold">
                    You save: {formatPrice(savings)} ({savingsPercent}%)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => addToCart(Number(id))}
                className="w-full bg-main hover:bg-main/90 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors mb-3 flex items-center justify-center gap-2"
              >
                Buy this copy
              </button>
              <button
                onClick={() => addToCart(Number(id))}
                className="w-full border border-main/20 hover:bg-main/5 text-main font-semibold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 bg-white"
              >
                <ShoppingCart size={15} />
                Add to cart
              </button>
            </div>

            {/* Condition Note Card */}
            <div className="bg-secondary/5 rounded-2xl p-5 border border-secondary/5 mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">Condition note</p>
              <p className="text-sm text-main/75 leading-relaxed">
                {book.conditionDetail ||
                  'The book has some creases on the front and back covers. Slight yellowing on the sides. But the pages are intact. Also, I highlighted some pages and my name is written on the first page.'}
              </p>
            </div>

            {/* Seller profile Card */}
            <div className="bg-secondary/5 rounded-2xl p-5 border border-secondary/5 mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-main/10 flex items-center justify-center font-heading font-bold text-main shrink-0 text-base">
                  {book.sellerName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-main text-sm truncate">{book.sellerName}</span>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      Verified
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-main/45 mt-1">
                    <MapPin size={11} className="shrink-0" />
                    <span>{book.location || 'Lagos Island'}</span>
                  </div>
                </div>
              </div>
              <Link
                to={`/browse`}
                className="text-xs font-semibold text-secondary hover:underline shrink-0 flex items-center gap-0.5"
              >
                <span>View seller's profile</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* Handwritten Seller Sticky Note */}
            <div className="relative bg-[#FFFDF0] pt-10 pb-6 px-6 rounded-2xl shadow-sm border border-[#f7f4d7] flex flex-col min-h-[160px] overflow-hidden">
              {/* Tape decoration */}
              <div className="absolute -top-1 w-14 h-4 bg-slate-400/20 rounded-[3px] shadow-sm border border-white/20 left-1/2 -translate-x-1/2" />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-main/40 mb-3">
                A note from the seller
              </p>
              <p className="font-handwritten text-[20px] text-main/90 leading-relaxed font-medium mb-4 flex-1">
                "{book.loveNote || 'This book changed how I see myself and my roots. I hope it does the same for you.'}"
              </p>
              <p className="font-handwritten text-base text-main/75 text-right font-semibold">— {book.sellerName}</p>
            </div>
          </div>
        </div>

        {/* RELATED BOOKS: You May Also Like */}
        {relatedBooks.length > 0 && (
          <div className="mt-16 border-t border-main/10 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading font-bold text-main text-2xl">You may also like</h2>
              <Link
                to="/browse"
                className="text-sm font-semibold text-secondary hover:underline flex items-center gap-1"
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
