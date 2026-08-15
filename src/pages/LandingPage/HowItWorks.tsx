import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({})

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

      {/* ── 1. HELP CENTER HERO HEADER (PangoBooks Style) ─────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#59608A] via-[#697098] to-[#7C84AF] text-white py-16 sm:py-20 px-4 md:px-6">
        
        {/* Soft background decorative cloud graphics */}
        <div className="absolute -top-24 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-300/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <p className="text-cyan-100 text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-3">
            Alákòwé Help Center
          </p>

          <h1 className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none mb-6">
            How can we help?
          </h1>

          {/* Search Bar Input */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-full shadow-2xl shadow-teal-950/20 overflow-hidden p-1.5 transition-all focus-within:ring-4 focus-within:ring-cyan-200">
              <Search className="w-5 h-5 text-main/40 ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help articles, topics, buying, selling, escrow..."
                className="w-full py-3 px-3 text-sm sm:text-base text-main placeholder:text-main/40 bg-transparent outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-2 hover:bg-main/5 rounded-full text-main/40 hover:text-main mr-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {searchQuery && (
              <p className="text-xs text-cyan-100 mt-2.5 font-medium">
                Found {totalFilteredArticles} article{totalFilteredArticles === 1 ? '' : 's'} matching "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">

        {/* ── 2. WELCOME READER BANNER ────────────────────────────── */}
        <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 border border-amber-200/80 rounded-3xl p-6 sm:p-8 mb-12 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">
                {welcomeText.greeting}
              </p>
              <h2 className="font-heading font-bold text-main text-lg sm:text-xl md:text-2xl mb-2">
                {welcomeText.title}
              </h2>
              <p className="text-main/75 text-sm leading-relaxed max-w-3xl mb-4">
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
        {!selectedCategory && !searchQuery && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-bold text-main text-xl sm:text-2xl">
                Browse by Category
              </h3>
              <span className="text-xs font-semibold text-main/40 uppercase tracking-wider">
                12 Guides Available
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
                        {cat.articleCount} articles
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
        )}

        {/* ── 5. ARTICLES ACCORDION SECTION (Detailed Content) ──────── */}
        <div className="space-y-12">
          {filteredData.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-main/20 rounded-3xl p-8">
              <HelpCircle className="w-12 h-12 text-main/30 mx-auto mb-3" />
              <h4 className="font-heading font-bold text-lg text-main mb-1">
                No matching articles found
              </h4>
              <p className="text-xs text-main/50 max-w-sm mx-auto mb-4">
                We couldn't find any guide topics matching "{searchQuery}". Try searching for another keyword like "shipping", "escrow", or "condition".
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
                            {cat.articles.length} articles
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

                    {selectedCategory === cat.id && (
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(null)}
                        className="text-xs font-semibold text-main/50 hover:text-main underline shrink-0"
                      >
                        View all topics
                      </button>
                    )}
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

        {/* ── 6. STILL HAVE QUESTIONS / CONTACT FOOTER BANNER ──────── */}
        <div className="mt-16 bg-main rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <div className="max-w-xl mx-auto relative z-10">
            <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-3">
              Still Have Questions?
            </p>
            <h3 className="font-heading font-bold text-2xl sm:text-4xl text-white mb-4">
              We're always here to help!
            </h3>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-8">
              If something isn't clear or you need assistance with your order, shipping, or bookstore, our friendly team is ready to assist you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-main font-bold px-8 py-3.5 text-xs sm:text-sm hover:bg-white/90 transition-all rounded-xl shadow-md"
              >
                Contact Support <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/faq"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/30 text-white font-bold px-8 py-3.5 text-xs sm:text-sm hover:border-white transition-all rounded-xl"
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
