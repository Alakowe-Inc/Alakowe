import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, MapPin, Star, ShoppingBag, ShieldCheck } from 'lucide-react'
import { books } from '../../data/mockData'
import { useCart } from '../../context/CartContext'
import { Button } from '@/components/ui/button'
import book1 from '../../assets/media/images/book-1.jpg'
import book2 from '../../assets/media/images/book-2.jpg'
import book3 from '../../assets/media/images/book-3.jpg'
import book4 from '../../assets/media/images/book-4.jpg'

const bookImagePool = [book1, book2, book3, book4]

function getBookImages(bookId: string): string[] {
  const start = (parseInt(bookId, 10) - 1) % bookImagePool.length
  return [0, 1, 2, 3].map(i => bookImagePool[(start + i) % bookImagePool.length])
}

function BookDetail() {
  const { slug } = useParams()
  const book = books.find(b => b.slug === slug)
  const { addToCart } = useCart()
  const [activeIdx, setActiveIdx] = useState(0)

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

  const finalPrice =
    (book.discount ?? 0) > 0
      ? Math.round(book.price * (1 - (book.discount ?? 0) / 100))
      : book.price

  const hasDiscount = (book.discount ?? 0) > 0
  const images = getBookImages(book.id)

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-12">

        {/* Back link */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-sm text-main/40 hover:text-main mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={14} /> Browse
        </Link>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* LEFT — Images */}
          <div className="flex flex-col gap-2">
            <div className="relative aspect-[4/3] overflow-hidden bg-third">
              <img
                key={activeIdx}
                src={images[activeIdx]}
                alt={book.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {hasDiscount && (
                <span className="absolute top-3 left-3 bg-main text-white text-[10px] font-semibold px-2.5 py-1 tracking-widest uppercase">
                  {book.discount}% off
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`w-14 h-14 shrink-0 overflow-hidden border-2 transition-all duration-150 ${i === activeIdx ? 'border-main' : 'border-transparent opacity-40 hover:opacity-70'
                    }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — Purchase panel */}
          <div className="lg:sticky lg:top-24">
            <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-secondary mb-3">
              {book.genre}
            </p>

            <h1 className="font-heading font-bold text-main text-2xl md:text-3xl leading-tight mb-1">
              {book.title}
            </h1>

            <p className="text-sm text-main/50 mb-6">
              by {book.author}
            </p>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2.5">
                <span className="font-heading font-bold text-main text-3xl">
                  &#8358;{finalPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-main/30 line-through">
                    &#8358;{book.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={() => addToCart(book.id)}
              className="w-full gap-2 bg-main text-white text-sm font-semibold h-auto py-3.5 tracking-wide hover:bg-main/90 rounded-xl mb-3"
            >
              <ShoppingBag size={15} />
              Add to Cart
            </Button>

            <p className="flex items-center gap-1.5 text-xs text-main/30 mb-8">
              <ShieldCheck size={12} className="shrink-0" />
              Secure checkout · Buyer protection included
            </p>

            {/* Divider */}
            <div className="border-t border-main/8 pt-6 space-y-4">

              {/* Condition */}
              <div className="flex justify-between text-sm">
                <span className="text-main/40">Condition</span>
                <span className="font-medium text-main">{book.condition}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-main/40">Format</span>
                <span className="font-medium text-main">{book.format}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-main/40">Ships from</span>
                <span className="font-medium text-main flex items-center gap-1">
                  <MapPin size={11} className="text-main/30" />{book.location}
                </span>
              </div>
            </div>

            {/* Seller */}
            <div className="border-t border-main/8 mt-6 pt-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-third flex items-center justify-center text-xs font-semibold text-main shrink-0">
                  {(book.sellerUsername ?? book.sellerName)[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-main">{book.sellerUsername ?? book.sellerName}</p>
                  <div className="flex items-center gap-1">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-main/40">{book.sellerRating}</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-main/30 font-semibold">Seller</span>
            </div>
          </div>
        </div>

        {/* Bottom — Description + notes */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 border-t border-main/8 pt-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-main/30 mb-4">About this book</p>
            <p className="text-sm text-main/60 leading-relaxed mb-6">{book.description}</p>
            {book.conditionNotes && (
              <>
                <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-main/30 mb-2">Condition notes</p>
                <p className="text-sm text-main/60 leading-relaxed">{book.conditionNotes}</p>
              </>
            )}
          </div>

          {book.loveNote && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-main/30 mb-4">A note from the seller</p>
              <p className="text-sm text-main/55 italic leading-relaxed">&ldquo;{book.loveNote}&rdquo;</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default BookDetail