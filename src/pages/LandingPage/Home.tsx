import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
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
import { blogPosts, bookQuotes, bookRequests, books } from '../../data/mockData'
import { useAuth } from '../../context/AuthContext'
import BookCard from '../../components/BookCard'
import heroImage1 from '../../assets/media/images/banny4.png'
import heroImage2 from '../../assets/media/images/banny2.png'
import heroImage3 from '../../assets/media/images/banny3.png'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

type Note = {
  id: number;
  quote: string;
  author: string;
  book: string;
  bgColor: string;
  tapeColor: string;
  borderColor: string;
  rotate?: string;
};

//ALÁKÒWÉ,
const heroSlides = [heroImage1, heroImage2, heroImage3]
const featuredBooks = books.slice(0, 8)

function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [slideIndex, setSlideIndex] = useState(0)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [visible, setVisible] = useState(true)


  const [joined, setJoined] = useState<Record<string, boolean>>({})
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [timestamps, setTimestamps] = useState<Record<string, number>>({})
  const [showModal, setShowModal] = useState(false)
  const [activeTitle, setActiveTitle] = useState("")

  // ── Stats animation state ─────────────────────────────────────
  const statsRef = useRef<HTMLDivElement | null>(null)
  const [startCount, setStartCount] = useState(false)
  const [booksCount, setBooksCount] = useState(0)
  const [readersCount, setReadersCount] = useState(0)
  const [statesText, setStatesText] = useState("")
  const [countingDone, setCountingDone] = useState(false)

  function handleJoinQueue(title: string) {
    if (joined[title]) return

    const newJoined = { ...joined, [title]: true }
    setJoined(newJoined)

    const newCounts = {
      ...counts,
      [title]:
        (counts[title] ||
          bookRequests.find(b => b.title === title)?.requestCount ||
          0) + 1,
    }

    setCounts(newCounts)

    const newTimestamps = {
      ...timestamps,
      [title]: Date.now(),
    }

    setTimestamps(newTimestamps)

    // SAVE TO LOCAL STORAGE
    localStorage.setItem("queueJoined", JSON.stringify(newJoined))
    localStorage.setItem("queueCounts", JSON.stringify(newCounts))
    localStorage.setItem("queueTime", JSON.stringify(newTimestamps))

    setActiveTitle(title)
    setShowModal(true)

    setTimeout(() => {
      setShowModal(false)
    }, 2000)
  }

  useEffect(() => {
    const savedJoined = localStorage.getItem("queueJoined")
    const savedCounts = localStorage.getItem("queueCounts")
    const savedTime = localStorage.getItem("queueTime")

    if (savedJoined) setJoined(JSON.parse(savedJoined))
    if (savedCounts) setCounts(JSON.parse(savedCounts))
    if (savedTime) setTimestamps(JSON.parse(savedTime))
  }, [])

  function formatTime(timestamp?: number, fallbackDays?: number) {
    if (!timestamp) {
      return fallbackDays === 1
        ? "1 day ago"
        : `${fallbackDays} days ago`
    }

    const diff = Date.now() - timestamp

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    // Just now
    if (seconds < 10) return "Just now"

    // Seconds
    if (seconds < 60) return `${seconds}s ago`

    // Minutes
    if (minutes < 60) {
      return minutes === 1
        ? "1 minute ago"
        : `${minutes} minutes ago`
    }

    // Hours + minutes (example: 1hr 30min ago)
    if (hours < 24) {
      const remainingMinutes = minutes % 60

      if (remainingMinutes === 0) {
        return hours === 1
          ? "1hr ago"
          : `${hours}hr ago`
      }

      return `${hours}hr ${remainingMinutes}min ago`
    }

    // Days
    if (days < 7) {
      return days === 1
        ? "1 day ago"
        : `${days} days ago`
    }

    const weeks = Math.floor(days / 7)
    if (weeks < 4) {
      return weeks === 1
        ? "1 week ago"
        : `${weeks} weeks ago`
    }

    const months = Math.floor(days / 30)
    if (months < 12) {
      return months === 1
        ? "1 month ago"
        : `${months} months ago`
    }

    const years = Math.floor(days / 365)
    return years === 1 ? "1 year ago" : `${years} years ago`
  }

  function handleIHaveThis() {
    navigate(user ? '/list' : '/login?redirect=/list')
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex(i => (i + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamps(prev => ({ ...prev }))
    }, 60000)

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
      <section className="relative w-full h-screen flex flex-col overflow-hidden">

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
              className="w-full sm:w-auto inline-flex justify-center items-center border border-white text-white font-semibold px-8 sm:px-10 py-3 sm:py-3.5 hover:bg-white hover:text-main transition-all duration-200 text-[11px] sm:text-xs tracking-widest uppercase rounded-full"
            >
              Browse Books
            </Link>
            <Link
              to="/list"
              className="w-full sm:w-auto inline-flex justify-center items-center border border-white bg-white text-main font-semibold px-8 sm:px-10 py-3 sm:py-3.5 hover:bg-white/85 transition-all duration-200 text-[11px] sm:text-xs tracking-widest uppercase rounded-full"
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

      {/* ── Featured Books ──────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

          {/* Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                Discover
              </p>
              <h2 className="font-heading font-bold text-main text-3xl md:text-4xl">
                Your Next Read
              </h2>
            </div>
            <Link
              to="/browse"
              className="hidden md:flex  underline underline-offset-4 items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
            >
              View all
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-8 text-center md:hidden">
            <Link
              to="/browse"
              className="inline-flex  underline underline-offset-4 items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
            >
              View all books
            </Link>
          </div>
        </div>
      </section>

      {/* DISCOVER BOOKS */}
      <div className='bg-white'>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6" id="discover-books">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-main">Discover books</h1>
            <a href="#" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              View more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>
          <div className="gap-4 pb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[24px]">
            {
              [
                {
                  title: "Atomic Habits",
                  author: "James Clear",
                  price: "₦5,000",
                  location: "Lekki, Lagos",
                  image:
                    "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1535115320i/40121378.jpg",
                },
                {
                  title: "It Ends With Us",
                  author: "Colleen Hoover",
                  price: "₦4,500",
                  location: "Yaba, Lagos",
                  image:
                    "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1688011813i/27362503.jpg",
                },
                {
                  title: "The Midnight Library",
                  author: "Matt Haig",
                  price: "₦5,500",
                  location: "Lekki, Lagos",
                  image:
                    "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg",
                },
                {
                  title: "The Psychology of Money",
                  author: "Morgan Housel",
                  price: "₦4,800",
                  location: "Ikeja, Lagos",
                  image:
                    "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1581527774i/41881472.jpg",
                },
                {
                  title: "The 48 Laws of Power",
                  author: "Robert Greene",
                  price: "₦6,000",
                  location: "Surulere, Lagos",
                  image:
                    "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1535115320i/40121378.jpg",
                },
                {
                  title: "Verity",
                  author: "Colleen Hoover",
                  price: "₦4,000",
                  location: "Lekki, Lagos",
                  image:
                    "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1634158558i/59344312.jpg",
                },
              ].map((book, index) => (
                <div className="min-w-[160px] snap-start flex-shrink-0 lg:min-w-0 rounded-[8px] border-[1px] border-[#E1E7EF] bg-[#FAFBFC] overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-[245px] bg-cover"
                    loading="lazy"
                  />

                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-text-main truncate">
                      {book.title}
                    </h3>
                    <p className="text-xs text-text-secondary truncate">{book.author}</p>

                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <p className="text-sm font-bold text-text-main">{book.price}</p>
                        <p className="text-xs text-text-muted flex items-center gap-1">
                          <svg
                            className="w-3 h-3 text-accent"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                          {book.location}
                        </p>
                      </div>

                      <button className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </section>
      </div>

      {/* CATEGORY ROWS */}
      <div className='bg-white'>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2" id="categories">
          <div className="flex items-center justify-between py-4 border-t border-border-light">
            <div className="flex items-center gap-3">
              <span className="text-lg">🏷️</span>
              <span className="text-sm font-semibold text-text-main">Books under ₦6,000</span>
            </div>
            <a href="#" className="text-[#172131] text-sm font-medium hover:underline flex items-center gap-1">
              View more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>
          <div className="flex items-center justify-between py-4 border-t border-border-light">
            <div className="flex items-center gap-3">
              <span className="text-lg">💜</span>
              <span className="text-sm font-semibold text-text-main">BookTok favourites</span>
            </div>
            <a href="#" className="text-[#172131] text-sm font-medium hover:underline flex items-center gap-1">
              View more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>
          <div className="flex items-center justify-between py-4 border-t border-border-light">
            <div className="flex items-center gap-3">
              <span className="text-lg">👤</span>
              <span className="text-sm font-semibold text-text-main">Nigerian authors</span>
            </div>
            <a href="#" className="text-[#172131] text-sm font-medium hover:underline flex items-center gap-1">
              View more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>
          <div className="flex items-center justify-between py-4 border-t border-border-light border-b">
            <div className="flex items-center gap-3">
              <span className="text-lg">⭐</span>
              <span className="text-sm font-semibold text-text-main">Recently added</span>
            </div>
            <a href="#" className="text-[#172131] text-sm font-medium hover:underline flex items-center gap-1">
              View more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>
        </section>
      </div>

      {/* NOTES SECTION */}
      <div className='bg-white'>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="notes">
          <h2 className="mb-8 text-2xl font-bold text-text-main sm:text-3xl">
            Notes from the pages
          </h2>

          <Swiper
            modules={[Autoplay, Pagination]}
            loop
            spaceBetween={12}
            // autoplay={{
            //   delay: 3000,
            //   disableOnInteraction: false,
            // }}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1.2,
              },
              420: {
                slidesPerView: 1.8,
              },
              520: {
                slidesPerView: 2,
              },
              640: {
                slidesPerView: 3,
              },
            }}
            className="pb-12 max-w-[900px] mx-auto"
          >
            <SwiperSlide>
              <div className="min-w-[240px] max-w-[260px] snap-start flex-shrink-0">
                <div className="bg-yellow-note rounded-2xl p-6 shadow-sm rotate-[-2deg] relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-yellow-200/60 rounded-sm" />
                  <p className="font-handwriting text-[14px] leading-relaxed text-gray-800 mb-6">
                    "I didn't expect this book to hit me like this..."
                  </p>
                  <div className="border-t border-yellow-300/50 pt-3">
                    <p className="text-sm font-semibold text-text-main">Tolu</p>
                    <p className="text-xs text-text-secondary">The Midnight Library</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="min-w-[240px] max-w-[260px] snap-start flex-shrink-0">
                <div className="bg-pink-note rounded-2xl p-6 shadow-sm rotate-[1deg] relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-pink-200/60 rounded-sm" />
                  <p className="font-handwriting text-[14px] leading-relaxed text-gray-800 mb-6">
                    "This one healed a part of me I didn't know was hurting."
                  </p>
                  <div className="border-t border-pink-300/50 pt-3">
                    <p className="text-sm font-semibold text-text-main">Feyi</p>
                    <p className="text-xs text-text-secondary">Homegoing</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="min-w-[240px] max-w-[260px] snap-start flex-shrink-0">
                <div className="bg-blue-note rounded-2xl p-6 shadow-sm rotate-[-1deg] relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-blue-200/60 rounded-sm" />
                  <p className="font-handwriting text-[14px] leading-relaxed text-gray-800 mb-6">
                    "Couldn't put it down. Read it in one sitting!"
                  </p>
                  <div className="border-t border-blue-300/50 pt-3">
                    <p className="text-sm font-semibold text-text-main">David</p>
                    <p className="text-xs text-text-secondary">The Alchemist</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="min-w-[240px] max-w-[260px] snap-start flex-shrink-0">
                <div className="bg-yellow-note rounded-2xl p-6 shadow-sm rotate-[-2deg] relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-yellow-200/60 rounded-sm" />
                  <p className="font-handwriting text-[14px] leading-relaxed text-gray-800 mb-6">
                    "I didn't expect this book to hit me like this..."
                  </p>
                  <div className="border-t border-yellow-300/50 pt-3">
                    <p className="text-sm font-semibold text-text-main">Tolu</p>
                    <p className="text-xs text-text-secondary">The Midnight Library</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="min-w-[240px] max-w-[260px] snap-start flex-shrink-0">
                <div className="bg-pink-note rounded-2xl p-6 shadow-sm rotate-[1deg] relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-pink-200/60 rounded-sm" />
                  <p className="font-handwriting text-[14px] leading-relaxed text-gray-800 mb-6">
                    "This one healed a part of me I didn't know was hurting."
                  </p>
                  <div className="border-t border-pink-300/50 pt-3">
                    <p className="text-sm font-semibold text-text-main">Feyi</p>
                    <p className="text-xs text-text-secondary">Homegoing</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="min-w-[240px] max-w-[260px] snap-start flex-shrink-0">
                <div className="bg-blue-note rounded-2xl p-6 shadow-sm rotate-[-1deg] relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-blue-200/60 rounded-sm" />
                  <p className="font-handwriting text-[14px] leading-relaxed text-gray-800 mb-6">
                    "Couldn't put it down. Read it in one sitting!"
                  </p>
                  <div className="border-t border-blue-300/50 pt-3">
                    <p className="text-sm font-semibold text-text-main">David</p>
                    <p className="text-xs text-text-secondary">The Alchemist</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>
      </div>

      {/* LOOKING FOR SOMETHING */}
      <div className='bg-white'>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="requests">
          <div className="flex items-start sm:items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-main">Looking for something?</h2>
              <p className="text-sm text-text-secondary mt-1">Join others waiting for books that are not yet listed.</p>
            </div>
            <a href="#" className="text-primary text-sm font-medium hover:underline flex items-center gap-1 mt-1 sm:mt-0 whitespace-nowrap">
              View more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>
          <div className="gap-4 pb-4 pt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="min-w-[200px] snap-start flex-shrink-0 lg:min-w-0 border border-border-light rounded-xl p-4 hover:shadow-md transition">
              <h3 className="text-sm font-bold text-text-main leading-tight">Fourth Wing</h3>
              <p className="text-xs text-text-secondary mt-0.5">Rebecca Yarros</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-text-secondary">
                <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
                25 readers waiting
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="inline-flex items-center gap-1 text-xs text-accent-red font-medium">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.88 10.07 9.29 13.12C9.34 13.22 9.39 13.32 9.39 13.44C9.39 13.66 9.22 13.85 9.01 13.92C8.77 14.01 8.53 13.92 8.36 13.74C8.32 13.69 8.28 13.64 8.24 13.58C7.15 12.08 6.98 10.04 7.68 8.36C5.82 10.04 4.91 12.64 5.12 15.04C5.16 15.44 5.21 15.84 5.33 16.22C5.42 16.71 5.58 17.18 5.79 17.63C6.58 19.22 8.14 20.42 9.87 20.81C11.73 21.24 13.76 20.98 15.34 19.87C17.1 18.64 18.11 16.42 17.97 14.3C17.94 13.83 17.84 13.37 17.66 12.93L17.66 11.2Z" /></svg>
                  High demand
                </span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-dark transition">Join waitlist</button>
                <button className="px-3 py-1.5 border border-border-light text-text-main text-xs font-medium rounded-lg hover:bg-surface-alt transition">List this book</button>
              </div>
            </div>
            <div className="min-w-[200px] snap-start flex-shrink-0 lg:min-w-0 border border-border-light rounded-xl p-4 hover:shadow-md transition">
              <h3 className="text-sm font-bold text-text-main leading-tight">A Court of Thorns and Roses</h3>
              <p className="text-xs text-text-secondary mt-0.5">Sarah J. Maas</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-text-secondary">
                <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
                18 readers waiting
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="inline-flex items-center gap-1 text-xs text-accent-red font-medium">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.88 10.07 9.29 13.12C9.34 13.22 9.39 13.32 9.39 13.44C9.39 13.66 9.22 13.85 9.01 13.92C8.77 14.01 8.53 13.92 8.36 13.74C8.32 13.69 8.28 13.64 8.24 13.58C7.15 12.08 6.98 10.04 7.68 8.36C5.82 10.04 4.91 12.64 5.12 15.04C5.16 15.44 5.21 15.84 5.33 16.22C5.42 16.71 5.58 17.18 5.79 17.63C6.58 19.22 8.14 20.42 9.87 20.81C11.73 21.24 13.76 20.98 15.34 19.87C17.1 18.64 18.11 16.42 17.97 14.3C17.94 13.83 17.84 13.37 17.66 12.93L17.66 11.2Z" /></svg>
                  High demand
                </span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-dark transition">Join waitlist</button>
                <button className="px-3 py-1.5 border border-border-light text-text-main text-xs font-medium rounded-lg hover:bg-surface-alt transition">List this book</button>
              </div>
            </div>
            <div className="min-w-[200px] snap-start flex-shrink-0 lg:min-w-0 border border-border-light rounded-xl p-4 hover:shadow-md transition">
              <h3 className="text-sm font-bold text-text-main leading-tight">The Song of Achilles</h3>
              <p className="text-xs text-text-secondary mt-0.5">Madeline Miller</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-text-secondary">
                <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
                12 readers waiting
              </div>
              <div className="flex items-center gap-2 mt-4 pt-2">
                <button className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-dark transition">Join waitlist</button>
                <button className="px-3 py-1.5 border border-border-light text-text-main text-xs font-medium rounded-lg hover:bg-surface-alt transition">List this book</button>
              </div>
            </div>
            <div className="min-w-[200px] snap-start flex-shrink-0 lg:min-w-0 border border-border-light rounded-xl p-4 hover:shadow-md transition">
              <h3 className="text-sm font-bold text-text-main leading-tight">Things Fall Apart</h3>
              <p className="text-xs text-text-secondary mt-0.5">Chinua Achebe</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-text-secondary">
                <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
                9 readers waiting
              </div>
              <div className="flex items-center gap-2 mt-4 pt-2">
                <button className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-dark transition">Join waitlist</button>
                <button className="px-3 py-1.5 border border-border-light text-text-main text-xs font-medium rounded-lg hover:bg-surface-alt transition">List this book</button>
              </div>
            </div>
          </div>
        </section>
      </div>

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
      <section className="py-20 bg-white border-t border-third">
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


      <section className="py-5 bg-white border-t border-third">
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


      {/* ── Book Requests ───────────────────────────────────────── */}
      <section className="py-20 bg-third border-t border-third">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

          {/* Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                Community
              </p>
              <h2 className="font-heading font-bold text-main text-3xl md:text-4xl">
                Book Requests
              </h2>
              <p className="text-main/50 text-sm mt-2 max-w-md">
                Can't find what you're looking for? Post a request and we will notify you when we have it.
              </p>
            </div>
          </div>

          {/* Request cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookRequests.map(req => (
              <div key={req.id} className="bg-white p-5 flex flex-col gap-4">
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-main text-base leading-snug">{req.title}</h3>
                  {req.author && (
                    <p className="text-xs text-main/45 mt-0.5">{req.author}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[11px]">
                  <span className="font-semibold text-secondary">
                    {(counts[req.title] ?? req.requestCount)}
                    {(counts[req.title] ?? req.requestCount) === 1
                      ? ' person needs this'
                      : ' people need this'}
                  </span>
                  <span className="text-main/35">
                    {formatTime(timestamps[req.title], req.daysAgo)}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1 border-t border-third">
                  <button
                    disabled={joined[req.title]}
                    onClick={() => handleJoinQueue(req.title)}
                    className={`text-[11px] font-semibold tracking-widest uppercase px-4 py-2 transition-colors shrink-0 rounded-full
                    ${joined[req.title]
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-main text-white hover:bg-main/85'}`}
                  >
                    {joined[req.title] ? "Joined" : "Join Queue"}
                  </button>
                  <button
                    onClick={handleIHaveThis}
                    className="text-[11px] font-semibold text-main/50 hover:text-secondary transition-colors underline underline-offset-2"
                  >
                    I have this
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <p className="text-sm text-main/50">
              Looking for a specific book? Let the community help you find it.
            </p>

            <Link
              to="/requests"
              className="inline-flex items-center gap-2 bg-main text-white font-semibold px-7 py-3 text-[11px] tracking-widest uppercase hover:bg-main/85 transition-colors shrink-0 rounded-full"
            >
              View all requests <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Blog ────────────────────────────────────────────────── */}
      <section className="py-28 bg-third">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

          {/* Header */}
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                Our Blog
              </p>
              <h2 className="font-heading font-bold text-main text-4xl md:text-5xl max-w-md leading-tight">
                Stories &amp; Insights
              </h2>
            </div>
            <Link
              to="/blog"
              className="hidden md:flex underline underline-offset-4 items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
            >
              View all posts
            </Link>
          </div>

          {/* Blog cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group flex flex-col"
              >
                {/* Image area */}
                <div className="overflow-hidden aspect-video bg-secondary/10 flex items-center justify-center mb-5">
                  <span className="font-heading font-bold text-8xl text-secondary/20 group-hover:text-secondary/35 group-hover:scale-110 transition-all duration-500 select-none">
                    ✦
                  </span>
                </div>

                {/* Meta */}
                <p className="text-[10px] font-semibold uppercase tracking-widest text-main/40 mb-3">
                  {post.date}
                </p>

                {/* Title */}
                <h3 className="font-heading font-bold text-main text-lg leading-snug mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-main/55 leading-relaxed line-clamp-2 flex-1">
                  {post.excerpt}
                </p>

                {/* Read more */}
                <span className="mt-4 text-sm font-semibold text-main/60 group-hover:text-secondary transition-colors underline underline-offset-4 decoration-main/20 group-hover:decoration-secondary">
                  Read more
                </span>
              </Link>
            ))}
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
              className="inline-flex items-center justify-center gap-2 bg-white text-main font-semibold px-8 py-3.5 text-sm hover:bg-white/90 transition-colors rounded-full"
            >
              Browse Books <ArrowRight size={14} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-8 py-3.5 text-sm hover:border-white transition-colors rounded-full"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>


      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-[90%] text-center 
            animate-[modalIn_.45s_cubic-bezier(.34,1.56,.64,1)]">

            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 
              flex items-center justify-center
              animate-[modalIn_.55s_cubic-bezier(.34,1.56,.64,1)]">
              ✓
            </div>

            <h3 className="font-heading font-bold text-lg text-main mb-2">
              Added to Queue
            </h3>

            <p className="text-sm text-main/60">
              You'll be notified when this book becomes available.
            </p>

          </div>
        </div>
      )}
    </div>
  )
}

export default Home