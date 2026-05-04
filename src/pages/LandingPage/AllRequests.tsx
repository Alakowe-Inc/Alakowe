import { Link, useNavigate } from 'react-router-dom'
import { PlusCircle, Users } from 'lucide-react'
import { bookRequests } from '../../data/mockData'
import { useAuth } from '../../context/AuthContext'

export default function AllRequests() {
  const { user } = useAuth()
  const navigate = useNavigate()

  function handleJoinQueue(title: string, author?: string) {
    const params = new URLSearchParams({ title })
    if (author) params.set('author', author)
    if (user) {
      navigate(`/request?${params}`)
    } else {
      navigate(`/login?redirect=/request?${params}`)
    }
  }

  function handleIHaveThis() {
    if (user) {
      navigate('/list')
    } else {
      navigate('/login?redirect=/list')
    }
  }

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
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

        {/* Stats bar */}
        <div className="flex items-center gap-2 bg-white border border-third rounded-2xl px-5 py-3.5 mb-8">
          <Users size={14} className="text-secondary" />
          <p className="text-sm text-main/60">
            <span className="font-semibold text-main">{bookRequests.reduce((s, r) => s + r.requestCount, 0)} readers</span>{' '}
            are waiting for books right now
          </p>
        </div>

        {/* Request cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookRequests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl border border-third p-5 flex flex-col gap-4">
              <div>
                <h3 className="font-heading font-bold text-main text-base leading-snug">{req.title}</h3>
                {req.author && (
                  <p className="text-xs text-main/45 mt-0.5">{req.author}</p>
                )}
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className="font-semibold text-secondary">
                  {req.requestCount} {req.requestCount === 1 ? 'person needs this' : 'people need this'}
                </span>
                <span className="text-main/35">
                  {req.daysAgo === 1 ? '1 day ago' : `${req.daysAgo} days ago`}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1 border-t border-third">
                <button
                  onClick={() => handleJoinQueue(req.title, req.author)}
                  className="text-[11px] font-semibold tracking-widest uppercase bg-main text-white px-4 py-2 hover:bg-main/85 transition-colors shrink-0 rounded-full"
                >
                  Join Queue
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

        {/* Bottom CTA */}
        <div className="mt-10 bg-white rounded-2xl border border-third px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-heading font-bold text-main text-base">Looking for a specific book?</p>
            <p className="text-sm text-main/50 mt-0.5">Post a request and let the community help you find it.</p>
          </div>
          <Link
            to="/request"
            className="inline-flex items-center gap-2 bg-main text-white font-semibold px-6 py-3 rounded-full hover:bg-main/90 transition-colors text-sm shrink-0"
          >
            <PlusCircle size={14} /> Post a Request
          </Link>
        </div>

      </div>
    </div>
  )
}
