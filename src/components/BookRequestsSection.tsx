import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { bookRequests } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

function BookRequestsSection() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [joined, setJoined] = useState<Record<string, boolean>>({})
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [timestamps, setTimestamps] = useState<Record<string, number>>({})
  const [showModal, setShowModal] = useState(false)
  const [activeTitle, setActiveTitle] = useState("")

  useEffect(() => {
    const savedJoined = localStorage.getItem("queueJoined")
    const savedCounts = localStorage.getItem("queueCounts")
    const savedTime = localStorage.getItem("queueTime")

    if (savedJoined) setJoined(JSON.parse(savedJoined))
    if (savedCounts) setCounts(JSON.parse(savedCounts))
    if (savedTime) setTimestamps(JSON.parse(savedTime))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamps(prev => ({ ...prev }))
    }, 60000)
    return () => clearInterval(interval)
  }, [])

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

    const newTimestamps = { ...timestamps, [title]: Date.now() }
    setTimestamps(newTimestamps)

    localStorage.setItem("queueJoined", JSON.stringify(newJoined))
    localStorage.setItem("queueCounts", JSON.stringify(newCounts))
    localStorage.setItem("queueTime", JSON.stringify(newTimestamps))

    setActiveTitle(title)
    setShowModal(true)

    setTimeout(() => {
      setShowModal(false)
    }, 2000)
  }

  function handleIHaveThis() {
    navigate(user ? '/list' : '/login?redirect=/list')
  }

  function formatTime(timestamp?: number, fallbackDays?: number) {
    if (!timestamp) {
      return fallbackDays === 1 ? "1 day ago" : `${fallbackDays} days ago`
    }

    const diff = Date.now() - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (seconds < 10) return "Just now"
    if (seconds < 60) return `${seconds}s ago`
    if (minutes < 60) return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`

    if (hours < 24) {
      const remainingMinutes = minutes % 60
      if (remainingMinutes === 0) return hours === 1 ? "1hr ago" : `${hours}hr ago`
      return `${hours}hr ${remainingMinutes}min ago`
    }

    if (days < 7) return days === 1 ? "1 day ago" : `${days} days ago`

    const weeks = Math.floor(days / 7)
    if (weeks < 4) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`

    const months = Math.floor(days / 30)
    if (months < 12) return months === 1 ? "1 month ago" : `${months} months ago`

    const years = Math.floor(days / 365)
    return years === 1 ? "1 year ago" : `${years} years ago`
  }

  return (
    <>
      <section className="py-12 bg-third border-t border-third">
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
              className="inline-flex items-center gap-2 bg-main text-white font-semibold px-7 py-3 text-[11px] tracking-widest uppercase hover:bg-main/85 transition-colors shrink-0 rounded-xl"
            >
              View all requests
            </Link>
          </div>
        </div>
      </section>

      {/* Queue success dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm text-center rounded-2xl border-0 shadow-xl p-8 [&>button]:hidden">
          <DialogTitle className="sr-only">Added to Queue</DialogTitle>
          <DialogDescription className="sr-only">
            You have been added to the queue for {activeTitle}
          </DialogDescription>

          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-xl animate-[modalIn_.55s_cubic-bezier(.34,1.56,.64,1)]">
            ✓
          </div>

          <h3 className="font-heading font-bold text-lg text-main mb-2">
            Added to Queue
          </h3>

          <p className="text-sm text-main/60">
            You'll be notified when <strong>{activeTitle}</strong> becomes available.
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BookRequestsSection
