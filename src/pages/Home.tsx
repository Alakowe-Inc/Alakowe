import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, MapPin, PackageCheck } from 'lucide-react'
import { books, blogPosts, bookQuotes } from '../data/mockData'
import BookCard from '../components/BookCard'
import heroImage from '../assets/media/images/Tranquil Study with Cactus and Pastel Books.png'

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
        <div className="relative flex-1 flex flex-col max-w-8xl mx-auto px-4 md:px-12 w-full">

          {/* Main content — vertically centred */}
          <div className="flex-1 flex items-center py-28">
            <div className="max-w-2xl">

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
          <div className="flex justify-end gap-3 pb-8">
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

      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-0">
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
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-main hover:text-secondary transition-colors"
            >
              View all <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 text-sm font-semibold text-main hover:text-secondary transition-colors"
            >
              View all books <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-main relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(139,92,246,0.06),transparent)]" />
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 xl:px-0">
          <div className="flex items-center gap-4 justify-center mb-16">
            <span className="h-px w-12 bg-secondary/30" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              From the pages
            </p>
            <span className="h-px w-12 bg-secondary/30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bookQuotes.map((q, i) => (
              <div
                key={i}
                className="group relative flex flex-col p-8 rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-secondary/20 transition-all duration-300"
              >
                <span className="absolute top-5 right-6 font-heading font-bold text-7xl text-secondary/10 group-hover:text-secondary/20 transition-colors leading-none select-none">
                  "
                </span>
                <p className="text-white/70 text-[15px] leading-[1.8] italic flex-1 relative z-10">
                  {q.quote}
                </p>
                <div className="mt-6 pt-5 border-t border-white/8 flex items-center gap-2.5">
                  <span className="h-px w-4 bg-secondary/60" />
                  <p className="text-secondary text-sm font-semibold">{q.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-third">
        <div className="max-w-5xl mx-auto px-4 md:px-6 xl:px-0">

          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
              Simple process
            </p>
            <h2 className="font-heading font-bold text-main text-3xl md:text-4xl mb-4">
              How does it work?
            </h2>
            <p className="text-main/55 leading-relaxed max-w-lg mx-auto text-sm">
              Browse books listed by readers like you, pay securely, and we handle
              everything from pickup to delivery.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] border-t-2 border-dashed border-secondary/35 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {[
                {
                  step: '01',
                  Icon: ShoppingBag,
                  title: 'Browse & Buy',
                  desc: 'Find the book you love and add it to cart. Pay securely — your money is held in escrow until you confirm delivery.',
                },
                {
                  step: '02',
                  Icon: MapPin,
                  title: 'We Collect',
                  desc: 'The seller drops the book at our nearest collection point, or we pick it up. We inspect every book before it moves.',
                },
                {
                  step: '03',
                  Icon: PackageCheck,
                  title: 'We Deliver',
                  desc: 'Your book arrives at your door in 3–7 business days. Confirm receipt and the seller gets paid.',
                },
              ].map(({ step, Icon, title, desc }) => (
                <div key={step} className="flex flex-col items-center text-center">
                  <div className="relative z-10 w-20 h-20 rounded-full bg-white border-2 border-secondary/40 flex items-center justify-center mb-6 shadow-sm">
                    <Icon size={26} className="text-main" />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-5 h-px bg-secondary/40 block" />
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary">
                      Step {step}
                    </span>
                    <span className="w-5 h-px bg-secondary/40 block" />
                  </div>
                  <h3 className="font-heading font-bold text-main text-xl mb-3">{title}</h3>
                  <p className="text-sm text-main/55 leading-relaxed max-w-[16rem]">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-14">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 bg-main text-white font-semibold px-8 py-3 rounded-md hover:bg-main/90 transition-colors text-sm"
            >
              Learn more <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-0">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                Our Blog
              </p>
              <h2 className="font-heading font-bold text-main text-3xl md:text-4xl">
                Stories &amp; Insights
              </h2>
            </div>
            <Link
              to="/blog"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-main hover:text-secondary transition-colors"
            >
              Read all <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-third hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="h-44 bg-secondary/15 flex items-center justify-center">
                  <span className="font-heading font-bold text-6xl text-secondary/40 select-none">
                    ✦
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-secondary bg-secondary/15 px-2.5 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-main/40">{post.readTime}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-main text-base leading-snug mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-main/55 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <p className="text-xs text-main/35 mt-4">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  )
}

export default Home
