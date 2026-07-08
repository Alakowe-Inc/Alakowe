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
import NotesCarousel from './NotesCarousel'
import HowItWork from './HowItWork'
import LookingForSomething from './LookingForSomething'
import Hero from './Hero'
//ALÁKÒWÉ,
// const heroSlides = [heroImage2, heroImage3]

function Home() {
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
      <Hero />

      {/* ── The Store ────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

          {/* Header */}
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
              Discover Books
            </p>
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
      <NotesCarousel/>

       {/* ── Looking For Something ─────────────────────────────────────────── */}
     
      <LookingForSomething/>
      
      {/* ── How it Works ────────────────────────────────────────── */}
      
      <HowItWork/>
          

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