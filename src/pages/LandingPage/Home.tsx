import { Link } from 'react-router-dom'
import { ArrowRight, Search, ShoppingCart, Handshake, BookOpen } from 'lucide-react'
import { blogPosts, bookQuotes, books } from '../../data/mockData'
import BookCard from '../../components/BookCard'
import heroImage from '../../assets/media/images/Tranquil Study with Cactus and Pastel Books.png'
import quoteBg from '../../assets/media/images/Books with Elegant Bookend.png'


const featuredBooks = books.slice(0, 8)

function Home() {
  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[88vh] flex flex-col overflow-hidden">

        {/* Background image */}
        <img
          src={heroImage}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark overlay — heavier left, fades right */}
        <div className="absolute inset-0 bg-linear-to-r from-main/92 via-main/70 to-main/25" />
        {/* Extra bottom fade for cards */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-main/60 to-transparent" />

        {/* Content wrapper */}
        <div className="relative flex-1 flex flex-col max-w-8xl mx-auto px-4 md:px-6 lg:px-12 w-full">

          {/* Main content — vertically centred */}
          <div className="flex-1 flex items-end py-18 lg:py-28">
            <div className="max-w-xl">

              <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-6">
                Nigeria's Used Book Marketplace
              </p>

              <h1 className="font-heading font-bold text-white leading-[1.05] mb-6 text-5xl md:text-6xl xl:text-7xl">
                Read it. Love it. Pass it on.
              </h1>

              <p className="text-white/55 text-sm leading-relaxed mb-10">
                Buy and sell pre-loved books across Nigeria — thousands of titles,
                real readers, one secure marketplace.
              </p>

              <Link
                to="/browse"
                className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-7 py-3.5 rounded-md hover:bg-white hover:text-main transition-all duration-200 text-sm"
              >
                Browse Books <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Bottom-right info cards */}
          <div className="hidden lg:flex justify-end gap-3 pb-8">
            {[
              { title: 'Fiction & Lit', label: 'Primary Focus', sub: '800+ titles' },
              { title: 'Nationwide', label: 'Market Coverage', sub: '12 cities' },
              { title: 'End-to-End', label: 'Secure & Delivered', sub: 'Escrow checkout' },
            ].map(({ title, label, sub }) => (
              <div
                key={title}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-md px-5 py-4 min-w-35"
              >
                <p className="text-white/45 text-[10px] uppercase tracking-widest font-semibold mb-2">{label}</p>
                <p className="text-white font-heading font-bold text-[15px] leading-snug">{title}</p>
                <p className="text-white/45 text-[11px] mt-1">{sub}</p>
              </div>
            ))}
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
                Featured Books
              </h2>
            </div>
            <Link
              to="/browse"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
            >
              View all <ArrowRight size={15} />
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
              className="inline-flex items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
            >
              View all books <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Book Quotes ─────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden">

        {/* Background image */}
        <img
          src={quoteBg}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark overlay — uniform but slightly lighter than hero */}
        <div className="absolute inset-0 bg-main/82" />

        <div className="relative max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

          {/* Header */}
          <div className="mb-14">
            <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              From the pages
            </p>
            <h2 className="font-heading font-bold text-white text-4xl md:text-5xl max-w-md leading-tight">
              Words that stay with you.
            </h2>
          </div>

          {/* Quote cards — frosted glass, matching hero info chips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {bookQuotes.map((q, i) => (
              <div
                key={i}
                className="group relative flex flex-col p-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 hover:border-secondary/30 transition-all duration-300"
              >
                {/* Decorative quote mark */}
                <span className="absolute top-5 right-6 font-heading font-bold text-7xl text-secondary/20 group-hover:text-secondary/35 transition-colors leading-none select-none">
                  "
                </span>

                <p className="text-white/75 text-[15px] leading-[1.8] italic flex-1 relative z-10">
                  {q.quote}
                </p>

                <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2.5">
                  <span className="h-px w-4 bg-secondary/60" />
                  <p className="text-secondary text-sm font-semibold">{q.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ────────────────────────────────────────── */}
      <section className="py-28 bg-white">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

          {/* Header */}
          <div className="flex flex-row items-end justify-between mb-14">
            <div className="">
              <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                Simple process
              </p>
              <h2 className="font-heading font-bold text-main text-4xl md:text-5xl max-w-md leading-tight">
                How does it work?
              </h2>
            </div>

            <Link
              to="/browse"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
            >
              Learn more <ArrowRight size={15} />
            </Link>
          </div>

          {/* Step cards — 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {[
              {
                step: '01',
                Icon: Search,
                title: 'Browse & Find',
                desc: 'Search thousands of pre-loved books by title, author, or genre. Filter by location and price to find exactly what you need.',
              },
              {
                step: '02',
                Icon: ShoppingCart,
                title: 'Add to Cart',
                desc: 'Add your book and pay securely at checkout. Your money is held in escrow — released only when you confirm delivery.',
              },
              {
                step: '03',
                Icon: Handshake,
                title: 'We Coordinate',
                desc: 'We notify the seller, arrange collection from their location, inspect the book, and prepare it for dispatch.',
              },
              {
                step: '04',
                Icon: BookOpen,
                title: 'Start Reading',
                desc: 'Your book arrives at your door in 3–7 business days. Confirm receipt and the seller gets paid. Happy reading!',
              },
            ].map(({ step, Icon, title, desc }) => (
              <div
                key={step}
                className="group flex flex-col p-4 md:p-6 rounded-lg border border-third hover:border-secondary/40 hover:shadow-md transition-all duration-300"
              >
                {/* Icon + step */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-11 h-11 rounded-lg bg-secondary/15 border border-secondary/20 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-main" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary">
                    Step {step}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-main text-xl mb-3">{title}</h3>
                <p className="text-main/55 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/how-to-works"
              className="inline-flex items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
            >
              Learn more <ArrowRight size={15} />
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
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
            >
              Read all <ArrowRight size={15} />
            </Link>
          </div>

          {/* Blog cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {blogPosts.slice(0, 3).map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group flex flex-col rounded-lg bg-white border border-third overflow-hidden hover:border-secondary/40 hover:shadow-md transition-all duration-300"
              >
                {/* Placeholder header */}
                <div className="h-40 bg-secondary/10 border-b border-third flex items-center justify-center">
                  <span className="font-heading font-bold text-6xl text-secondary/40 group-hover:text-secondary/60 transition-colors select-none">
                    ✦
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-semibold text-secondary bg-secondary/15 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      {post.category}
                    </span>
                    <span className="text-xs text-main/40">{post.readTime}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-main text-base leading-snug mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-main/55 line-clamp-2 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <p className="text-xs text-main/35 mt-4">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="bg-main py-24">
        <div className="max-w-8xl mx-auto px-4 md:px-6 md:flex-row lg:px-12 flex flex-col items-center md:items-end justify-between gap-8">
          <div className='text-center md:text-start'>
            <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              Start Today
            </p>
            <h2 className="font-heading font-bold text-white text-4xl md:text-5xl max-w-md leading-tight">
              Ready to find your next read?
            </h2>
          </div>
          <Link
            to="/browse"
            className="shrink-0 inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-7 py-3.5 rounded-md hover:bg-white hover:text-main transition-all duration-200 text-sm"
          >
            Browse Books <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
