import { useState, useMemo, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Search,
  Sparkles,
  ShoppingCart,
  PlusCircle,
  ShieldCheck,
  Truck,
  Wallet,
  Store,
  BookOpenCheck,
  User,
  Lightbulb,
  Heart,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  BookOpen,
  ArrowRight,
  X,
  FileText,
} from 'lucide-react'
import {
  guideCategories,
  welcomeText,
  type GuideCategory,
  type GuideArticle,
} from '../../data/howItWorksData'

// Map icon names to Lucide icon components
const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  ShoppingCart,
  PlusCircle,
  ShieldCheck,
  Truck,
  Wallet,
  Store,
  BookOpenCheck,
  User,
  Lightbulb,
  Heart,
  HelpCircle,
}

export default function HowItWorks() {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (location.hash) {
      const categoryId = location.hash.replace('#', '')
      setSelectedCategory(categoryId)
      setTimeout(() => {
        const el = document.getElementById(categoryId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [location.hash])

  // Toggle single article accordion expansion
  const toggleArticle = (id: string) => {
    setExpandedArticles((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Filter categories and articles based on search query
  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) {
      if (selectedCategory) {
        return guideCategories.filter((c) => c.id === selectedCategory)
      }
      return guideCategories
    }

    return guideCategories
      .map((cat) => {
        const matchingArticles = cat.articles.filter(
          (art) =>
            art.title.toLowerCase().includes(q) ||
            (typeof art.content === 'string'
              ? art.content.toLowerCase().includes(q)
              : art.content.join(' ').toLowerCase().includes(q))
        )

        const matchesCategory =
          cat.title.toLowerCase().includes(q) ||
          cat.subtitle.toLowerCase().includes(q)

        if (matchesCategory || matchingArticles.length > 0) {
          return {
            ...cat,
            articles: matchingArticles.length > 0 ? matchingArticles : cat.articles,
          }
        }
        return null
      })
      .filter((c): c is GuideCategory => c !== null)
  }, [searchQuery, selectedCategory])

  // Count total articles across filtered data
  const totalFilteredArticles = useMemo(() => {
    return filteredData.reduce((acc, cat) => acc + cat.articles.length, 0)
  }, [filteredData])

  return (
    <div className="bg-[#fcfdfd] min-h-screen text-main">

      {/* Banner Card — replicated from BrowseBooks / SellerStorefront design */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-8">
        <div className="bg-gradient-to-br from-violet-50/70 to-indigo-50/40 border border-violet-100/80 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          
          {/* Icon Avatar */}
          <div className="w-24 h-24 rounded-full bg-violet-100 border-4 border-white flex items-center justify-center shrink-0 shadow-sm">
            <HelpCircle size={32} className="text-secondary" />
          </div>

          {/* Description Text */}
          <div className="flex-1 text-center md:text-left z-10 min-w-0">
            <h1 className="font-heading font-bold text-main text-2xl sm:text-3xl leading-snug">
              How can we help?
            </h1>
            <p className="text-xs sm:text-sm text-main/55 mt-2 max-w-lg">
              Explore help topics, buying and selling guides, escrow protection details, and delivery information across Alákòwé.
            </p>

            {/* Search Bar Input inside Banner */}
            <div className="relative mt-5 max-w-xl">
              <div className="relative flex items-center bg-white border border-violet-100 rounded-2xl overflow-hidden shadow-sm focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20 transition-all">
                <Search size={16} className="ml-4 text-main/40 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search help articles, topics, buying, selling..."
                  className="w-full px-3 py-3.5 text-xs sm:text-sm text-main placeholder:text-main/35 bg-transparent outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-2 text-main/40 hover:text-main mr-2 transition-colors"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {searchQuery && (
                <p className="text-xs text-secondary mt-2 font-medium">
                  Found {totalFilteredArticles} sub-topic{totalFilteredArticles === 1 ? '' : 's'} matching "{searchQuery}"
                </p>
              )}
            </div>
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
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">

        {/* ── 2. WELCOME READER BANNER ────────────────────────────── */}
        <div className="bg-[#F8F9FA] border border-main/10 rounded-3xl p-6 sm:p-8 mb-10 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                <span>{welcomeText.greeting}</span>
              </div>
              <h2 className="font-heading font-bold text-main text-lg sm:text-xl md:text-2xl mb-2">
                {welcomeText.title}
              </h2>
              <p className="text-main/70 text-xs sm:text-sm leading-relaxed max-w-3xl mb-4 font-normal">
                {welcomeText.body}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 bg-secondary text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-secondary/90 transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pre-Listing Guide (/sell)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. CATEGORY PILL FILTER NAVIGATION ────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === null && !searchQuery
                ? 'bg-secondary text-white shadow-sm'
                : 'bg-white text-main/70 border border-main/15 hover:border-main/40'
            }`}
          >
            All 12 Topics
          </button>
          <Link
            to="/sell"
            className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap bg-violet-50 text-secondary border border-violet-200 hover:bg-secondary hover:text-white transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pre-Listing Guide</span>
          </Link>
          {guideCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-white text-main/70 border border-main/15 hover:border-main/40'
              }`}
            >
              {cat.number}. {cat.title}
            </button>
          ))}
        </div>

        {/* ── 4. CATEGORY CARDS GRID (PangoBooks Style Overview) ─────── */}
        {!selectedCategory && !searchQuery ? (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-bold text-main text-xl sm:text-2xl">
                Browse by Category
              </h3>
              <span className="text-xs font-semibold text-main/40 uppercase tracking-wider">
                12 Topics Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {guideCategories.map((cat) => {
                const IconComponent = iconMap[cat.iconName] || HelpCircle
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="group bg-white border border-main/10 rounded-2xl p-6 text-left hover:border-secondary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                          <IconComponent className="w-5.5 h-5.5" />
                        </div>
                        <span className="text-xs font-bold text-main/30 group-hover:text-secondary transition-colors">
                          #{cat.number}
                        </span>
                      </div>

                      <h4 className="font-heading font-bold text-main text-base sm:text-lg mb-1 group-hover:text-secondary transition-colors">
                        {cat.title}
                      </h4>
                      <p className="text-xs text-main/55 leading-relaxed line-clamp-2 mb-4">
                        {cat.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-main/8 text-xs text-main/45 font-medium">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-main/35" />
                        {cat.articleCount} sub-topics
                      </span>
                      <span className="text-secondary font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        Explore <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          /* ── 5. ARTICLES ACCORDION SECTION (Detailed Content for Selected Category/Search) ──────── */
          <div className="space-y-12">
            {filteredData.length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-main/20 rounded-3xl p-8">
                <HelpCircle className="w-12 h-12 text-main/30 mx-auto mb-3" />
                <h4 className="font-heading font-bold text-lg text-main mb-1">
                  No matching sub-topics found
                </h4>
                <p className="text-xs text-main/50 max-w-sm mx-auto mb-4">
                  We couldn't find any sub-topics matching "{searchQuery}". Try searching for another keyword like "shipping", "escrow", or "condition".
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-secondary underline hover:text-secondary/80"
                >
                  Clear Search Query
                </button>
              </div>
            ) : (
              filteredData.map((cat) => {
                const IconComponent = iconMap[cat.iconName] || HelpCircle
                return (
                  <section
                    key={cat.id}
                    id={cat.id}
                    className="bg-white border border-main/10 rounded-3xl p-6 sm:p-8 shadow-sm"
                  >
                    {/* Category Section Header */}
                    <div className="flex items-start justify-between gap-4 pb-6 border-b border-main/10 mb-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                              Section {cat.number}
                            </span>
                            <span className="text-xs text-main/30">•</span>
                            <span className="text-xs text-main/45 font-medium">
                              {cat.articles.length} sub-topics
                            </span>
                          </div>
                          <h3 className="font-heading font-bold text-main text-xl sm:text-2xl">
                            {cat.title}
                          </h3>
                        </div>
                      </div>

                      {cat.id === 'selling-books' && (
                        <Link
                          to="/sell"
                          className="inline-flex items-center gap-1.5 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-all shrink-0 ml-auto"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Pre-Listing Page</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedCategory(null)}
                        className="text-xs font-semibold text-main/50 hover:text-main underline shrink-0"
                      >
                        View all topics
                      </button>
                    </div>

                    {/* Articles List / Accordions */}
                    <div className="space-y-4">
                      {cat.articles.map((article) => {
                        const isExpanded = expandedArticles[article.id] || !!searchQuery
                        return (
                          <div
                            key={article.id}
                            className="border border-main/10 rounded-2xl overflow-hidden transition-all duration-200 bg-white"
                          >
                            <button
                              type="button"
                              onClick={() => toggleArticle(article.id)}
                              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-main/[0.02] transition-colors"
                            >
                              <span className="font-heading font-bold text-main text-sm sm:text-base pr-4">
                                {article.title}
                              </span>
                              <div className={`w-7 h-7 rounded-full bg-main/5 flex items-center justify-center text-main/60 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180 bg-secondary/15 text-secondary' : ''}`}>
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="px-5 pb-5 pt-1 border-t border-main/5 text-xs sm:text-sm text-main/75 leading-relaxed space-y-3 bg-[#fafcfc]">
                                {typeof article.content === 'string' ? (
                                  <p className="whitespace-pre-line">{article.content}</p>
                                ) : (
                                  article.content.map((paragraph, pIdx) => (
                                    <p key={pIdx}>{paragraph}</p>
                                  ))
                                )}

                                {article.bullets && article.bullets.length > 0 && (
                                  <ul className="list-disc list-inside space-y-1 text-main/80 pt-2 font-medium">
                                    {article.bullets.map((b, bIdx) => (
                                      <li key={bIdx}>{b}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </section>
                )
              })
            )}
          </div>
        )}

        {/* ── 6. STILL HAVE QUESTIONS / CONTACT FOOTER BANNER ──────── */}
        <div className="mt-16 bg-white border border-main/10 rounded-3xl p-8 sm:p-12 text-center text-main relative overflow-hidden shadow-sm">
          <div className="max-w-xl mx-auto relative z-10">
            <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-3">
              Still Have Questions?
            </p>
            <h3 className="font-heading font-bold text-2xl sm:text-4xl text-main mb-4">
              We're always here to help!
            </h3>
            <p className="text-main/60 text-xs sm:text-sm leading-relaxed mb-8">
              If something isn't clear or you need assistance with your order, shipping, or bookstore, our friendly team is ready to assist you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-3.5 text-xs sm:text-sm hover:bg-secondary/90 transition-all rounded-xl shadow-xs"
              >
                Contact Support <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/faq"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-main/15 bg-white text-main font-bold px-8 py-3.5 text-xs sm:text-sm hover:border-main/40 transition-all rounded-xl"
              >
                View General FAQ
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}