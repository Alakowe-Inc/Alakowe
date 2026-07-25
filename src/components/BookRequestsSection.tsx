import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Flame } from 'lucide-react'
import { bookRequests as mockBookRequests } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import { useAllBookRequests, useJoinWaitlist } from '../lib/api/requests/requests.hooks'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export default function BookRequestsSection() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: apiRequests } = useAllBookRequests(undefined, user?.email)
  const joinWaitlistMutation = useJoinWaitlist()

  const [joinedMap, setJoinedMap] = useState<Record<string, boolean>>({})
  const [countsMap, setCountsMap] = useState<Record<string, number>>({})
  const [showModal, setShowModal] = useState(false)
  const [activeTitle, setActiveTitle] = useState("")

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

  // Combine top 5 items for display
  const items = (apiRequests && apiRequests.length > 0
    ? apiRequests.slice(0, 5).map(r => ({
        id: r.id,
        title: r.title,
        author: r.author || '',
        requestCount: r.waitlist?.length || r.waitlistCount || 1,
        isUserJoined: r.isUserOnWaitlist || (r.waitlist?.includes(user?.email || '') ?? false),
      }))
    : mockBookRequests.slice(0, 5).map(r => ({
        id: r.id,
        title: r.title,
        author: r.author || '',
        requestCount: r.requestCount,
        isUserJoined: false,
      }))
  )

  async function handleJoin(item: typeof items[0]) {
    if (!user) {
      navigate('/login?redirect=/request-book')
      return
    }

    const currentJoined = joinedMap[item.id] || item.isUserJoined
    if (currentJoined) return

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
      if (item.id.startsWith('REQ-') || item.id.length > 10) {
        await joinWaitlistMutation.mutateAsync({ requestId: item.id, buyerEmail: user.email })
      }
    } catch {
      // optimistic fallback already set
    }

    setActiveTitle(item.title)
    setShowModal(true)

    setTimeout(() => {
      setShowModal(false)
    }, 2000)
  }

  function handleListThisBook(title: string) {
    const targetPath = `/list?title=${encodeURIComponent(title)}`
    navigate(user ? targetPath : `/login?redirect=${encodeURIComponent(targetPath)}`)
  }

  return (
    <section className="py-12 bg-white border-t border-third">
      <div className="max-w-5xl mx-auto px-4 md:px-6">

        {/* Section Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="font-heading font-bold text-main text-2xl sm:text-3xl md:text-4xl">
              Looking for something?
            </h2>
            <p className="text-main/50 text-xs sm:text-sm mt-1">
              Join others waiting for books that are not yet listed.
            </p>
          </div>

          <Link
            to="/request-book"
            className="shrink-0 text-xs sm:text-sm font-semibold text-secondary hover:underline flex items-center gap-1 transition-colors pt-1"
          >
            <span>View more</span>
            <span className="text-base">&rarr;</span>
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((item) => {
            const count = countsMap[item.id] ?? item.requestCount
            const isJoined = joinedMap[item.id] || item.isUserJoined
            const isHighDemand = count >= 15

            return (
              <div
                key={item.id}
                className="bg-white border border-main/10 rounded-2xl p-4 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200"
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
                    <div className="h-[23px] mt-2.5" /> // spacer to align buttons across row
                  )}
                </div>

                {/* Bottom Buttons */}
                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    disabled={isJoined}
                    onClick={() => handleJoin(item)}
                    className={`w-full font-bold text-[11px] tracking-wider uppercase py-2.5 rounded-full transition-all duration-200 shadow-sm ${
                      isJoined
                        ? 'bg-main/10 text-main/40 cursor-not-allowed shadow-none'
                        : 'bg-[#5C5CFF] hover:bg-[#4B4BEE] text-white active:scale-[0.98]'
                    }`}
                  >
                    {isJoined ? '✓ JOINED' : 'JOIN WAITLIST'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleListThisBook(item.title)}
                    className="w-full border border-main/20 text-main/75 hover:border-main/40 hover:text-main font-bold text-[11px] tracking-wider uppercase py-2.5 rounded-full transition-all duration-200 active:scale-[0.98] block text-center"
                  >
                    LIST THIS BOOK
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
    </section>
  )
}
