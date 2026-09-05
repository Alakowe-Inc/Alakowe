import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Clock, AlertCircle, BookOpen, Users, XCircle, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  useMyBookRequests,
  useLeaveWaitlist,
} from '../../lib/api/requests/requests.hooks'

function getDate(r: { dateCreated?: string | null; createdAt?: string | null }): string {
  return r.dateCreated || r.createdAt || ''
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return '—'
  }
}

export default function MyRequests() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // My Requests API
  const { data: rawMyRequests, isLoading: loadingMyRequests, error: myRequestsError } = useMyBookRequests(user?.email)
  const myRequests = Array.isArray(rawMyRequests) ? rawMyRequests : []

  const leaveWaitlist = useLeaveWaitlist()
  const [loadingRequestId, setLoadingRequestId] = useState<string | null>(null)

  async function handleLeaveWaitlist(requestId: string | number) {
    if (!user) {
      navigate('/login?redirect=/my-requests')
      return
    }
    setLoadingRequestId(String(requestId))
    try {
      await leaveWaitlist.mutateAsync({ requestId, buyerEmail: user.email })
    } catch {
      // handled
    } finally {
      setLoadingRequestId(null)
    }
  }

  return (
    <div className="bg-[#fcfdfd] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-main/8">
            <div>
              <h2 className="font-heading font-bold text-main text-lg">My Activity & Waitlists</h2>
              <p className="text-xs text-main/55">
                Book requests created by you and waitlists you've joined.
              </p>
            </div>
            {user && (
              <span className="text-[11px] font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full w-fit">
                {myRequests.length} {myRequests.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>

          {!user ? (
            <div className="text-center py-16 border border-dashed border-main/15 rounded-2xl bg-slate-50/50 p-8">
              <Clock size={36} className="text-secondary mx-auto mb-3" />
              <h3 className="font-heading font-bold text-main text-lg mb-1">
                Log in to see your requests
              </h3>
              <p className="text-xs text-main/55 max-w-sm mx-auto mb-5">
                Track the books you've requested and waitlists you've joined all in one place.
              </p>
              <button
                onClick={() => navigate('/login?redirect=/my-requests')}
                className="bg-secondary text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-colors uppercase tracking-wider"
              >
                Log In
              </button>
            </div>
          ) : loadingMyRequests ? (
            <div className="text-center py-20">
              <div className="inline-block w-6 h-6 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin mb-3" />
              <p className="text-main/50 text-sm">Loading your activity...</p>
            </div>
          ) : myRequestsError ? (
            <div className="text-center py-16 border border-dashed border-red-200 rounded-2xl bg-red-50/40 p-8">
              <AlertCircle size={36} className="text-red-400 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-main text-base mb-1">
                Could not load your requests
              </h3>
              <p className="text-xs text-main/50 max-w-sm mx-auto mb-3">
                {(myRequestsError as Error)?.message || 'An error occurred while fetching your requests.'}
              </p>
              <p className="text-[11px] text-main/40">
                If you just logged in, try refreshing the page.
              </p>
            </div>
          ) : myRequests.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-main/15 rounded-2xl bg-white p-8">
              <BookOpen size={36} className="text-main/30 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-main text-base mb-1">
                No active requests found
              </h3>
              <p className="text-xs text-main/50 max-w-sm mx-auto mb-6">
                You haven't submitted any book requests or joined any waitlists yet.
              </p>
              <button
                onClick={() => navigate('/request-book')}
                className="bg-secondary text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-secondary/90 transition-colors"
              >
                Create a Request
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myRequests.map((req) => {
                const isOwner = req.buyerEmail?.toLowerCase() === user.email?.toLowerCase()
                const waitlistCount = req.waitlistCount ?? req.waitlist?.length ?? 0
                const statusLower = (req.status || '').toLowerCase()
                const isClosed = statusLower === 'closed'
                const isMatched = statusLower === 'matched'
                const isOnWaitlist = req.isWaitlisted != null ? Boolean(req.isWaitlisted) : (req.isUserOnWaitlist ?? true)

                const categoryName = req.genre || req.category || 'General'
                const conditionName = req.condition || req.bookCondition || 'Any Condition'

                const createdDate = formatDate(getDate(req))
                const joinedDate = formatDate(req.dateJoined || req.joinedAt) || createdDate

                return (
                  <div key={req.id} className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    {/* Header: Status + Type Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-main/8">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isClosed
                              ? 'bg-gray-100 text-gray-600 border-gray-200'
                              : isMatched
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {isClosed ? 'Closed' : isMatched ? 'Matched' : statusLower === 'pending' ? 'Pending' : 'Open Request'}
                          </span>
                          <span className="text-xs text-main/40">•</span>
                          <span className={`text-xs font-semibold ${isOwner ? 'text-violet-600' : 'text-secondary'}`}>
                            {isOwner ? '📝 Your Request' : '🔔 Joined Waitlist'}
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-main text-lg truncate">{req.title}</h3>
                        {req.author && (
                          <p className="text-xs text-main/55 mt-0.5">by {req.author}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Users size={14} className="text-main/40" />
                        <span className="text-xs font-semibold text-main">
                          {waitlistCount} {waitlistCount === 1 ? 'reader waiting' : 'readers waiting'}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 bg-slate-50/70 border border-slate-100 rounded-xl p-3.5">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary mb-0.5">Category</p>
                        <p className="text-xs text-main font-semibold">{categoryName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary mb-0.5">Condition</p>
                        <p className="text-xs text-main font-semibold">{conditionName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary mb-0.5">First Requested</p>
                        <p className="text-xs text-main font-medium">{createdDate}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary mb-0.5">Date Joined</p>
                        <p className="text-xs text-main font-medium">{joinedDate}</p>
                      </div>
                    </div>

                    {/* Action footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-main/8">
                      <p className="text-[11px] text-main/40">
                        {isOwner ? `Created on ${createdDate}` : `Joined waitlist on ${joinedDate}`}
                      </p>

                      {!isClosed && isOnWaitlist && (
                        <button
                          disabled={!!loadingRequestId}
                          onClick={() => handleLeaveWaitlist(req.id)}
                          className="px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                        >
                          <XCircle size={13} />
                          {loadingRequestId === req.id ? 'Leaving...' : 'Leave Waitlist'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}