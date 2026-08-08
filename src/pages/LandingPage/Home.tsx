import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  BookOpen,
  BookPlus,
  BellRing,
  Wallet,
  Shield,
  Truck,
} from 'lucide-react'
import { books as mockBooks } from '../../data/mockData'
import BookCarousel from '../../components/BookCarousel'
import BookCard from '../../components/BookCard'
import { useLandingPage } from '../../lib/api/listings/listings.hooks'
import { listingToBookDisplay } from '../../lib/api/adapters'
import BookRequestsSection from '../../components/BookRequestsSection'
import heroImageDesktop from '../../assets/media/images/image2.jpeg'
import heroImageMobile from '../../assets/media/images/images3.jpeg'

/* ── Promo Insert Cards ─────────────────────────────────────────── */
const promoInserts = [
  {
    id: 'what-does-alakowe-mean',
    accentColor: 'bg-emerald-50/70 border-emerald-100',
    question: 'What does Alákòwé mean?',
    answer: `Alákòwé (pronounced ah-lah-koh-we) is a Yoruba word meaning "one who writes" or "a learned person." Around here, we believe readers deserve a marketplace built just for them, where books, independent booksellers, and readers come together to share knowledge.`,
    buttonLabel: 'Learn More',
    buttonTo: '/how-it-works',
  },
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
    accentColor: 'bg-sky-50/60 border-sky-100',
    question: 'Who am I buying from on Alákòwé?',
    answer: `From readers just like you. Every book on Alákòwé comes from someone's shelf: students, teachers, parents, collectors, and fellow book lovers who believe every great book deserves another reader.`,
    buttonLabel: 'Browse Books',
    buttonTo: '/browse',
  },
  {
    id: 'bottomline',
    accentColor: 'bg-teal-50/60 border-teal-100',
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
  const [howItWorksTab, setHowItWorksTab] = useState<'buy' | 'sell'>('sell')

  const { data: landingPage, isLoading: sectionsLoading } = useLandingPage()
  const sections = landingPage?.sections ?? []

  // Extract real seller love notes from listings + fallback seller notes
  const sellerLoveNotes = useMemo(() => {
    const list: Array<{
      id: string
      quote: string
      bookTitle: string
      sellerName: string
    }> = []

    sections.forEach(section => {
      (section.listings ?? []).forEach(listing => {
        if (listing.loveNote && listing.loveNote.trim()) {
          list.push({
            id: String(listing.id ?? Math.random()),
            quote: listing.loveNote.trim(),
            bookTitle: listing.title ?? 'Untitled Book',
            sellerName: listing.createdBy ?? 'Seller',
          })
        }
      })
    })

    // Supplement with seller love notes from listed books
    mockBooks.forEach(b => {
      if (b.loveNote && !list.some(n => n.bookTitle === b.title)) {
        list.push({
          id: b.id,
          quote: b.loveNote,
          bookTitle: b.title,
          sellerName: b.sellerName || 'Verified Seller',
        })
      }
    })

    return list
  }, [sections])

  // Hero image auto-change state (toggles every 1 second)
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev === 0 ? 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const heroImages = [heroImageDesktop, heroImageDesktop]
  const heroImagesMobile = [heroImageMobile, heroImageMobile]

  const mobileLoveNotesScrollRef = useRef<HTMLDivElement>(null)
  const [isMobileNotesPaused, setIsMobileNotesPaused] = useState(false)

  // Continuous infinite scroll for mobile Love Notes
  useEffect(() => {
    const container = mobileLoveNotesScrollRef.current
    if (!container || isMobileNotesPaused || sellerLoveNotes.length <= 1) return

    let animationId: number
    let lastTime: number | null = null
    const speed = 35 // pixels per second
    let accumulator = 0

    const scrollStep = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp
      const deltaTime = timestamp - lastTime
      lastTime = timestamp

      if (container) {
        // We render the list 3 times, so one original set is 1/3 of the scrollWidth
        const singleSetWidth = container.scrollWidth / 3
        
        accumulator += (speed * deltaTime) / 1000
        
        if (accumulator >= 1) {
          const pixelsToScroll = Math.floor(accumulator)
          accumulator -= pixelsToScroll
          container.scrollLeft += pixelsToScroll
        }
        
        if (container.scrollLeft >= singleSetWidth) {
          container.scrollLeft -= singleSetWidth
        }
      }
      animationId = requestAnimationFrame(scrollStep)
    }

    animationId = requestAnimationFrame(scrollStep)
    return () => cancelAnimationFrame(animationId)
  }, [isMobileNotesPaused, sellerLoveNotes.length])

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[560px] md:min-h-[620px] lg:min-h-[680px] bg-[#6c74ad] flex flex-col justify-between overflow-hidden text-white px-6 sm:px-10 lg:px-16 pt-24 md:pt-28 lg:pt-32 pb-10">

        {/* Dynamic Background Image with Smooth 1-second Fade (Desktop) */}
        <div className="hidden sm:block absolute inset-0 pointer-events-none overflow-hidden">
          {heroImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt=""
              aria-hidden
              className={`absolute inset-0 w-full h-full object-cover object-right-bottom transition-opacity duration-500 ease-in-out ${
                idx === currentHeroIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        {/* Dynamic Background Image with Smooth 1-second Fade (Mobile) */}
        <div className="sm:hidden absolute inset-0 pointer-events-none overflow-hidden">
          {heroImagesMobile.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt=""
              aria-hidden
              className={`absolute inset-0 w-full h-full object-cover object-right-bottom transition-opacity duration-500 ease-in-out ${
                idx === currentHeroIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ objectPosition: '85% 100%' }}
            />
          ))}
        </div>

        {/* Dark Overlay to make the image slightly darker */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl w-full mx-auto flex-1 flex flex-col justify-center py-6">
          <div className="max-w-xl pt-64 sm:pt-0">
            {/* Tagline */}
            <p className="text-white/80 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-2 sm:mb-5">
              BUY, SELL & REQUEST BOOKS
            </p>

            {/* Main Headline */}
            <h1 className="font-heading font-extrabold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight mb-3 sm:mb-6">
              Where books <br />
              find new readers.
            </h1>

            {/* Decorative underline */}
            <div className="w-12 h-1 bg-[#c3c6ff] rounded-full mb-4 sm:mb-8" />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <Link
                to="/browse"
                className="bg-[#c3c6ff] hover:bg-[#b0b4ff] text-[#2c305c] font-bold px-6 py-3.5 rounded-xl text-sm transition-colors shadow-sm w-[200px] sm:w-auto flex items-center justify-between sm:justify-center gap-4"
              >
                <span>Browse</span>
                <span className="text-lg sm:hidden">&rarr;</span>
              </Link>
              <Link
                to="/list"
                className="border border-white/70 hover:bg-white/10 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-colors w-[200px] sm:w-auto flex items-center justify-between sm:justify-center gap-4"
              >
                <span>List Books</span>
                <span className="text-lg sm:hidden">&rarr;</span>
              </Link>
            </div>
            
            {/* Mobile Feature Badges (Stacked on the left) */}
            <div className="sm:hidden flex flex-col gap-3 mt-5 w-[200px]">
              <div className="flex items-center gap-3.5 border-b border-white/20 pb-3">
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center shrink-0 bg-white/10">
                  <BookOpen size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Built only</p>
                  <p className="text-xs font-bold text-white leading-tight">for readers</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 border-b border-white/20 pb-3">
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center shrink-0 bg-white/10">
                  <Shield size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Secure</p>
                  <p className="text-xs font-bold text-white leading-tight">payments</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pb-2">
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center shrink-0 bg-white/10">
                  <Truck size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Nationwide</p>
                  <p className="text-xs font-bold text-white leading-tight">delivery & pickup</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Badges Bar (Desktop Only) */}
        <div className="hidden sm:grid relative z-10 max-w-7xl w-full mx-auto pt-8 border-t border-white/15 grid-cols-3 gap-6 text-white/90">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center shrink-0 bg-white/10">
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Built only</p>
              <p className="text-xs font-bold text-white leading-tight">for readers</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center shrink-0 bg-white/10">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Secure</p>
              <p className="text-xs font-bold text-white leading-tight">payments</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center shrink-0 bg-white/10">
              <Truck size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Nationwide</p>
              <p className="text-xs font-bold text-white leading-tight">delivery & pickup</p>
            </div>
          </div>
        </div>
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

          {/* First promo insert before image cards */}
          <PromoInsert promo={promoInserts[0]} />

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
            let promoIndex = 1

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

      {/* ── Love Notes from Our Sellers ─────────────────────────────────────────── */}
      <section className="bg-white py-14 border-t border-b border-third overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>

              <h2 className="font-heading font-bold text-main text-2xl sm:text-3xl md:text-4xl">
                Love Notes from Our Sellers
              </h2>
              <p className="text-xs sm:text-sm text-main/60 mt-1 max-w-xl">
                Real notes written by sellers when listing a book for the next reader.
              </p>
            </div>

            {/* Desktop Controls */}
            {sellerLoveNotes.length > 3 && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => setActiveQuoteIndex(prev => (prev === 0 ? sellerLoveNotes.length - 1 : prev - 1))}
                  className="w-9 h-9 rounded-full border border-main/15 bg-white flex items-center justify-center text-main/50 hover:text-main hover:border-main/40 transition-colors shadow-sm"
                  aria-label="Previous note"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setActiveQuoteIndex(prev => (prev === sellerLoveNotes.length - 1 ? 0 : prev + 1))}
                  className="w-9 h-9 rounded-full border border-main/15 bg-white flex items-center justify-center text-main/50 hover:text-main hover:border-main/40 transition-colors shadow-sm"
                  aria-label="Next note"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Cards Carousel */}
          <div className="relative">
            {/* Desktop Grid (3 cards per view) */}
            <div className="hidden lg:grid grid-cols-3 gap-6">
              {sellerLoveNotes.slice(activeQuoteIndex, activeQuoteIndex + 3).concat(
                sellerLoveNotes.slice(0, Math.max(0, (activeQuoteIndex + 3) - sellerLoveNotes.length))
              ).slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="relative bg-[#F9F9F9] pt-10 pb-6 px-6 rounded-2xl border border-[#EEEEEE] shadow-[0_4px_20px_-4px_rgba(23,33,49,0.06)] flex flex-col justify-between min-h-[240px] transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Tape decoration */}
                  <div className="absolute -top-2.5 w-16 h-5 bg-slate-300/40 rounded-[3px] shadow-sm border border-white/40 left-1/2 -translate-x-1/2" />

                  <div>
                    {/* Book title tag */}
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-secondary bg-secondary/15 border border-secondary/25 rounded-md px-2.5 py-1 mb-4 max-w-full truncate">
                      <BookOpen size={12} className="shrink-0 text-secondary" />
                      <span className="truncate">{item.bookTitle}</span>
                    </div>

                    {/* Quote text (handwritten) */}
                    <p className="font-handwritten text-[22px] sm:text-[24px] text-main/90 leading-relaxed font-medium mb-6">
                      "{item.quote}"
                    </p>
                  </div>

                  {/* Seller info */}
                  <div className="pt-4 border-t border-[#EEEEEE] flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm relative">
                      {item.sellerName.charAt(0).toUpperCase()}
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-500 rounded-full border border-white flex items-center justify-center">
                        <Heart size={8} className="fill-white text-white" />
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-bold text-xs text-main truncate">
                        {item.sellerName}
                      </p>
                      <p className="text-[10px] text-main/45 font-medium">Verified Seller</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Card Display (Continuous Scroll) */}
            <div className="lg:hidden w-full overflow-hidden">
              <div 
                ref={mobileLoveNotesScrollRef}
                onMouseEnter={() => setIsMobileNotesPaused(true)}
                onMouseLeave={() => setIsMobileNotesPaused(false)}
                onTouchStart={() => setIsMobileNotesPaused(true)}
                onTouchEnd={() => setIsMobileNotesPaused(false)}
                className="flex gap-4 overflow-x-auto py-4 px-4 scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full"
              >
                {sellerLoveNotes.length > 0 ? [...sellerLoveNotes, ...sellerLoveNotes, ...sellerLoveNotes].map((item, idx) => (
                  <div 
                    key={`${item.id}-${idx}`}
                    className="w-[85vw] max-w-sm shrink-0 relative bg-[#F9F9F9] pt-10 pb-6 px-6 rounded-2xl border border-[#EEEEEE] shadow-[0_4px_20px_-4px_rgba(23,33,49,0.06)] flex flex-col justify-between min-h-[230px]"
                  >
                    {/* Tape decoration */}
                    <div className="absolute -top-2.5 w-16 h-5 bg-slate-300/40 rounded-[3px] shadow-sm border border-white/40 left-1/2 -translate-x-1/2" />

                    <div>
                      {/* Book title tag */}
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-secondary bg-secondary/15 border border-secondary/25 rounded-md px-2.5 py-1 mb-4 max-w-full truncate">
                        <BookOpen size={12} className="shrink-0 text-secondary" />
                        <span className="truncate">{item.bookTitle}</span>
                      </div>

                      {/* Quote text (handwritten) */}
                      <p className="font-handwritten text-[22px] sm:text-[24px] text-main/90 leading-relaxed font-medium mb-6 whitespace-normal">
                        "{item.quote}"
                      </p>
                    </div>

                    {/* Seller info */}
                    <div className="pt-4 border-t border-[#EEEEEE] flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm relative">
                        {item.sellerName.charAt(0).toUpperCase()}
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-500 rounded-full border border-white flex items-center justify-center">
                          <Heart size={8} className="fill-white text-white" />
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading font-bold text-xs text-main truncate">
                          {item.sellerName}
                        </p>
                        <p className="text-[10px] text-main/45 font-medium">Verified Seller</p>
                      </div>
                    </div>
                  </div>
                )) : null}
              </div>
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
      <section className="py-8 bg-white border-t border-third">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="rounded-2xl bg-secondary text-white px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm border border-secondary/20">
            <div className="min-w-0 flex-1">
              <p className="text-white/60 text-[11px] font-semibold uppercase tracking-widest mb-1.5">
                Start Today
              </p>
              <h3 className="font-heading font-bold text-white text-lg sm:text-xl md:text-2xl leading-snug">
                Ready to find the next reader for your book?
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed mt-1 max-w-xl">
                List your books in minutes and join a community where great books keep moving.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 self-start sm:self-center">
              <Link
                to="/list"
                className="inline-flex items-center justify-center gap-1.5 bg-[#c3c6ff] hover:bg-white text-secondary font-bold px-5 py-2.5 text-xs sm:text-sm transition-colors rounded-xl shadow-xs"
              >
                <span>List a Book</span>
                <span className="text-sm">&rarr;</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-1.5 border border-white/30 hover:bg-white/10 text-white font-semibold px-5 py-2.5 text-xs sm:text-sm transition-colors rounded-xl"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}

export default Home