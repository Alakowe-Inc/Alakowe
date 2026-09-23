import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, Shield, Clock, MapPin, Phone, ShoppingBag, Truck, Home } from 'lucide-react'
import { useCheckout } from '../../../context/CheckoutContext'
import { usePayCheckout, useCancelCheckout } from '../../../lib/api/checkout/checkout.hooks'
import { getCheckoutSessionApi } from '../../../lib/api/checkout/checkout.api'
import { formatPrice } from '../../../lib/utils'
import PaystackPop from '@paystack/inline-js'

const ORDER_JOURNEY_STEPS = [
  {
    Icon: ShoppingBag,
    label: 'Order placed',
    desc: 'We confirm your order.',
  },
  {
    Icon: Package,
    label: 'Seller prepares',
    desc: 'Seller prepares your book(s).',
  },
  {
    Icon: Package,
    label: 'Book collected',
    desc: 'We collect the book(s) from the seller.',
  },
  {
    Icon: Truck,
    label: 'On its way',
    desc: 'Your order is on its way to you.',
  },
  {
    Icon: Home,
    label: 'Delivered',
    desc: 'Enjoy your new read!',
  },
] as const

const PICKUP_STEPS = [
  {
    Icon: Package,
    label: 'Seller prepares your book',
    desc: 'The seller gets your book ready at their pickup address.',
  },
  {
    Icon: Phone,
    label: 'You get their contact',
    desc: 'After payment, you receive the seller\'s phone number to arrange collection.',
  },
  {
    Icon: MapPin,
    label: 'You pick up',
    desc: 'Collect the book on one of your preferred days and show your pickup code.',
  },
] as const

const MIXED_STEPS = [
  {
    Icon: Package,
    label: 'Delivery orders',
    desc: 'Sellers drop off at a Speedaf station. We inspect, then deliver to you in about 3-7 business days.',
  },
  {
    Icon: MapPin,
    label: 'Pickup orders',
    desc: 'You\'ll get the seller\'s contact after payment. Collect with your pickup code on a preferred day.',
  },
  {
    Icon: Shield,
    label: 'Payment stays protected',
    desc: 'Your payment is held until the order is completed for each fulfillment type.',
  },
] as const

function CheckoutSummary() {
  const checkout = useCheckout()
  const payCheckout = usePayCheckout()
  const cancelCheckout = useCancelCheckout()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const session = checkout.sessionData

  useEffect(() => {
    if (!session) {
      navigate('/checkout')
    }
  }, [session, navigate])

  function handleBack() {
    const sessionId = checkout.sessionId
    if (sessionId) {
      cancelCheckout.mutate(sessionId)
    }
    navigate('/checkout')
  }

  if (!session) return null

  const deliveryFee = (session.deliveryFee ?? 0) / 100
  const voucherDiscount = (session.voucherDiscountAmount ?? 0) / 100
  const subtotal = ((session.totalAmount ?? 0) / 100) - deliveryFee + voucherDiscount
  const total = (session.totalAmount ?? 0) / 100

  const sellerGroups = session.sellerGroups ?? []
  const fulfillmentTypes = sellerGroups.map(
    (g) => g.selectedFulfillmentType ?? 'Courier',
  )
  const hasCourier = fulfillmentTypes.some((t) => t === 'Courier')
  const hasPickup = fulfillmentTypes.some((t) => t === 'Pickup')
  const fulfillmentMode =
    hasCourier && hasPickup ? 'mixed' : hasPickup ? 'pickup' : 'courier'

  const howItWorks =
    fulfillmentMode === 'pickup'
      ? { title: 'How Pickup Works', steps: PICKUP_STEPS }
      : fulfillmentMode === 'mixed'
        ? { title: 'How Fulfillment Works', steps: MIXED_STEPS }
        : { title: 'YOUR ORDER JOURNEY', steps: ORDER_JOURNEY_STEPS }

  const allItems = sellerGroups.flatMap((g) => g.items ?? [])

  async function initiatePayment(sessionId: string) {
    const paymentInit = await payCheckout.mutateAsync(sessionId)
    const accessCode = paymentInit?.accessCode ?? null

    if (!accessCode) {
      return { success: false as const, reason: 'no_access_code' as const }
    }

    const popup = new PaystackPop()
    popup.resumeTransaction(accessCode)
    return { success: true as const }
  }

  async function handlePayment() {
    const sessionId = checkout.sessionId
    if (!sessionId) {
      checkout.setErrorBanner('Session expired. Please start checkout again.')
      navigate('/checkout')
      return
    }

    setLoading(true)
    checkout.setErrorBanner(null)

    try {
      const result = await initiatePayment(sessionId)

      if (result.success) {
        navigate('/checkout/processing')
        return
      }

      if (result.reason === 'no_access_code') {
        const refreshedSession = await getCheckoutSessionApi(sessionId)

        if (refreshedSession?.isExpired) {
          checkout.setErrorBanner('Your checkout session has expired. Please start again.')
          navigate('/checkout')
          return
        }

        const retry = await initiatePayment(sessionId)
        if (retry.success) {
          navigate('/checkout/processing')
        } else {
          checkout.setErrorBanner('Payment could not be initiated. Please try again.')
        }
      }
    } catch {
      try {
        const refreshedSession = await getCheckoutSessionApi(sessionId)

        if (refreshedSession?.isExpired) {
          checkout.setErrorBanner('Your checkout session has expired. Please start again.')
          navigate('/checkout')
          return
        }

        const retry = await initiatePayment(sessionId)
        if (retry.success) {
          navigate('/checkout/processing')
        } else {
          checkout.setErrorBanner('Payment could not be initiated. Please try again.')
        }
      } catch {
        checkout.setErrorBanner(
          'Something went wrong. Please check your orders or try again later.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 py-10">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> Back to Shipping Details
        </button>

        <h1 className="font-heading font-bold text-main text-3xl mb-8">Checkout Summary</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-third p-6">
              <h2 className="font-heading font-bold text-main text-lg mb-5">Order Summary</h2>

              <div className="flex flex-col gap-3 mb-5">
                {allItems.map((item) => (
                  <div key={item.listingId} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-main truncate leading-snug">
                        {item.title}
                      </p>
                      <p className="text-xs text-main/45">
                        {item.author}
                        {(item.quantity ?? 0) > 1 && ` ×${item.quantity}`}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-main shrink-0">
                      {formatPrice(((item.buyerPrice ?? 0) / 100) * (item.quantity ?? 0))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {fulfillmentMode === 'courier' ? (
              <div className="bg-[#F8FAFF] rounded-2xl border border-third p-6 pb-4 overflow-hidden">
                <h2 className="font-heading font-bold text-[#0F172A] text-[13px] uppercase tracking-wider mb-8">
                  {howItWorks.title}
                </h2>
                <div className="overflow-x-auto pb-4 -mx-2 px-2 md:overflow-visible md:pb-2 md:mx-0 md:px-0">
                  <div className="flex flex-row items-start justify-between relative min-w-[650px] md:min-w-0">
                    <div className="absolute top-6 left-12 right-12 h-[1px] border-t border-dashed border-[#D4D4FF] z-0" />
                    {howItWorks.steps.map(({ Icon, label, desc }, idx) => (
                      <div key={label} className="relative z-10 flex flex-col items-center text-center max-w-[120px] flex-1">
                        <div className="relative mb-3">
                          <div className="w-12 h-12 rounded-[14px] bg-white border border-[#D4D4FF] flex items-center justify-center shadow-sm">
                            <Icon size={18} className="text-[#6B6FFF]" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-[18px] h-[18px] rounded-full bg-white border border-[#D4D4FF] text-[#6B6FFF] text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </div>
                        </div>
                        <h3 className="font-bold text-[#0F172A] text-[12px] leading-snug mb-1">{label}</h3>
                        <p className="text-[#8C8F99] text-[11px] leading-snug px-1">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-third p-6">
                <h2 className="font-heading font-bold text-main text-lg mb-5">
                  {howItWorks.title}
                </h2>
                <div className="flex flex-col gap-5">
                  {howItWorks.steps.map(({ Icon, label, desc }) => (
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
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-third p-6 lg:sticky lg:top-24">
              <h2 className="font-heading font-bold text-main text-lg mb-5">Payment Summary</h2>

              {checkout.errorBanner && (
                <p className="text-xs text-red-600 mb-4 leading-relaxed bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {checkout.errorBanner}
                </p>
              )}

              <div className="border-t border-third pt-4 flex flex-col gap-2.5 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-main/55">Subtotal</span>
                  <span className="font-medium text-main">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">
                      Voucher {session.voucherCode ? `(${session.voucherCode})` : ''} discount
                    </span>
                    <span className="font-medium text-green-600">
                      −{formatPrice(voucherDiscount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-main/55">
                    {fulfillmentMode === 'pickup' ? 'Pickup' : 'Delivery'}
                  </span>
                  <span className="font-medium text-main">
                    {deliveryFee > 0
                      ? formatPrice(deliveryFee)
                      : fulfillmentMode === 'pickup'
                        ? 'No fee'
                        : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold mt-1">
                  <span className="text-main">Total</span>
                  <span className="text-main">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3 border border-secondary/40 bg-secondary/5 rounded-xl px-4 py-3.5">
                  <div className="w-4 h-4 rounded-full border-2 border-secondary flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <span className="text-sm font-semibold text-main">Card / Bank Transfer</span>
                  <span className="ml-auto text-xs text-main/40 font-medium">via Paystack</span>
                </div>
                <p className="text-xs text-main/40 mt-3 leading-relaxed">
                  {fulfillmentMode === 'pickup'
                    ? 'Your payment is held securely until the seller confirms pickup with your code.'
                    : fulfillmentMode === 'mixed'
                      ? 'Your payment is held securely until each part of your order is completed.'
                      : 'Your payment is held securely in escrow and only released to the seller after you confirm delivery.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-secondary text-white font-semibold py-4 rounded-full hover:bg-secondary/90 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing…' : `Proceed to Payment · ${formatPrice(total)}`}
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
      </div>
    </div>
  )
}

export default CheckoutSummary
