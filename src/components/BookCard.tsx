import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Book } from '../data/mockData'

interface BookCardProps {
  book: Book
}

function BookCard({ book }: BookCardProps) {
  return (
    <Link to={`/books/${book.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-third hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
        {/* Cover */}
        <div
          className="relative h-52 flex items-center justify-center"
          style={{ backgroundColor: book.coverColor + '18' }}
        >
          {book.badge && (
            <span
              className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
                book.badge === 'Best Value'
                  ? 'bg-secondary/30 text-main'
                  : 'bg-main text-white'
              }`}
            >
              {book.badge}
            </span>
          )}
          <div
            className="w-24 h-36 rounded-lg shadow-lg flex items-end justify-center pb-3"
            style={{ backgroundColor: book.coverColor }}
          >
            <div className="w-16 h-px bg-white/40 rounded" />
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-main/50 font-medium mb-1 truncate">{book.author}</p>
          <h3 className="font-heading font-semibold text-main text-sm leading-snug mb-3 group-hover:text-secondary transition-colors line-clamp-2 min-h-[2.5rem]">
            {book.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-main/40 min-w-0">
              <MapPin size={11} className="shrink-0" />
              <span className="text-xs truncate">{book.location}</span>
            </div>
            <span className="font-heading font-bold text-main text-sm shrink-0 ml-2">
              ₦{book.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BookCard
