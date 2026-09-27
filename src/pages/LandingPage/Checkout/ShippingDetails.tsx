import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import { useCart } from '../../../context/CartContext'
import { useCheckout } from '../../../context/CheckoutContext'
import { useStartCheckout } from '../../../lib/api/checkout/checkout.hooks'
import { useValidateVoucher } from '../../../lib/api/voucher/voucher.hooks'
import { useValidateCart } from '../../../lib/api/cart/cart.hooks'
import {
  useCreateShippingAddress,
  useShippingAddresses,
} from '../../../lib/api/shipping-addresses/shipping-addresses.hooks'
import { useAreasByState, useStates } from '../../../lib/api/location/location.hooks'
import type { CartItemDisplay } from '../../../lib/api/adapters'
import type { OrderFulfillmentType, SellerFulfillmentChoice, StoreFulfillmentOption } from '../../../lib/api/types'
import { FormControl, SelectBoxControl, RadioControl, type SelectOption } from '@/components/ui/form-controls'
import { cn } from '@/lib/utils'

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
  cn(
    'rounded-xl border-gray-200 h-auto py-3 text-[.9rem] text-gray-800 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-secondary',
    hasError && 'border-red-400'
  )

const selectClass = (hasError?: boolean) =>
  cn(
    'w-full rounded-xl border px-4 py-3 text-[.9rem] text-gray-800 outline-none focus:ring-0 focus:border-secondary transition-colors bg-white',
    hasError ? 'border-red-400' : 'border-gray-200'
  )

type ContactErrors = {
  fullName?: string
  email?: string
  phone?: string
}

type SellerGroup = {
  sellerEmail: string
  storeName?: string
  fulfillmentOption: StoreFulfillmentOption
  pickupAddressLine?: string
  pickupCity?: string
  pickupState?: string
  items: CartItemDisplay[]
}

type SellerChoice = {
  fulfillmentType: OrderFulfillmentType
  pickupDates: string[]
}

function formatLocalIsoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function nextSevenDays(): { iso: string; label: string }[] {
  const days: { iso: string; label: string }[] = []
  const now = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
    days.push({
      iso: formatLocalIsoDate(d),
      label: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
    })
  }
  return days
}

function pickupMapsUrl(line?: string, city?: string, state?: string): string | null {
  const query = [line, city, state].filter(Boolean).join(', ')
  if (!query) return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

function defaultTypeForOption(opt: StoreFulfillmentOption): OrderFulfillmentType {
  if (opt === 'Pickup') return 'Pickup'
  return 'Courier'
}

function ShippingDetails() {
  const { items, removeFromCart } = useCart()
  const checkout = useCheckout()
  const startCheckout = useStartCheckout()
  const validateCart = useValidateCart()
  const navigate = useNavigate()

  const { data: savedAddresses } = useShippingAddresses()
  const createShippingAddress = useCreateShippingAddress({ skipSuccessToast: true })
  const validateVoucher = useValidateVoucher()
  const statesQuery = useStates()
  const areasQuery = useAreasByState(
    typeof checkout.newStateId === 'number' ? checkout.newStateId : undefined
  )

  const savedOptions = savedAddresses ?? []
  const dayOptions = useMemo(() => nextSevenDays(), [])

  const [errors, setErrors] = useState<ContactErrors>({})
  const [pickupDateErrors, setPickupDateErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [validationLoading, setValidationLoading] = useState(false)
  const [validationDone, setValidationDone] = useState(false)
  const [validationAttempt, setValidationAttempt] = useState(0)
  const [sellerChoices, setSellerChoices] = useState<Record<string, SellerChoice>>({})
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherMessage, setVoucherMessage] = useState<string | null>(null)
  const [voucherError, setVoucherError] = useState<string | null>(null)
  const [voucherDiscountNaira, setVoucherDiscountNaira] = useState(0)

  const itemSignature = useMemo(
    () => items.map((i) => `${i.listingId}:${i.quantity}`).sort().join('|'),
    [items]
  )

  const sellerGroups = useMemo((): SellerGroup[] => {
    const map = new Map<string, CartItemDisplay[]>()
    for (const item of items) {
      const key = item.sellerEmail?.trim() || 'unknown'
      const list = map.get(key) ?? []
      list.push(item)
      map.set(key, list)
    }
    return Array.from(map.entries()).map(([sellerEmail, groupItems]) => {
      const first = groupItems[0]
      return {
        sellerEmail,
        storeName: first?.storeName,
        fulfillmentOption: first?.fulfillmentOption ?? 'Courier',
        pickupAddressLine: first?.pickupAddressLine,
        pickupCity: first?.pickupCity,
        pickupState: first?.pickupState,
        items: groupItems,
      }
    })
  }, [items])

  useEffect(() => {
    setSellerChoices((prev) => {
      const next: Record<string, SellerChoice> = {}
      for (const g of sellerGroups) {
        const existing = prev[g.sellerEmail]
        const locked = defaultTypeForOption(g.fulfillmentOption)
        if (g.fulfillmentOption === 'Both') {
          next[g.sellerEmail] = {
            fulfillmentType: existing?.fulfillmentType === 'Pickup' ? 'Pickup' : 'Courier',
            pickupDates: existing?.pickupDates ?? [],
          }
        } else {
          next[g.sellerEmail] = {
            fulfillmentType: locked,
            pickupDates: locked === 'Pickup' ? (existing?.pickupDates ?? []) : [],
          }
        }
      }
      return next
    })
  }, [sellerGroups])

  const needsCourier = sellerGroups.some((g) => {
    const choice = sellerChoices[g.sellerEmail]
    const type = choice?.fulfillmentType ?? defaultTypeForOption(g.fulfillmentOption)
    return type === 'Courier'
  })

  const subtotal = items.reduce((sum, item) => sum + item.buyerPrice * item.quantity, 0)

  useEffect(() => {
    let cancelled = false

    async function runValidation() {
      if (items.length === 0) return
      if (validationLoading) return
      if (validationAttempt > 1) return

      checkout.setErrorBanner(null)
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
        checkout.setErrorBanner('Unable to validate your cart right now. Please try again.')
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

  function validate(): ContactErrors {
    const e: ContactErrors = {}
    if (!checkout.contactForm.fullName.trim()) e.fullName = 'Full name is required'
    if (!checkout.contactForm.email.trim() || !/\S+@\S+\.\S+/.test(checkout.contactForm.email))
      e.email = 'Valid email is required'
    if (
      !checkout.contactForm.phone.trim() ||
      checkout.contactForm.phone.replace(/\D/g, '').length < 10
    )
      e.phone = 'Valid phone number is required'
    return e
  }

  function setContact(field: keyof typeof checkout.contactForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      checkout.setContactForm((p) => ({ ...p, [field]: value }))
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev }
          delete next[field]
          return next
        })
      }
    }
  }

  function setChoiceType(sellerEmail: string, fulfillmentType: OrderFulfillmentType) {
    setSellerChoices((prev) => ({
      ...prev,
      [sellerEmail]: {
        fulfillmentType,
        pickupDates: fulfillmentType === 'Pickup' ? (prev[sellerEmail]?.pickupDates ?? []) : [],
      },
    }))
    if (fulfillmentType !== 'Pickup') {
      setPickupDateErrors((prev) => {
        if (!prev[sellerEmail]) return prev
        const next = { ...prev }
        delete next[sellerEmail]
        return next
      })
    }
  }

  function togglePickupDate(sellerEmail: string, iso: string) {
    setSellerChoices((prev) => {
      const current = prev[sellerEmail] ?? { fulfillmentType: 'Pickup' as const, pickupDates: [] }
      const has = current.pickupDates.includes(iso)
      const pickupDates = has
        ? current.pickupDates.filter((d) => d !== iso)
        : [...current.pickupDates, iso]

      return {
        ...prev,
        [sellerEmail]: {
          ...current,
          fulfillmentType: 'Pickup',
          pickupDates,
        },
      }
    })

    setPickupDateErrors((errs) => {
      if (!errs[sellerEmail]) return errs
      const next = { ...errs }
      delete next[sellerEmail]
      return next
    })
    if (checkout.errorBanner?.toLowerCase().includes('pickup day')) {
      checkout.setErrorBanner(null)
    }
  }

  async function handleApplyVoucher() {
    const code = voucherCode.trim()
    if (!code) {
      setVoucherError('Enter a voucher code.')
      setVoucherMessage(null)
      setVoucherDiscountNaira(0)
      return
    }
    setVoucherError(null)
    setVoucherMessage(null)
    try {
      const result = await validateVoucher.mutateAsync({
        voucherCode: code,
        cartSubtotal: Math.round(subtotal * 100),
      })
      setVoucherDiscountNaira(Math.round((result?.discountAmount ?? 0) / 100))
      setVoucherMessage(result?.message ?? 'Voucher applied.')
    } catch {
      setVoucherError('Invalid or expired voucher code.')
      setVoucherDiscountNaira(0)
    }
  }

  async function handleProceed() {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setErrors({})
    checkout.setErrorBanner(null)

    const nextPickupErrors: Record<string, string> = {}
    for (const g of sellerGroups) {
      const choice = sellerChoices[g.sellerEmail]
      const type = choice?.fulfillmentType ?? defaultTypeForOption(g.fulfillmentOption)
      if (type === 'Pickup' && (choice?.pickupDates.length ?? 0) < 1) {
        nextPickupErrors[g.sellerEmail] = 'Select at least one preferred pickup day.'
      }
    }
    setPickupDateErrors(nextPickupErrors)
    if (Object.keys(nextPickupErrors).length > 0) {
      return
    }

    if (needsCourier) {
      if (checkout.addressMode === 'saved') {
        if (typeof checkout.selectedShippingAddressId !== 'number') {
          checkout.setErrorBanner('Shipping address is missing. Please review and try again.')
          return
        }
      } else if (
        typeof checkout.newStateId !== 'number' ||
        typeof checkout.newAreaId !== 'number' ||
        !checkout.newAddressLine.trim()
      ) {
        checkout.setErrorBanner('Shipping address is missing. Please review and try again.')
        return
      }
    }

    setLoading(true)

    try {
      const sellerFulfillments: SellerFulfillmentChoice[] = sellerGroups.map((g) => {
        const choice = sellerChoices[g.sellerEmail]
        const fulfillmentType =
          choice?.fulfillmentType ?? defaultTypeForOption(g.fulfillmentOption)
        return {
          sellerEmail: g.sellerEmail,
          fulfillmentType,
          pickupDates: fulfillmentType === 'Pickup' ? (choice?.pickupDates ?? []) : undefined,
        }
      })

      let shippingAddressId = 0

      if (needsCourier) {
        if (checkout.addressMode === 'saved') {
          shippingAddressId = checkout.selectedShippingAddressId as number
        } else {
          const created = await createShippingAddress.mutateAsync({
            label: `${checkout.contactForm.fullName.split(' ')[0] || 'Delivery'}`,
            stateId: checkout.newStateId as number,
            areaId: checkout.newAreaId as number,
            addressLine: checkout.newAddressLine,
            isDefault: true,
          })
          shippingAddressId = created?.id ?? 0
        }

        if (!shippingAddressId) {
          checkout.setErrorBanner('Shipping address is missing. Please review and try again.')
          return
        }
      }

      const session = await startCheckout.mutateAsync({
        shippingAddressId,
        shippingStateId: needsCourier && typeof checkout.newStateId === 'number' ? checkout.newStateId : null,
        shippingAreaId: needsCourier && typeof checkout.newAreaId === 'number' ? checkout.newAreaId : null,
        shippingAddress:
          needsCourier && checkout.addressMode === 'new' ? checkout.newAddressLine : null,
        cartItemIds: items.map((i) => i.id),
        deliveryFullName: checkout.contactForm.fullName || null,
        deliveryPhoneNumber: checkout.contactForm.phone || null,
        deliveryEmail: checkout.contactForm.email || null,
        voucherCode: voucherCode.trim() ? voucherCode.trim().toUpperCase() : null,
        sellerFulfillments,
      })

      const sessionId = session?.sessionId ?? null
      if (!sessionId || !session) {
        checkout.setErrorBanner('Could not start checkout. Please try again.')
        return
      }

      checkout.setSessionData(sessionId, session)
      navigate('/checkout/summary')
    } catch {
      checkout.setErrorBanner('Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-third p-6">
              <h2 className="font-heading font-bold text-main text-lg mb-5">Contact</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Full Name" error={errors.fullName}>
                    <FormControl
                      type="text"
                      placeholder="e.g. Amaka Okonkwo"
                      value={checkout.contactForm.fullName}
                      onChange={setContact('fullName')}
                      style={inputClass(!!errors.fullName)}
                    />
                  </Field>
                </div>

                <Field label="Email Address" error={errors.email}>
                  <FormControl
                    type="email"
                    placeholder="you@example.com"
                    value={checkout.contactForm.email}
                    onChange={setContact('email')}
                    style={inputClass(!!errors.email)}
                  />
                </Field>

                <Field label="Phone Number" error={errors.phone}>
                  <FormControl
                    type="tel"
                    placeholder="080XXXXXXXX"
                    value={checkout.contactForm.phone}
                    onChange={setContact('phone')}
                    style={inputClass(!!errors.phone)}
                  />
                </Field>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-third p-6">
              <h2 className="font-heading font-bold text-main text-lg mb-5">Fulfillment</h2>
              <div className="flex flex-col gap-4">
                {sellerGroups.map((g) => {
                  const choice = sellerChoices[g.sellerEmail]
                  const type =
                    choice?.fulfillmentType ?? defaultTypeForOption(g.fulfillmentOption)
                  const mapsUrl = pickupMapsUrl(
                    g.pickupAddressLine,
                    g.pickupCity,
                    g.pickupState
                  )
                  const addressText = [g.pickupAddressLine, g.pickupCity, g.pickupState]
                    .filter(Boolean)
                    .join(', ')

                  return (
                    <div
                      key={g.sellerEmail}
                      className="rounded-2xl border border-third bg-third/40 p-4"
                    >
                      <p className="font-heading font-bold text-main text-base">
                        {g.storeName?.trim() || g.sellerEmail}
                      </p>
                      <p className="text-xs text-main/50 mt-1 leading-relaxed">
                        {g.items.map((i) => i.title).join(' · ')}
                      </p>

                      {g.fulfillmentOption === 'Courier' && (
                        <p className="text-sm text-main/70 mt-3">Alákòwé delivery</p>
                      )}

                      {g.fulfillmentOption === 'Pickup' && (
                        <div className="mt-3 space-y-1">
                          <p className="text-sm font-semibold text-main">
                            This seller's books are pickup only
                          </p>
                          <p className="text-xs text-main/55 leading-relaxed">
                            You'll collect from the seller's pickup address below. No delivery fee for this seller.
                            After you complete the order, you'll get the seller's contact info to arrange pickup.
                          </p>
                        </div>
                      )}

                      {g.fulfillmentOption === 'Both' && (
                        <div className="flex items-center gap-4 flex-wrap mt-3">
                          <RadioControl
                            name={`fulfill-${g.sellerEmail}`}
                            checked={type === 'Courier'}
                            onChange={() => setChoiceType(g.sellerEmail, 'Courier')}
                            label={{ exist: true, text: 'Deliver', style: 'text-sm' }}
                          />
                          <RadioControl
                            name={`fulfill-${g.sellerEmail}`}
                            checked={type === 'Pickup'}
                            onChange={() => setChoiceType(g.sellerEmail, 'Pickup')}
                            label={{ exist: true, text: 'Pickup', style: 'text-sm' }}
                          />
                        </div>
                      )}

                      {g.fulfillmentOption === 'Both' && type === 'Courier' && (
                        <p className="text-sm text-main/70 mt-3">Alákòwé delivery</p>
                      )}

                      {type === 'Pickup' && (
                          <div className="mt-3 space-y-3">
                            {addressText && (
                              <div>
                                <p className="text-xs font-semibold text-main/50 uppercase tracking-wider mb-1">
                                  Pickup address
                                </p>
                                <p className="text-sm text-main/70">{addressText}</p>
                                {mapsUrl && (
                                  <a
                                    href={mapsUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-secondary mt-1 hover:underline"
                                  >
                                    <MapPin size={11} /> View on Maps
                                  </a>
                                )}
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-semibold text-main/50 uppercase tracking-wider mb-2">
                                Preferred pickup days
                              </p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {dayOptions.map((day) => {
                                  const selected = (choice?.pickupDates ?? []).includes(day.iso)
                                  return (
                                    <button
                                      key={day.iso}
                                      type="button"
                                      onClick={() => togglePickupDate(g.sellerEmail, day.iso)}
                                      className={cn(
                                        'rounded-xl border px-2.5 py-2 text-xs font-semibold transition-colors',
                                        selected
                                          ? 'border-main bg-main text-white'
                                          : pickupDateErrors[g.sellerEmail]
                                            ? 'border-red-400 bg-white text-main'
                                            : 'border-third bg-white text-main hover:border-main/30'
                                      )}
                                    >
                                      {day.label}
                                    </button>
                                  )
                                })}
                              </div>
                              {pickupDateErrors[g.sellerEmail] ? (
                                <p className="text-xs text-red-500 mt-2">
                                  {pickupDateErrors[g.sellerEmail]}
                                </p>
                              ) : (
                                <p className="text-[11px] text-main/40 mt-2">
                                  Select at least one day
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  )
                })}
              </div>
            </div>

            {needsCourier && (
              <div className="bg-white rounded-2xl border border-third p-6">
                <h2 className="font-heading font-bold text-main text-lg mb-5">Shipping Address</h2>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4 flex-wrap">
                    <RadioControl
                      name="addressMode"
                      checked={checkout.addressMode === 'saved'}
                      onChange={() => checkout.setAddressMode('saved')}
                      label={{ exist: true, text: 'Use saved address', style: 'text-sm' }}
                    />

                    <RadioControl
                      name="addressMode"
                      checked={checkout.addressMode === 'new'}
                      onChange={() => checkout.setAddressMode('new')}
                      label={{ exist: true, text: 'Enter a new address', style: 'text-sm' }}
                    />
                  </div>

                  {checkout.addressMode === 'saved' ? (
                    <Field label="Choose address">
                      <SelectBoxControl
                        placeholder="Select shipping address"
                        options={savedOptions.map((a) => ({
                          label: `${a.label ?? 'Address'}${a.stateName ? ` (${a.stateName})` : ''}`,
                          value: a.id ?? '',
                        }))}
                        value={
                          checkout.selectedShippingAddressId
                            ? savedOptions
                                .map((a) => ({
                                  label: `${a.label ?? 'Address'}${a.stateName ? ` (${a.stateName})` : ''}`,
                                  value: a.id ?? '',
                                }))
                                .find((o) => o.value === checkout.selectedShippingAddressId) ?? null
                            : null
                        }
                        onChange={(option: SelectOption) =>
                          checkout.setSelectedShippingAddressId(Number(option.value))
                        }
                        style={selectClass(false)}
                      />
                    </Field>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="State">
                        <SelectBoxControl
                          placeholder="Select state"
                          options={(statesQuery.data ?? []).map((s) => ({
                            label: s.name,
                            value: s.id,
                          }))}
                          value={
                            typeof checkout.newStateId === 'number'
                              ? (statesQuery.data ?? [])
                                  .map((s) => ({ label: s.name, value: s.id }))
                                  .find((o) => o.value === checkout.newStateId) ?? null
                              : null
                          }
                          onChange={(option: SelectOption) =>
                            checkout.setNewStateId(Number(option.value))
                          }
                          style={selectClass(false)}
                        />
                      </Field>

                      <Field label="Area">
                        <SelectBoxControl
                          placeholder="Select area"
                          options={(areasQuery.data ?? []).map((a) => ({
                            label: a.name,
                            value: a.id,
                          }))}
                          value={
                            typeof checkout.newAreaId === 'number'
                              ? (areasQuery.data ?? [])
                                  .map((a) => ({ label: a.name, value: a.id }))
                                  .find((o) => o.value === checkout.newAreaId) ?? null
                              : null
                          }
                          onChange={(option: SelectOption) =>
                            checkout.setNewAreaId(Number(option.value))
                          }
                          disabled={typeof checkout.newStateId !== 'number'}
                          style={selectClass(false)}
                        />
                      </Field>

                      <div className="sm:col-span-2">
                        <Field label="Address line">
                          <FormControl
                            type="text"
                            placeholder="e.g. 12 Broad Street, Flat 3"
                            value={checkout.newAddressLine}
                            onChange={(e) => checkout.setNewAddressLine(e.target.value)}
                            style={inputClass(false)}
                          />
                        </Field>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-third p-6 lg:sticky lg:top-24">
              <h2 className="font-heading font-bold text-main text-lg mb-5">Order Summary</h2>

              {checkout.errorBanner && (
                <p className="text-xs text-red-600 mb-4 leading-relaxed bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {checkout.errorBanner}
                </p>
              )}

              <div className="flex flex-col gap-3 mb-5">
                {items.map((item) => (
                  <div key={item.listingId} className="flex items-center gap-3">
                    <div
                      className="w-8 h-10 rounded overflow-hidden shrink-0 shadow-sm flex items-center justify-center"
                      style={{ backgroundColor: item.coverColor }}
                    >
                      {item.coverImageUrl ? (
                        <img
                          src={item.coverImageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-4 h-px bg-white/40 rounded" />
                      )}
                    </div>
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
                      ₦{(item.buyerPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-third pt-4 flex flex-col gap-2.5 mb-6">
                <div>
                  <label className="text-xs font-semibold text-main/50 uppercase tracking-wider mb-1.5 block">
                    Voucher code (optional)
                  </label>
                  <div className="flex gap-2">
                    <FormControl
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={voucherCode}
                      onChange={(e) => {
                        setVoucherCode(e.target.value.toUpperCase())
                        setVoucherError(null)
                      }}
                      style={inputClass(false)}
                    />
                    <button
                      type="button"
                      onClick={handleApplyVoucher}
                      disabled={validateVoucher.isPending}
                      className="shrink-0 rounded-xl bg-main px-4 text-sm font-semibold text-white hover:bg-main/90 transition-colors disabled:opacity-60"
                    >
                      {validateVoucher.isPending ? 'Checking…' : 'Apply'}
                    </button>
                  </div>
                  {voucherMessage && (
                    <p className="text-xs text-green-600 mt-1.5">{voucherMessage}</p>
                  )}
                  {voucherError && (
                    <p className="text-xs text-red-500 mt-1.5">{voucherError}</p>
                  )}
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-main/55">Subtotal</span>
                  <span className="font-medium text-main">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                {voucherDiscountNaira > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Voucher discount</span>
                    <span className="font-medium text-green-600">
                      −₦{voucherDiscountNaira.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold mt-1">
                  <span className="text-main">Estimated Total</span>
                  <span className="text-main">₦{(subtotal - voucherDiscountNaira).toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceed}
                disabled={
                  loading ||
                  validationLoading ||
                  !validationDone
                }
                className="w-full bg-secondary text-white font-semibold py-4 rounded-full hover:bg-secondary/90 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? 'Processing…'
                  : validationLoading
                    ? 'Validating cart…'
                    : !validationDone
                      ? 'Validating cart…'
                      : 'Proceed to Checkout Summary'}
              </button>

              <p className="text-xs text-main/35 text-center mt-3 leading-relaxed">
                {needsCourier
                  ? 'Delivery fee will be calculated on the next page'
                  : 'No delivery fee for pickup-only orders'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingDetails
