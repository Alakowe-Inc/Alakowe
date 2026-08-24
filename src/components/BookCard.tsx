import { Star, Heart, ShoppingCart, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { BookBadge } from '../data/mockData'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/utils'

/**
 * Minimal shape BookCard actually renders. Both the mock `Book` and the
 * API-backed `BookDisplay` satisfy this, so either can be passed directly.
 */
export interface BookCardData {
  id: string
  title: string
  author: string
  price: number
  coverColor: string
  coverImageUrl?: string
  badge?: BookBadge
  discount?: number
  isDiscountApplied?: boolean
  sellerRating?: number
  location?: string
  originalPriceOfNew?: number
}

interface BookCardProps {
  book: BookCardData
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

function BookCard({ book }: BookCardProps) {
  const [hovered, setHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { addToCart } = useCart()

  return (
    <Link
      to={`/books/${book.id}`}
      className="group block w-full max-w-[190px] mx-auto transition-all duration-300 hover:-translate-y-1 bg-white p-2 rounded-2xl shadow-sm hover:shadow-md border border-main/5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image / Cover area */}
      <div className="relative overflow-hidden bg-[#f5f5f3] rounded-xl aspect-[4/5]">
        {/* Favorite button */}
        <button
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
        >
          <Heart
            size={14}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-900'}
          />
        </button>

        {/* Badge */}
        {book.badge && (
          <span
            className={`absolute top-3 left-3 z-10 text-[9px] font-semibold tracking-wider rounded-full uppercase px-2.5 py-1 ${
              book.badge === 'Best Value'
                ? 'bg-secondary/90 text-white'
                : 'bg-secondary text-white'
            }`}
          >
            {book.badge}
          </span>
        )}

        {/* Discount badge (real listings) */}
        {!book.badge && book.isDiscountApplied && book.discount && book.discount > 0 && (
          <span className="absolute top-3 left-3 z-10 text-[9px] font-bold text-white bg-secondary px-2.5 py-1 rounded-full uppercase tracking-wider">
            {book.discount}% off
          </span>
        )}

        {/* Book cover image */}
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundColor: book.coverColor }}
          />
        )}
      </div>

      {/* Info */}
      <div className="pt-2.5 pb-1 px-0.5">
        {/* Title and Rating Row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-main leading-snug truncate group-hover:text-secondary transition-colors flex-1">
            {book.title}
          </h3>
          <div className="flex items-center gap-0.5 text-xs text-slate-500 shrink-0 mt-0.5">
            <span className="font-semibold">{book.sellerRating?.toFixed(1) || '4.0'}</span>
            <Star className="fill-amber-400 text-amber-400" size={11} />
          </div>
        </div>

        {/* Author */}
        <p className="text-xs text-slate-500 font-normal mt-0.5 truncate">
          {book.author}
        </p>

        {/* Location Tag */}
        {book.location && (
          <div className="flex items-center gap-1 text-[11px] text-main/55 mt-1 truncate">
            <MapPin size={11} className="text-secondary shrink-0" />
            <span className="truncate">{book.location}</span>
          </div>
        )}

        {/* Price and Cart Row */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-main">
              {formatPrice(book.price)}
            </span>
            {book.originalPriceOfNew != null && book.originalPriceOfNew > 0 && book.originalPriceOfNew !== book.price && (
              <span className="text-[10px] text-main/40 line-through">
                {formatPrice(book.originalPriceOfNew)}
              </span>
            )}
          </div>
          <button
            className="w-8 h-8 rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-colors duration-300 flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addToCart(book.id)
            }}
          >
            <ShoppingCart size={13} />
          </button>
        </div>
      </div>
    </Link>
  )
}

export { StarRating }
export default BookCard
