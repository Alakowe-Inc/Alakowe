import { useState, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Bell, BookOpen, Users, Clock, AlertCircle, XCircle, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { CONDITIONS, GENRES } from '../../data/sellerData'
import { FormControl, SelectBoxControl, type SelectOption } from '@/components/ui/form-controls'
import {
  useSubmitBookRequest,
  useAllBookRequests,
  useMyBookRequests,
  useJoinWaitlist,
  useLeaveWaitlist,
} from '../../lib/api/requests/requests.hooks'

type FormState = {
  title: string
  author: string
  category: string
  condition: string
}

const empty: FormState = {
  title: '', author: '', category: '', condition: '',
}

function Field({ label, required, hint, error, children }: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <label className="text-xs font-semibold text-main/50 uppercase tracking-wider">
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {hint && <span className="text-xs text-main/35">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

const inputClass = (err?: boolean) =>
  `w-full border rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus:border-secondary transition-colors bg-white ${err ? 'border-red-400' : 'border-main/15'}`

/* Helper to format dates nicely */
// Reads dateCreated (actual API field) first, falls back to createdAt
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

// Reads isWaitlisted (actual API field) first, falls back to isUserOnWaitlist
function getIsJoined(
  r: { isWaitlisted?: boolean | null; isUserOnWaitlist?: boolean; waitlist?: string[] | null },
  email?: string
): boolean {
  if (r.isWaitlisted != null) return Boolean(r.isWaitlisted)
  if (r.isUserOnWaitlist != null) return Boolean(r.isUserOnWaitlist)
  if (email && r.waitlist) return r.waitlist.includes(email)
  return false
}

export default function RequestBook() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [activeTab, setActiveTab] = useState<'requests' | 'form' | 'my-requests'>('requests')
  const [form, setForm] = useState<FormState>({
    ...empty,
    title: params.get('title') ?? '',
    author: params.get('author') ?? '',
  })
  const [filter, setFilter] = useState<'most' | 'recent'>('most')
  const [searchTerm, setSearchTerm] = useState('')

  // Public requested books API (GET /api/v1/BookRequest)
  const { data: rawAllRequests, isLoading: loadingRequests } = useAllBookRequests(undefined, user?.email)
  const allRequests = Array.isArray(rawAllRequests) ? rawAllRequests : []

  // My Requests API (GET /api/v1/BookRequest/my-activity)
  const { data: rawMyRequests, isLoading: loadingMyRequests, error: myRequestsError } = useMyBookRequests(user?.email)
  const myRequests = Array.isArray(rawMyRequests) ? rawMyRequests : []

  /* Filter and Sort logic for Requested Books */
  const filteredRequests = useMemo(() => {
    let list = allRequests.filter(r => {
      const count = r.waitlistCount ?? r.waitlist?.length ?? 0
      return count > 0 && (r.status || '').toLowerCase() !== 'closed'
    })

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase()
      list = list.filter(r =>
        r.title.toLowerCase().includes(term) || (r.author || '').toLowerCase().includes(term)
      )
    }

    if (filter === 'most') {
      // Sort by waitlistCount descending — highest number of waiting readers first
      return [...list].sort((a, b) => {
        const countA = a.waitlistCount ?? a.waitlist?.length ?? 0
        const countB = b.waitlistCount ?? b.waitlist?.length ?? 0
        return countB - countA
      })
    }

    // Recently requested — sort by dateCreated descending (newest first)
    return [...list].sort((a, b) => {
      const tA = new Date(getDate(a)).getTime()
      const tB = new Date(getDate(b)).getTime()
      if (isNaN(tA) && isNaN(tB)) return 0
      if (isNaN(tA)) return 1
      if (isNaN(tB)) return -1
      return tB - tA
    })
  }, [allRequests, filter, searchTerm])

  const [errors, setErrors] = useState<Partial<FormState>>({})

  const submitRequest = useSubmitBookRequest()
  const joinWaitlist = useJoinWaitlist()
  const leaveWaitlist = useLeaveWaitlist()

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }))
  }

  function setSelect(field: keyof FormState) {
    return (option: SelectOption) => setForm(p => ({ ...p, [field]: String(option.value) }))
  }

  function validate(): Partial<FormState> {
    const e: Partial<FormState> = {}
    if (!form.title.trim()) e.title = 'Book title is required'
    if (!form.category) e.category = 'Please select a category'
    return e
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      navigate('/login?redirect=/request-book')
      return
    }
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    try {
      await submitRequest.mutateAsync({
        title: form.title.trim(),
        author: form.author.trim(),
        category: form.category,
        buyerEmail: user.email,
        bookCondition: form.condition,
      })
      setForm(empty)
      setActiveTab('requests')
    } catch {
      // error toast handled in client.ts
    }
  }

  const [loadingRequestId, setLoadingRequestId] = useState<string | null>(null)

  async function handleJoinWaitlist(request: typeof allRequests[0]) {
    if (!user) {
      navigate('/login?redirect=/request-book')
      return
    }
    setLoadingRequestId(String(request.id))
    try {
      await joinWaitlist.mutateAsync({
        title: request.title,
        author: request.author || '',
        category: request.genre || request.category || '',
        bookCondition: request.condition || '',
      })
    } catch {
      // handled
    } finally {
      setLoadingRequestId(null)
    }
  }

  async function handleLeaveWaitlist(requestId: string | number) {
    if (!user) {
      navigate('/login?redirect=/request-book')
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
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10">

        {/* Banner Card — matches SellerStorefront header */}
        <div className="bg-gradient-to-br from-violet-50/70 to-indigo-50/40 border border-violet-100/80 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">

          {/* Icon Avatar */}
          <div className="w-20 h-20 rounded-full bg-violet-100 border-4 border-white flex items-center justify-center shrink-0 shadow-sm">
            <BookOpen size={30} className="text-secondary" />
          </div>

          {/* Header Text */}
          <div className="flex-1 text-center md:text-left z-10 min-w-0">
            <h1 className="font-heading font-bold text-main text-2xl sm:text-3xl leading-snug">
              Request a Book
            </h1>
            <p className="text-xs sm:text-sm text-main/55 mt-1.5 max-w-md">
              Can't find what you're looking for? Submit a request and we'll notify you when a matching book is listed.
            </p>

            {/* Info pill */}
            <div className="inline-flex items-center gap-2 mt-4 bg-white/70 border border-violet-100 rounded-full px-3.5 py-1.5">
              <Bell size={11} className="text-secondary shrink-0" />
              <span className="text-[11px] text-main/60 font-medium">
                You'll get an <span className="font-semibold text-main">email notification</span> when a match is found
              </span>
            </div>
          </div>

          {/* Decorative illustration */}
          <div className="absolute right-8 bottom-0 hidden lg:block select-none opacity-40 pointer-events-none z-0">
            <svg width="200" height="100" viewBox="0 0 220 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="80" cy="50" r="30" stroke="#6B6FFF" strokeWidth="3" fill="#E8E8FF" />
              <circle cx="80" cy="50" r="18" stroke="#6B6FFF" strokeWidth="2" fill="#F3F3FF" />
              <line x1="103" y1="73" x2="125" y2="95" stroke="#6B6FFF" strokeWidth="4" strokeLinecap="round" />
              <rect x="145" y="60" width="14" height="40" rx="2" fill="#E8E8FF" stroke="#6B6FFF" strokeWidth="2" />
              <rect x="161" y="50" width="12" height="50" rx="2" fill="#F3F3FF" stroke="#6B6FFF" strokeWidth="2" />
              <rect x="175" y="55" width="16" height="45" rx="2" fill="#E8E8FF" stroke="#6B6FFF" strokeWidth="2" />
              <line x1="130" y1="100" x2="210" y2="100" stroke="#6B6FFF" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* ── Mobile View Dropdown Tab Selector ── */}
        <div className="block sm:hidden mb-6">
          <label className="text-[10px] font-bold uppercase tracking-wider text-main/50 mb-1.5 block">
            Select View:
          </label>
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as typeof activeTab)}
              className="w-full bg-white border border-main/20 rounded-xl px-4 py-3 text-xs font-bold text-main appearance-none outline-none focus:border-secondary transition-colors shadow-sm pr-10"
            >
              <option value="requests">📚 REQUESTED BOOKS ({allRequests.length})</option>
              <option value="form">✍️ BOOK REQUEST FORM</option>
              <option value="my-requests">👤 MY REQUESTS {user ? `(${myRequests.length})` : ''}</option>
            </select>
            <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-main/50 pointer-events-none" />
          </div>
        </div>

        {/* ── Desktop Horizontal Tabs ── */}
        <div className="hidden sm:flex border-b border-main/10 mb-8 overflow-x-auto">
          {[
            { id: 'requests', label: `Requested Books${allRequests.length > 0 ? ` (${allRequests.length})` : ''}` },
            { id: 'form', label: 'Book Request Form' },
            { id: 'my-requests', label: `My Requests${user ? ` (${myRequests.length})` : ''}` },
          ].map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all -mb-px whitespace-nowrap ${
                  isActive
                    ? 'border-secondary text-main font-bold'
                    : 'border-transparent text-main/45 hover:text-main'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* TAB 1: FORM */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
              <div className="flex flex-col gap-5">
                <div className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                      <BookOpen size={16} className="text-secondary" />
                    </div>
                    <h2 className="font-heading font-bold text-main text-base">Book Details</h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    <Field label="Book Title" required error={errors.title}>
                      <FormControl type="text" placeholder="e.g. Purple Hibiscus" value={form.title} onChange={set('title')} style={inputClass(!!errors.title)} />
                    </Field>
                    <Field label="Author" required error={errors.author}>
                      <FormControl type="text" placeholder="e.g. Chimamanda Ngozi Adichie" value={form.author} onChange={set('author')} style={inputClass()} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Category" required error={errors.category}>
                        <SelectBoxControl
                          placeholder="Select Category"
                          options={GENRES.map(g => ({ label: g, value: g }))}
                          value={GENRES.map(g => ({ label: g, value: g })).find(o => o.value === form.category) ?? null}
                          onChange={setSelect('category')}
                          style={inputClass(!!errors.category)}
                        />
                      </Field>
                      <Field label="Min. Condition" hint="— Optional">
                        <SelectBoxControl
                          placeholder="Any condition"
                          options={CONDITIONS.map(c => ({ label: c, value: c }))}
                          value={form.condition ? { label: form.condition, value: form.condition } : null}
                          onChange={setSelect('condition')}
                          style={inputClass()}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="border border-violet-100 rounded-2xl bg-gradient-to-b from-violet-50/60 to-indigo-50/30 p-5 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-secondary">How it works</p>
                  {[
                    { step: '1', text: 'Fill in the book title and genre' },
                    { step: '2', text: 'Set a budget (optional)' },
                    { step: '3', text: 'A seller lists a match — you\'re notified via email' },
                    { step: '4', text: 'Click the link in your email to purchase' },
                  ].map(({ step, text }) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[9px] font-bold text-white">{step}</span>
                      </div>
                      <p className="text-xs text-main/60 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={submitRequest.isPending}
                  className="w-full bg-main text-white font-semibold py-3.5 rounded-xl hover:bg-main/90 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitRequest.isPending ? 'Submitting…' : 'Submit Request'}
                </button>
                <p className="text-center text-[11px] text-main/35">
                  Your request will be visible to{' '}
                  <Link to="/browse" className="text-secondary font-semibold hover:underline">
                    all sellers
                  </Link>{' '}
                  on Alákòwé.
                </p>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: REQUESTED BOOKS */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                <p className="text-xs text-main/60 mb-1.5 font-medium">
                  Search for the title first before submitting a fresh request:
                </p>
                <FormControl
                  type="text"
                  placeholder="Search requested books by title or author..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={inputClass()}
                />
              </div>

              {/* Filter options */}
              <div className="flex items-center gap-2 self-start sm:self-end">
                <span className="text-[11px] font-bold uppercase tracking-wider text-main/40">Sort By:</span>
                <button
                  type="button"
                  onClick={() => setFilter('most')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                    filter === 'most'
                      ? 'bg-secondary text-white shadow-sm'
                      : 'bg-main/5 text-main/60 hover:bg-main/10'
                  }`}
                >
                  <span>Most Requested</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('recent')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                    filter === 'recent'
                      ? 'bg-secondary text-white shadow-sm'
                      : 'bg-main/5 text-main/60 hover:bg-main/10'
                  }`}
                >
                  <span>Recently Requested</span>
                </button>
              </div>
            </div>

            {/* List */}
            {loadingRequests ? (
              <div className="text-center py-20">
                <div className="inline-block w-6 h-6 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin mb-3" />
                <p className="text-main/50 text-sm">Loading book requests...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-main/15 rounded-2xl">
                <p className="text-main/60 text-sm font-medium">No book requests found.</p>
                <p className="text-xs text-main/40 mt-1">Try another search term or submit a new request!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredRequests.map((request) => {
                  const waitlistCount = request.waitlistCount ?? request.waitlist?.length ?? 0
                  const isJoined = getIsJoined(request, user?.email)
                  const categoryName = request.genre || request.category || 'General'
                  const conditionName = request.condition || request.bookCondition || 'Any Condition'
                  const createdDate = formatDate(getDate(request))

                  return (
                    <div key={request.id} className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                      {/* Request Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading font-bold text-main text-lg">{request.title}</h3>
                          {request.author && (
                            <p className="text-xs text-main/55 mt-0.5">by {request.author}</p>
                          )}
                        </div>
                      </div>

                      {/* Request Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-main/8">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary mb-1">Category</p>
                          <p className="text-xs text-main font-medium">{categoryName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary mb-1">Min. Condition</p>
                          <p className="text-xs text-main font-medium">{conditionName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary mb-1">Requested On</p>
                          <p className="text-xs text-main font-medium">{createdDate}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary mb-1">Waiting</p>
                          <div className="flex items-center gap-1">
                            <Users size={12} className="text-main/40" />
                            <p className="text-xs text-main font-semibold">{waitlistCount} {waitlistCount === 1 ? 'reader' : 'readers'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-main/40">
                          Requested on {createdDate}
                        </p>

                        <button
                          disabled={!!loadingRequestId}
                          onClick={() => {
                            if (isJoined) {
                              handleLeaveWaitlist(request.id)
                            } else {
                              handleJoinWaitlist(request)
                            }
                          }}
                          className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                            isJoined
                              ? 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300 group'
                              : 'bg-secondary text-white hover:bg-secondary/90 shadow-sm'
                          }`}
                          title={isJoined ? 'Click to leave waitlist' : 'Click to join waitlist'}
                        >
                          {isJoined ? (
                            <>
                              <span className="group-hover:hidden">✓ Joined</span>
                              <span className="hidden group-hover:inline">
                                {loadingRequestId === request.id ? 'Leaving...' : 'Leave Waitlist'}
                              </span>
                            </>
                          ) : loadingRequestId === request.id ? (
                            'Joining...'
                          ) : (
                            'Join Waitlist'
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY REQUESTS */}
        {activeTab === 'my-requests' && (
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
                  onClick={() => navigate('/login?redirect=/request-book')}
                  className="bg-main text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-main/90 transition-colors uppercase tracking-wider"
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
                  onClick={() => setActiveTab('form')}
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
                  const joinedDate = req.joinedAt ? formatDate(req.joinedAt) : createdDate

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

                      {/* Details Grid: Category, Condition, First Requested, Joined Date */}
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
        )}

        <div className="mt-12 text-center">
          <p className="text-[10px] text-main/35">
            Powered by{' '}
            <Link to="/" className="font-semibold text-main/50 hover:text-secondary transition-colors">
              Alakowe
            </Link>
            {' '}— Nigeria's peer-to-peer book marketplace
          </p>
        </div>
      </div>
    </div>
  )
}
