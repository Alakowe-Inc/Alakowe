import { useState, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Bell, BookOpen, Wallet, StickyNote, MapPin, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { CONDITIONS, GENRES } from '../../data/sellerData'
import { FormControl, SelectBoxControl, TextareaControl, type SelectOption } from '@/components/ui/form-controls'
import {
  useSubmitBookRequest,
  useAllBookRequests,
  useJoinWaitlist,
} from '../../lib/api/requests/requests.hooks'

type FormState = {
  title: string
  author: string
  genre: string
  condition: string
  maxPrice: string
  notes: string
}

const empty: FormState = {
  title: '', author: '', genre: '', condition: '',
  maxPrice: '', notes: '',
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

export default function RequestBook() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [activeTab, setActiveTab] = useState<'form' | 'requests'>('requests')
  const [form, setForm] = useState<FormState>({
    ...empty,
    title: params.get('title') ?? '',
    author: params.get('author') ?? '',
  })
  const [filter, setFilter] = useState<'most' | 'recent'>('recent')
  const [searchTerm, setSearchTerm] = useState('')
  const { data: allRequests = [], isLoading: loadingRequests } = useAllBookRequests(undefined, user?.email)
  const filteredRequests = useMemo(() => {
    let list = allRequests
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase()
      list = list.filter(r => r.title.toLowerCase().includes(term))
    }
    if (filter === 'most') {
      return [...list].sort((a, b) => (b.waitlist?.length || 0) - (a.waitlist?.length || 0))
    }
    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [allRequests, filter, searchTerm])
  const [errors, setErrors] = useState<Partial<FormState>>({})

  const submitRequest = useSubmitBookRequest()
  const joinWaitlist = useJoinWaitlist()

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
    if (!form.genre) e.genre = 'Please select a genre'
    const price = parseFloat(form.maxPrice)
    if (form.maxPrice && (isNaN(price) || price < 100))
      e.maxPrice = 'Enter a valid amount (min ₦100)'
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
        buyerEmail: user.email,
        title: form.title.trim(),
        author: form.author.trim(),
        genre: form.genre,
        bookCondition: form.condition,
        maxPrice: parseFloat(form.maxPrice) || 0,
        notes: form.notes.trim(),
      })
      setForm(empty)
      setActiveTab('requests')
    } catch {
      // error toast handled in client.ts
    }
  }

  async function handleJoinWaitlist(requestId: string) {
    if (!user) {
      navigate('/login?redirect=/request-book')
      return
    }
    try {
      await joinWaitlist.mutateAsync({ requestId, buyerEmail: user.email })
    } catch {
      // handled
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

          {/* Decorative illustration — mirrors storefront */}
          <div className="absolute right-8 bottom-0 hidden lg:block select-none opacity-40 pointer-events-none z-0">
            <svg width="200" height="100" viewBox="0 0 220 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Search icon */}
              <circle cx="80" cy="50" r="30" stroke="#6B6FFF" strokeWidth="3" fill="#E8E8FF" />
              <circle cx="80" cy="50" r="18" stroke="#6B6FFF" strokeWidth="2" fill="#F3F3FF" />
              <line x1="103" y1="73" x2="125" y2="95" stroke="#6B6FFF" strokeWidth="4" strokeLinecap="round" />
              {/* Book stacks */}
              <rect x="145" y="60" width="14" height="40" rx="2" fill="#E8E8FF" stroke="#6B6FFF" strokeWidth="2" />
              <rect x="161" y="50" width="12" height="50" rx="2" fill="#F3F3FF" stroke="#6B6FFF" strokeWidth="2" />
              <rect x="175" y="55" width="16" height="45" rx="2" fill="#E8E8FF" stroke="#6B6FFF" strokeWidth="2" />
              {/* Shelf line */}
              <line x1="130" y1="100" x2="210" y2="100" stroke="#6B6FFF" strokeWidth="3" strokeLinecap="round" />
              {/* Stars / sparkles */}
              <circle cx="50" cy="20" r="3" fill="#6B6FFF" opacity="0.5" />
              <circle cx="130" cy="15" r="2" fill="#6B6FFF" opacity="0.4" />
              <circle cx="170" cy="25" r="2.5" fill="#6B6FFF" opacity="0.3" />
            </svg>
          </div>
        </div>

        {/* Divider nav line — mirrors tab bar from storefront */}
        <div className="flex border-b border-main/10 mb-8">
          {(['requests','form' ] as const).map((tab) => {
            const labelMap = {
              form: 'Book Request Form',
              requests: `Requested Books${allRequests.length > 0 ? ` (${allRequests.length})` : ''}`,
            }
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all -mb-px ${
                  isActive
                    ? 'border-secondary text-main font-bold'
                    : 'border-transparent text-main/45 hover:text-main'
                }`}
              >
                {labelMap[tab]}
              </button>
            )
          })}
        </div>

        {/* Form */}
        {activeTab === 'form' ? (
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
                  <Field label="Author" hint="— Leave blank if unsure">
                    <FormControl type="text" placeholder="e.g. Chimamanda Ngozi Adichie" value={form.author} onChange={set('author')} style={inputClass()} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Genre" required error={errors.genre}>
                      <SelectBoxControl
                        placeholder="Select genre"
                        options={GENRES.map(g => ({ label: g, value: g }))}
                        value={GENRES.map(g => ({ label: g, value: g })).find(o => o.value === form.genre) ?? null}
                        onChange={setSelect('genre')}
                        style={inputClass(!!errors.genre)}
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
        ) : (
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                <p className="text-xs text-main/60 mb-1.5 font-medium">
                  Search for the title first before submitting a fresh request:
                </p>
                <FormControl
                  type="text"
                  placeholder="Search requested books by title..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={inputClass()}
                />
              </div>

              {/* Filter options */}
              <div className="flex items-center gap-2 self-start sm:self-end">
                <span className="text-xs font-semibold text-main/50 uppercase tracking-wider">Filter:</span>
                <button
                  type="button"
                  onClick={() => setFilter('recent')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    filter === 'recent'
                      ? 'bg-secondary text-white'
                      : 'bg-main/5 text-main/60 hover:bg-main/10'
                  }`}
                >
                  Recently Requested
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('most')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    filter === 'most'
                      ? 'bg-secondary text-white'
                      : 'bg-main/5 text-main/60 hover:bg-main/10'
                  }`}
                >
                  Most Requested
                </button>
              </div>
            </div>

            {/* List */}
            {loadingRequests ? (
              <div className="text-center py-20">
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
                  const waitlistCount = request.waitlist?.length || request.waitlistCount || 1
                  const isJoined = request.isUserOnWaitlist || request.waitlist?.includes(user?.email || '')
                  return (
                    <div key={request.id} className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                      {/* Request Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading font-bold text-main text-lg">{request.title}</h3>
                          {request.author && (
                            <p className="text-xs text-main/55 mt-0.5">{request.author}</p>
                          )}
                        </div>
                      </div>

                      {/* Request Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-main/8">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary mb-1">Genre</p>
                          <p className="text-xs text-main font-medium">{request.genre || 'N/A'}</p>
                        </div>
                        {request.condition && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary mb-1">Min. Condition</p>
                            <p className="text-xs text-main font-medium">{request.condition}</p>
                          </div>
                        )}
                        {request.maxPrice ? (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary mb-1">Max Budget</p>
                            <p className="text-xs text-main font-medium">₦{request.maxPrice.toLocaleString()}</p>
                          </div>
                        ) : null}
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary mb-1">Waiting</p>
                          <div className="flex items-center gap-1">
                            <Users size={12} className="text-main/40" />
                            <p className="text-xs text-main font-semibold">{waitlistCount}</p>
                          </div>
                        </div>
                      </div>

                      {request.notes && (
                        <div className="mb-4 pb-4 border-b border-main/8">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary mb-2">Notes</p>
                          <p className="text-xs text-main/70 leading-relaxed">{request.notes}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-main/40">
                          Requested {new Date(request.createdAt).toLocaleDateString('en-NG')}
                        </p>

                        <button
                          disabled={isJoined || joinWaitlist.isPending}
                          onClick={() => handleJoinWaitlist(request.id)}
                          className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors ${
                            isJoined
                              ? 'bg-main/10 text-main/40 cursor-not-allowed'
                              : 'bg-secondary text-white hover:bg-secondary/90'
                          }`}
                        >
                          {isJoined ? '✓ Joined' : 'Join Waitlist'}
                        </button>
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
