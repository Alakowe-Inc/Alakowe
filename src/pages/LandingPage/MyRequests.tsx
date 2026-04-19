import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Bell, BookOpen, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getBuyerRequests,
  closeRequest,
  REQUEST_STATUS_LABEL,
  REQUEST_STATUS_CLASS,
} from '../../data/requestData'
import type { BookRequest } from '../../data/requestData'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86_400_000)
  const h = Math.floor(diff / 3_600_000)
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  return 'Just now'
}

export default function MyRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<BookRequest[]>([])
  const [closing, setClosing] = useState<string | null>(null)

  useEffect(() => {
    if (user) setRequests(getBuyerRequests(user.email))
  }, [user])

  function handleClose(id: string) {
    closeRequest(id)
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'closed' } : r))
    setClosing(null)
  }

  const open = requests.filter(r => r.status === 'open').length
  const matched = requests.filter(r => r.status === 'matched').length

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-main text-3xl">My Requests</h1>
            <p className="text-main/50 text-sm mt-1">Books you're looking for</p>
          </div>
          <Link
            to="/request"
            className="flex items-center gap-2 bg-main text-white font-semibold px-5 py-2.5 rounded-full hover:bg-main/90 transition-colors text-sm"
          >
            <PlusCircle size={15} /> New Request
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-third p-5">
            <div className="flex items-center gap-2 mb-3">
              <Bell size={15} className="text-secondary" />
              <span className="text-xs font-semibold text-main/45 uppercase tracking-wider">Open</span>
            </div>
            <p className="font-heading font-bold text-main text-2xl">{open}</p>
            <p className="text-xs text-main/40 mt-0.5">Waiting for a match</p>
          </div>
          <div className="bg-white rounded-2xl border border-third p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={15} className="text-green-500" />
              <span className="text-xs font-semibold text-main/45 uppercase tracking-wider">Matched</span>
            </div>
            <p className="font-heading font-bold text-main text-2xl">{matched}</p>
            <p className="text-xs text-main/40 mt-0.5">Ready to buy</p>
          </div>
        </div>

        {/* Requests list */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-third p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-main/6 flex items-center justify-center mx-auto mb-4">
              <Bell size={28} className="text-main/30" />
            </div>
            <h2 className="font-heading font-bold text-main text-lg mb-2">No requests yet</h2>
            <p className="text-main/50 text-sm mb-6">
              Can't find a book you're looking for? Submit a request and get notified when it's listed.
            </p>
            <Link
              to="/request"
              className="inline-flex items-center gap-2 bg-main text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-main/90 transition-colors"
            >
              <PlusCircle size={15} /> Request a Book
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {requests.map(req => (
              <div key={req.id} className="bg-white rounded-2xl border border-third p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-main text-base leading-snug truncate">
                      {req.title}
                    </p>
                    {req.author && (
                      <p className="text-sm text-main/50 mt-0.5">by {req.author}</p>
                    )}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${REQUEST_STATUS_CLASS[req.status]}`}>
                    {REQUEST_STATUS_LABEL[req.status]}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-main/45 mb-3">
                  <span>{req.genre}</span>
                  {req.condition && <span>Min: {req.condition}</span>}
                  {req.maxPrice > 0 && <span>Budget: ₦{req.maxPrice.toLocaleString()}</span>}
                  <span>{timeAgo(req.createdAt)}</span>
                </div>

                {req.notes && (
                  <p className="text-xs text-main/55 bg-third rounded-lg px-3 py-2 mb-3 leading-relaxed">
                    {req.notes}
                  </p>
                )}

                {req.status === 'matched' && (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-3">
                    <BookOpen size={14} className="text-green-600 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-800">A match was found!</p>
                      <p className="text-xs text-green-700 mt-0.5">Check your email for the listing link.</p>
                    </div>
                    <Link
                      to="/browse"
                      className="text-xs font-semibold text-green-700 hover:underline shrink-0"
                    >
                      Browse now
                    </Link>
                  </div>
                )}

                {req.status === 'open' && (
                  <div className="flex justify-end">
                    {closing === req.id ? (
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-main/50">Close this request?</span>
                        <button
                          onClick={() => handleClose(req.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors"
                        >
                          Yes, close it
                        </button>
                        <button
                          onClick={() => setClosing(null)}
                          className="text-xs font-semibold text-main/45 hover:text-main transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setClosing(req.id)}
                        className="flex items-center gap-1.5 text-xs text-main/40 hover:text-red-500 transition-colors"
                      >
                        <X size={12} /> Close request
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
