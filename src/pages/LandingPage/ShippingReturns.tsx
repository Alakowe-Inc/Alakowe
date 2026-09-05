import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Minus, Truck, MapPin, Package, Home, ShoppingBag, AlertTriangle, Shield, Headphones } from 'lucide-react'

// ─── FAQ data ───────────────────────────────────────────────────────────────
const faqs = [
  { q: "How much is delivery?", a: "Delivery fees depend on your location and are shown at checkout before you pay." },
  { q: "How long does delivery take?", a: "Most orders arrive within 4–8 working days. Some may arrive sooner, especially when your order doesn't require books to be collected from multiple sellers." },
  { q: "Can I pick up my order?", a: "Yes! You can choose to collect directly from the seller if the seller has enabled pickup for their listing." },
  { q: "Can I track my order?", a: "Yes. Once your order is dispatched you'll receive a tracking update via email or your account dashboard." },
  { q: "What if there's a problem with my order?", a: "Report any issue within 12 hours of delivery. Take photos, tell us what happened and we'll review and resolve it as quickly as possible." },
]

// ─── Order journey steps ─────────────────────────────────────────────────────
const journey = [
  { num: 1, Icon: ShoppingBag, label: 'Order placed', desc: 'We confirm your order.' },
  { num: 2, Icon: Package,     label: 'Seller prepares', desc: 'Seller prepares your book(s).' },
  { num: 3, Icon: Package,     label: 'Book collected', desc: 'We collect the book(s) from the seller.' },
  { num: 4, Icon: Truck,       label: 'On its way', desc: 'Your order is on its way to you.' },
  { num: 5, Icon: Home,        label: 'Delivered', desc: 'Enjoy your new read!' },
]

// ─── Truck SVG illustration ──────────────────────────────────────────────────
function TruckIllustration() {
  return (
    <svg viewBox="0 0 260 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Road dashes */}
      <path d="M10 110 Q130 90 250 110" stroke="#c7c4f0" strokeWidth="1.5" strokeDasharray="6 4" fill="none"/>
      {/* Truck body */}
      <rect x="20" y="60" width="110" height="50" rx="4" fill="white" stroke="#635BFF" strokeWidth="2"/>
      <rect x="110" y="68" width="42" height="42" rx="4" fill="#f0effd" stroke="#635BFF" strokeWidth="2"/>
      {/* Cab window */}
      <rect x="115" y="73" width="32" height="20" rx="3" fill="#c7c4f0"/>
      {/* Wheels */}
      <circle cx="50" cy="112" r="10" fill="white" stroke="#635BFF" strokeWidth="2"/>
      <circle cx="50" cy="112" r="4" fill="#635BFF"/>
      <circle cx="120" cy="112" r="10" fill="white" stroke="#635BFF" strokeWidth="2"/>
      <circle cx="120" cy="112" r="4" fill="#635BFF"/>
      {/* Motion lines */}
      <line x1="5" y1="78" x2="18" y2="78" stroke="#635BFF" strokeWidth="2" strokeLinecap="round"/>
      <line x1="2" y1="88" x2="18" y2="88" stroke="#635BFF" strokeWidth="2" strokeLinecap="round"/>
      <line x1="7" y1="98" x2="18" y2="98" stroke="#635BFF" strokeWidth="2" strokeLinecap="round"/>
      {/* Curved arrow */}
      <path d="M165 95 Q195 75 220 95" stroke="#635BFF" strokeWidth="1.5" strokeDasharray="5 3" fill="none" markerEnd="url(#arrow)"/>
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#635BFF"/>
        </marker>
      </defs>
      {/* Door */}
      <rect x="215" y="55" width="38" height="60" rx="4" fill="white" stroke="#635BFF" strokeWidth="2"/>
      <rect x="215" y="55" width="38" height="8" rx="2" fill="#f0effd" stroke="#635BFF" strokeWidth="1.5"/>
      <circle cx="218" cy="89" r="2.5" fill="#635BFF"/>
      {/* Plant */}
      <line x1="248" y1="115" x2="248" y2="90" stroke="#635BFF" strokeWidth="2"/>
      <ellipse cx="242" cy="86" rx="7" ry="5" fill="#c7c4f0"/>
      <ellipse cx="254" cy="84" rx="7" ry="5" fill="#635BFF" opacity="0.4"/>
      {/* Ground */}
      <line x1="200" y1="115" x2="260" y2="115" stroke="#635BFF" strokeWidth="1.5"/>
    </svg>
  )
}

// ─── Store SVG illustration ───────────────────────────────────────────────────
function StoreIllustration() {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-24">
      <rect x="10" y="35" width="100" height="58" rx="3" fill="white" stroke="#635BFF" strokeWidth="2"/>
      <rect x="10" y="22" width="100" height="18" rx="2" fill="#f0effd" stroke="#635BFF" strokeWidth="2"/>
      {/* Awning stripes */}
      {[20,33,46,59,72,85,98].map(x => (
        <line key={x} x1={x} y1="22" x2={x} y2="40" stroke="#635BFF" strokeWidth="1.5" opacity="0.4"/>
      ))}
      {/* Door */}
      <rect x="45" y="60" width="30" height="33" rx="2" fill="#f0effd" stroke="#635BFF" strokeWidth="1.5"/>
      <circle cx="71" cy="77" r="2" fill="#635BFF"/>
      {/* Windows */}
      <rect x="15" y="48" width="22" height="18" rx="2" fill="#c7c4f0" stroke="#635BFF" strokeWidth="1.5"/>
      <rect x="83" y="48" width="22" height="18" rx="2" fill="#c7c4f0" stroke="#635BFF" strokeWidth="1.5"/>
      {/* Trees */}
      <line x1="5" y1="93" x2="5" y2="75" stroke="#635BFF" strokeWidth="1.5"/>
      <ellipse cx="5" cy="70" rx="6" ry="8" fill="#635BFF" opacity="0.3"/>
      <line x1="115" y1="93" x2="115" y2="75" stroke="#635BFF" strokeWidth="1.5"/>
      <ellipse cx="115" cy="70" rx="6" ry="8" fill="#635BFF" opacity="0.3"/>
    </svg>
  )
}

// ─── FAQ accordion item ───────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#e8e6ff] last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-[#1a1a2e] hover:text-[#635BFF] transition-colors"
      >
        {q}
        {open ? <Minus size={16} className="text-[#635BFF] shrink-0" /> : <Plus size={16} className="text-[#635BFF] shrink-0" />}
      </button>
      {open && <p className="pb-4 text-sm text-[#1a1a2e]/60 leading-relaxed">{a}</p>}
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function ShippingReturns() {
  return (
    <div className="bg-[#f5f4ff] min-h-screen font-body">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#f0effd] border-b border-[#e0deff]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 flex items-center justify-between gap-6">
          <div>
            <h1 className="font-heading font-bold text-[#1a1a2e] text-3xl md:text-4xl leading-tight mb-3">
              Shipping &amp; Returns
            </h1>
            <p className="text-[#1a1a2e]/55 text-sm leading-relaxed max-w-xs">
              From seller to your shelf,<br />here's everything you need to know.
            </p>
          </div>
          <div className="hidden sm:block w-56 h-32 shrink-0">
            <TruckIllustration />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 flex flex-col gap-10">

        {/* ── How will I receive it? ────────────────────────────────────────── */}
        <section>
          <h2 className="font-heading font-bold text-[#1a1a2e] text-base uppercase tracking-widest mb-5">
            How will I receive it?
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            {/* Aláòwé Delivery card */}
            <div className="bg-white rounded-2xl border border-[#e0deff] p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f0effd] flex items-center justify-center shrink-0">
                  <Truck size={18} className="text-[#635BFF]" />
                </div>
                <div>
                  <p className="font-bold text-[#1a1a2e] text-sm">ALÁKÒWÉ DELIVERY</p>
                  <p className="text-[#635BFF] text-xs font-semibold mt-0.5">Average delivery: 4–8 working days</p>
                </div>
              </div>
              <p className="text-sm text-[#1a1a2e]/60 leading-relaxed">
                Most orders arrive within 4–8 working days. Some may arrive sooner, especially when your
                order doesn't require books to be collected from multiple sellers and brought together.
              </p>
              <div>
                <span className="inline-flex items-center gap-1.5 border border-[#e0deff] rounded-full px-3 py-1 text-xs text-[#1a1a2e]/60">
                  Delivery fee applies <span className="w-3.5 h-3.5 rounded-full bg-[#f0effd] text-[#635BFF] flex items-center justify-center text-[9px] font-bold">i</span>
                </span>
              </div>
            </div>

            {/* Pick up card */}
            <div className="bg-white rounded-2xl border border-[#e0deff] p-6 flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f0effd] flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-[#635BFF]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1a1a2e] text-sm">PICK UP</p>
                    <p className="text-[#635BFF] text-xs font-semibold mt-0.5">Collect from seller</p>
                  </div>
                </div>
                <p className="text-sm text-[#1a1a2e]/60 ml-13 pl-0">Available nationwide</p>
              </div>
              <div className="shrink-0 self-center">
                <StoreIllustration />
              </div>
            </div>
          </div>

          {/* Delivery fee note */}
          <div className="mt-3 flex items-center gap-2.5 bg-white rounded-xl border border-[#e0deff] px-4 py-3">
            <span className="w-4 h-4 rounded-full bg-[#f0effd] flex items-center justify-center text-[#635BFF] text-[9px] font-bold shrink-0">i</span>
            <p className="text-xs text-[#1a1a2e]/55">Delivery fees are shown at checkout before payment.</p>
          </div>
        </section>

        {/* ── Buying from multiple sellers ──────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-[#e0deff] p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">

            {/* Left copy */}
            <div className="shrink-0">
              <p className="font-heading font-bold text-[#1a1a2e] text-lg leading-snug mb-2">
                BUYING FROM<br />MULTIPLE SELLERS?
              </p>
              <p className="font-heading font-bold text-[#635BFF] text-lg leading-snug">
                ONE ORDER.<br />MULTIPLE SELLERS.<br />ONE DELIVERY.
              </p>
            </div>

            {/* Diagram */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2">
                {/* Sellers column */}
                <div className="flex flex-col gap-3 shrink-0">
                  {['Seller A', 'Seller B', 'Seller C'].map(s => (
                    <div key={s} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#f0effd] flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#635BFF]" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                      <span className="text-xs text-[#1a1a2e]/60">{s}</span>
                    </div>
                  ))}
                </div>

                {/* Arrow to Aláòwé */}
                <div className="flex-1 flex items-center justify-center">
                  <svg viewBox="0 0 60 60" className="w-10 h-10">
                    <path d="M5 10 L55 30 L5 50" stroke="#635BFF" strokeWidth="1.5" strokeDasharray="4 3" fill="none"/>
                  </svg>
                </div>

                {/* Aláòwé hub */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-[#635BFF] flex items-center justify-center">
                    <Package size={18} className="text-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#1a1a2e] mt-1">Alákòwé</span>
                </div>

                {/* Arrow to you */}
                <div className="flex-1 flex items-center justify-center">
                  <svg viewBox="0 0 60 20" className="w-10 h-5">
                    <path d="M5 10 L50 10" stroke="#635BFF" strokeWidth="1.5" strokeDasharray="4 3" fill="none"/>
                    <path d="M46 6 L54 10 L46 14" stroke="#635BFF" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>

                {/* You */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-[#f0effd] border border-[#e0deff] flex items-center justify-center">
                    <Home size={18} className="text-[#635BFF]" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#1a1a2e] mt-1">You</span>
                </div>
              </div>

              <p className="text-xs text-[#1a1a2e]/55 mt-5 leading-relaxed">
                When you buy from multiple sellers in one order, we collect the books, bring them together, and deliver them to you as one order.
              </p>
            </div>
          </div>
        </section>

        {/* ── Your order journey ────────────────────────────────────────────── */}
        <section>
          <h2 className="font-heading font-bold text-[#1a1a2e] text-base uppercase tracking-widest mb-6">
            Your order journey
          </h2>
          <div className="relative flex items-start justify-between gap-2">
            {/* Connector line */}
            <div className="absolute top-6 left-[calc(10%)] right-[calc(10%)] h-px border-t border-dashed border-[#635BFF]/30 hidden sm:block" />

            {journey.map(({ num, Icon, label, desc }) => (
              <div key={num} className="flex flex-col items-center text-center gap-2 flex-1 z-10">
                <div className="relative">
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white border border-[#e0deff] text-[9px] font-bold text-[#635BFF] flex items-center justify-center">
                    {num}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-white border border-[#e0deff] flex items-center justify-center">
                    <Icon size={18} className="text-[#635BFF]" />
                  </div>
                </div>
                <p className="text-xs font-semibold text-[#1a1a2e] leading-snug">{label}</p>
                <p className="text-[11px] text-[#1a1a2e]/50 leading-snug hidden sm:block">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom three columns ──────────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-4">

          {/* Something wrong */}
          <div className="bg-white rounded-2xl border border-[#e0deff] p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <AlertTriangle size={15} className="text-amber-500" />
              </div>
              <p className="font-bold text-[#1a1a2e] text-sm">SOMETHING WRONG?</p>
            </div>
            <p className="text-xs text-[#1a1a2e]/60 leading-relaxed">
              Report an issue within <span className="font-semibold text-[#1a1a2e]">12 hours</span> of delivery.
            </p>
            <div className="flex flex-col gap-2.5">
              {['Take photos', 'Tell us what happened', 'We\'ll review it'].map((step, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                    i === 0 ? 'bg-[#f0effd] text-[#635BFF]' :
                    i === 1 ? 'bg-[#635BFF]/15 text-[#635BFF]' :
                    'bg-[#635BFF] text-white'
                  }`}>{i + 1}</span>
                  <span className="text-xs text-[#1a1a2e]/65">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment protection */}
          <div className="bg-white rounded-2xl border border-[#e0deff] p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#f0effd] flex items-center justify-center shrink-0">
                <Shield size={15} className="text-[#635BFF]" />
              </div>
              <p className="font-bold text-[#1a1a2e] text-sm">PAYMENT PROTECTION</p>
            </div>
            <p className="text-xs text-[#1a1a2e]/60 leading-relaxed">
              Your payment is protected while your order is being completed.
            </p>
            {/* Lock illustration */}
            <div className="flex items-center justify-center mt-auto pt-2">
              <div className="w-16 h-16 rounded-2xl bg-[#f0effd] border border-[#e0deff] flex items-center justify-center">
                <Shield size={28} className="text-[#635BFF]" />
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl border border-[#e0deff] p-6">
            <p className="font-bold text-[#1a1a2e] text-sm mb-3">FREQUENTLY ASKED QUESTIONS</p>
            <div className="flex flex-col">
              {faqs.map(f => <FaqItem key={f.q} {...f} />)}
            </div>
          </div>

        </div>

        {/* ── Need more help banner ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#e0deff] px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f0effd] flex items-center justify-center shrink-0">
              <Headphones size={18} className="text-[#635BFF]" />
            </div>
            <div>
              <p className="font-semibold text-[#1a1a2e] text-sm">Need more help?</p>
              <p className="text-xs text-[#1a1a2e]/50">We're here for you. Reach out anytime.</p>
            </div>
          </div>
          <Link
            to="/customer-service"
            className="bg-[#635BFF] hover:bg-[#4f48cc] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shrink-0"
          >
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  )
}
