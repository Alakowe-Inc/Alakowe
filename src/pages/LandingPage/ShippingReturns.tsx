import { Link } from 'react-router-dom'
import { Truck, MapPin, Clock, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'

const deliveryZones = [
  { zone: 'Lagos (Island & Mainland)', time: '1–2 business days', fee: '₦1,000' },
  { zone: 'Lagos (Suburbs & Outskirts)', time: '2–3 business days', fee: '₦1,200' },
  { zone: 'Abuja', time: '2–4 business days', fee: '₦1,500' },
  { zone: 'Port Harcourt', time: '3–5 business days', fee: '₦1,500' },
  { zone: 'Other Major Cities', time: '4–7 business days', fee: '₦1,800' },
  { zone: 'Other States', time: '5–10 business days', fee: '₦2,200' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-third p-6 md:p-8">
      <h2 className="font-heading font-bold text-main text-xl mb-5">{title}</h2>
      {children}
    </div>
  )
}

export default function ShippingReturns() {
  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">Shipping</p>
          <h1 className="font-heading font-bold text-main text-4xl mb-3">Shipping & Returns</h1>
          <p className="text-main/50 text-sm">
            Everything you need to know about how we deliver books across Nigeria and how returns are handled.
          </p>
        </div>

        <div className="flex flex-col gap-6">

          {/* How it works */}
          <Section title="How shipping works">
            <div className="flex flex-col gap-5">
              {[
                {
                  icon: CheckCircle,
                  color: 'text-green-500',
                  title: 'Seller drops off the book',
                  desc: 'After you place an order, the seller has 48 hours to drop the book off at our nearest collection point.',
                },
                {
                  icon: AlertCircle,
                  color: 'text-secondary',
                  title: 'We inspect and pack',
                  desc: 'Our team checks that the book matches the listing description and condition, then packs it securely for dispatch.',
                },
                {
                  icon: Truck,
                  color: 'text-main',
                  title: 'Delivered to your door',
                  desc: 'Once dispatched, you\'ll receive a tracking update via email. Delivery times vary by location.',
                },
              ].map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <Icon size={18} className={`${color} shrink-0 mt-0.5`} />
                  <div>
                    <p className="font-semibold text-main text-sm mb-0.5">{title}</p>
                    <p className="text-sm text-main/55">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Delivery zones */}
          <Section title="Delivery zones & fees">
            <div className="flex items-start gap-2 bg-secondary/6 border border-secondary/20 rounded-xl px-4 py-3 mb-5">
              <MapPin size={14} className="text-secondary shrink-0 mt-0.5" />
              <p className="text-xs text-main/65">
                We currently deliver to <span className="font-semibold text-main">24 states</span> across Nigeria. More areas are being added regularly.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-third">
                    <th className="text-left py-2.5 pr-4 text-xs font-semibold text-main/45 uppercase tracking-wider">Zone</th>
                    <th className="text-left py-2.5 pr-4 text-xs font-semibold text-main/45 uppercase tracking-wider">
                      <Clock size={11} className="inline mr-1" />Estimated Time
                    </th>
                    <th className="text-left py-2.5 text-xs font-semibold text-main/45 uppercase tracking-wider">Delivery Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-third">
                  {deliveryZones.map(row => (
                    <tr key={row.zone}>
                      <td className="py-3 pr-4 text-main font-medium">{row.zone}</td>
                      <td className="py-3 pr-4 text-main/60">{row.time}</td>
                      <td className="py-3 text-main font-semibold">{row.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-main/40 mt-4">Delivery fees are charged at checkout and are non-refundable except in cases of our error.</p>
          </Section>

          {/* Returns */}
          <Section title="Returns & disputes">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-main/60 leading-relaxed">
                Because books are second-hand, we do not accept returns based on buyer's remorse. However, we protect you in the following situations:
              </p>

              {[
                {
                  icon: RefreshCw,
                  title: 'Book condition doesn\'t match the listing',
                  desc: 'If the book is in significantly worse condition than described, you can raise a dispute within 48 hours of delivery. We\'ll review the case and issue a full refund if the claim is valid.',
                },
                {
                  icon: AlertCircle,
                  title: 'Wrong book delivered',
                  desc: 'If you receive a different book from what you ordered, contact us immediately. We\'ll arrange a collection and deliver the correct book at no extra cost.',
                },
                {
                  icon: Truck,
                  title: 'Book not delivered',
                  desc: 'If your book doesn\'t arrive within the estimated window and tracking shows no movement, we\'ll investigate and either redeliver or issue a full refund.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 border-l-2 border-secondary/30 pl-4">
                  <Icon size={15} className="text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-main text-sm mb-0.5">{title}</p>
                    <p className="text-xs text-main/55 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Escrow note */}
          <div className="bg-main rounded-2xl p-6 md:p-8 text-white">
            <h2 className="font-heading font-bold text-white text-lg mb-2">Your money is protected</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              All payments are held in escrow. The seller is only paid after you confirm that your book has arrived in the described condition. If something goes wrong, your money stays safe with us.
            </p>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-secondary text-sm font-semibold hover:text-secondary/80 transition-colors"
            >
              Learn how our escrow works →
            </Link>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-third p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-heading font-bold text-main text-base">Have a shipping issue?</p>
              <p className="text-sm text-main/50 mt-0.5">Our support team will resolve it as fast as possible.</p>
            </div>
            <Link
              to="/customer-service"
              className="inline-flex items-center gap-2 bg-main text-white font-semibold px-6 py-3 rounded-full hover:bg-main/90 transition-colors text-sm shrink-0"
            >
              Contact Support
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
