import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Flame, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAllBookRequests, useJoinWaitlist, useLeaveWaitlist } from '../lib/api/requests/requests.hooks'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

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

  // Randomly shuffle requested books so users see a dynamic, fresh selection of all requested books on each visit
  const shuffledApiRequests = useMemo(() => {
    const safeApiRequests = Array.isArray(apiRequests) ? apiRequests : []
    const list = [...safeApiRequests]
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]]
    }
    return list
  }, [apiRequests])

  const items = shuffledApiRequests.map(r => ({
    id: r.id,
    title: r.title,
    author: r.author || '',
    requestCount: r.waitlist?.length || r.waitlistCount || 1,
    isUserJoined: r.isUserOnWaitlist || (r.waitlist?.includes(user?.email || '') ?? false),
  }))

  // Automatically scroll horizontally every 3 seconds unless hovered
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
        container.scrollBy({ left: 260, behavior: 'smooth' })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isPaused, items.length])

  function scroll(direction: 'left' | 'right') {
    if (!scrollContainerRef.current) return
    const offset = direction === 'left' ? -280 : 280
    scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  async function handleJoin(item: typeof items[0]) {
    if (!user) {
      navigate('/login?redirect=/request-book')
      return
    }

    const currentJoined = joinedMap[item.id] || item.isUserJoined

    if (currentJoined) {
      const newJoined = { ...joinedMap, [item.id]: false }
      const newCounts = {
        ...countsMap,
        [item.id]: Math.max(1, (countsMap[item.id] ?? item.requestCount) - 1),
      }
      setJoinedMap(newJoined)
      setCountsMap(newCounts)
      localStorage.setItem("queueJoined", JSON.stringify(newJoined))
      localStorage.setItem("queueCounts", JSON.stringify(newCounts))

      try {
        await leaveWaitlistMutation.mutateAsync({ requestId: item.id, buyerEmail: user.email })
      } catch {
        // optimistic fallback set
      }
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

    try {
      await joinWaitlistMutation.mutateAsync({
        requestId: item.id,
        buyerEmail: user.email,
        title: item.title,
        author: item.author,
      })
    } catch {
      // optimistic fallback already set
    }

    setActiveTitle(item.title)
    setShowModal(true)

    setTimeout(() => {
      setShowModal(false)
    }, 2000)
  }

  return (
    <div className="my-10">
      <div>

        {/* Section Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading font-bold text-main text-2xl sm:text-3xl md:text-4xl">
              Looking for something?
            </h2>
            <p className="text-main/50 text-xs sm:text-sm mt-1">
              Join others waiting for books that are not yet listed.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            {/* Scroll navigation arrows */}
            <div className="hidden sm:flex items-center gap-1.5 mr-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-full border border-main/15 bg-white text-main/70 hover:bg-main/5 flex items-center justify-center transition-colors shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-full border border-main/15 bg-white text-main/70 hover:bg-main/5 flex items-center justify-center transition-colors shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <Link
              to="/request-book"
              className="shrink-0 text-xs sm:text-sm font-semibold text-secondary hover:underline flex items-center gap-1 transition-colors"
            >
              <span>View more</span>
              <span className="text-base">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Cards Row — 1 Row x 5 Columns Layout with Auto-scroll */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-4 overflow-x-auto scroll-smooth py-2 px-1 scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => {
            const count = countsMap[item.id] ?? item.requestCount
            const isJoined = joinedMap[item.id] || item.isUserJoined
            const isHighDemand = count >= 15

            return (
              <div
                key={item.id}
                className="shrink-0 w-[80vw] sm:w-[45vw] md:w-[30vw] lg:w-[calc((100%-4*1rem)/5)] bg-white border border-main/10 rounded-2xl p-4 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200"
              >
                {/* Top Information */}
                <div>
                  <h3 className="font-heading font-bold text-main text-sm sm:text-base leading-snug line-clamp-1" title={item.title}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-main/45 mt-0.5 line-clamp-1 min-h-[16px]" title={item.author}>
                    {item.author || 'Unknown Author'}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-main/60 font-medium mt-3">
                    <User size={13} className="text-main/40 shrink-0" />
                    <span>{count} {count === 1 ? 'reader waiting' : 'readers waiting'}</span>
                  </div>

                  {isHighDemand ? (
                    <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100/80 px-2.5 py-0.5 rounded-full">
                      <Flame size={11} className="text-amber-500 fill-amber-500" />
                      <span>HIGH DEMAND</span>
                    </div>
                  ) : (
                    <div className="h-[23px] mt-2.5" />
                  )}
                </div>

                {/* Bottom Buttons */}
                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    disabled={joinWaitlistMutation.isPending || leaveWaitlistMutation.isPending}
                    onClick={() => handleJoin(item)}
                    className={`w-full font-bold text-[11px] tracking-wider uppercase py-2.5 rounded-full transition-all duration-200 shadow-sm ${
                      isJoined
                        ? 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300 group'
                        : 'bg-[#5C5CFF] hover:bg-[#4B4BEE] text-white active:scale-[0.98]'
                    }`}
                    title={isJoined ? 'Click to leave waitlist' : 'Click to join waitlist'}
                  >
                    {isJoined ? (
                      <>
                        <span className="group-hover:hidden">✓ JOINED</span>
                        <span className="hidden group-hover:inline">LEAVE WAITLIST</span>
                      </>
                    ) : (
                      'JOIN WAITLIST'
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm text-center rounded-2xl border-0 shadow-xl p-8 [&>button]:hidden">
          <DialogTitle className="sr-only">Added to Waitlist</DialogTitle>
          <DialogDescription className="sr-only">
            You have joined the waitlist for {activeTitle}
          </DialogDescription>

          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-xl animate-[modalIn_.55s_cubic-bezier(.34,1.56,.64,1)] text-green-600">
            ✓
          </div>

          <h3 className="font-heading font-bold text-lg text-main mb-2">
            Joined Waitlist!
          </h3>

          <p className="text-sm text-main/60">
            You'll be notified as soon as <strong>{activeTitle}</strong> is listed for sale.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
