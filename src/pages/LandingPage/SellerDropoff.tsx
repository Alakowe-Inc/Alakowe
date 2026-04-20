import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Truck, Clock, Check } from 'lucide-react'
import {
  getSellerOrder,
  updateSellerOrderStatus,
  seedSellerOrders,
  generateDropoffCode,
} from '../../data/sellerData'
import { updateOrderStatus, seedDemoOrder } from '../../data/orderData'
import type { SellerOrder } from '../../data/sellerData'

const COLLECTION_CENTRES = [
  {
    id: 'yaba',
    name: 'Alakowe Hub — Yaba',
    address: '14 Fadipe Street, Yaba, Lagos',
    hours: 'Mon–Sat · 9am–5pm',
  },
  {
    id: 'ikeja',
    name: 'Alakowe Hub — Ikeja',
    address: '22 Allen Avenue, Ikeja, Lagos',
    hours: 'Mon–Sat · 9am–6pm',
  },
  {
    id: 'lekki',
    name: 'Alakowe Hub — Lekki',
    address: '4 Admiralty Way, Lekki Phase 1, Lagos',
    hours: 'Tue–Sat · 10am–4pm',
  },
  {
    id: 'abuja',
    name: 'Alakowe Hub — Abuja',
    address: 'Plot 123, Wuse 2, Abuja FCT',
    hours: 'Mon–Fri · 9am–5pm',
  },
]

function getPickupSlots() {
  const dayLabels = ['Tomorrow', 'In 2 Days', 'In 3 Days']
  const times = ['9am – 12pm', '12pm – 4pm']
  const slots: { id: string; dayLabel: string; date: string; time: string }[] = []
  for (let d = 0; d < 3; d++) {
    const date = new Date()
    date.setDate(date.getDate() + d + 1)
    const dateStr = date.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' })
    for (const t of times) {
      slots.push({ id: `${d}-${t}`, dayLabel: dayLabels[d], date: dateStr, time: t })
    }
  }
  return slots
}

type Method = 'dropoff' | 'pickup'
type Step = 'choose' | 'details' | 'confirmed'

export default function SellerDropoff() {
  const { id } = useParams<{ id: string }>()
  useNavigate()
  const [order, setOrder] = useState<SellerOrder | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [step, setStep] = useState<Step>('choose')
  const [method, setMethod] = useState<Method | null>(null)
  const [selectedCentre, setSelectedCentre] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    seedDemoOrder()
    seedSellerOrders()
    if (!id) { setNotFound(true); return }
    const o = getSellerOrder(id)
    if (!o) { setNotFound(true); return }
    setOrder(o)
    if (o.status !== 'awaiting_seller' && o.dropoffCode) {
      setCode(o.dropoffCode)
      setMethod(o.pickupSlot ? 'pickup' : 'dropoff')
      setSelectedCentre(o.dropoffLocation ?? '')
      setSelectedSlot(o.pickupSlot ?? '')
      setStep('confirmed')
    }
  }, [id])

  if (notFound) {
    return (
      <div className="bg-third min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-main/60 text-sm mb-4">Order not found.</p>
          <Link to="/my-sales" className="text-secondary font-semibold text-sm hover:underline">
            Back to My Sales
          </Link>
        </div>
      </div>
    )
  }

  if (!order) return null

  function handleChooseMethod(m: Method) {
    setMethod(m)
    setStep('details')
  }

  function handleSubmit() {
    if (!id || !order) return
    if (method === 'dropoff' && !selectedCentre) return
    if (method === 'pickup' && !selectedSlot) return
    setSubmitting(true)
    const generatedCode = generateDropoffCode()
    setTimeout(() => {
      const centre = COLLECTION_CENTRES.find(c => c.id === selectedCentre)
      updateSellerOrderStatus(id, 'dropoff_scheduled', {
        dropoffCode: generatedCode,
        dropoffLocation: method === 'dropoff' ? centre?.name : undefined,
        pickupSlot: method === 'pickup' ? selectedSlot : undefined,
      })
      if (order.linkedOrderId) {
        updateOrderStatus(order.linkedOrderId, 'dropoff_scheduled')
      }
      setCode(generatedCode)
      setOrder(prev => prev ? { ...prev, status: 'dropoff_scheduled', dropoffCode: generatedCode } : null)
      setStep('confirmed')
      setSubmitting(false)
    }, 1200)
  }

  const centre = COLLECTION_CENTRES.find(c => c.id === selectedCentre)
  const slot = getPickupSlots().find(s => s.id === selectedSlot)

  /* ── Confirmed ── */
  if (step === 'confirmed') {
    return (
      <div className="bg-third min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-500" strokeWidth={2} />
          </div>
          <h1 className="font-heading font-bold text-main text-2xl mb-2">
            {method === 'pickup' ? 'Pickup Scheduled!' : 'Drop-off Confirmed!'}
          </h1>
          <p className="text-main/55 text-sm mb-8 leading-relaxed">
            {method === 'pickup'
              ? 'Our team will come to collect your book at the selected time.'
              : `Bring your book to ${centre?.name} with this code.`}
          </p>

          {/* Code */}
          <div className="bg-white rounded-2xl border border-third p-6 mb-5 text-left">
            <p className="text-xs font-semibold text-main/40 uppercase tracking-wider mb-2">
              {method === 'pickup' ? 'Pickup Code' : 'Drop-off Code'}
            </p>
            <p className="font-heading font-bold text-main text-3xl tracking-widest">{code}</p>
            <p className="text-xs text-main/45 mt-2">
              {method === 'pickup'
                ? 'Show this code to our rider when they arrive.'
                : 'Show this at the collection centre when dropping off.'}
            </p>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl border border-third p-5 mb-6 text-left">
            <p className="text-xs font-semibold text-main/40 uppercase tracking-wider mb-3">Details</p>
            {method === 'dropoff' && centre && (
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-main">{centre.name}</p>
                  <p className="text-xs text-main/50 mt-0.5">{centre.address}</p>
                  <p className="text-xs text-main/35 mt-0.5 flex items-center gap-1">
                    <Clock size={10} /> {centre.hours}
                  </p>
                </div>
              </div>
            )}
            {method === 'pickup' && slot && (
              <div className="flex items-start gap-3">
                <Clock size={14} className="text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-main">{slot.date} · {slot.time}</p>
                  <p className="text-xs text-main/50 mt-0.5">Our rider will call before arriving</p>
                </div>
              </div>
            )}
            <div className="border-t border-third mt-4 pt-3 flex flex-col gap-1">
              <p className="text-xs text-main/40">
                Order: <span className="font-semibold text-main">{order.orderId}</span>
              </p>
              <p className="text-xs text-main/40">
                Book: <span className="font-semibold text-main">{order.bookTitle}</span>
              </p>
            </div>
          </div>

          <Link
            to="/my-sales"
            className="w-full bg-main text-white font-semibold py-4 rounded-full hover:bg-main/90 transition-colors text-sm text-center block"
          >
            Back to My Sales
          </Link>
        </div>
      </div>
    )
  }

  /* ── Choose method ── */
  if (step === 'choose') {
    return (
      <div className="bg-third min-h-screen">
        <div className="max-w-lg mx-auto px-4 md:px-6 py-10">
          <Link
            to="/my-sales"
            className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium"
          >
            <ArrowLeft size={15} /> Back to My Sales
          </Link>

          <div className="mb-8">
            <p className="text-xs font-semibold text-main/40 uppercase tracking-widest mb-1">Book Handoff</p>
            <h1 className="font-heading font-bold text-main text-2xl md:text-3xl">How will you send it?</h1>
            <p className="text-main/50 text-sm mt-1.5">Choose how to get your book to Alakowe</p>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-third p-5 mb-6">
            <p className="text-xs font-semibold text-main/40 uppercase tracking-wider mb-2">Order Summary</p>
            <p className="font-heading font-bold text-main">{order.bookTitle}</p>
            <p className="text-xs text-main/45 mt-0.5">Order {order.orderId} · Buyer: {order.buyerInitials}</p>
            <div className="border-t border-third mt-3 pt-3 flex items-center justify-between">
              <span className="text-xs text-main/40">Your Payout</span>
              <span className="font-heading font-bold text-main">₦{order.netAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleChooseMethod('dropoff')}
              className="bg-white border border-third rounded-2xl p-6 text-left hover:border-secondary/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/15 transition-colors">
                  <MapPin size={20} className="text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-heading font-bold text-main text-base">Drop off at a centre</p>
                  <p className="text-main/50 text-sm mt-1 leading-relaxed">
                    Bring your book to one of our collection points. Go at your own pace.
                  </p>
                </div>
                <ArrowLeft size={16} className="text-main/25 rotate-180 shrink-0 mt-1 group-hover:text-secondary transition-colors" />
              </div>
            </button>

            <button
              onClick={() => handleChooseMethod('pickup')}
              className="bg-white border border-third rounded-2xl p-6 text-left hover:border-secondary/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/15 transition-colors">
                  <Truck size={20} className="text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-heading font-bold text-main text-base">Request a pickup</p>
                  <p className="text-main/50 text-sm mt-1 leading-relaxed">
                    We'll send a rider to collect from you. Choose a convenient time slot.
                  </p>
                </div>
                <ArrowLeft size={16} className="text-main/25 rotate-180 shrink-0 mt-1 group-hover:text-secondary transition-colors" />
              </div>
            </button>
          </div>

          <p className="text-xs text-main/35 text-center mt-6 leading-relaxed">
            Please complete this within 48 hours to keep the buyer's order on track.
          </p>
        </div>
      </div>
    )
  }

  /* ── Details step ── */
  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-lg mx-auto px-4 md:px-6 py-10">
        <button
          onClick={() => setStep('choose')}
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div className="mb-6">
          <p className="text-xs font-semibold text-main/40 uppercase tracking-widest mb-1">
            {method === 'dropoff' ? 'Drop-off' : 'Pickup'}
          </p>
          <h1 className="font-heading font-bold text-main text-2xl">
            {method === 'dropoff' ? 'Select a collection centre' : 'Choose a time slot'}
          </h1>
        </div>

        {method === 'dropoff' && (
          <div className="flex flex-col gap-3 mb-8">
            {COLLECTION_CENTRES.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCentre(c.id)}
                className={`bg-white border rounded-2xl p-5 text-left transition-all ${
                  selectedCentre === c.id
                    ? 'border-secondary bg-secondary/5'
                    : 'border-third hover:border-secondary/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                      selectedCentre === c.id ? 'border-secondary bg-secondary' : 'border-main/25'
                    }`}
                  >
                    {selectedCentre === c.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-main text-sm">{c.name}</p>
                    <p className="text-xs text-main/50 mt-0.5">{c.address}</p>
                    <p className="text-xs text-main/35 mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {c.hours}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {method === 'pickup' && (
          <div className="flex flex-col gap-3 mb-8">
            {getPickupSlots().map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSlot(s.id)}
                className={`bg-white border rounded-2xl px-5 py-4 text-left transition-all ${
                  selectedSlot === s.id
                    ? 'border-secondary bg-secondary/5'
                    : 'border-third hover:border-secondary/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      selectedSlot === s.id ? 'border-secondary bg-secondary' : 'border-main/25'
                    }`}
                  >
                    {selectedSlot === s.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-main text-sm">{s.date}</p>
                    <p className="text-xs text-main/50 mt-0.5">{s.time}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={
            submitting ||
            (method === 'dropoff' && !selectedCentre) ||
            (method === 'pickup' && !selectedSlot)
          }
          className="w-full bg-main text-white font-semibold py-4 rounded-full hover:bg-main/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting
            ? 'Confirming…'
            : method === 'dropoff'
            ? 'Confirm Drop-off'
            : 'Confirm Pickup Request'}
        </button>
      </div>
    </div>
  )
}
