import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, Shield, Clock } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { books } from '../../data/mockData'
import { saveOrder, generateOrderId } from '../../data/orderData'
import type { Order, OrderItem } from '../../data/orderData'

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

type FormState = {
  fullName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-main/50 uppercase tracking-wider mb-1.5 block">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

const inputClass = (hasError?: boolean) =>
  `w-full border rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus:border-secondary transition-colors bg-white ${
    hasError ? 'border-red-400' : 'border-main/15'
  }`

function Checkout() {
  const { items, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
  })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [loading, setLoading] = useState(false)

  const cartBooks = items
    .map(item => ({ ...item, book: books.find(b => b.id === item.bookId)! }))
    .filter(item => item.book)

  const subtotal = cartBooks.reduce((sum, { book, quantity }) => sum + book.price * quantity, 0)
  const deliveryFee = 1500
  const total = subtotal + deliveryFee

  if (cartBooks.length === 0) {
    return (
      <div className="bg-third min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-main/60 text-sm mb-4">Your cart is empty.</p>
          <Link to="/browse" className="text-secondary font-semibold text-sm hover:underline">
            Browse Books
          </Link>
        </div>
      </div>
    )
  }

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }))
  }

  function validate(): Partial<FormState> {
    const e: Partial<FormState> = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Valid email is required'
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10)
      e.phone = 'Valid phone number is required'
    if (!form.street.trim()) e.street = 'Street address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.state) e.state = 'Please select a state'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)

    const orderItems: OrderItem[] = cartBooks.map(({ book, quantity }) => ({
      bookId: book.id,
      title: book.title,
      author: book.author,
      coverColor: book.coverColor,
      price: book.price,
      quantity,
      condition: book.condition,
      sellerName: book.sellerName,
    }))

    const order: Order = {
      id: generateOrderId(),
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      status: 'payment_received',
      customerName: form.fullName,
      customerEmail: form.email,
      customerPhone: form.phone,
      deliveryAddress: { street: form.street, city: form.city, state: form.state },
      createdAt: new Date().toISOString(),
    }

    setTimeout(() => {
      saveOrder(order)
      clearCart()
      navigate(`/payment/success?orderId=${order.id}`)
    }, 1800)
  }

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 py-10">

        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> Back to Cart
        </Link>

        <h1 className="font-heading font-bold text-main text-3xl mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: form fields ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Delivery details */}
              <div className="bg-white rounded-2xl border border-third p-6">
                <h2 className="font-heading font-bold text-main text-lg mb-5">Delivery Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Field label="Full Name" error={errors.fullName}>
                      <input
                        type="text"
                        placeholder="e.g. Amaka Okonkwo"
                        value={form.fullName}
                        onChange={set('fullName')}
                        className={inputClass(!!errors.fullName)}
                      />
                    </Field>
                  </div>
                  <Field label="Email Address" error={errors.email}>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={set('email')}
                      className={inputClass(!!errors.email)}
                    />
                  </Field>
                  <Field label="Phone Number" error={errors.phone}>
                    <input
                      type="tel"
                      placeholder="080XXXXXXXX"
                      value={form.phone}
                      onChange={set('phone')}
                      className={inputClass(!!errors.phone)}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Street Address" error={errors.street}>
                      <input
                        type="text"
                        placeholder="e.g. 12 Broad Street, Flat 3"
                        value={form.street}
                        onChange={set('street')}
                        className={inputClass(!!errors.street)}
                      />
                    </Field>
                  </div>
                  <Field label="City" error={errors.city}>
                    <input
                      type="text"
                      placeholder="e.g. Lagos"
                      value={form.city}
                      onChange={set('city')}
                      className={inputClass(!!errors.city)}
                    />
                  </Field>
                  <Field label="State" error={errors.state}>
                    <select
                      value={form.state}
                      onChange={set('state')}
                      className={`${inputClass(!!errors.state)} ${!form.state ? 'text-main/30' : 'text-main'}`}
                    >
                      <option value="" disabled>Select state</option>
                      {NIGERIAN_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>

              {/* How delivery works */}
              <div className="bg-white rounded-2xl border border-third p-6">
                <h2 className="font-heading font-bold text-main text-lg mb-5">How Delivery Works</h2>
                <div className="flex flex-col gap-5">
                  {([
                    {
                      Icon: Package,
                      label: 'Seller drops off',
                      desc: 'The seller brings your book to our nearest collection centre within 48 hours.',
                    },
                    {
                      Icon: Shield,
                      label: 'We inspect & process',
                      desc: 'Our team checks the book quality and prepares your order for dispatch.',
                    },
                    {
                      Icon: Clock,
                      label: 'We deliver to you',
                      desc: 'Your book is on its way. Estimated delivery: 3–7 business days.',
                    },
                  ] as const).map(({ Icon, label, desc }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-secondary" />
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-main text-sm">{label}</p>
                        <p className="text-main/50 text-xs mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-2xl border border-third p-6">
                <h2 className="font-heading font-bold text-main text-lg mb-5">Payment Method</h2>
                <div className="flex items-center gap-3 border border-secondary/40 bg-secondary/5 rounded-xl px-4 py-3.5">
                  <div className="w-4 h-4 rounded-full border-2 border-secondary flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <span className="text-sm font-semibold text-main">Card / Bank Transfer</span>
                  <span className="ml-auto text-xs text-main/40 font-medium">via Paystack</span>
                </div>
                <p className="text-xs text-main/40 mt-3 leading-relaxed">
                  Your payment is held securely in escrow and only released to the seller after you confirm delivery.
                </p>
              </div>

            </div>

            {/* ── Right: order summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-third p-6 lg:sticky lg:top-24">
                <h2 className="font-heading font-bold text-main text-lg mb-5">Order Summary</h2>

                <div className="flex flex-col gap-3 mb-5">
                  {cartBooks.map(({ book, quantity }) => (
                    <div key={book.id} className="flex items-center gap-3">
                      <div
                        className="w-8 h-12 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: book.coverColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-main truncate leading-snug">{book.title}</p>
                        <p className="text-xs text-main/45">
                          {book.author}{quantity > 1 && ` ×${quantity}`}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-main shrink-0">
                        ₦{(book.price * quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-third pt-4 flex flex-col gap-2.5 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-main/55">Subtotal</span>
                    <span className="font-medium text-main">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-main/55">Delivery</span>
                    <span className="font-medium text-main">₦{deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold mt-1">
                    <span className="text-main">Total</span>
                    <span className="text-main">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-main text-white font-semibold py-4 rounded-full hover:bg-main/90 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Securing your payment…' : `Place Order · ₦${total.toLocaleString()}`}
                </button>

                <p className="text-xs text-main/35 text-center mt-3 leading-relaxed">
                  By placing this order you agree to our{' '}
                  <Link to="/faq" className="underline hover:text-main/60 transition-colors">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
