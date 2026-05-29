import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  ShoppingBag,
  BookOpen,
  Tag,
  Layers,
  Package,
  ShieldCheck,
} from 'lucide-react'
import { useListing } from '../../lib/api/listings/listings.hooks'
import { listingToBookDisplay } from '../../lib/api/adapters'
import { useCart } from '../../context/CartContext'

function BookDetail() {
  const { id } = useParams()
  const { data: listing, isLoading } = useListing(Number(id))
  const { addToCart } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)

  const book = useMemo(() => listing ? listingToBookDisplay(listing) : null, [listing])
  const allImages = useMemo(() => {
    if (!book?.coverImageUrl) return []
    return [book.coverImageUrl, ...(book.imageUrls ?? [])]
  }, [book])

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
        <div className="text-center animate-[fadeIn_0.5s_ease-out]">
          <p className="font-heading font-bold text-main text-2xl mb-3">Book not found</p>
          <Link to="/browse" className="text-sm text-secondary hover:underline font-semibold">
            Back to Browse
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-third min-h-screen animate-[fadeIn_0.6s_ease-out]">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes floatIn { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: translateY(0);} }
        .reveal { animation: floatIn 0.6s ease-out both; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-12">
        {/* Breadcrumb / Back */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 md:mb-10 transition-all duration-200 font-medium hover:-translate-x-0.5"
        >
          <ArrowLeft size={15} /> Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* COVER + GALLERY */}
          <div className="order-1 lg:order-none lg:col-span-7 space-y-4">
            <div className="reveal relative rounded-3xl overflow-hidden bg-white border border-third/60">
              {allImages.length > 0 ? (
                <img
                  src={allImages[selectedImage]}
                  alt={book.title}
                  className="w-full h-80 md:h-[32rem] object-contain p-4"
                />
              ) : (
                <div
                  className="w-full h-80 md:h-[32rem] flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${book.coverColor}28, ${book.coverColor}10 55%, transparent 80%), linear-gradient(135deg, #ffffff 0%, ${book.coverColor}10 100%)`,
                  }}
                >
                  <div
                    className="w-40 h-60 md:w-52 md:h-[19rem] rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.45)] flex items-end justify-center pb-5"
                    style={{ backgroundColor: book.coverColor }}
                  >
                    <div className="w-28 h-px bg-white/40 rounded" />
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-secondary' : 'border-transparent hover:border-main/20'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="order-2 lg:order-none lg:col-span-5 lg:row-span-2 reveal">
            <div className="lg:sticky lg:top-[120px] flex flex-col">
              <p className="text-secondary text-[11px] font-bold uppercase tracking-[0.25em] mb-3">
                {book.genre}
              </p>

              <h1 className="font-heading font-bold text-main text-3xl md:text-4xl xl:text-5xl leading-[1.1] tracking-tight mb-3">
                {book.title}
              </h1>

              <p className="text-main/55 text-base mb-5">
                by <span className="text-main/80 font-medium">{book.author}</span>
              </p>

              {book.loveNote && (
                <div className="relative bg-secondary/10 border-l-4 border-secondary rounded-r-2xl rounded-l-md p-5 mb-7">
                  <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-secondary mb-2">
                    A note from the seller
                  </p>
                  <p className="text-main/75 text-sm italic leading-relaxed">
                    "{book.loveNote}"
                  </p>
                </div>
              )}

              {/* PRICE + CTA */}
              <div className="bg-white border border-third/70 rounded-2xl p-5 md:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-secondary mb-1.5">
                      Price
                    </p>
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                      <p className="font-heading font-bold text-main text-4xl md:text-[2.5rem] leading-none">
                        ₦{book.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(Number(id))}
                    className="group inline-flex items-center justify-center gap-2 bg-main text-white font-semibold px-7 py-4 rounded-full hover:bg-main/90 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transition-all duration-200 text-sm w-full sm:w-auto"
                  >
                    <ShoppingBag size={17} className="transition-transform duration-300 group-hover:rotate-[-8deg]" />
                    Add to Cart
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-third/70 flex items-center gap-2 text-xs text-main/55">
                  <ShieldCheck size={14} className="text-secondary" />
                  Secure checkout · Buyer protection included
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="order-3 lg:order-none lg:col-span-7 reveal bg-white border border-third/70 rounded-2xl p-6 md:p-7 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading font-bold text-main text-lg">Product Details</h3>
              <div className="hidden md:flex items-center gap-1.5 text-xs text-main/50">
                <ShieldCheck size={14} className="text-secondary" />
                Verified Listing
              </div>
            </div>

            <div className="divide-y divide-third/70 text-sm">
              {[
                { icon: Tag, label: 'Category', value: book.genre },
                { icon: BookOpen, label: 'Format', value: book.format || 'Paperback' },
                { icon: Layers, label: 'Condition', value: book.condition },
                { icon: Package, label: 'Available', value: String(book.quantity) },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3.5 px-1 rounded-lg hover:bg-third/40 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-third/60 flex items-center justify-center">
                      <Icon size={14} className="text-main/65" />
                    </div>
                    <span className="text-main/60">{label}</span>
                  </div>
                  <span className="font-semibold text-main">{value}</span>
                </div>
              ))}
            </div>

            {book.conditionDetail && (
              <div className="mt-4 pt-4 border-t border-third/70">
                <p className="text-xs font-semibold text-main/50 uppercase tracking-widest mb-2">
                  Condition Notes
                </p>
                <p className="text-sm text-main/70 leading-relaxed">{book.conditionDetail}</p>
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          {book.description && (
            <div className="order-4 lg:order-none lg:col-span-7 reveal bg-white border border-third/70 rounded-2xl p-6 md:p-7 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="font-heading font-bold text-main text-lg mb-4">Description</h3>
              <p className="text-sm text-main/70 leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookDetail
