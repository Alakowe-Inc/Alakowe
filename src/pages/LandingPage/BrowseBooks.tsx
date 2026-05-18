import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { books } from '../../data/mockData'
import BookCard from '../../components/BookCard'

const genres = ['All', 'African Fiction', 'Foreign Fiction', 'Romance', 'Thriller', 'Fantasy', 'Children', 'Academic', 'Self Help']
const conditions = ['All', 'Very Good', 'Good', 'Average', 'Below Average']
const locations = ['All', 'Lagos', 'Ibadan', 'Abuja', 'Port Harcourt']

function BrowseBooks() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [genre, setGenre] = useState('All')
  const [condition, setCondition] = useState('All')
  const [location, setLocation] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    document.body.style.overflow = showFilters ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showFilters])

  const openFilters = () => setShowFilters(true)
  const closeFilters = () => setShowFilters(false)

  const filtered = useMemo(() => {
    let result = [...books]
    if (query) {
      const q = query.toLowerCase()
      result = result.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q),
      )
    }
    if (genre !== 'All') result = result.filter(b => b.genre === genre)
    if (condition !== 'All') result = result.filter(b => b.condition === condition)
    if (location !== 'All') result = result.filter(b => b.location.includes(location))
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price)
    return result
  }, [query, genre, condition, location, sortBy])

  const hasFilters = genre !== 'All' || condition !== 'All' || location !== 'All'

  function clearFilters() {
    setGenre('All')
    setCondition('All')
    setLocation('All')
  }

  return (
    <div className="min-h-screen bg-third">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="bg-main min-h-[50vh] flex items-center justify-center py-20">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 w-full text-center">
          <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Marketplace
          </p>
          <h1 className="font-heading font-bold text-white text-4xl md:text-5xl leading-tight mb-8">
            Find your next read.
          </h1>

          {/* Search bar — frosted glass to match hero/quotes */}
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/15 rounded-md overflow-hidden max-w-xl mx-auto focus-within:border-secondary transition-colors">
            <Search size={15} className="ml-4 text-white/40 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title, author, or location…"
              className="flex-1 px-4 py-3.5 text-sm text-white placeholder-white/30 outline-none bg-transparent font-body"
            />
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
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs font-semibold uppercase tracking-[0.15em] text-main bg-transparent outline-none cursor-pointer max-w-30 md:max-w-none truncate"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
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
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
              {filtered.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
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
            className="absolute right-0 top-0 h-full w-full sm:w-105 bg-white flex flex-col"
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
                {location !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-main text-white px-3 py-1.5 rounded-full">
                    {location}
                    <button onClick={() => setLocation('All')} className="hover:opacity-70 transition-opacity"><X size={10} /></button>
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

              {/* Location */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-secondary mb-5">Location</p>
                <div className="flex flex-col">
                  {locations.map(l => (
                    <button
                      key={l}
                      onClick={() => setLocation(l)}
                      className="flex items-center justify-between py-3.5 border-b border-main/6 group"
                    >
                      <span className={`text-sm transition-colors ${location === l ? 'font-semibold text-main' : 'text-main/50 group-hover:text-main'}`}>
                        {l}
                      </span>
                      {location === l && (
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 pt-4 pb-6 shrink-0 flex items-center gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 border border-main/15 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-main/50 hover:border-main/40 hover:text-main transition-colors rounded-full"
              >
                Clear All
              </button>
              <button
                onClick={closeFilters}
                className="flex-1 bg-main text-white py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-main/90 transition-colors rounded-full"
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
