import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, ShoppingBag, User } from 'lucide-react'
import { getPublicSellerProfile } from '../../data/sellerData'
import type { PublicSellerProfile } from '../../data/sellerData'
import { useListings } from '../../lib/api/listings/listings.hooks'
import { listingToBookDisplay } from '../../lib/api/adapters'
import BookCard from '../../components/BookCard'

export default function SellerStorefront() {
  const { email } = useParams<{ email: string }>()
  const decodedEmail = email ? decodeURIComponent(email) : ''

  const [profile, setProfile] = useState<PublicSellerProfile | null>(null)
  const [activeTab, setActiveTab] = useState<'bookstore' | 'about'>('bookstore')

  const { data: pagedResult, isLoading } = useListings()

  const listings = useMemo(() => {
    if (!pagedResult?.result) return []
    return pagedResult.result
      .filter((l) => l.createdBy?.toLowerCase() === decodedEmail.toLowerCase())
      .map(listingToBookDisplay)
  }, [pagedResult, decodedEmail])

  useEffect(() => {
    if (!decodedEmail) return
    setProfile(getPublicSellerProfile(decodedEmail))
  }, [decodedEmail])

  const displayName = profile?.fullName || profile?.username || decodedEmail.split('@')[0]
  const location = [profile?.city, profile?.state].filter(Boolean).join(', ')

  if (!decodedEmail) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="text-main/50 text-sm">Store not found.</p>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10">
        
        {/* Banner Card Wrapper */}
        <div className="bg-gradient-to-br from-violet-50/70 to-indigo-50/40 border border-violet-100/80 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          
          {/* Avatar Profile */}
          <div className="w-24 h-24 rounded-full bg-violet-100 border-4 border-white flex items-center justify-center shrink-0 shadow-sm font-heading font-bold text-3xl text-main select-none">
            {displayName.charAt(0).toUpperCase()}
          </div>

          {/* Description Text */}
          <div className="flex-1 text-center md:text-left z-10 min-w-0">
            <h1 className="font-heading font-bold text-main text-2xl sm:text-3xl leading-snug">
              {displayName}'s Bookstore
            </h1>
            <p className="text-xs sm:text-sm text-main/55 mt-1">
              {listings.length} active listings
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

        {/* Tab Navigation */}
        <div className="flex border-b border-main/10 mb-8 mt-2">
          {(['bookstore', 'about'] as const).map((tab) => {
            const labelMap = {
              bookstore: 'Bookstore',
              about: 'About',
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

        {/* Tab Contents */}
        {activeTab === 'bookstore' ? (
          <div>
            {isLoading ? (
              <div className="py-20 text-center">
                <p className="text-main/50 text-xs">Loading bookstore listings…</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-third p-12 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-main/5 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={20} className="text-main/30" />
                </div>
                <h2 className="font-heading font-bold text-main text-base mb-1">No books listed yet</h2>
                <p className="text-main/40 text-xs">
                  This seller hasn't listed any books yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
                {listings.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
            
            {/* About Card Content */}
            <div className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <User size={18} className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-main text-lg">About {displayName}</h3>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-main/70 leading-relaxed max-w-2xl">
                {profile?.bio ||
                  "I'm a big believer in books finding the right readers. Most of the books here are ones I've read, loved, and now want to pass on to someone who'll enjoy them just as much. I mostly sell fiction, personal growth, and thought-provoking reads."}
              </p>

              <div className="flex items-center gap-1.5 mt-6 text-xs sm:text-sm text-main font-medium">
                <MapPin size={13} className="text-secondary shrink-0" />
                <span>{location || 'Lagos Island, Lagos'}</span>
              </div>
              <p className="text-xs text-main/40 mt-1 ml-5">
                Usually replies within a few hours
              </p>
            </div>

            {/* Statistics Card Panel (Excluding Star Rating Card) */}
            <div className="border border-main/10 rounded-2xl bg-white p-5 shadow-sm space-y-5">
              
              {/* Books Sold */}
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-secondary/5 flex items-center justify-center shrink-0 text-secondary">
                  <ShoppingBag size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-main text-sm">23</span>
                    <span className="text-[9px] text-main/40 font-medium">Across</span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs text-main/55">
                    <span>Books sold</span>
                    <span>Alákòwé</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-main/5" />

              {/* Location */}
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-secondary/5 flex items-center justify-center shrink-0 text-secondary">
                  <MapPin size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-main text-xs block truncate">{location || 'Lagos Island'}</span>
                  <span className="text-[9px] text-main/40 block mt-0.5">Location</span>
                </div>
              </div>

              <div className="h-px bg-main/5" />

              {/* Member Since */}
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-secondary/5 flex items-center justify-center shrink-0 text-secondary">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-main text-xs block">May 2025</span>
                  <span className="text-[9px] text-main/40 block mt-0.5">Member since</span>
                </div>
              </div>

            </div>

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
