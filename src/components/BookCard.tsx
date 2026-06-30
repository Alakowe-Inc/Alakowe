import { Star, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Book } from '../data/mockData'
import { useCart } from '../context/CartContext'
import book1 from '../assets/media/images/book-1.jpg'
import book2 from '../assets/media/images/book-2.jpg'
import book3 from '../assets/media/images/book-3.jpg'
import book4 from '../assets/media/images/book-4.jpg'

const bookImages = [book1, book2, book3, book4]

function getBookImage(id: string) {
  const index = (parseInt(id, 10) - 1) % bookImages.length
  return bookImages[Math.max(0, index)]
}

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

function BookCard({ book }: BookCardProps) {
  const [hovered, setHovered] = useState(false)
  const { addToCart } = useCart()

  return (
    <Link
      to={`/books/${book.slug}`}
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

        {/* Book cover image */}
        <img
          src={getBookImage(book.id)}
          alt={book.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Add to cart overlay */}
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
        <div className="flex items-center gap-1 mt-1.5 text-main/45">
          <MapPin size={11} className="shrink-0" />
          <span className="text-[10px] truncate">{book.location}</span>
        </div>
      </div>
    </Link>
  )
}

export { StarRating }
export default BookCard
