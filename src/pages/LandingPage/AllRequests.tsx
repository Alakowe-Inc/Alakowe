import { Link, useNavigate } from 'react-router-dom'
import { PlusCircle, Users } from 'lucide-react'
import { bookRequests } from '../../data/mockData'
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect } from 'react'

export default function AllRequests() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [joined, setJoined] = useState<Record<string, boolean>>({})
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [timestamps, setTimestamps] = useState<Record<string, number>>({})

  const [showModal, setShowModal] = useState(false)
  const [activeTitle, setActiveTitle] = useState("")

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

    localStorage.setItem("queueJoined", JSON.stringify(newJoined))
    localStorage.setItem("queueCounts", JSON.stringify(newCounts))
    localStorage.setItem("queueTime", JSON.stringify(newTimestamps))

    // 👉 ADD THIS PART
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

    if (seconds < 10) return "Just now"

    if (seconds < 60) return `${seconds}s ago`

    if (minutes < 60) {
      return minutes === 1
        ? "1 minute ago"
        : `${minutes} minutes ago`
    }

    if (hours < 24) {
      const remainingMinutes = minutes % 60

      if (remainingMinutes === 0) {
        return hours === 1
          ? "1hr ago"
          : `${hours}hr ago`
      }

      return `${hours}hr ${remainingMinutes}min ago`
    }

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
      setTimestamps(prev => ({ ...prev }))
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">Community</p>
            <h1 className="font-heading font-bold text-main text-3xl">Book Requests</h1>
            <p className="text-main/50 text-sm mt-1 max-w-md">
              Books the community is looking for. Join a queue to get notified when it's listed, or sell one if you have it.
            </p>
          </div>

          <Link
            to="/request"
            className="flex items-center gap-2 bg-main text-white font-semibold px-5 py-2.5 rounded-full hover:bg-main/90 transition-colors text-sm shrink-0"
          >
            <PlusCircle size={15} /> Post a Request
          </Link>
        </div>

        {/* Request cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookRequests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl border border-third p-5 flex flex-col gap-4">

              <div>
                <h3 className="font-heading font-bold text-main text-base">{req.title}</h3>
                {req.author && (
                  <p className="text-xs text-main/45">{req.author}</p>
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
                  className={`text-[11px] font-semibold tracking-widest uppercase px-4 py-2 transition-colors rounded-full
                  ${joined[req.title]
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-main text-white hover:bg-main/85'}`}
                >
                  {joined[req.title] ? "Joined" : "Join Queue"}
                </button>

                <button
                  onClick={handleIHaveThis}
                  className="text-[11px] font-semibold text-main/50 hover:text-secondary underline"
                >
                  I have this
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* ✅ MODAL MUST BE INSIDE RETURN */}
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