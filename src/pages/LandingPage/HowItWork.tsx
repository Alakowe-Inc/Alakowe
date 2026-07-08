import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingCart,
  Handshake,
  MapPin,
  BookOpen,
  BookPlus,
  BellRing,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

interface Step {
  step: string
  Icon: LucideIcon
  title: string
  desc: string
}

const buySteps: Step[] = [
  { step: '01', Icon: ShoppingCart, title: 'Add to cart', desc: 'Find a book you love and add it to your cart.' },
  { step: '02', Icon: Handshake, title: 'Pay securely', desc: 'Your payment is protected with us.' },
  { step: '03', Icon: MapPin, title: 'We coordinate', desc: 'We handle the pickup, shipping and delivery.' },
  { step: '04', Icon: BookOpen, title: 'Start reading', desc: 'Receive your book and enjoy!' },
]

const sellSteps: Step[] = [
  { step: '01', Icon: BookPlus, title: 'List your book', desc: 'Create a listing in minutes with photos and details.' },
  { step: '02', Icon: BellRing, title: 'Get notified', desc: 'We notify you as soon as your book sells.' },
  { step: '03', Icon: MapPin, title: 'We coordinate', desc: 'Drop off or we arrange pickup and inspection.' },
  { step: '04', Icon: Wallet, title: 'Get paid', desc: 'Once the buyer confirms receipt, you get paid.' },
]

export default function HowItWorks() {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy')
  const steps = mode === 'buy' ? buySteps : sellSteps

  return (
    <section className="py-16 bg-white border-t border-third">
      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-14 flex-wrap gap-6">
          <h2 className="font-heading font-bold text-main text-3xl md:text-4xl">
            How it works
          </h2>

          {/* Buy/Sell toggle */}
          <div className="inline-flex bg-secondary/10 rounded-full p-1">
            <button
              type="button"
              onClick={() => setMode('buy')}
              className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${
                mode === 'buy' ? 'bg-secondary text-white' : 'text-main/50'
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => setMode('sell')}
              className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${
                mode === 'sell' ? 'bg-secondary text-white' : 'text-main/50'
              }`}
            >
              Sell
            </button>
          </div>

          <Link
            to="/how-it-works"
            className="hidden md:flex underline underline-offset-4 items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
          >
            Learn more
          </Link>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          <div className="hidden lg:block absolute top-[38px] left-[12.5%] right-[12.5%] border-t-2 border-dotted border-secondary/30 -z-0" />

          {steps.map(({ step, Icon, title, desc }) => (
            <div key={step} className="relative flex flex-col items-center text-center z-10">
              <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-5">
                <Icon size={28} className="text-secondary" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-secondary text-white text-[11px] font-bold flex items-center justify-center">
                  {parseInt(step, 10)}
                </span>
                <h3 className="font-heading font-bold text-main text-base">{title}</h3>
              </div>
              <p className="text-main/50 text-sm leading-relaxed max-w-[200px]">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            to="/how-it-works"
            className="inline-flex underline underline-offset-4 items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  )
}