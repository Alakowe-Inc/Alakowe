import { Star, X, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import type { Book } from '../data/mockData'
import { useCart } from '../context/CartContext'

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
          <BookCover color={book.coverColor} scale={1.9} />
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
          <p className="text-base sm:text-lg font-semibold text-main mt-1">₦{book.price.toLocaleString()}</p>

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
            className="mt-5 sm:mt-6 w-full bg-secondary text-white font-semibold py-3 rounded-md text-sm tracking-wide hover:bg-secondary/90 transition-colors"
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
  const [hovered, setHovered] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const { addToCart } = useCart()

  return (
    <>
      <Link
        to={`/books/${book.id}`}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image / Cover area */}
        <div className="relative overflow-hidden bg-[#f5f5f3]" style={{ aspectRatio: '4/4' }}>
          {/* Badge */}
          {book.badge && (
            <span
              className={`absolute top-3 left-3 z-10 text-[10px] font-semibold tracking-widest rounded-full uppercase px-2.5 py-1 ${book.badge === 'Best Value'
                  ? 'bg-secondary/80 text-main'
                  : 'bg-main text-white'
                }`}
            >
              {book.badge}
            </span>
          )}

          {/* Book cover visual */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="transition-transform duration-500 group-hover:scale-105">
              <BookCover color={book.coverColor} />
            </div>
          </div>

          {/* Quick View overlay */}
          <button
            className={`absolute cursor-pointer bottom-0 left-0 right-0 bg-secondary py-3.5 text-center text-[11px] font-semibold tracking-widest uppercase text-white transition-all duration-300 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addToCart(book.id)
            }}
          >
            Add to Cart
          </button>
        </div>

        {/* Info */}
        <div className="pt-3 pb-1">
          <p className="text-[10px] tracking-widest uppercase text-main/50 font-medium truncate">
            {book.author}
          </p>
          <h3 className="text-[13px] font-semibold uppercase tracking-wide text-main leading-snug mt-0.5 line-clamp-2 group-hover:text-secondary transition-colors">
            {book.title}
          </h3>
          <p className="text-[13px] text-main mt-1">₦{book.price.toLocaleString()}</p>
          <div className="mt-1.5">
            <StarRating rating={book.sellerRating} />
          </div>
        </div>
      </Link>

      {showModal && <QuickViewModal book={book} onClose={() => setShowModal(false)} />}
    </>
  )
}

export default BookCard
