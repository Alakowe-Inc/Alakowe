import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Star, ShoppingBag } from 'lucide-react'
import { books } from '../data/mockData'

const conditionStyle: Record<string, string> = {
  'Very Good': 'bg-green-100 text-green-700',
  'Good': 'bg-blue-100 text-blue-700',
  'Average': 'bg-yellow-100 text-yellow-700',
  'Below Average': 'bg-red-100 text-red-700',
}

function BookDetail() {
  const { id } = useParams()
  const book = books.find(b => b.id === id)

  if (!book) {
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

  return (
    <div className="min-h-screen bg-third">
      <div className="max-w-8xl mx-auto px-4 md:px-12 py-8">

        {/* Back link */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* Left — book cover */}
          <div>
            <div
              className="rounded-3xl h-72 md:h-[480px] flex items-center justify-center shadow-inner"
              style={{ backgroundColor: book.coverColor + '20' }}
            >
              <div
                className="w-36 h-52 md:w-44 md:h-64 rounded-md shadow-2xl flex items-end justify-center pb-4"
                style={{ backgroundColor: book.coverColor }}
              >
                <div className="w-28 h-px bg-white/40 rounded" />
              </div>
            </div>
          </div>

          {/* Right — details */}
          <div className="flex flex-col">

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="text-xs font-semibold text-secondary bg-secondary/15 px-3 py-1 rounded-full">
                {book.genre}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${conditionStyle[book.condition]}`}>
                {book.condition}
              </span>
            </div>

            <h1 className="font-heading font-bold text-main text-3xl md:text-4xl leading-tight mb-2">
              {book.title}
            </h1>
            <p className="text-main/55 text-lg mb-6">by {book.author}</p>

            <p className="text-main/65 text-sm leading-relaxed mb-8">{book.description}</p>

            {/* Seller card */}
            <div className="bg-white rounded-2xl border border-third p-5 mb-5">
              <p className="text-xs uppercase tracking-widest font-semibold text-main/40 mb-3">
                Sold by
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/25 flex items-center justify-center font-heading font-bold text-main text-sm shrink-0">
                  {book.sellerName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-main text-sm">{book.sellerName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={11} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-main/55">{book.sellerRating} rating</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-main/45 shrink-0">
                  <MapPin size={13} />
                  <span className="text-xs">{book.location}</span>
                </div>
              </div>
            </div>

            {/* Love note */}
            <div className="bg-secondary/10 border border-secondary/25 rounded-2xl p-5 mb-8">
              <p className="text-xs uppercase tracking-widest font-semibold text-secondary mb-2">
                A note from the seller
              </p>
              <p className="text-main/65 text-sm italic leading-relaxed">"{book.loveNote}"</p>
            </div>

            {/* Price + CTA */}
            <div className="flex items-center justify-between mt-auto">
              <div>
                <p className="text-xs text-main/45 mb-1">Price</p>
                <p className="font-heading font-bold text-main text-3xl">
                  ₦{book.price.toLocaleString()}
                </p>
              </div>
              <button className="flex items-center gap-2 bg-main text-white font-semibold px-8 py-4 rounded-md hover:bg-main/90 transition-colors text-sm">
                <ShoppingBag size={17} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail
