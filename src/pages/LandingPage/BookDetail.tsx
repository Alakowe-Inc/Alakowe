import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Star, ShoppingBag } from 'lucide-react'
import { books } from '../../data/mockData'
import { useCart } from '../../context/CartContext'

function BookDetail() {
  const { id } = useParams()
  const book = books.find(b => b.id === id)
  const { addToCart } = useCart()

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
    <div className="bg-third min-h-screen">
      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 py-10">

        {/* Back link */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-10 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* Left — book cover */}
          <div
            className="rounded-lg h-72 md:h-120 flex items-center justify-center border border-third"
            style={{ backgroundColor: book.coverColor + '18' }}
          >
            <div
              className="w-36 h-52 md:w-44 md:h-64 rounded-lg shadow-2xl flex items-end justify-center pb-4"
              style={{ backgroundColor: book.coverColor }}
            >
              <div className="w-28 h-px bg-white/40 rounded" />
            </div>
          </div>

          {/* Right — details */}
          <div className="flex flex-col">

            {/* Eyebrow */}
            <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              {book.genre}
            </p>

            <h1 className="font-heading font-bold text-main text-3xl md:text-4xl leading-tight mb-2">
              {book.title}
            </h1>
            <p className="text-main/55 text-base mb-4">by {book.author}</p>

            {/* Condition tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-main/40 w-full mb-1">Condition notes</p>
              {book.condition.split(',').map(issue => (
                <span key={issue.trim()} className="text-xs font-medium text-main/60 bg-main/8 border border-main/12 px-3 py-1 rounded-full">
                  {issue.trim()}
                </span>
              ))}
            </div>

            <p className="text-main/65 text-sm leading-relaxed mb-8">{book.description}</p>

            {/* Seller card */}
            <div className="bg-white rounded-lg border border-third p-5 mb-4">
              <p className="text-xs uppercase tracking-widest font-semibold text-secondary mb-3">
                Sold by
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center font-heading font-bold text-main text-sm shrink-0">
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
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-5 mb-8">
              <p className="text-xs uppercase tracking-widest font-semibold text-secondary mb-2">
                A note from the seller
              </p>
              <p className="text-main/65 text-sm italic leading-relaxed">"{book.loveNote}"</p>
            </div>

            {/* Price + CTA */}
            <div className="flex items-center justify-between mt-auto">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-1">Price</p>
                <p className="font-heading font-bold text-main text-3xl">
                  ₦{book.price.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => addToCart(book.id)}
                className="inline-flex items-center gap-2 bg-main text-white font-semibold px-7 py-3.5 rounded-md hover:bg-main/90 transition-colors text-sm"
              >
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
