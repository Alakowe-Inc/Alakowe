import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ShoppingBag, Truck, Calendar, Store, Info, PlusCircle, ArrowLeft, Star, Heart } from 'lucide-react'
import { books } from '../../data/mockData'
import { formatPrice } from '../../lib/utils'

export default function SampleStorefront() {
  const [activeTab, setActiveTab] = useState<'bookstore' | 'about'>('bookstore')

  // Sample store information
  const sampleStore = {
    displayName: "Chiamaka Okoro's Bookstore",
    storeSlug: "read-and-relish",
    location: "Bodija, Ibadan, Oyo State",
    memberSince: "January 2026",
    booksSold: 42,
    fulfillmentOption: "Delivery & Pickup",
    description: "Welcome to Chiamaka Okoro's Bookstore! I'm a passionate reader and literature enthusiast sharing my curated personal collection of fiction, African classics, and self-improvement titles. All books are well-cared for and looking for their next happy home.",
    currentlyReading: "Tomorrow, and Tomorrow, and Tomorrow by Gabrielle Zevin",
    favouriteBook: "Half of a Yellow Sun by Chimamanda Ngozi Adichie",
    favouriteAuthor: "Chinua Achebe",
    readMostly: ["African Fiction", "Historical Fiction", "Self Help", "Memoirs"],
    hobbies: ["Journaling", "Coffee Tasting", "Podcasts", "Gardening"],
  }

  const localBooksData = [
    { title: "1st Case", filename: "1st Case.jpeg" },
    { title: "Dear Ijeawele", filename: "Dear Ijeawele.jpeg" },
    { title: "Face Me", filename: "Face Me.jpeg" },
    { title: "Formation", filename: "Formation.jpeg" },
    { title: "Funny Men Cannot Be Trusted", filename: "Funny Men Cannot Be Trusted.jpeg" },
    { title: "Gray Mountain", filename: "Gray Mountain.jpeg" },
    { title: "Ikigai", filename: "Ikigai.jpeg" },
    { title: "My Sister", filename: "My Sister.jpeg" },
    { title: "Nearly all the men in lagos are mad", filename: "Nearly all the men in lagos are mad.jpeg" },
    { title: "Rich Dad Poor Dad", filename: "Rich Dad Poor Dad.jpeg" },
    { title: "Sparring Partners", filename: "Sparring Partners.jpeg" },
    { title: "The Boys From Biloxi", filename: "The Boys From Biloxi.jpeg" },
    { title: "The Light We Carry", filename: "The Light We Carry.jpeg" },
    { title: "The Psychology of money", filename: "The Psychology of money.jpeg" },
    { title: "The Righteous may fall seven times", filename: "The Righteous may fall seven times.jpeg" }
  ]

  // We want exactly 15 books (3 rows of 5 columns).
  const extendedBooks = [...books, ...books, ...books].slice(0, 15)

  // Use mock books with images and titles matching the local files
  const sampleListings = extendedBooks.map((b, i) => {
    const localData = localBooksData[i % localBooksData.length]
    return {
      ...b,
      id: `${b.id}-${i}`, // ensure unique keys
      title: localData.title,
      coverImageUrl: `/${encodeURIComponent(localData.filename)}`
    }
  })

  return (
    <div className="bg-white min-h-screen">
      {/* Sample Banner Notification for Visitors */}
      <div className="bg-slate-50 border-b border-main/10 text-main px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-medium">
            <Info size={18} className="shrink-0 text-secondary" />
            <span>
              <strong className="font-bold text-secondary">Sample Bookstore Demo:</strong> This is an example of how your custom storefront will look to buyers when you create a store on Alákòwé.
            </span>
          </div>
          <Link
            to="/list"
            className="shrink-0 bg-secondary text-white hover:bg-secondary/90 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle size={14} />
            <span>Create Your Store</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
        
        {/* Back Link */}
        <Link
          to="/sell"
          className="inline-flex items-center gap-1.5 text-xs text-main/55 hover:text-main mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={14} /> Back to Sell page
        </Link>

        {/* Storefront Header Card */}
        <div className="bg-gradient-to-br from-violet-50/80 via-indigo-50/50 to-purple-50/40 border border-violet-100/90 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 shadow-xs">
          
          {/* Avatar / Store Badge */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-indigo-600 border-4 border-white flex items-center justify-center shrink-0 shadow-md font-heading font-bold text-3xl text-white select-none">
            {sampleStore.displayName.charAt(0)}
          </div>

          {/* Store Info */}
          <div className="flex-1 text-center md:text-left z-10 min-w-0">
            <h1 className="font-heading font-bold text-main text-2xl sm:text-3xl leading-snug">
              {sampleStore.displayName}
            </h1>
            <p className="text-xs sm:text-sm text-main/60 mt-1 flex items-center justify-center md:justify-start gap-2">
              <span>{sampleListings.length} Active Listings</span>             
            </p>
          </div>

          {/* Decorative Shelf Vector Illustration */}
          <div className="absolute right-8 bottom-0 hidden lg:block select-none opacity-40 pointer-events-none z-0">
            <svg width="220" height="100" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="100" x2="240" y2="100" stroke="#6B6FFF" strokeWidth="3" strokeLinecap="round" />
              <rect x="150" y="20" width="16" height="80" rx="2" fill="#E8E8FF" stroke="#6B6FFF" strokeWidth="2" />
              <line x1="158" y1="30" x2="158" y2="90" stroke="#6B6FFF" strokeWidth="2" strokeDasharray="3 3" />
              <rect x="168" y="30" width="14" height="70" rx="2" fill="#F3F3FF" stroke="#6B6FFF" strokeWidth="2" />
              <rect x="184" y="25" width="18" height="75" rx="2" fill="#E8E8FF" stroke="#6B6FFF" strokeWidth="2" />
              <line x1="193" y1="35" x2="193" y2="85" stroke="#6B6FFF" strokeWidth="2" strokeDasharray="2 2" />
              <rect x="50" y="85" width="60" height="15" rx="2" fill="#F3F3FF" stroke="#6B6FFF" strokeWidth="2" />
              <rect x="53" y="72" width="54" height="13" rx="2" fill="#E8E8FF" stroke="#6B6FFF" strokeWidth="2" />
              <rect x="56" y="61" width="48" height="11" rx="2" fill="#F3F3FF" stroke="#6B6FFF" strokeWidth="2" />
              <path d="M210 70 L230 70 L225 90 L215 90 Z" fill="#E8E8FF" stroke="#6B6FFF" strokeWidth="2" />
              <path d="M220 70 C220 50 205 55 205 55 C205 55 215 65 220 70 Z" fill="#F3F3FF" stroke="#6B6FFF" strokeWidth="1.5" />
              <path d="M220 70 C220 45 228 48 228 48 C228 48 225 62 220 70 Z" fill="#E8E8FF" stroke="#6B6FFF" strokeWidth="1.5" />
              <path d="M220 70 C222 55 235 58 235 58 C235 58 227 67 220 70 Z" fill="#F3F3FF" stroke="#6B6FFF" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-main/10 mb-8 mt-2">
          {(['bookstore', 'about'] as const).map((tab) => {
            const labelMap = {
              bookstore: 'Bookstore',
              about: 'About Store & Seller',
            }
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all -mb-px ${
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

        {/* Tab Content */}
        {activeTab === 'bookstore' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-main text-lg">Featured Books</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
              {sampleListings.map((book) => (
                <div
                  key={book.id}
                  className="group block w-full max-w-[190px] mx-auto transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {/* Image / Cover area */}
                  <div className="relative overflow-hidden bg-[#f5f5f3] rounded-[16px] aspect-[4/5] shadow-sm">
                    {/* Heart indicator (static preview) */}
                    <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-gray-400">
                      <Heart size={14} />
                    </div>

                    {/* Badge */}
                    {book.badge && (
                      <span
                        className={`absolute top-3 left-3 z-10 text-[9px] font-semibold tracking-wider rounded-full uppercase px-2.5 py-1 ${
                          book.badge === 'Best Value'
                            ? 'bg-secondary/90 text-white'
                            : 'bg-secondary text-white'
                        }`}
                      >
                        {book.badge}
                      </span>
                    )}

                    {/* Book cover color or image */}
                    {book.coverImageUrl ? (
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundColor: book.coverColor }}
                      >
                        <span className="text-white/80 font-heading font-bold text-center px-3 text-xs leading-tight drop-shadow-sm">
                          {book.title}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info details */}
                  <div className="pt-2.5 pb-1 px-0.5">
                    {/* Title and Rating Row */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-main leading-snug truncate group-hover:text-secondary transition-colors flex-1">
                        {book.title}
                      </h3>
                      <div className="flex items-center gap-0.5 text-xs text-slate-500 shrink-0 mt-0.5">
                        <span className="font-semibold">{book.sellerRating?.toFixed(1) || '4.8'}</span>
                        <Star className="fill-amber-400 text-amber-400" size={11} />
                      </div>
                    </div>

                    {/* Author */}
                    <p className="text-xs text-slate-500 font-normal mt-0.5 truncate">
                      {book.author}
                    </p>

                    {/* Location Tag */}
                    {book.location && (
                      <div className="flex items-center gap-1 text-[11px] text-main/55 mt-1 truncate">
                        <MapPin size={11} className="text-secondary shrink-0" />
                        <span className="truncate">{book.location}</span>
                      </div>
                    )}

                    {/* Price Display (No Cart Button) */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-main/5">
                      <span className="text-sm font-bold text-main">
                        {formatPrice(book.price)}
                      </span>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA for sellers */}
            <div className="mt-14 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-3xl p-8 text-center space-y-3">
              <h3 className="font-heading font-bold text-main text-xl">
                Ready to setup your own bookstore like this?
              </h3>
              <p className="text-main/60 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                List your pre-loved books on Alákòwé in minutes, set your own prices, and share your personal storefront link with buyers nationwide.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link
                  to="/list"
                  className="bg-secondary hover:bg-secondary/90 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm"
                >
                  List a Book Now
                </Link>
                <Link
                  to="/how-it-works"
                  className="bg-white hover:bg-main/5 text-main border border-main/15 font-semibold text-xs px-6 py-3 rounded-xl transition-all"
                >
                  How It Works
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* About Store Card */}
            <div className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm mb-6">
              <h3 className="font-heading font-bold text-main text-lg mb-3">About Me & My Bookstore</h3>
              <p className="text-sm text-main/80 leading-relaxed max-w-3xl">
                {sampleStore.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Reading Profile Card */}
              <div className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="font-heading font-bold text-main text-lg mb-6">Seller Reading Profile</h3>
                
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-main/5 pb-4 gap-2">
                    <span className="text-sm text-main/60">Currently Reading</span>
                    <span className="text-sm font-medium text-secondary text-left sm:text-right">{sampleStore.currentlyReading}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-main/5 pb-4 gap-2">
                    <span className="text-sm text-main/60">Favourite Book</span>
                    <span className="text-sm font-medium text-secondary text-left sm:text-right">{sampleStore.favouriteBook}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-main/5 pb-4 gap-2">
                    <span className="text-sm text-main/60">Favourite Author</span>
                    <span className="text-sm font-medium text-secondary text-left sm:text-right">{sampleStore.favouriteAuthor}</span>
                  </div>
                  <div className="border-b border-main/5 pb-4">
                    <span className="text-sm text-main/60 block mb-3">Reads Mostly</span>
                    <div className="flex flex-wrap gap-2">
                      {sampleStore.readMostly.map((tag) => (
                        <span key={tag} className="bg-secondary/10 text-main text-xs font-medium px-3 py-1.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-main/60 block mb-3">Hobbies Beyond Reading</span>
                    <div className="flex flex-wrap gap-2">
                      {sampleStore.hobbies.map((tag) => (
                        <span key={tag} className="bg-secondary/10 text-main text-xs font-medium px-3 py-1.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketplace Stats Card */}
              <div className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm space-y-6">
                <h3 className="font-heading font-bold text-main text-lg mb-6">Marketplace Stats</h3>

                {/* Books Sold */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center shrink-0 text-secondary">
                    <ShoppingBag size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-main/60 block mb-0.5">Books Sold</span>
                    <span className="font-bold text-main text-sm block">{sampleStore.booksSold} books</span>
                  </div>
                </div>

                <div className="h-px bg-main/5" />

                {/* Fulfilment */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center shrink-0 text-secondary">
                    <Truck size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-main/60 block mb-0.5">Preferred Fulfilment</span>
                    <span className="font-bold text-main text-sm block">
                      {sampleStore.fulfillmentOption}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-main/5" />

                {/* Member Since */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center shrink-0 text-secondary">
                    <Calendar size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-main/60 block mb-0.5">Member Since</span>
                    <span className="font-bold text-main text-sm block">{sampleStore.memberSince}</span>
                  </div>
                </div>

                <div className="h-px bg-main/5" />

                {/* Location */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center shrink-0 text-secondary">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-main/60 block mb-0.5">Location</span>
                    <span className="font-bold text-main text-sm block">{sampleStore.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
