import { Link } from 'react-router-dom'
import {
  Search,
  ShoppingCart,
  Handshake,
  BookOpen,
  BookPlus,
  BellRing,
  MapPin,
  Wallet
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
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  const { data: landingPage, isLoading: sectionsLoading } = useLandingPage()
  const sections = landingPage?.sections ?? []

  // ── Stats animation state ─────────────────────────────────────
  const statsRef = useRef<HTMLDivElement | null>(null)
  const [startCount, setStartCount] = useState(false)
  const [booksCount, setBooksCount] = useState(0)
  const [readersCount, setReadersCount] = useState(0)
  const [statesText, setStatesText] = useState("")
  const [countingDone, setCountingDone] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex(i => (i + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setQuoteIndex(i => (i + 1) % bookQuotes.length)
        setVisible(true)
      }, 500)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // ── Scroll trigger for stats (one-time) ───────────────────────
  useEffect(() => {
    const node = statsRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStartCount(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // ── Animated counters + typing effect ─────────────────────────
  useEffect(() => {
    if (!startCount) return

    const duration = 1800
    const startTime = performance.now()
    const booksTarget = 5000
    const readersTarget = 1200

    let rafId: number
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3)

      setBooksCount(Math.floor(eased * booksTarget))
      setReadersCount(Math.floor(eased * readersTarget))

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setBooksCount(booksTarget)
        setReadersCount(readersTarget)
        setCountingDone(true)
      }
    }

    rafId = requestAnimationFrame(tick)

    // Typing effect for "All"
    const word = "All"
    let i = 0
    setStatesText("")
    const typeInterval = setInterval(() => {
      i += 1
      setStatesText(word.slice(0, i))
      if (i >= word.length) clearInterval(typeInterval)
    }, 80)

    return () => {
      cancelAnimationFrame(rafId)
      clearInterval(typeInterval)
    }
  }, [startCount])

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

      {/* ── About ───────────────────────────────────────────────── */}
      <section className="py-20 bg-third border-t border-third">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Text */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                Our Story
              </p>
              <h2 className="font-heading font-bold text-main text-3xl md:text-4xl mb-6 leading-tight">
                Welcome to ALÁKÒWÉ
              </h2>
              <p className="text-main/60 text-sm leading-relaxed mb-5">
                ALÁKÒWÉ is a Yoruba word used to describe an educated or literate person. Here, anyone who has ever felt connected to a book and wanted someone else to feel it too, is included.
              </p>

              <p className="text-main/60 text-sm leading-relaxed mb-5">
                ALÁKÒWÉ, A New Way to Read
              </p>
              {/* <p className="text-main/60 text-sm leading-relaxed mb-8">
                Whether you're a student hunting for a textbook, a bibliophile expanding your collection, or someone clearing shelf space, ALÁKÒWÉ is the community for you.
              </p> */}
              <div
                ref={statsRef}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-main/10"
              >
                {[
                  {
                    value: `${booksCount.toLocaleString()}${countingDone ? '+' : ''}`,
                    label: 'Books Listed',
                  },
                  {
                    value: `${readersCount.toLocaleString()}${countingDone ? '+' : ''}`,
                    label: 'Happy Readers',
                  },
                  {
                    value: statesText,
                    label: 'States Covered',
                  },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="font-heading font-bold text-main text-2xl md:text-3xl">{value}</p>
                    <p className="text-main/45 text-xs mt-1 leading-snug">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual panel */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-main/5 p-6 flex flex-col gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center">
                  <BookOpen size={15} className="text-main" />
                </div>
                <h4 className="font-heading font-bold text-main text-base">Inspected Books</h4>
                <p className="text-main/50 text-xs leading-relaxed">Every book is physically checked before dispatch to ensure it matches the listing, always.</p>
              </div>
              <div className="bg-main p-6 flex flex-col gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Handshake size={15} className="text-white" />
                </div>
                <h4 className="font-heading font-bold text-white text-base">Escrow Protection</h4>
                <p className="text-white/50 text-xs leading-relaxed">Your payment is held until you confirm receipt. Sellers get paid only when you're satisfied.</p>
              </div>
              <div className="bg-secondary/10 p-6 flex flex-col gap-3 col-span-2">
                <h4 className="font-heading font-bold text-main text-base">Nationwide Delivery</h4>
                <p className="text-main/50 text-xs leading-relaxed">We coordinate pickup from sellers and delivery to your door across every state in Nigeria. Fast, reliable, and tracked.</p>
              </div>
            </div>
          </div>
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
            <h2 className="font-heading font-bold text-main text-3xl md:text-5xl tracking-tight max-w-3xl">Discover books, curated by condition and demand.</h2>
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
      <section className="bg-white py-24 border-t border-b border-third">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-main/40 mb-12">
            From the Pages
          </p>
          <div
            className="transition-opacity duration-500"
            style={{ opacity: visible ? 1 : 0 }}
          >
            <p className="font-heading font-bold text-main text-2xl md:text-3xl lg:text-4xl leading-snug">
              "{bookQuotes[quoteIndex].quote}"
            </p>
            <p className="mt-6 text-xs uppercase tracking-widest text-main/40 font-semibold">
              — {bookQuotes[quoteIndex].author}
            </p>
          </div>
        </div>
      </section>

      {/* ── How it Works ────────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-third">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

          {/* Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                Simple process
              </p>
              <h2 className="font-heading font-bold text-main text-3xl md:text-4xl">
                How does it works for buyers?
              </h2>
            </div>
            <Link
              to="/how-it-works"
              className="hidden md:flex underline underline-offset-4 items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
            >
              Learn more
            </Link>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {[
              {
                step: '01',
                Icon: Search,
                title: 'Browse & Find',
                desc: 'Search thousands of pre-loved books by title, author, or genre. Filter by location and price.',
              },
              {
                step: '02',
                Icon: ShoppingCart,
                title: 'Add to Cart',
                desc: 'Pay securely at checkout. Your money is held in escrow, released only when you confirm delivery.',
              },
              {
                step: '03',
                Icon: Handshake,
                title: 'We Coordinate',
                desc: 'We notify the seller, arrange collection, inspect the book, and prepare it for dispatch.',
              },
              {
                step: '04',
                Icon: BookOpen,
                title: 'Start Reading',
                desc: 'Your book arrives in 3–7 business days. Confirm receipt and the seller gets paid.',
              },
            ].map(({ step, Icon, title, desc }) => (
              <div key={step} className="flex flex-col">
                {/* Step number + icon row */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-heading font-bold text-4xl text-main/10 leading-none select-none">
                    {step}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-main" />
                  </div>
                </div>

                <h3 className="font-heading font-bold text-main text-lg mb-2">{title}</h3>
                <p className="text-main/50 text-sm leading-relaxed">{desc}</p>
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



      <section className="py-16 bg-white border-t border-third">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

          {/* Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-heading font-bold text-main text-3xl md:text-4xl">
                How does it works for sellers?
              </h2>
            </div>
            <Link
              to="/how-it-works"
              className="hidden md:flex underline underline-offset-4 items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
            >
              Learn more
            </Link>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {[
              {
                step: '01',
                Icon: BookPlus,
                title: 'List Your Books',
                desc: 'Create a listing in minutes. Set your price, upload photos, and share details about your book’s condition and edition.',
              },
              {
                step: '02',
                Icon: BellRing,
                title: 'Get Notified',
                desc: 'When your book sells, we send you a notification with the book details and instructions for the next steps.',
              },
              {
                step: '03',
                Icon: MapPin,
                title: 'We Coordinate',
                desc: 'You drop off the book at a nearby location or we arrange a pickup. We inspect the book to ensure it matches your listing before dispatch.',
              },
              {
                step: '04',
                Icon: Wallet,
                title: 'Get Paid',
                desc: 'Once the buyer confirms receipt, we release your payment. It’s that simple.',
              },
            ].map(({ step, Icon, title, desc }) => (
              <div key={step} className="flex flex-col">
                {/* Step number + icon row */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-heading font-bold text-4xl text-main/10 leading-none select-none">
                    {step}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-main" />
                  </div>
                </div>

                <h3 className="font-heading font-bold text-main text-lg mb-2">{title}</h3>
                <p className="text-main/50 text-sm leading-relaxed">{desc}</p>
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