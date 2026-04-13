import { useState, useMemo } from 'react'
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
    <div className="min-h-screen bg-white">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="bg-main">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 pt-14 pb-16">
          <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Marketplace
          </p>
          <h1 className="font-heading font-bold text-white text-4xl md:text-5xl leading-tight mb-8">
            Find your next read.
          </h1>

          {/* Search bar — frosted glass to match hero/quotes */}
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/15 rounded-md overflow-hidden max-w-xl focus-within:border-secondary transition-colors">
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

      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 py-10">
        <div className="flex gap-10">

          {/* Desktop sidebar filters */}
          <aside className="hidden lg:block w-48 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-main/40">Filters</p>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-secondary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <FilterSection title="Genre">
                {genres.map(g => (
                  <FilterOption key={g} label={g} active={genre === g} onClick={() => setGenre(g)} />
                ))}
              </FilterSection>

              <FilterSection title="Condition">
                {conditions.map(c => (
                  <FilterOption key={c} label={c} active={condition === c} onClick={() => setCondition(c)} />
                ))}
              </FilterSection>

              <FilterSection title="Location" last>
                {locations.map(l => (
                  <FilterOption key={l} label={l} active={location === l} onClick={() => setLocation(l)} />
                ))}
              </FilterSection>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">

            {/* Top bar */}
            <div className="mb-6">
              {/* Count + desktop sort — single row on lg+ */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-1">
                    Results
                  </p>
                  <p className="font-heading font-bold text-main text-xl md:text-2xl">
                    {filtered.length} book{filtered.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                {/* Sort select — desktop only in this row */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="hidden lg:block text-sm text-main border border-third bg-white rounded-md px-3 py-2 outline-none cursor-pointer hover:border-main/40 transition-colors"
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              {/* Mobile controls — full-width row */}
              <div className="flex gap-2 lg:hidden">
                <button
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-main border border-third bg-white rounded-md px-4 py-2.5 hover:border-main/40 transition-colors"
                  onClick={() => setShowFilters(true)}
                >
                  <SlidersHorizontal size={15} />
                  Filters
                </button>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="flex-1 text-sm text-main border border-third bg-white rounded-md px-3 py-2.5 outline-none cursor-pointer hover:border-main/40 transition-colors"
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Genre pills */}
            <div className="flex gap-2 overflow-x-auto mb-6 scrollbar-none">
              {genres.map(g => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${genre === g
                    ? 'bg-main text-white'
                    : 'bg-third text-main/55 hover:bg-secondary/15 hover:text-main'
                    }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {filtered.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-28 border border-third rounded-lg">
                <span className="font-heading font-bold text-6xl text-secondary/30 mb-6 select-none">✦</span>
                <p className="font-heading font-semibold text-main text-xl mb-2">No books found</p>
                <p className="text-main/50 text-sm">Try adjusting your search or filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {showFilters && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-full sm:w-80 bg-white flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Sticky header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-third shrink-0">
              <h3 className="font-heading font-semibold text-main">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-main/50 hover:text-main transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable filter content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <FilterSection title="Genre">
                {genres.map(g => (
                  <FilterOption key={g} label={g} active={genre === g} onClick={() => setGenre(g)} />
                ))}
              </FilterSection>

              <FilterSection title="Condition">
                {conditions.map(c => (
                  <FilterOption key={c} label={c} active={condition === c} onClick={() => setCondition(c)} />
                ))}
              </FilterSection>

              <FilterSection title="Location" last>
                {locations.map(l => (
                  <FilterOption key={l} label={l} active={location === l} onClick={() => setLocation(l)} />
                ))}
              </FilterSection>
            </div>

            {/* Sticky footer */}
            <div className="px-6 py-4 border-t gap-x-4 flex items-center border-third shrink-0">
              <button
                onClick={clearFilters}
                className="w-full bg-transparent border border-main text-main py-3 rounded-md font-semibold text-sm hover:bg-white/60 transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-main text-white py-3 rounded-md font-semibold text-sm hover:bg-main/90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterSection({
  title,
  children,
  last = false,
}: {
  title: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <div className={last ? '' : 'mb-6 pb-6 border-b border-third'}>
      <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-3">{title}</p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}

function FilterOption({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`text-sm text-left px-2 py-1.5 rounded-md transition-colors ${active
        ? 'text-main font-semibold bg-secondary/15'
        : 'text-main/55 hover:text-main hover:bg-third'
        }`}
    >
      {label}
    </button>
  )
}

export default BrowseBooks
