import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  ShoppingCart,
  BookOpen,
  BookPlus,
  BellRing,
  Wallet,
  Shield,
  Truck,
} from 'lucide-react'
import { bookQuotes } from '../../data/mockData'
import BookCarousel from '../../components/BookCarousel'
import BookCard from '../../components/BookCard'
import { useLandingPage } from '../../lib/api/listings/listings.hooks'
import { listingToBookDisplay } from '../../lib/api/adapters'
import BookRequestsSection from '../../components/BookRequestsSection'
import heroImage2 from '../../assets/media/images/banny2.png'
import heroImage3 from '../../assets/media/images/banny3.png'

/* ── Promo Insert Cards ─────────────────────────────────────────── */
const promoInserts = [
  {
    id: 'sell-why',
    accentColor: 'bg-emerald-50/70 border-emerald-100',
    question: 'Why do I need to sell my books?',
    answer: `Because every 25 books successfully sold on Alákòwé helps save one tree, hence, giving books, and our planet, a longer life. Also, by passing on the books you've finished, you're helping someone else discover their next great read.`,
    buttonLabel: 'Learn More',
    buttonTo: '/how-it-works',
  },
  {
    id: 'sell-alakowe',
    accentColor: 'bg-violet-50/60 border-violet-100',
    question: 'Why do I need to sell them on Alákòwé?',
    answer: 'Because Alákòwé was built by readers, for readers, so we understand the value of books. Every book you sell on Alákòwé helps grow a community where great books keep moving.',
    buttonLabel: 'List a Book',
    buttonTo: '/list',
  },
  {
    id: 'bookstore-dream',
    accentColor: 'bg-indigo-50/60 border-indigo-100',
    question: 'Want to start the bookstore of your dreams?',
    answer: `You already have the books. We'll give you the bookstore. Once your first book is approved, you automatically get your own bookstore page where readers can browse everything you're selling. Consider it your own little corner of Alákòwé.`,
    buttonLabel: 'View Sample Bookstore',
    buttonTo: '/store/sample',
  },
  {
    id: 'who-buying-from',
    accentColor: 'bg-amber-50/60 border-amber-100',
    question: 'Who am I buying from on Alákòwé?',
    answer: `From readers just like you. Every book on Alákòwé comes from someone's shelf: students, teachers, parents, collectors, and fellow book lovers who believe every great book deserves another reader.`,
    buttonLabel: 'Browse Books',
    buttonTo: '/browse',
  },
  {
    id: 'bottomline',
    accentColor: 'bg-rose-50/50 border-rose-100',
    question: 'Our bottomline',
    answer: `Every order matters. We're committed to making sure buyers receive the books they paid for and sellers get paid for the books they sell. If you ever have a question or concern, our team — made up of real humans — is here to help.`,
    buttonLabel: 'Contact Us',
    buttonTo: '/contact',
  },
]

function PromoInsert({ promo }: { promo: typeof promoInserts[0] }) {
  const [expanded, setExpanded] = useState(false)
  const MAX_CHARS = 110
  const isLong = promo.answer.length > MAX_CHARS
  const displayText = isLong && !expanded ? `${promo.answer.slice(0, MAX_CHARS)}…` : promo.answer

  return (
    <div className={`rounded-2xl border ${promo.accentColor} px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 transition-all`}>
      <div className="min-w-0 flex-1">
        <h4 className="font-heading font-bold text-main text-sm sm:text-base leading-snug mb-1">
          {promo.question}
        </h4>
        <p className="text-xs sm:text-sm text-main/65 leading-relaxed max-w-2xl">
          {displayText}
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-0.5 text-xs font-semibold text-secondary hover:underline ml-1.5 focus:outline-none"
            >
              <span>{expanded ? 'Show less' : 'Show more'}</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </p>
      </div>

      <Link
        to={promo.buttonTo}
        className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-secondary hover:underline underline-offset-2 transition-colors whitespace-nowrap self-start sm:self-center"
      >
        <span>{promo.buttonLabel}</span>
        <span className="text-sm">&rarr;</span>
      </Link>
    </div>
  )
}

function Home() {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0)
  const [howItWorksTab, setHowItWorksTab] = useState<'buy' | 'sell'>('buy')

  const { data: landingPage, isLoading: sectionsLoading } = useLandingPage()
  const sections = landingPage?.sections ?? []

  useEffect(() => {
    // no-op: hero is static per breakpoint (mobile vs desktop)
  }, [])

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative w-full h-[60vh] min-h-[460px] flex flex-col overflow-hidden">

        {/* Background images: mobile uses banny3, desktop uses banny2 */}
        <img
          src={heroImage3}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 lg:hidden"
        />
        <img
          src={heroImage2}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 hidden lg:block"
        />

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

        {/* Static hero per breakpoint (no pagination dots) */}
      </section>


      {/* ── The Store ────────────────────────────────────────────── */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4 md:px-6">

          {/* Header */}
          {/* <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
              The Store
            </p>
          </div> */}

          {/* Dynamic sections from API */}
          {sectionsLoading && (
            <div className="py-12 text-center text-main/40 text-sm">Loading collections...</div>
          )}

          {(() => {
            // Filter out empty sections first
            const validSections = sections.filter(
              (s) => (s.listings ?? []).length > 0
            )
            const iconMap: Record<string, React.ReactNode> = {
              category: <span className="text-amber-400">✦</span>,
              collection: <span className="text-red-400">🔥</span>,
              tag: <span className="text-amber-500">☆</span>,
            }
            const result: React.ReactNode[] = []
            let promoIndex = 0

            const pushPromo = (index: number) => {
              const promo = promoInserts[index]
              if (promo.id === 'bottomline') {
                result.push(<BookRequestsSection key="looking-for-something" />)
              }
              result.push(<PromoInsert key={`promo-${index}`} promo={promo} />)
            }

            validSections.forEach((section, idx) => {
              const listings = (section.listings ?? []).map(listingToBookDisplay)
              const filterKey = section.sectionType ?? "category"
              const filterValue = section.filterParam?.[filterKey] ?? ""

              result.push(
                <div key={section.id} className="mb-10">
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

              // After every 2 sections, insert a promo card
              if ((idx + 1) % 2 === 0 && promoIndex < promoInserts.length) {
                pushPromo(promoIndex)
                promoIndex++
              }
            })

            // If there are remaining promos after the last sections, append them
            while (promoIndex < promoInserts.length) {
              pushPromo(promoIndex)
              promoIndex++
            }

            return result
          })()}

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
      <section className="bg-white py-12 border-t border-b border-third">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-8 text-left">
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
            <div className="hidden lg:flex items-center justify-center gap-2 mt-8">
              <span className="w-2.5 h-2.5 rounded-full bg-main" />
              <span className="w-2.5 h-2.5 rounded-full bg-main/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-main/20" />
            </div>
          </div>
        </div>
      </section>

      {/* ── How it Works ────────────────────────────────────────── */}
      <section className="py-12 bg-white border-t border-third">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
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
      <section className="bg-main py-16">
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