import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { books } from '../../data/mockData'

function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart()

  const cartBooks = items.map(item => ({
    ...item,
    book: books.find(b => b.id === item.bookId)!,
  })).filter(item => item.book)

  const subtotal = cartBooks.reduce((sum, { book, quantity }) => sum + book.price * quantity, 0)

  if (cartBooks.length === 0) {
    return (
      <div className="bg-third min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-main/8 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-main/40" />
          </div>
          <h2 className="font-heading font-bold text-main text-2xl mb-2">Your cart is empty</h2>
          <p className="text-main/55 text-sm mb-8">
            Browse our collection and add books you love.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 bg-main text-white font-semibold px-6 py-3 rounded-full hover:bg-main/90 transition-colors text-sm"
          >
            Browse Books
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 py-10">

        {/* Header */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> Back to Browse
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading font-bold text-main text-3xl">Your Cart</h1>
          <button
            onClick={clearCart}
            className="text-xs text-main/45 hover:text-main/70 transition-colors font-medium underline underline-offset-2"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartBooks.map(({ book, quantity }) => (
              <div
                key={book.id}
                className="bg-white rounded-lg border border-third p-5 flex gap-5"
              >
                {/* Book cover */}
                <Link to={`/books/${book.id}`} className="shrink-0">
                  <div
                    className="w-16 h-24 rounded-full shadow-md flex items-end justify-center pb-2"
                    style={{ backgroundColor: book.coverColor }}
                  >
                    <div className="w-10 h-px bg-white/40 rounded" />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <Link to={`/books/${book.id}`} className="hover:underline">
                      <p className="font-heading font-bold text-main text-base leading-snug">
                        {book.title}
                      </p>
                    </Link>
                    <button
                      onClick={() => removeFromCart(book.id)}
                      aria-label="Remove"
                      className="text-main cursor-pointer hover:text-red-600 transition-colors shrink-0 mt-0.5"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <p className="text-main/50 text-sm mb-1">by {book.author}</p>

                  <span className="text-xs font-medium text-main/50 bg-main/6 border border-main/10 px-2 py-0.5 rounded-full">
                    {book.condition}
                  </span>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity control */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(book.id, quantity - 1)}
                        disabled={quantity <= 1}
                        className="w-7 h-7 rounded-full border border-main/20 flex items-center justify-center text-main hover:border-main/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold text-main w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(book.id, quantity + 1)}
                        className="w-7 h-7 rounded-full border border-main/20 flex items-center justify-center text-main hover:border-main/50 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Line total */}
                    <p className="font-heading font-bold text-main text-lg">
                      ₦{(book.price * quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-third p-6 sticky top-24">
              <h2 className="font-heading font-bold text-main text-lg mb-6">Order Summary</h2>

              <div className="flex flex-col gap-3 mb-6">
                {cartBooks.map(({ book, quantity }) => (
                  <div key={book.id} className="flex items-center justify-between text-sm">
                    <span className="text-main/60 truncate pr-2">
                      {book.title} {quantity > 1 && <span className="text-main/40">×{quantity}</span>}
                    </span>
                    <span className="text-main font-medium shrink-0">
                      ₦{(book.price * quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-third pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-main/60 uppercase tracking-wider">Subtotal</span>
                  <span className="font-heading font-bold text-main text-xl">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-main/40 mt-2">
                  Delivery fee calculated at checkout
                </p>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-main text-white font-semibold py-3.5 rounded-full hover:bg-main/90 transition-colors text-sm mb-3 text-center"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/browse"
                className="block text-center text-sm text-main/50 hover:text-main transition-colors font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart
