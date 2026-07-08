import { MapPin, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/utils'
import type { Book } from '../data/mockData'

interface DiscoverBookCardProps {
  book: Book
}

export default function BookCard({ book }: DiscoverBookCardProps) {
  const { addToCart } = useCart()

  return (
    <Link
      to={`/books/${book.id}`}
      className="block bg-white rounded-2xl border border-third overflow-hidden"
    >
      {/* Cover */}
      <div className="p-4 pb-0">
        <div className="aspect-square rounded-xl overflow-hidden bg-[#f5f5f3]">
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ backgroundColor: book.coverColor }}
            />
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 pt-3">
        <h3 className="font-heading font-bold text-main text-base leading-snug truncate">
          {book.title}
        </h3>
        <p className="text-main/50 text-sm mt-0.5 truncate">{book.author}</p>

        <p className="text-main font-semibold text-sm mt-3 line-through decoration-main/40">
          {formatPrice(book.price)}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-main/45 min-w-0">
            <MapPin size={13} className="shrink-0 text-red-400" />
            <span className="text-xs truncate">{book.location}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addToCart(book.id)
            }}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-white hover:bg-secondary/90 transition-colors shrink-0"
            aria-label={`Add ${book.title} to cart`}
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </Link>
  )
}