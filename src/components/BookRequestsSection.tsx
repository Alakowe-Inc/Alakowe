import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, Flame, ChevronLeft, ChevronRight, BookOpen, Loader2, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAllBookRequests, useJoinWaitlist, useLeaveWaitlist } from '../lib/api/requests/requests.hooks'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

/* ── Sleek, dark executive theme palettes ── */
const CARD_ACCENTS = [
  {
    bg: 'from-[#0F172A] via-[#1E1B4B] to-[#0F172A]',
    border: 'border-indigo-500/30',
    avatarBg: 'from-indigo-600 to-violet-700',
    glow: 'group-hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]',
    accentText: 'text-indigo-300',
  },
  {
    bg: 'from-[#0F172A] via-[#0284C7]/20 to-[#0F172A]',
    border: 'border-sky-500/30',
    avatarBg: 'from-sky-600 to-blue-700',
    glow: 'group-hover:shadow-[0_0_25px_rgba(14,165,233,0.25)]',
    accentText: 'text-sky-300',
  },
  {
    bg: 'from-[#0F172A] via-[#059669]/20 to-[#0F172A]',
    border: 'border-emerald-500/30',
    avatarBg: 'from-emerald-600 to-teal-700',
    glow: 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    accentText: 'text-emerald-300',
  },
  {
    bg: 'from-[#0F172A] via-[#7C3AED]/20 to-[#0F172A]',
    border: 'border-purple-500/30',
    avatarBg: 'from-purple-600 to-pink-700',
    glow: 'group-hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]',
    accentText: 'text-purple-300',
  },
  {
    bg: 'from-[#0F172A] via-[#D97706]/20 to-[#0F172A]',
    border: 'border-amber-500/30',
    avatarBg: 'from-amber-600 to-orange-700',
    glow: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]',
    accentText: 'text-amber-300',
  },
]

interface BookRequestsSectionProps {
  onSelectBookTitle?: (title: string) => void
}

export default function BookRequestsSection({ }: BookRequestsSectionProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: apiRequests } = useAllBookRequests(undefined, user?.email)
  const joinWaitlistMutation = useJoinWaitlist()
  const leaveWaitlistMutation = useLeaveWaitlist()

  const [joinedMap, setJoinedMap] = useState<Record<string, boolean>>({})
  const [countsMap, setCountsMap] = useState<Record<string, number>>({})
  const [showModal, setShowModal] = useState(false)
  const [activeTitle, setActiveTitle] = useState("")

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const savedJoined = localStorage.getItem("queueJoined")
    const savedCounts = localStorage.getItem("queueCounts")

    if (savedJoined) {
      try { setJoinedMap(JSON.parse(savedJoined)) } catch { /* ignore */ }
    }
    if (savedCounts) {
      try { setCountsMap(JSON.parse(savedCounts)) } catch { /* ignore */ }
    }
  }, [])

  // Randomly shuffle requested books so users see a dynamic, fresh selection on each visit
  const shuffledApiRequests = useMemo(() => {
    const safeApiRequests = Array.isArray(apiRequests) ? apiRequests : []
    const list = [...safeApiRequests]
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]]
    }
    return list
  }, [apiRequests])

  const items = shuffledApiRequests
    .map(r => ({
      id: r.id,
      title: r.title,
      author: r.author || '',
      requestCount: r.waitlist ? r.waitlist.length : (r.waitlistCount ?? 0),
      isUserJoined: r.isUserOnWaitlist || (r.waitlist?.includes(user?.email || '') ?? false),
    }))
    .filter(item => {
      const currentCount = countsMap[item.id] ?? item.requestCount
      return currentCount > 0
    })

  // Auto-scroll every 3.5s unless hovered
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || isPaused || items.length <= 1) return

    const interval = setInterval(() => {
      if (!container) return
      const maxScroll = container.scrollWidth - container.clientWidth
      if (maxScroll <= 0) return

      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        container.scrollBy({ left: 300, behavior: 'smooth' })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, items.length])

  function scroll(direction: 'left' | 'right') {
    if (!scrollContainerRef.current) return
    const offset = direction === 'left' ? -300 : 300
    scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  const [loadingItemId, setLoadingItemId] = useState<string | null>(null)

  async function handleJoin(item: typeof items[0]) {
    if (!user) {
      navigate('/login?redirect=/request-book')
      return
    }

    const currentJoined = joinedMap[item.id] || item.isUserJoined
    setLoadingItemId(item.id)

    try {
      if (currentJoined) {
        const newJoined = { ...joinedMap, [item.id]: false }
        const newCounts = {
          ...countsMap,
          [item.id]: Math.max(0, (countsMap[item.id] ?? item.requestCount) - 1),
        }
        setJoinedMap(newJoined)
        setCountsMap(newCounts)
        localStorage.setItem("queueJoined", JSON.stringify(newJoined))
        localStorage.setItem("queueCounts", JSON.stringify(newCounts))

        await leaveWaitlistMutation.mutateAsync({ requestId: item.id, buyerEmail: user.email })
        return
      }

      const newJoined = { ...joinedMap, [item.id]: true }
      const newCounts = {
        ...countsMap,
        [item.id]: (countsMap[item.id] ?? item.requestCount) + 1,
      }

      setJoinedMap(newJoined)
      setCountsMap(newCounts)

      localStorage.setItem("queueJoined", JSON.stringify(newJoined))
      localStorage.setItem("queueCounts", JSON.stringify(newCounts))

      await joinWaitlistMutation.mutateAsync({
        requestId: item.id,
        buyerEmail: user.email,
        title: item.title,
        author: item.author,
      })

      setActiveTitle(item.title)
      setShowModal(true)

      setTimeout(() => {
        setShowModal(false)
      }, 2000)
    } catch {
      // handled
    } finally {
      setLoadingItemId(null)
    }
  }

  /* Generate initials for the book avatar */
  function getInitials(title: string) {
    return title
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() || '')
      .join('')
  }

  return (
    <div className="my-12">
      <div>

        {/* ── Section Header ── */}
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-3 py-1 mb-3">
              <Sparkles size={13} className="text-secondary" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                Requested by Readers
              </span>
            </div>
            <h2 className="font-heading font-bold text-main text-2xl sm:text-3xl md:text-4xl leading-tight">
              What would you like to buy?
            </h2>
            <p className="text-main/50 text-xs sm:text-sm mt-1.5 max-w-md">
              Join buyers waiting for these requested titles. We'll notify you as soon as a seller lists one!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Scroll navigation arrows */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-9 h-9 rounded-full border border-main/12 bg-white text-main/60 hover:text-main hover:border-main/25 hover:shadow-md flex items-center justify-center transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-9 h-9 rounded-full border border-main/12 bg-white text-main/60 hover:text-main hover:border-main/25 hover:shadow-md flex items-center justify-center transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight size={17} />
              </button>
            </div>

            <Link
              to="/request-book"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-secondary bg-secondary/8 hover:bg-secondary/15 px-4 py-2.5 rounded-xl transition-colors"
            >
              <span>View all</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* ── Cards Carousel ── */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-4 overflow-x-auto scroll-smooth py-2 px-1 scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, index) => {
            const count = countsMap[item.id] ?? item.requestCount
            const isJoined = joinedMap[item.id] || item.isUserJoined
            const isHighDemand = count >= 5
            const accent = CARD_ACCENTS[index % CARD_ACCENTS.length]
            const isLoading = loadingItemId === item.id

            return (
              <div
                key={item.id}
                className="shrink-0 w-[78vw] sm:w-[42vw] md:w-[28vw] lg:w-[calc((100%-4*1rem)/5)] group"
              >
                {/* Premium Dark Card Container */}
                <div className={`
                  relative rounded-2xl bg-gradient-to-b ${accent.bg}
                  border ${accent.border} ${accent.glow}
                  p-5 flex flex-col justify-between min-h-[220px]
                  shadow-md hover:shadow-xl transition-all duration-300
                  hover:-translate-y-1 relative overflow-hidden
                `}>
                  {/* Glass accent background highlight */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/[0.04] pointer-events-none blur-xl" />

                  {/* Top Row: Initials Avatar + Badges */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3.5">
                      {/* Book Initials Avatar */}
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${accent.avatarBg} text-white border border-white/20 shadow-sm flex items-center justify-center shrink-0`}>
                        <span className="font-heading font-bold text-sm tracking-wider">
                          {getInitials(item.title)}
                        </span>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-col items-end gap-1.5">
                        {isHighDemand && (
                          <div className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                            <Flame size={10} className="text-amber-400 fill-amber-400" />
                            <span>Trending</span>
                          </div>
                        )}
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 bg-white/10 border border-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                          <Users size={11} className="text-slate-400" />
                          <span>{count} {count === 1 ? 'waiting' : 'waiting'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Title & Author */}
                    <h3
                      className="font-heading font-bold text-white text-base leading-snug line-clamp-2 mb-1 group-hover:text-slate-100 transition-colors"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-xs text-slate-400 line-clamp-1 font-medium"
                      title={item.author}
                    >
                      {item.author || 'Unknown Author'}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-5">
                    <button
                      type="button"
                      disabled={!!loadingItemId}
                      onClick={() => handleJoin(item)}
                      className={`w-full font-bold text-[11px] tracking-wider uppercase py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                        isJoined
                          ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-red-500/20 hover:text-red-300 hover:border-red-400/40 group/btn shadow-sm'
                          : 'bg-secondary hover:bg-secondary/90 text-white shadow-md hover:shadow-lg active:scale-[0.98]'
                      }`}
                      title={isJoined ? 'Click to leave waitlist' : 'Click to join waitlist'}
                    >
                      {isLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : isJoined ? (
                        <>
                          <span className="group-hover/btn:hidden">✓ Joined</span>
                          <span className="hidden group-hover/btn:inline">Leave Waitlist</span>
                        </>
                      ) : (
                        'Join Waitlist'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Empty state */}
          {items.length === 0 && (
            <div className="w-full text-center py-16 border border-dashed border-main/15 rounded-2xl bg-main/[0.02]">
              <BookOpen size={28} className="mx-auto text-main/20 mb-3" />
              <p className="text-main/40 text-sm font-medium">No book requests yet.</p>
              <Link
                to="/request-book"
                className="text-secondary text-xs font-semibold hover:underline mt-2 inline-block"
              >
                Be the first to request a book →
              </Link>
            </div>
          )}
        </div>

        {/* Mobile "View all" button */}
        <div className="flex sm:hidden justify-center mt-5">
          <Link
            to="/request-book"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary bg-secondary/8 hover:bg-secondary/15 px-5 py-2.5 rounded-xl transition-colors"
          >
            <span>View all requests</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── Success Dialog ── */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm text-center rounded-3xl border-0 shadow-2xl p-8 [&>button]:hidden">
          <DialogTitle className="sr-only">Added to Waitlist</DialogTitle>
          <DialogDescription className="sr-only">
            You have joined the waitlist for {activeTitle}
          </DialogDescription>

          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-2xl animate-[modalIn_.55s_cubic-bezier(.34,1.56,.64,1)] text-white shadow-lg">
            ✓
          </div>

          <h3 className="font-heading font-bold text-xl text-main mb-2">
            You're on the list!
          </h3>

          <p className="text-sm text-main/55 leading-relaxed">
            We'll notify you as soon as <strong className="text-main">{activeTitle}</strong> is listed for sale.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
