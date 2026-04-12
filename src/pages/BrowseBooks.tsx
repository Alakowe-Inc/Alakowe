import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { books } from '../data/mockData'
import BookCard from '../components/BookCard'

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
    <div className="min-h-screen bg-third">

      {/* Page header */}
      <div className="bg-white border-b border-third">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 py-8">
          <h1 className="font-heading font-bold text-main text-3xl mb-5">Browse Books</h1>
          <div className="flex items-center bg-third rounded-md overflow-hidden max-w-xl">
            <Search size={15} className="ml-4 text-main/40 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title, author, or location…"
              className="flex-1 px-4 py-3 text-sm text-main placeholder-main/40 outline-none bg-transparent font-body"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="px-4 text-main/40 hover:text-main transition-colors"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 py-8">
        <div className="flex gap-8">

          {/* Desktop sidebar filters */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="bg-white rounded-2xl border border-third p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-semibold text-main text-sm">Filters</h3>
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
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-main/55">
                {filtered.length} book{filtered.length !== 1 ? 's' : ''} found
              </p>
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden flex items-center gap-2 text-sm font-semibold text-main border border-third bg-white rounded-lg px-4 py-2 hover:border-main transition-colors"
                  onClick={() => setShowFilters(true)}
                >
                  <SlidersHorizontal size={15} />
                  Filters
                </button>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-sm text-main border border-third bg-white rounded-lg px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Genre pills */}
            <div className="flex gap-2 flex-wrap mb-6">
              {genres.map(g => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-colors ${genre === g
                    ? 'bg-main text-white border-main'
                    : 'bg-white text-main border-third hover:border-main'
                    }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="font-heading font-semibold text-main text-xl mb-2">No books found</p>
                <p className="text-main/55 text-sm">Try adjusting your search or filters.</p>
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
            className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold text-main">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-main/50 hover:text-main"
              >
                <X size={20} />
              </button>
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

            <button
              onClick={() => setShowFilters(false)}
              className="w-full bg-main text-white py-3 rounded-md font-semibold text-sm mt-4"
            >
              Apply Filters
            </button>
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
    <div className={last ? '' : 'mb-6'}>
      <p className="text-xs uppercase tracking-widest font-semibold text-main/40 mb-3">{title}</p>
      <div className="flex flex-col gap-1">{children}</div>
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
      className={`text-sm text-left px-3 py-1.5 rounded-lg transition-colors ${active ? 'bg-secondary/20 text-main font-semibold' : 'text-main/65 hover:bg-third'
        }`}
    >
      {label}
    </button>
  )
}

export default BrowseBooks
