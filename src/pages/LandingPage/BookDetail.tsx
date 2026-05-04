import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  Star,
  ShoppingBag,
  BookOpen,
  Tag,
  Layers,
  Package,
  ShieldCheck,
} from 'lucide-react'
import { books } from '../../data/mockData'
import { useCart } from '../../context/CartContext'

function BookDetail() {
  const { id } = useParams()
  const book = books.find(b => b.id === id)
  const { addToCart } = useCart()

  if (!book) {
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

  const finalPrice =
    book.discount && (book.discount ?? 0) > 0
      ? Math.round(book.price * (1 - book.discount / 100))
      : book.price

  const hasDiscount = (book.discount ?? 0) > 0

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

        {/*
          Grid is flattened so order-* can interleave on mobile.
          Mobile order: 1) Image, 2) Summary panel, 3) Product details.
          Desktop: image (col-span-7) + product details (col-span-7) on left,
          summary panel (col-span-5, row-span-2, sticky) on right.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* COVER — order-1 on mobile, top-left on desktop */}
          <div
            className="order-1 lg:order-none lg:col-span-7 reveal group relative rounded-3xl h-80 md:h-[32rem] flex items-center justify-center border border-third/60 overflow-hidden transition-all duration-500 hover:shadow-2xl"
            style={{
              background: `radial-gradient(circle at 30% 20%, ${book.coverColor}28, ${book.coverColor}10 55%, transparent 80%), linear-gradient(135deg, #ffffff 0%, ${book.coverColor}10 100%)`,
            }}
          >
            {/* soft glow */}
            <div
              className="absolute -inset-20 blur-3xl opacity-40 transition-opacity duration-700 group-hover:opacity-60"
              style={{ background: `radial-gradient(circle, ${book.coverColor}55, transparent 60%)` }}
            />
            <div
              className="relative w-40 h-60 md:w-52 md:h-[19rem] rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.45)] flex items-end justify-center pb-5 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-rotate-1"
              style={{ backgroundColor: book.coverColor }}
            >
              <div className="w-28 h-px bg-white/40 rounded" />
            </div>

            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-secondary text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">
                {book.discount}% OFF
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — STICKY PURCHASE PANEL.
              order-2 on mobile (between image and details).
              On desktop: col-span-5, spans both rows so it sits beside image + details. */}
          <div className="order-2 lg:order-none lg:col-span-5 lg:row-span-2 reveal">
            <div className="lg:sticky lg:top-[120px] flex flex-col">
              {/* Genre */}
              <p className="text-secondary text-[11px] font-bold uppercase tracking-[0.25em] mb-3">
                {book.genre}
              </p>

              <h1 className="font-heading font-bold text-main text-3xl md:text-4xl xl:text-5xl leading-[1.1] tracking-tight mb-3">
                {book.title}
              </h1>

              <p className="text-main/55 text-base mb-5">
                by <span className="text-main/80 font-medium">{book.author}</span>
              </p>

              {/* CONDITION NOTES */}
              {book.conditionNotes && (
                <div className="mb-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-main/40 mb-2">
                    Condition notes
                  </p>
                  <p className="text-sm text-main/70 leading-relaxed">
                    {book.conditionNotes}
                  </p>
                </div>
              )}

              {/* DESCRIPTION */}
              <div className="mb-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-main/40 mb-2">
                  Book Description
                </p>
                <p className="text-main/70 text-sm leading-relaxed mb-7">
                  {book.description}
                </p>
              </div>

              {/* SELLER */}
              <div className="bg-white rounded-2xl border border-third/70 p-5 mb-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-secondary mb-3">
                  Sold by
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center font-heading font-bold text-main text-base shrink-0 ring-2 ring-white shadow">
                    {(book.sellerUsername ?? book.sellerName)[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-main text-sm truncate">
                      {book.sellerUsername ?? book.sellerName}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={11} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-main/55">
                        {book.sellerRating} rating
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-main/50 shrink-0">
                    <MapPin size={13} />
                    <span className="text-xs">{book.location}</span>
                  </div>
                </div>
              </div>

              {/* LOVE NOTE */}
              {book.loveNote && (
                <div className="relative bg-secondary/10 border-l-4 border-secondary rounded-r-2xl rounded-l-md p-5 mb-7">
                  <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-secondary mb-2">
                    A note from the seller
                  </p>
                  <p className="text-main/75 text-sm italic leading-relaxed">
                    “{book.loveNote}”
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
                        ₦{finalPrice.toLocaleString()}
                      </p>
                      {hasDiscount && (
                        <p className="text-sm text-main/40 line-through">
                          ₦{book.price.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {hasDiscount && (
                      <p className="mt-1.5 inline-block text-[11px] text-secondary font-bold bg-secondary/10 px-2 py-0.5 rounded-full">
                        {book.discount}% OFF
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(book.id)}
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

          {/* PRODUCT DETAILS — order-3 on mobile, sits under image on desktop */}
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
                { icon: BookOpen, label: 'Format', value: book.format },
                { icon: Layers, label: 'Condition', value: book.condition },
                { icon: Package, label: 'Available', value: book.quantity },
                { icon: MapPin, label: 'Ships From', value: book.location },
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail