import { Link } from 'react-router-dom'
import { ArrowRight, Search, ShoppingCart, Handshake, BookOpen } from 'lucide-react'
import { useState, useEffect } from 'react'
import { blogPosts, bookQuotes, books } from '../../data/mockData'
import BookCard from '../../components/BookCard'
import heroImage1 from '../../assets/media/images/Website landing page image (white bg).jpg'
import heroImage2 from '../../assets/media/images/Tranquil Study with Cactus and Pastel Books.png'
import heroImage3 from '../../assets/media/images/Books with Elegant Bookend.png'

const heroSlides = [heroImage1, heroImage2, heroImage3]
const featuredBooks = books.slice(0, 8)

function Home() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [visible, setVisible] = useState(true)

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
    }, 6000)
    return () => clearInterval(interval)
  }, [])

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
            Read it. Love it. Pass it on.
          </h1>

          <p className="text-white/65 text-xs sm:text-sm md:text-base leading-relaxed mb-8 sm:mb-10 max-w-xs sm:max-w-sm md:max-w-md">
            Sometimes, you are just a good book away from a good mood
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              to="/browse"
              className="w-full sm:w-auto inline-flex justify-center items-center border border-white text-white font-semibold px-8 sm:px-10 py-3 sm:py-3.5 hover:bg-white hover:text-main transition-all duration-200 text-[11px] sm:text-xs tracking-widest uppercase"
            >
              Browse Books
            </Link>
            <Link
              to="/list"
              className="w-full sm:w-auto inline-flex justify-center items-center border border-white bg-white text-main font-semibold px-8 sm:px-10 py-3 sm:py-3.5 hover:bg-white/85 transition-all duration-200 text-[11px] sm:text-xs tracking-widest uppercase"
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
                How does it work?
              </h2>
            </div>
            <Link
              to="/browse"
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
                desc: 'Pay securely at checkout. Your money is held in escrow — released only when you confirm delivery.',
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
              to="/browse"
              className="inline-flex underline underline-offset-4 items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
            >
              Learn more
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
                to={`/blog/${post.id}`}
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
              Discover affordable used books from readers across Nigeria — buy, sell, and keep great stories moving.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/browse"
              className="inline-flex items-center justify-center gap-2 bg-white text-main font-semibold px-8 py-3.5 text-sm hover:bg-white/90 transition-colors"
            >
              Browse Books <ArrowRight size={14} />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-8 py-3.5 text-sm hover:border-white transition-colors"
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
