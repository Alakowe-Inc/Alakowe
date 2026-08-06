import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal, X, Plus, Sparkles } from 'lucide-react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useListings } from '../../lib/api/listings/listings.hooks'
import { listingToBookDisplay } from '../../lib/api/adapters'
import BookCard from '../../components/BookCard'
import { FormControl, SelectBoxControl, type SelectOption } from '@/components/ui/form-controls'

const genres = ['All', 'African Fiction', 'Foreign Fiction', 'Romance', 'Thriller', 'Fantasy', 'Children', 'Academic', 'Self Help']
const conditions = ['All', 'New', 'LikeNew', 'Excellent', 'Good', 'Fair', 'Poor']

function BrowseBooks() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [genre, setGenre] = useState('All')
  const [condition, setCondition] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 12

  const { data: pagedResult, isLoading } = useListings()

  const books = useMemo(() => (pagedResult?.result ?? []).map(listingToBookDisplay), [pagedResult])

  useEffect(() => {
    document.body.style.overflow = showFilters ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showFilters])

  useEffect(() => {
    setPage(1)
  }, [query, genre, condition, sortBy])

  const openFilters = () => setShowFilters(true)
  const closeFilters = () => setShowFilters(false)

  const filtered = useMemo(() => {
    let result = [...books]
    if (query) {
      const q = query.toLowerCase()
      result = result.filter(
        b =>
          (b.title && b.title.toLowerCase().includes(q)) ||
          (b.author && b.author.toLowerCase().includes(q)),
      )
    }
    if (genre !== 'All') result = result.filter(b => b.genre === genre)
    if (condition !== 'All') result = result.filter(b => b.condition === condition)
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price)
    return result
  }, [query, genre, condition, sortBy, books])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const hasFilters = genre !== 'All' || condition !== 'All'

  function clearFilters() {
    setGenre('All')
    setCondition('All')
  }

  function handleRequestBook() {
    const params = query ? `?title=${encodeURIComponent(query)}` : ''
    navigate(`/request-book${params}`)
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10">

        {/* Banner Card — matches SellerStorefront design */}
        <div className="bg-gradient-to-br from-violet-50/70 to-indigo-50/40 border border-violet-100/80 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          
          {/* Icon Avatar */}
          <div className="w-24 h-24 rounded-full bg-violet-100 border-4 border-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles size={32} className="text-secondary" />
          </div>

          {/* Description Text */}
          <div className="flex-1 text-center md:text-left z-10 min-w-0">
            <h1 className="font-heading font-bold text-main text-2xl sm:text-3xl leading-snug">
              Browse Our Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-main/55 mt-2">
              Discover thousands of books from trusted sellers. Find your next read or request a book that's not available.
            </p>
          </div>

          {/* Decorative Shelf Vector Illustration */}
          <div className="absolute right-8 bottom-0 hidden lg:block select-none opacity-45 pointer-events-none z-0">
            <svg width="220" height="100" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Shelf */}
              <line x1="0" y1="100" x2="240" y2="100" stroke="#6B6FFF" strokeWidth="3" strokeLinecap="round" />
              
              {/* Books */}
              <rect x="150" y="20" width="16" height="80" rx="2" fill="#E8E8FF" stroke="#6B6FFF" strokeWidth="2" />
              <line x1="158" y1="30" x2="158" y2="90" stroke="#6B6FFF" strokeWidth="2" strokeDasharray="3 3" />
              <rect x="168" y="30" width="14" height="70" rx="2" fill="#F3F3FF" stroke="#6B6FFF" strokeWidth="2" />
              <rect x="184" y="25" width="18" height="75" rx="2" fill="#E8E8FF" stroke="#6B6FFF" strokeWidth="2" />
              <line x1="193" y1="35" x2="193" y2="85" stroke="#6B6FFF" strokeWidth="2" strokeDasharray="2 2" />

              <rect x="50" y="85" width="60" height="15" rx="2" fill="#F3F3FF" stroke="#6B6FFF" strokeWidth="2" />
              <rect x="53" y="72" width="54" height="13" rx="2" fill="#E8E8FF" stroke="#6B6FFF" strokeWidth="2" />
              <rect x="56" y="61" width="48" height="11" rx="2" fill="#F3F3FF" stroke="#6B6FFF" strokeWidth="2" />

              {/* Plant */}
              <path d="M210 70 L230 70 L225 90 L215 90 Z" fill="#E8E8FF" stroke="#6B6FFF" strokeWidth="2" />
              <path d="M220 70 C220 50 205 55 205 55 C205 55 215 65 220 70 Z" fill="#F3F3FF" stroke="#6B6FFF" strokeWidth="1.5" />
              <path d="M220 70 C220 45 228 48 228 48 C228 48 225 62 220 70 Z" fill="#E8E8FF" stroke="#6B6FFF" strokeWidth="1.5" />
              <path d="M220 70 C222 55 235 58 235 58 C235 58 227 67 220 70 Z" fill="#F3F3FF" stroke="#6B6FFF" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Search Bar — below banner */}
        <div className="mb-8">
          <div className="flex items-center bg-white border border-main/10 rounded-2xl overflow-hidden shadow-sm focus-within:border-secondary focus-within:shadow-md transition-all">
            <Search size={16} className="ml-4 text-main/40 shrink-0" />
            <div className="flex-1">
              <FormControl
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by title, author…"
                style="min-h-0 px-4 py-3.5 text-sm text-main placeholder:text-main/30 outline-none bg-transparent border-0 rounded-none focus-visible:ring-0 font-body"
              />
            </div>
            {query && (
              <button
                onClick={() => setQuery('')}
                className="px-4 text-main/40 hover:text-main transition-colors"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between py-4 border-b border-main/10 flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-3 md:gap-6">
            <div className="max-w-30 md:max-w-none">
              <SelectBoxControl
                options={[
                  { label: 'Featured', value: 'default' },
                  { label: 'Price: Low → High', value: 'price-asc' },
                  { label: 'Price: High → Low', value: 'price-desc' },
                ]}
                value={{
                  default: { label: 'Featured', value: 'default' },
                  'price-asc': { label: 'Price: Low → High', value: 'price-asc' },
                  'price-desc': { label: 'Price: High → Low', value: 'price-desc' },
                }[sortBy]}
                onChange={(option: SelectOption) => setSortBy(String(option.value))}
                style="min-h-0 px-0 py-0 border-0 rounded-none bg-transparent hover:bg-transparent text-xs font-semibold uppercase tracking-[0.15em] text-main truncate"
              />
            </div>
            <span className="hidden sm:block text-xs font-semibold uppercase tracking-[0.15em] text-main/40">
              {filtered.length} {filtered.length === 1 ? 'Book' : 'Books'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openFilters}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-main hover:text-secondary transition-colors"
            >
              <SlidersHorizontal size={13} />
              <span className="hidden sm:inline">Filter and Sort</span>
              <span className="sm:hidden">Filter</span>
              {hasFilters && (
                <span className="w-4 h-4 rounded-full bg-secondary text-white text-[9px] flex items-center justify-center">
                  ✓
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Grid ── */}
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <p className="text-main/50 text-sm">Loading…</p>
            </div>
          ) : filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 mb-10">
                {paginated.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>

              {/* ── Bottom Bar: Pagination + Request a Book Button ── */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 pt-6 border-t border-main/10">
                {/* Pagination Controls */}
                {totalPages > 1 ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      disabled={page === 1}
                      className="w-9 h-9 rounded-full border border-main/15 flex items-center justify-center text-main/40 hover:border-main/40 hover:text-main disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      aria-label="Previous page"
                    >
                      <CaretLeftIcon size={14} weight="bold" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                        className={`w-9 h-9 rounded-full text-xs font-semibold transition-all ${n === page
                          ? 'bg-secondary text-white'
                          : 'border border-main/15 text-main/50 hover:border-main/40 hover:text-main'
                          }`}
                      >
                        {n}
                      </button>
                    ))}

                    <button
                      onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      disabled={page === totalPages}
                      className="w-9 h-9 rounded-full border border-main/15 flex items-center justify-center text-main/40 hover:border-main/40 hover:text-main disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      aria-label="Next page"
                    >
                      <CaretRightIcon size={14} weight="bold" />
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-main/40 font-medium">
                    Showing all {filtered.length} books
                  </div>
                )}

                {/* Request a Book Link */}
                <button
                  type="button"
                  onClick={handleRequestBook}
                  className="text-xs sm:text-sm font-semibold text-secondary hover:underline transition-all text-left"
                >
                  Can't find what you're looking for, click here to request for it
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-third p-8 shadow-sm">
              <span className="font-heading font-bold text-7xl text-secondary/20 mb-4 select-none">✦</span>
              <p className="font-heading font-bold text-main text-xl mb-2">No books found</p>
              <p className="text-main/55 text-sm mb-6 max-w-md">
                {query
                  ? `We couldn't find any listings matching "${query}". Submit a book request so sellers know you're looking for it!`
                  : 'No books match your current filters. You can submit a request for the book you need!'}
              </p>
              <Link
                to={query ? `/request-book?title=${encodeURIComponent(query)}` : '/request-book'}
                className="inline-flex items-center gap-2 bg-secondary text-white font-semibold text-xs px-6 py-3.5 rounded-xl hover:bg-secondary/90 transition-all shadow-sm"
              >
                Request this Book {query ? `"${query}"` : ''} &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Filters drawer */}
      {showFilters && (
        <div
          className="fixed inset-0 z-50 bg-main/40 backdrop-blur-sm"
          onClick={closeFilters}
        >
          <div
            className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-6 pb-6 shrink-0">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-secondary mb-1">Marketplace</p>
                <h3 className="font-heading font-bold text-main text-2xl">Filter &amp; Sort</h3>
              </div>
              <button
                onClick={closeFilters}
                className="w-9 h-9 rounded-full border border-main/10 flex items-center justify-center text-main/40 hover:border-main/30 hover:text-main transition-all"
              >
                <X size={15} />
              </button>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="px-8 pb-4 flex flex-wrap gap-2 shrink-0">
                {genre !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-secondary text-white px-3 py-1.5 rounded-full">
                    {genre}
                    <button onClick={() => setGenre('All')} className="hover:opacity-70 transition-opacity"><X size={10} /></button>
                  </span>
                )}
                {condition !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-secondary text-white px-3 py-1.5 rounded-full">
                    {condition}
                    <button onClick={() => setCondition('All')} className="hover:opacity-70 transition-opacity"><X size={10} /></button>
                  </span>
                )}
              </div>
            )}

            <div className="h-px bg-main/8 mx-8 shrink-0" />

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">

              {/* Sort */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-secondary mb-5">Sort By</p>
                <div className="flex flex-col">
                  {[
                    { value: 'default', label: 'Featured' },
                    { value: 'price-asc', label: 'Price: Low to High' },
                    { value: 'price-desc', label: 'Price: High to Low' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className="flex items-center justify-between py-3.5 border-b border-main/6 group"
                    >
                      <span className={`text-sm transition-colors ${sortBy === opt.value ? 'font-semibold text-main' : 'text-main/50 group-hover:text-main'}`}>
                        {opt.label}
                      </span>
                      {sortBy === opt.value && (
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-secondary mb-5">Genre</p>
                <div className="flex flex-col">
                  {genres.map(g => (
                    <button
                      key={g}
                      onClick={() => setGenre(g)}
                      className="flex items-center justify-between py-3.5 border-b border-main/6 group"
                    >
                      <span className={`text-sm transition-colors ${genre === g ? 'font-semibold text-main' : 'text-main/50 group-hover:text-main'}`}>
                        {g}
                      </span>
                      {genre === g && (
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-secondary mb-5">Condition</p>
                <div className="flex flex-col">
                  {conditions.map(c => (
                    <button
                      key={c}
                      onClick={() => setCondition(c)}
                      className="flex items-center justify-between py-3.5 border-b border-main/6 group"
                    >
                      <span className={`text-sm transition-colors ${condition === c ? 'font-semibold text-main' : 'text-main/50 group-hover:text-main'}`}>
                        {c}
                      </span>
                      {condition === c && (
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            

            {/* Footer */}
            <div className="px-8 pt-4 pb-4 shrink-0 flex items-center gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 border border-main/15 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-main/50 hover:border-main/40 hover:text-main transition-colors rounded-xl"
              >
                Clear All
              </button>
              <button
                onClick={closeFilters}
                className="flex-1 bg-secondary text-white py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-secondary/90 transition-colors rounded-xl"
              >
                Show {filtered.length} {filtered.length === 1 ? 'Result' : 'Results'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BrowseBooks
