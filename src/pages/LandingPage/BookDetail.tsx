import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { getListingById } from '@/services/listings.service'
import { isMockMode } from '@/lib/utils'
import { books as mockBooks } from '../../data/mockData'
import type { ListingResponse } from '@/lib/api-types'

function BookDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()

  const [listing, setListing] = useState<ListingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    if (isMockMode()) {
      const book = mockBooks.find(b => b.id === id)
      if (book) {
        setListing({
          id: Number(book.id),
          title: book.title,
          isbn: null,
          description: book.description,
          loveNote: book.loveNote,
          price: book.price,
          quantity: 1,
          bookCondition: 'Good' as const,
          coverImageFileName: null,
          imageFileNames: null,
          author: book.author,
          categoryId: 0,
          isPublished: true,
          isSoldOut: false,
          status: 'Published',
          categoryName: book.genre,
          createdBy: book.sellerName,
          dateCreated: null,
          dateModified: null,
          cartItemCount: 0,
          wishlistItemCount: 0,
        })
      }
      setLoading(false)
      return
    }
    setLoading(true)
    getListingById(Number(id))
      .then(setListing)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const onChangeQuantity = (delta: number) => {
    if (!listing) return
    const q = Math.max(1, listing.quantity + delta)
    setListing({ ...listing, quantity: q })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-third flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-third">
        <div className="text-center">
          <p className="font-heading font-bold text-main text-2xl mb-3">
            {error ? 'Something went wrong' : 'Book not found'}
          </p>
          <p className="text-sm text-main/50 mb-4">{error}</p>
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

        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-10 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          <div className="rounded-lg h-72 md:h-120 bg-secondary/10 flex items-center justify-center border border-third">
            <div className="w-36 h-52 md:w-44 md:h-64 rounded-lg shadow-2xl bg-secondary/20 flex items-end justify-center pb-4">
              <div className="w-28 h-px bg-white/40 rounded" />
            </div>
          </div>

          <div className="flex flex-col">

            <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              {listing.categoryName || 'General'}
            </p>

            <h1 className="font-heading font-bold text-main text-3xl md:text-4xl leading-tight mb-2">
              {listing.title}
            </h1>
            <p className="text-main/55 text-base mb-4">by {listing.author}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-main/40 w-full mb-1">Condition</p>
              <span className="text-xs font-medium text-main/60 bg-main/8 border border-main/12 px-3 py-1 rounded-full">
                {listing.bookCondition}
              </span>
            </div>

            <p className="text-main/65 text-sm leading-relaxed mb-8">{listing.description}</p>

            {listing.loveNote && (
              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-5 mb-8">
                <p className="text-xs uppercase tracking-widest font-semibold text-secondary mb-2">
                  A note from the seller
                </p>
                <p className="text-main/65 text-sm italic leading-relaxed">"{listing.loveNote}"</p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-1">Price</p>
                <p className="font-heading font-bold text-main text-3xl">
                  ₦{listing.price.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onChangeQuantity(-1)}
                    disabled={listing.quantity <= 1}
                    className="w-8 h-8 rounded-full border border-main/20 flex items-center justify-center text-main hover:border-main/50 transition-colors disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{listing.quantity}</span>
                  <button
                    onClick={() => onChangeQuantity(1)}
                    className="w-8 h-8 rounded-full border border-main/20 flex items-center justify-center text-main hover:border-main/50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => addToCart(listing.id, listing.quantity)}
                  className="inline-flex items-center gap-2 bg-main text-white font-semibold px-7 py-3.5 rounded-full hover:bg-main/90 transition-colors text-sm"
                >
                  <ShoppingBag size={17} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail
