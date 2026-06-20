import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, Shield, Clock } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useStartCheckout, useCompleteCheckout } from '../../lib/api/checkout/checkout.hooks'
import { useValidateCart } from '../../lib/api/cart/cart.hooks'
import {
  useCreateShippingAddress,
  useShippingAddresses,
} from '../../lib/api/shipping-addresses/shipping-addresses.hooks'
import { useAreasByState, useStates } from '../../lib/api/location/location.hooks'

type ContactFormState = {
  fullName: string
  email: string
  phone: string
}

type AddressMode = 'saved' | 'new'

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

const selectClass = (hasError?: boolean) =>
  `${inputClass(hasError)} bg-white`

function Checkout() {
  const { items, removeFromCart } = useCart()
  const startCheckout = useStartCheckout()
  const completeCheckout = useCompleteCheckout()
  const validateCart = useValidateCart()
  const navigate = useNavigate()

  // Shipping address data
  const { data: savedAddresses } = useShippingAddresses()
  const createShippingAddress = useCreateShippingAddress()

  const statesQuery = useStates()
  const [addressMode, setAddressMode] = useState<AddressMode>('saved')
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<number | ''>('')
  const [newStateId, setNewStateId] = useState<number | ''>('')
  const [newAreaId, setNewAreaId] = useState<number | ''>('')
  const [newAddressLine, setNewAddressLine] = useState<string>('')

  const areasQuery = useAreasByState(typeof newStateId === 'number' ? newStateId : undefined)

  // Contact data
  const [contactForm, setContactForm] = useState<ContactFormState>({
    fullName: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Partial<ContactFormState>>({})
  const [loading, setLoading] = useState(false)

  // Cart validation gate (Phase 2)
  const [validationLoading, setValidationLoading] = useState(false)
  const [validationDone, setValidationDone] = useState(false)
  const [validationAttempt, setValidationAttempt] = useState(0)

  const itemSignature = useMemo(
    () => items.map((i) => `${i.listingId}:${i.quantity}`).sort().join('|'),
    [items]
  )

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const deliveryFee = 1500
  const total = subtotal + deliveryFee

  if (items.length === 0) {
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

  function setContact(field: keyof ContactFormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setContactForm((p) => ({ ...p, [field]: e.target.value }))
  }

  function validate(): Partial<ContactFormState> {
    const e: Partial<ContactFormState> = {}
    if (!contactForm.fullName.trim()) e.fullName = 'Full name is required'
    if (!contactForm.email.trim() || !/\S+@\S+\.\S+/.test(contactForm.email))
      e.email = 'Valid email is required'
    if (!contactForm.phone.trim() || contactForm.phone.replace(/\D/g, '').length < 10)
      e.phone = 'Valid phone number is required'
    return e
  }

  useEffect(() => {
    let cancelled = false

    async function runValidation() {
      if (items.length === 0) return
      if (validationLoading) return
      if (validationAttempt > 1) return

      setValidationLoading(true)
      setValidationDone(false)

      try {
        const result = await validateCart.mutateAsync()
        if (cancelled) return

        if (!result?.isValid) {
          const issues = result?.issues ?? []
          const invalidListingIds = Array.from(
            new Set(
              issues
                .map((i) => i.listingId)
                .filter((id): id is number => typeof id === 'number')
            )
          )

          await Promise.all(invalidListingIds.map((listingId) => removeFromCart(listingId)))
          setValidationAttempt((a) => a + 1)
        } else {
          setValidationDone(true)
        }
      } catch {
        setValidationDone(false)
      } finally {
        if (!cancelled) setValidationLoading(false)
      }
    }

    if (!validationDone || validationAttempt === 0) {
      setValidationAttempt(0)
    }

    runValidation()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemSignature])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setErrors({})
    setLoading(true)

    try {
      let shippingAddressId: number | undefined

      if (addressMode === 'saved') {
        shippingAddressId =
          typeof selectedShippingAddressId === 'number' ? selectedShippingAddressId : undefined
      } else {
        if (
          typeof newStateId !== 'number' ||
          typeof newAreaId !== 'number' ||
          !newAddressLine.trim()
        ) {
          // Use contact errors object for now; keep UI changes minimal
          setErrors({
            fullName: undefined,
            email: undefined,
            phone: undefined,
          })
          return
        }

        const created = await createShippingAddress.mutateAsync({
          label: `${contactForm.fullName.split(' ')[0] || 'Delivery'}`,
          stateId: newStateId,
          areaId: newAreaId,
          addressLine: newAddressLine,
          isDefault: true,
        })

        shippingAddressId = created?.id
      }

      if (!shippingAddressId) {
        navigate('/payment/error')
        return
      }

      const session = await startCheckout.mutateAsync({
        shippingAddressId,
        shippingStateId: typeof newStateId === 'number' ? newStateId : null,
        shippingAreaId: typeof newAreaId === 'number' ? newAreaId : null,
        shippingAddress: addressMode === 'new' ? newAddressLine : null,
      })

      const order = await completeCheckout.mutateAsync(session.sessionId ?? '')
      navigate(`/payment/success?orderId=${order.orderId}`)
    } catch {
      navigate('/payment/error')
    } finally {
      setLoading(false)
    }
  }

  const savedOptions = savedAddresses ?? []

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
            {/* Left */}
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
                        value={contactForm.fullName}
                        onChange={setContact('fullName')}
                        className={inputClass(!!errors.fullName)}
                      />
                    </Field>
                  </div>

                  <Field label="Email Address" error={errors.email}>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={contactForm.email}
                      onChange={setContact('email')}
                      className={inputClass(!!errors.email)}
                    />
                  </Field>

                  <Field label="Phone Number" error={errors.phone}>
                    <input
                      type="tel"
                      placeholder="080XXXXXXXX"
                      value={contactForm.phone}
                      onChange={setContact('phone')}
                      className={inputClass(!!errors.phone)}
                    />
                  </Field>

                  {/* Shipping address selector */}
                  <div className="sm:col-span-2">
                    <div className="mt-1 flex flex-col gap-3">
                      <p className="text-sm font-semibold text-main">Shipping address</p>

                      <div className="flex items-center gap-4 flex-wrap">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="addressMode"
                            checked={addressMode === 'saved'}
                            onChange={() => setAddressMode('saved')}
                          />
                          Use saved address
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="addressMode"
                            checked={addressMode === 'new'}
                            onChange={() => setAddressMode('new')}
                          />
                          Enter a new address
                        </label>
                      </div>

                      {addressMode === 'saved' ? (
                        <Field label="Choose address">
                          <select
                            value={selectedShippingAddressId}
                            onChange={(e) =>
                              setSelectedShippingAddressId(
                                e.target.value === '' ? '' : Number(e.target.value)
                              )
                            }
                            className={selectClass(false)}
                          >
                            <option value="" disabled>
                              Select shipping address
                            </option>
                            {savedOptions.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.label ?? 'Address'}
                                {a.stateName ? ` (${a.stateName})` : ''}
                              </option>
                            ))}
                          </select>
                        </Field>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="State">
                            <select
                              value={newStateId}
                              onChange={(e) =>
                                setNewStateId(e.target.value === '' ? '' : Number(e.target.value))
                              }
                              className={selectClass(false)}
                            >
                              <option value="" disabled>
                                Select state
                              </option>
                              {(statesQuery.data ?? []).map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </Field>

                          <Field label="Area">
                            <select
                              value={newAreaId}
                              onChange={(e) =>
                                setNewAreaId(e.target.value === '' ? '' : Number(e.target.value))
                              }
                              className={selectClass(false)}
                              disabled={typeof newStateId !== 'number'}
                            >
                              <option value="" disabled>
                                Select area
                              </option>
                              {(areasQuery.data ?? []).map((a) => (
                                <option key={a.id} value={a.id}>
                                  {a.name}
                                </option>
                              ))}
                            </select>
                          </Field>

                          <div className="sm:col-span-2">
                            <Field label="Address line">
                              <input
                                type="text"
                                placeholder="e.g. 12 Broad Street, Flat 3"
                                value={newAddressLine}
                                onChange={(e) => setNewAddressLine(e.target.value)}
                                className={inputClass(false)}
                              />
                            </Field>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* How delivery works */}
              <div className="bg-white rounded-2xl border border-third p-6">
                <h2 className="font-heading font-bold text-main text-lg mb-5">
                  How Delivery Works
                </h2>
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
                  Your payment is held securely in escrow and only released to the seller after you
                  confirm delivery.
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-third p-6 lg:sticky lg:top-24">
                <h2 className="font-heading font-bold text-main text-lg mb-5">Order Summary</h2>

                <div className="flex flex-col gap-3 mb-5">
                  {items.map((item) => (
                    <div key={item.listingId} className="flex items-center gap-3">
                      <div
                        className="w-8 h-12 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: item.coverColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-main truncate leading-snug">
                          {item.title}
                        </p>
                        <p className="text-xs text-main/45">
                          {item.author}
                          {item.quantity > 1 && ` ×${item.quantity}`}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-main shrink-0">
                        ₦{(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-third pt-4 flex flex-col gap-2.5 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-main/55">Subtotal</span>
                    <span className="font-medium text-main">
                      ₦{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-main/55">Delivery</span>
                    <span className="font-medium text-main">
                      ₦{deliveryFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold mt-1">
                    <span className="text-main">Total</span>
                    <span className="text-main">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || validationLoading || !validationDone}
                  className="w-full bg-main text-white font-semibold py-4 rounded-full hover:bg-main/90 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading
                    ? 'Processing…'
                    : validationLoading
                      ? 'Validating cart…'
                      : !validationDone
                        ? 'Validating cart…'
                        : `Place Order · ₦${total.toLocaleString()}`}
                </button>

                <p className="text-xs text-main/35 text-center mt-3 leading-relaxed">
                  By placing this order you agree to our{' '}
                  <Link to="/faq" className="underline hover:text-main/60 transition-colors">
                    Terms &amp; Conditions
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
