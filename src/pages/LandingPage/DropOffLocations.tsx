import { Search, MapPin, Navigation, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'

const sampleLocations = [
  { name: 'Alakowe Hub - Lekki', area: 'Lekki Phase 1', hours: 'Mon - Sat • 9:00 AM - 6:00 PM' },
  { name: 'Campus Book Exchange', area: 'Yaba', hours: 'Mon - Sun • 10:00 AM - 7:00 PM' },
  { name: 'Reader Relay Centre', area: 'Ikeja', hours: 'Mon - Sat • 8:00 AM - 5:30 PM' },
]

export default function DropOffLocations() {
  return (
    <div className="bg-[#f8f8f5] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="bg-white rounded-[28px] border border-main/10 shadow-[0_14px_50px_-18px_rgba(23,33,49,0.12)] overflow-hidden">
          <div className="bg-gradient-to-r from-secondary to-indigo-600 p-6 md:p-10 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/75 mb-3">Drop-off locations</p>
                <h1 className="font-heading font-bold text-3xl md:text-5xl leading-tight">
                  Find a book drop-off point near you
                </h1>
              </div>

              <div className="w-full max-w-md rounded-2xl bg-white/10 border border-white/15 p-3 backdrop-blur-sm">
                <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 border border-white/10">
                  <Search size={18} className="text-white/80" />
                  <input
                    readOnly
                    value="Search by city, area, or postcode"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="mt-3 w-full rounded-xl bg-white text-secondary font-bold text-sm px-4 py-3.5 shadow-sm hover:bg-white/95 transition-colors"
                >
                  Search drop-off locations
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 lg:p-10">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-main/10 bg-[#f7f7fb] p-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-3">
                  <MapPin size={18} />
                </div>
                <h2 className="font-heading font-bold text-main text-lg mb-1">Convenient hubs</h2>
                <p className="text-sm text-main/60 leading-relaxed">
                  Pick a station close to you and hand in your book with your drop-off code.
                </p>
              </div>

              <div className="rounded-2xl border border-main/10 bg-[#f7f7fb] p-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-3">
                  <Navigation size={18} />
                </div>
                <h2 className="font-heading font-bold text-main text-lg mb-1">Easy to find</h2>
                <p className="text-sm text-main/60 leading-relaxed">
                  Search by area, neighbourhood, or location name to get the right stop quickly.
                </p>
              </div>

              <div className="rounded-2xl border border-main/10 bg-[#f7f7fb] p-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-3">
                  <Clock3 size={18} />
                </div>
                <h2 className="font-heading font-bold text-main text-lg mb-1">Fast drop-off</h2>
                <p className="text-sm text-main/60 leading-relaxed">
                  Most partner locations are available during regular business hours for quick handoff.
                </p>
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-end justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-main/45">Popular spots</p>
                  <h2 className="font-heading font-bold text-main text-2xl mt-1">Nearby locations</h2>
                </div>
                <Link to="/browse" className="text-xs font-semibold text-secondary hover:underline">
                  Browse books
                </Link>
              </div>

              <div className="space-y-4">
                {sampleLocations.map((location) => (
                  <div key={location.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-main/10 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                        <MapPin size={17} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading font-bold text-main text-base">{location.name}</p>
                        <p className="text-sm text-main/55 mt-0.5">{location.area}</p>
                        <p className="text-[11px] text-main/45 mt-1">{location.hours}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full sm:w-auto rounded-full border border-secondary/20 bg-secondary/5 text-secondary font-semibold text-xs px-4 py-2.5 hover:bg-secondary hover:text-white transition-colors"
                    >
                      Choose location
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
