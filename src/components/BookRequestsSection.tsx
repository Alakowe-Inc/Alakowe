import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, ChevronLeft, ChevronRight, BookOpen, Loader2, Bookmark, Tag } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAllBookRequests, useJoinWaitlist, useLeaveWaitlist } from '../lib/api/requests/requests.hooks'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

/* Push pin icon for the yellow sticky note */
function PushPinIcon({ className = "w-4 h-4 text-[#635BFF]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11V22H13V16H18V14L16 12Z" />
    </svg>
  )
}

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
      id: String(r.id),
      title: r.title,
      author: r.author || '',
      requestCount: r.waitlistCount ?? r.waitlist?.length ?? 0,
      isUserJoined:
        r.isWaitlisted != null
          ? Boolean(r.isWaitlisted)
          : (r.isUserOnWaitlist || (r.waitlist?.includes(user?.email || '') ?? false)),
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
        container.scrollBy({ left: 280, behavior: 'smooth' })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, items.length])

  function scroll(direction: 'left' | 'right') {
    if (!scrollContainerRef.current) return
    const offset = direction === 'left' ? -280 : 280
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

  return (
    <div className="my-12">
      <div>

        {/* ── Section Header ── */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading font-bold text-gray-900 text-2xl sm:text-3xl md:text-4xl leading-tight">
              What book are you looking for{' '}
              <span className="text-[#635BFF] font-serif italic font-normal">
                from other readers?
              </span>
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Join other readers waiting or create a new request.<br className="hidden sm:block" />
              We'll notify you via email as soon as someone lists the book.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 pt-1">
            {/* Scroll navigation arrows */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center transition-all shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center transition-all shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <Link
              to="/request-book"
              className="text-xs sm:text-sm font-medium text-[#635BFF] hover:underline flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <span className="text-base">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* ── Cards Carousel (1 Row x 5 Columns) ── */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-4 overflow-x-auto scroll-smooth py-3 px-1 scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => {
            const count = countsMap[item.id] ?? item.requestCount
            const isJoined = joinedMap[item.id] || item.isUserJoined
            const isLoading = loadingItemId === item.id

            return (
              <div
                key={item.id}
                className="shrink-0 w-[78vw] sm:w-[42vw] md:w-[28vw] lg:w-[calc((100%-4*1rem)/5)] group"
              >
                {/* White Card Container */}
                <div className="bg-white border border-gray-200/70 rounded-2xl p-5 flex flex-col justify-between min-h-[260px] shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 relative">

                  {/* Top Pinned Yellow Sticky Badge */}
                  <div>
                    <div className="relative mb-6 pt-1">
                      {/* Purple Push Pin */}
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 drop-shadow-sm">
                        <PushPinIcon className="w-4 h-4 text-[#635BFF]" />
                      </div>

                      {/* Yellow Note */}
                      <div className="bg-[#FFC947] text-gray-900 font-bold text-xs py-1.5 px-3 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transform -rotate-1">
                        <Users size={13} className="text-gray-900 shrink-0" />
                        <span>{count} {count === 1 ? 'reader waiting' : 'readers waiting'}</span>
                      </div>
                    </div>

                    {/* Dashed Line Divider */}
                    <div className="border-b border-dashed border-gray-200/80 mb-4" />

                    {/* Book Title & Author */}
                    <h3
                      className="font-heading font-bold text-gray-900 text-base sm:text-lg leading-snug line-clamp-2 min-h-[48px] text-left"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-xs text-gray-500 line-clamp-1 mt-1 text-left"
                      title={item.author}
                    >
                      by {item.author || 'Unknown Author'}
                    </p>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="mt-6">
                    <button
                      type="button"
                      disabled={!!loadingItemId}
                      onClick={() => handleJoin(item)}
                      className={`w-full font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5 ${
                        isJoined
                          ? 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300 group/btn'
                          : 'bg-[#635BFF] hover:bg-[#5249FF] text-white active:scale-[0.98]'
                      }`}
                      title={isJoined ? 'Click to leave waitlist' : 'Click to join waitlist'}
                    >
                      {isLoading ? (
                        <Loader2 size={15} className="animate-spin" />
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
            <div className="w-full text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <BookOpen size={28} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm font-medium">No book requests yet.</p>
              <Link
                to="/request-book"
                className="text-[#635BFF] text-xs font-semibold hover:underline mt-2 inline-block"
              >
                Be the first to request a book →
              </Link>
            </div>
          )}
        </div>

        {/* ── Bottom Banner: Have a book on this list? ── */}
        <div className="mt-6 bg-[#F6F5FF] border border-[#E0DCFF] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white text-[#635BFF] border border-[#E0DCFF] flex items-center justify-center shrink-0 shadow-sm">
              <Bookmark size={18} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">
                Have a book on this list?
              </h3>
              <p className="text-gray-500 text-xs mt-0.5">
                List it and connect with readers who are already waiting.
              </p>
            </div>
          </div>

          <Link
            to={user ? '/list' : '/login?redirect=/list'}
            className="bg-white border border-[#635BFF]/30 text-[#635BFF] hover:bg-[#635BFF] hover:text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <Tag size={14} />
            <span>Sell a Book</span>
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
