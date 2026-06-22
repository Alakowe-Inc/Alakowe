import { Star, X, MapPin, ShoppingCart, Heart } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import type { Book } from '../data/mockData'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/utils'

interface BookCardProps {
  book: Book
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-200 text-gray-200'
          }
        />
      ))}
    </div>
  )
}

function BookCover({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <div
      className="relative flex"
      style={{ width: `${52 * scale}%`, aspectRatio: '2/3' }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-3 rounded-l-sm"
        style={{ backgroundColor: color + 'cc' }}
      />
      <div
        className="flex-1 rounded-r-sm flex flex-col justify-between p-3 shadow-xl"
        style={{ backgroundColor: color }}
      >
        <div className="space-y-1">
          <div className="w-full h-px bg-white/30" />
          <div className="w-3/4 h-px bg-white/20" />
        </div>
        <div className="space-y-1">
          <div className="w-full h-px bg-white/30" />
          <div className="w-1/2 h-px bg-white/20" />
        </div>
      </div>
    </div>
  )
}

function QuickViewModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const navigate = useNavigate()

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-2xl shadow-2xl flex flex-col sm:flex-row overflow-y-auto sm:overflow-hidden"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top / Left — book cover */}
        <div className="bg-[#f5f5f3] flex items-center justify-center sm:w-2/5 sm:shrink-0 p-6 sm:p-8 py-8 sm:py-12">
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-contain max-h-64" />
          ) : (
            <BookCover color={book.coverColor} scale={1.9} />
          )}
        </div>

        {/* Bottom / Right — details */}
        <div className="flex-1 p-5 sm:p-7 flex flex-col sm:overflow-y-auto relative">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-main/40 hover:text-main transition-colors"
          >
            <X size={18} />
          </button>

          {/* Title & price */}
          <h2 className="text-lg sm:text-xl font-bold text-main leading-snug pr-6">{book.title}</h2>
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-base sm:text-lg font-semibold text-main mt-1">{formatPrice(book.price)}</p>
            {book.originalPrice !== book.price && (
              <span className="text-sm text-main/40 line-through">{formatPrice(book.originalPrice)}</span>
            )}
            {book.isDiscountApplied && book.discount && book.discount > 0 && (
              <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                {book.discount}% OFF
              </span>
            )}
          </div>

          {/* Stars */}
          <div className="mt-2">
            <StarRating rating={book.sellerRating} />
          </div>

          {/* Description */}
          <p className="text-sm text-main/60 leading-relaxed mt-4">{book.description}</p>

          {/* Condition */}
          <div className="mt-4 sm:mt-5">
            <p className="text-xs font-semibold text-main/50 uppercase tracking-widest mb-2">
              Condition
            </p>
            <span className="inline-block text-xs font-medium bg-[#f5f5f3] text-main px-3 py-1.5 rounded-full">
              {book.condition}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 mt-3 sm:mt-4 text-main/50">
            <MapPin size={13} className="shrink-0" />
            <span className="text-xs">{book.location}</span>
          </div>

          {/* Seller */}
          <div className="mt-1 text-xs text-main/40">
            Sold by <span className="font-medium text-main/60">{book.sellerName}</span>
          </div>

          {/* CTA */}
          <button
            className="mt-5 sm:mt-6 w-full bg-secondary text-white font-semibold py-3 rounded-full text-sm tracking-wide hover:bg-secondary/90 transition-colors"
            onClick={() => navigate(`/books/${book.id}`)}
          >
            Add to Cart
          </button>

          {/* View full details */}
          <button
            className="mt-3 mb-1 text-xs text-secondary underline underline-offset-2 hover:text-secondary/80 transition-colors"
            onClick={() => navigate(`/books/${book.id}`)}
          >
            View full details
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

function BookCard({ book }: BookCardProps) {
  const [showModal, setShowModal] = useState(false)
  const { addToCart } = useCart()

  return (
    <>
      <Link
        to={`/books/${book.id}`}
        className="group block"
      >
        {/* Cover image */}
        <div className="relative overflow-hidden rounded-xl bg-[#f5f5f3]" style={{ aspectRatio: '3/4' }}>
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundColor: book.coverColor }}
            >
              <BookCover color={book.coverColor} />
            </div>
          )}

          {/* Wishlist heart */}
          <button
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-main/40 hover:text-red-500 hover:bg-white transition-colors"
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
            aria-label="Add to wishlist"
          >
            <Heart size={14} />
          </button>

          {/* Discount badge */}
          {book.isDiscountApplied && book.discount && book.discount > 0 && (
            <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-secondary px-2 py-0.5 rounded-full">
              {book.discount}% OFF
            </span>
          )}
        </div>

        {/* Info */}
        <div className="pt-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-main leading-snug line-clamp-1 group-hover:text-secondary transition-colors">
              {book.title}
            </h3>
            <div className="flex items-center gap-0.5 shrink-0">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-medium text-main/60">4.0</span>
            </div>
          </div>

          <p className="text-xs text-secondary mt-0.5 truncate">{book.author}</p>

          <div className="flex items-center gap-1 mt-1 text-main/40">
            <MapPin size={10} className="shrink-0" />
            <span className="text-[10px] truncate">{book.location}</span>
          </div>

          <div className="flex items-center justify-between mt-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-main">{formatPrice(book.price)}</span>
              {book.originalPrice !== book.price && (
                <span className="text-[11px] text-main/40 line-through">{formatPrice(book.originalPrice)}</span>
              )}
            </div>

            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(book.id) }}
              className="w-8 h-8 rounded-full bg-main/8 flex items-center justify-center text-main hover:bg-main hover:text-white transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart size={13} />
            </button>
          </div>
        </div>
      </Link>

      {showModal && <QuickViewModal book={book} onClose={() => setShowModal(false)} />}
    </>
  )
}

export default BookCard
