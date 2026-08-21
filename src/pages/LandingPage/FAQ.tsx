import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'
import { guideCategories } from '../../data/howItWorksData'

function FAQ() {
  const [open, setOpen] = useState<string | null>(null)

  function toggle(key: string) {
    setOpen(prev => (prev === key ? null : key))
  }

  const faqCategory = useMemo(() => guideCategories.find(c => c.id === 'general-faq'), [])

  return (
    <div className="bg-[#fcfdfd] min-h-screen">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-8">
        <div className="bg-gradient-to-br from-violet-50/70 to-indigo-50/40 border border-violet-100/80 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6">
          
          {/* Icon Avatar */}
          <div className="w-24 h-24 rounded-full bg-violet-100 border-4 border-white flex items-center justify-center shrink-0 shadow-sm">
            <HelpCircle size={32} className="text-secondary" />
          </div>

          {/* Description Text */}
          <div className="flex-1 text-center md:text-left z-10 min-w-0">
            <p className="text-secondary text-[11px] font-bold uppercase tracking-wider mb-2">
              Help Centre
            </p>
            <h1 className="font-heading font-bold text-main text-2xl sm:text-3xl leading-snug">
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-main/60 mt-2">
              Can't find what you're looking for?{' '}
              <Link to="/contact" className="text-secondary hover:underline font-semibold">
                Contact us
              </Link>
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
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-12">

          {/* Sections */}
          <div className="mb-14 scroll-mt-24">
            <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-6">
              {faqCategory?.subtitle || 'General FAQs'}
            </p>
            <div className="flex flex-col">
              {faqCategory?.articles.map((article) => {
                const key = article.id
                const isOpen = open === key
                return (
                  <div key={key} className="border-t border-main/15">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between py-5 text-left gap-6"
                    >
                      <span className="font-heading font-bold text-main text-sm uppercase tracking-wide leading-snug">
                        {article.title}
                      </span>
                      <span className={`shrink-0 text-xs font-bold tracking-widest transition-colors duration-200 ${isOpen ? 'text-secondary' : 'text-main/45'}`}>
                        {isOpen ? 'LESS −' : 'MORE +'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pb-5">
                        <div className="text-sm text-main/55 leading-relaxed max-w-3xl space-y-3">
                          {typeof article.content === 'string' ? (
                            <p className="whitespace-pre-line">{article.content}</p>
                          ) : (
                            article.content.map((paragraph, pIdx) => (
                              <p key={pIdx}>{paragraph}</p>
                            ))
                          )}
                          {article.bullets && article.bullets.length > 0 && (
                            <ul className="list-disc list-inside space-y-1 mt-2 font-medium text-main/80">
                              {article.bullets.map((b, bIdx) => (
                                <li key={bIdx}>{b}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="border-t border-main/15" />
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="bg-third py-16">
        <div className="max-w-2xl mx-auto px-4 md:px-6 lg:px-12 flex flex-col items-center text-center gap-8">
          <div>
            <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-4">
              Still need help?
            </p>
            <h2 className="font-heading font-bold text-main text-2xl sm:text-3xl md:text-4xl leading-tight mb-5">
              We're happy to answer your questions.
            </h2>
            <p className="text-main/60 text-sm leading-relaxed">
              Reach out to our team and we'll get back to you as soon as possible — no question is too small.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-semibold px-8 py-3.5 text-sm hover:bg-secondary/90 transition-colors rounded-xl shadow-xs"
            >
              Contact Us
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center justify-center gap-2 border border-main/20 bg-white text-main font-semibold px-8 py-3.5 text-sm hover:border-main/40 transition-colors rounded-xl"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default FAQ
