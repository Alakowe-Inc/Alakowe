import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { useSearchParams } from 'react-router-dom'
import { useListings } from '../../lib/api/listings/listings.hooks'
import { listingToBookDisplay } from '../../lib/api/adapters'
import BookCard from '../../components/BookCard'
import { FormControl, SelectBoxControl, type SelectOption } from '@/components/ui/form-controls'

const genres = ['All', 'African Fiction', 'Foreign Fiction', 'Romance', 'Thriller', 'Fantasy', 'Children', 'Academic', 'Self Help']
const conditions = ['All', 'New', 'LikeNew', 'Excellent', 'Good', 'Fair', 'Poor']

function BrowseBooks() {
  const [searchParams] = useSearchParams()
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

  const openFilters = () => setShowFilters(true)
  const closeFilters = () => setShowFilters(false)

  const filtered = useMemo(() => {
    setPage(1)
    let result = [...books]
    if (query) {
      const q = query.toLowerCase()
      result = result.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q),
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

  return (
    <div className="min-h-screen bg-third">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="bg-main h-[40vh] min-h-[320px] flex items-center justify-center py-12">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 w-full text-center">
          <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Marketplace
          </p>
          <h1 className="font-heading font-bold text-white text-4xl md:text-5xl leading-tight mb-8">
            Find your next read.
          </h1>

          {/* Search bar */}
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/15 rounded-md overflow-hidden max-w-xl mx-auto focus-within:border-secondary transition-colors">
            <Search size={15} className="ml-4 text-white/40 shrink-0" />
            <div className="flex-1">
              <FormControl
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by title, author…"
                style="min-h-0 px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none bg-transparent border-0 rounded-none focus-visible:ring-0 font-body"
              />
            </div>
            {query && (
              <button
                onClick={() => setQuery('')}
                className="px-4 text-white/40 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-8xl py-6 mx-auto px-4 md:px-6 lg:px-12">

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between py-4 border-b border-main/10">
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
              {filtered.length} {filtered.length === 1 ? 'Product' : 'Products'}
            </span>
          </div>

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

        {/* ── Grid ── */}
        <div className="py-10">
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <p className="text-main/50 text-sm">Loading…</p>
            </div>
          ) : filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
                {paginated.map(book => (
                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  <BookCard key={book.id} book={book as any} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-16">
                  <button
                    onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    disabled={page === 1}
                    className="w-9 h-9 rounded-full border border-main/15 flex items-center justify-center text-main/40 hover:border-main/40 hover:text-main disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <CaretLeftIcon size={14} weight="bold" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      className={`w-9 h-9 rounded-full text-xs font-semibold transition-all ${n === page
                        ? 'bg-main text-white'
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
                  >
                    <CaretRightIcon size={14} weight="bold" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <span className="font-heading font-bold text-8xl text-secondary/20 mb-6 select-none">✦</span>
              <p className="font-heading font-semibold text-main text-xl mb-2">No books found</p>
              <p className="text-main/50 text-sm">Try adjusting your search or filters.</p>
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
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-main text-white px-3 py-1.5 rounded-full">
                    {genre}
                    <button onClick={() => setGenre('All')} className="hover:opacity-70 transition-opacity"><X size={10} /></button>
                  </span>
                )}
                {condition !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-main text-white px-3 py-1.5 rounded-full">
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
                className="flex-1 bg-main text-white py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-main/90 transition-colors rounded-xl"
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
