import { Link } from 'react-router-dom'
import {
  Search,
  ShoppingCart,
  Handshake,
  BookOpen,
  BookPlus,
  BellRing,
  MapPin,
  Wallet,
  Shield,
  Truck
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { bookQuotes } from '../../data/mockData'
import BookCarousel from '../../components/BookCarousel'
import BookCard from '../../components/BookCard'
import { useLandingPage } from '../../lib/api/listings/listings.hooks'
import { listingToBookDisplay } from '../../lib/api/adapters'
import heroImage1 from '../../assets/media/images/banny4.png'
import heroImage2 from '../../assets/media/images/banny2.png'
import heroImage3 from '../../assets/media/images/banny3.png'
//ALÁKÒWÉ,
const heroSlides = [heroImage1, heroImage2, heroImage3]

function Home() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0)
  const [howItWorksTab, setHowItWorksTab] = useState<'buy' | 'sell'>('buy')

  const { data: landingPage, isLoading: sectionsLoading } = useLandingPage()
  const sections = landingPage?.sections ?? []

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex(i => (i + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative w-full h-[calc(90vh-100px)] flex flex-col overflow-hidden">

        {/* Background slides */}
        {heroSlides.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
            style={{ opacity: i === slideIndex ? 1 : 0 }}
          />
        ))}

        {/* Uniform dark overlay */}
        <div className="absolute inset-0 bg-main/50" />

        {/* Centered content */}
        <div className="relative flex-1 flex flex-col items-center justify-center text-center px-5 sm:px-8">
          <p className="text-white/70 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] sm:tracking-[0.35em] mb-4 sm:mb-5">
            Nigeria's Trusted Used Books Marketplace
          </p>

          <h1 className="font-heading font-bold text-white uppercase leading-none mb-4 sm:mb-5 text-3xl sm:text-5xl md:text-6xl xl:text-7xl max-w-xs sm:max-w-xl md:max-w-3xl">
            Buy, Sell & Request Used Books
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              to="/browse"
              className="w-full sm:w-auto inline-flex justify-center items-center border border-white text-white font-semibold px-8 sm:px-10 py-3 sm:py-3.5 hover:bg-white hover:text-main transition-all duration-200 text-[11px] sm:text-xs tracking-widest uppercase rounded-xl"
            >
              Browse Books
            </Link>
            <Link
              to="/list"
              className="w-full sm:w-auto inline-flex justify-center items-center border border-white bg-white text-main font-semibold px-8 sm:px-10 py-3 sm:py-3.5 hover:bg-white/85 transition-all duration-200 text-[11px] sm:text-xs tracking-widest uppercase rounded-xl"
            >
              List a Book
            </Link>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="relative flex items-center justify-center gap-2.5 pb-6 sm:pb-8">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={`rounded-full transition-all duration-300 ${i === slideIndex ? 'w-2.5 h-2.5 bg-white' : 'w-2 h-2 bg-white/40'}`}
            />
          ))}
        </div>
      </section>


      {/* ── The Store ────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

          {/* Header */}
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
              The Store
            </p>
            <p className="text-main/55 text-sm md:text-base mt-3 max-w-2xl">Hand-picked listings from readers across Nigeria — refreshed daily.</p>
          </div>

          {/* Dynamic sections from API */}
          {sectionsLoading && (
            <div className="py-12 text-center text-main/40 text-sm">Loading collections...</div>
          )}

          {sections.map((section) => {
            const listings = (section.listings ?? []).map(listingToBookDisplay)
            if (listings.length === 0) return null

            const iconMap: Record<string, React.ReactNode> = {
              category: <span className="text-amber-400">✦</span>,
              collection: <span className="text-red-400">🔥</span>,
              tag: <span className="text-amber-500">☆</span>,
            }

            const filterKey = section.sectionType ?? "category"
            const filterValue = section.filterParam?.[filterKey] ?? ""

            return (
              <div key={section.id} className="mb-14">
                <BookCarousel
                  label={section.title ?? "Featured"}
                  icon={iconMap[filterKey]}
                  seeAllLink={`/browse?${filterKey}=${filterValue}`}
                >
                  {listings.map((book) => (
                    <div key={book.id} className="shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-[20%] px-1.5 sm:px-2 snap-start">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <BookCard book={book as any} />
                    </div>
                  ))}
                </BookCarousel>
              </div>
            )
          })}

          {!sectionsLoading && sections.length === 0 && (
            <div className="py-12 text-center text-main/40 text-sm">
              No collections available yet. Check back soon!
            </div>
          )}

          {/* Mobile CTA */}
          <div className="mt-8 text-center md:hidden">
            <Link
              to="/browse"
              className="inline-flex underline underline-offset-4 items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
            >
              View all books
            </Link>
          </div>
        </div>
      </section>

      {/* ── Book Quotes ─────────────────────────────────────────── */}
      <section className="bg-white py-20 border-t border-b border-third">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">
          {/* Header */}
          <div className="mb-12 text-left">
            <h2 className="font-heading font-bold text-main text-3xl">
              Notes from the pages
            </h2>
          </div>

          {/* Cards Grid / Carousel */}
          <div className="relative">
            {/* On desktop: show all three cards in a grid */}
            <div className="hidden lg:grid grid-cols-3 gap-8">
              {bookQuotes.map((item, idx) => (
                <div
                  key={idx}
                  className="relative bg-[#FFFDF0] pt-12 pb-8 px-8 rounded-lg shadow-[0_10px_25px_-5px_rgba(23,33,49,0.05)] flex flex-col min-h-[220px] transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* Tape decoration */}
                  <div className="absolute -top-2 w-14 h-4 bg-slate-400/20 rounded-[3px] shadow-sm border border-white/20 left-1/2 -translate-x-1/2" />

                  {/* Quote text (handwritten) */}
                  <p className="font-handwritten text-[24px] text-main/90 leading-relaxed font-medium mb-8">
                    "{item.quote}"
                  </p>

                  {/* Author */}
                  <p className="font-heading font-bold text-xs text-main mt-auto self-start">
                    {item.author}
                  </p>
                </div>
              ))}
            </div>

            {/* On mobile/tablet: show only the active card with slider dots */}
            <div className="lg:hidden flex flex-col items-center">
              <div className="w-full max-w-md relative bg-[#FFFDF0] pt-12 pb-8 px-8 rounded-lg shadow-[0_10px_25px_-5px_rgba(23,33,49,0.05)] flex flex-col min-h-[220px]">
                {/* Tape decoration */}
                <div className="absolute -top-2 w-14 h-4 bg-slate-400/20 rounded-[3px] shadow-sm border border-white/20 left-1/2 -translate-x-1/2" />

                {/* Quote text (handwritten) */}
                <p className="font-handwritten text-[24px] text-main/90 leading-relaxed font-medium mb-8">
                  "{bookQuotes[activeQuoteIndex].quote}"
                </p>

                {/* Author */}
                <p className="font-heading font-bold text-xs text-main mt-auto self-start">
                  {bookQuotes[activeQuoteIndex].author}
                </p>
              </div>

              {/* Mobile pagination dots */}
              <div className="flex gap-2.5 mt-8">
                {bookQuotes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveQuoteIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      activeQuoteIndex === idx ? 'bg-main w-5' : 'bg-main/20'
                    }`}
                    aria-label={`Go to quote ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop pagination dots matching mockup layout */}
            <div className="hidden lg:flex items-center justify-center gap-2 mt-12">
              <span className="w-2.5 h-2.5 rounded-full bg-main" />
              <span className="w-2.5 h-2.5 rounded-full bg-main/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-main/20" />
            </div>
          </div>
        </div>
      </section>

      {/* ── How it Works ────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-third">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16">
            <h2 className="font-heading font-bold text-main text-3xl md:text-4xl">
              How it works
            </h2>

            {/* Toggle Container */}
            <div className="flex bg-[#f5f6fa] p-1 rounded-full border border-main/5 self-start sm:self-center">
              <button
                onClick={() => setHowItWorksTab('buy')}
                className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${
                  howItWorksTab === 'buy'
                    ? 'bg-secondary text-white shadow-sm'
                    : 'text-main/40 hover:text-main'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setHowItWorksTab('sell')}
                className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${
                  howItWorksTab === 'sell'
                    ? 'bg-secondary text-white shadow-sm'
                    : 'text-main/40 hover:text-main'
                }`}
              >
                Sell
              </button>
            </div>

            <Link
              to="/how-it-works"
              className="text-sm font-semibold text-secondary hover:underline underline-offset-2 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Learn more</span>
              <span className="text-base">&rarr;</span>
            </Link>
          </div>

          {/* Steps Display */}
          <div className="relative">
            {/* Horizontal Dashed Line (Desktop Only) */}
            <div className="absolute top-[36px] left-[12%] right-[12%] h-[1px] border-t border-dashed border-secondary/30 -z-10 hidden lg:block" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {(howItWorksTab === 'buy'
                ? [
                    {
                      step: 1,
                      Icon: ShoppingCart,
                      title: 'Add to cart',
                      desc: 'Find a book you love and add it to your cart.',
                    },
                    {
                      step: 2,
                      Icon: Shield,
                      title: 'Pay securely',
                      desc: 'Your payment is protected with us.',
                    },
                    {
                      step: 3,
                      Icon: Truck,
                      title: 'We coordinate',
                      desc: 'We handle the pickup, shipping and delivery.',
                    },
                    {
                      step: 4,
                      Icon: BookOpen,
                      title: 'Start reading',
                      desc: 'Receive your book and enjoy!',
                    },
                  ]
                : [
                    {
                      step: 1,
                      Icon: BookPlus,
                      title: 'List your books',
                      desc: 'Create a listing in minutes with photos and price.',
                    },
                    {
                      step: 2,
                      Icon: BellRing,
                      title: 'Get notified',
                      desc: 'Receive details immediately when your book sells.',
                    },
                    {
                      step: 3,
                      Icon: Truck,
                      title: 'We coordinate',
                      desc: 'We arrange collection and inspect the book.',
                    },
                    {
                      step: 4,
                      Icon: Wallet,
                      title: 'Get paid',
                      desc: 'Receive your money once the buyer confirms receipt.',
                    },
                  ]
              ).map(({ step, Icon, title, desc }) => (
                <div key={step} className="flex flex-col items-center text-center px-4">
                  {/* Icon Circle */}
                  <div className="w-[72px] h-[72px] rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-6 shrink-0 relative z-10 hover:scale-105 transition-transform duration-300">
                    <Icon size={22} className="text-secondary" />
                  </div>

                  {/* Title & Step Number */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="w-5 h-5 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {step}
                    </span>
                    <h3 className="font-heading font-bold text-main text-base">{title}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-main/60 text-sm leading-relaxed max-w-[240px] mx-auto">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="bg-main py-28">
        <div className="max-w-2xl mx-auto px-4 md:px-6 lg:px-12 flex flex-col items-center text-center gap-8">
          <div>
            <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-4">
              Start Today
            </p>
            <h2 className="font-heading font-bold text-white text-4xl md:text-5xl leading-tight mb-5">
              Ready to find your next read?
            </h2>
            <p className="text-white/55 text-sm leading-relaxed">
              Discover affordable used books from readers across Nigeria. Buy, sell, and keep great stories moving.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/browse"
              className="inline-flex items-center justify-center gap-2 bg-white text-main font-semibold px-8 py-3.5 text-sm hover:bg-white/90 transition-colors rounded-xl"
            >
              Browse Books
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-8 py-3.5 text-sm hover:border-white transition-colors rounded-xl"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>


    </div>
  )
}

export default Home