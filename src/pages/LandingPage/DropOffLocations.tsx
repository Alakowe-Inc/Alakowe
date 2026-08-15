import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Phone, Building2, Navigation, Package } from 'lucide-react'
import { useSpeedafStations } from '../../lib/api/logistics/logistics.hooks'
import type { SpeedafStationDto } from '../../lib/api/logistics/logistics.api'

function StationCard({ station }: { station: SpeedafStationDto }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${station.address}, ${station.area}, ${station.city}`,
  )}`

  return (
    <div className="bg-white rounded-2xl border border-third p-5 hover:shadow-md hover:border-secondary/20 transition-all duration-300 group">
      {/* Station name & mode badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-heading font-bold text-main text-sm leading-snug group-hover:text-secondary transition-colors">
          {station.siteName}
        </h3>
        <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/15">
          <Building2 size={10} />
          {station.siteMode}
        </span>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 mb-2">
        <MapPin size={13} className="text-main/35 shrink-0 mt-0.5" />
        <p className="text-xs text-main/60 leading-relaxed">{station.address}</p>
      </div>

      {/* Area & City */}
      <div className="flex items-center gap-2 mb-2">
        <Navigation size={12} className="text-main/35 shrink-0" />
        <p className="text-xs text-main/50">
          {station.area}, {station.city}
          {station.region && <span className="text-main/30"> · {station.region}</span>}
        </p>
      </div>

      {/* Phone */}
      {station.contactPhone && (
        <div className="flex items-center gap-2 mb-4">
          <Phone size={12} className="text-main/35 shrink-0" />
          <a
            href={`tel:${station.contactPhone}`}
            className="text-xs text-secondary font-medium hover:underline"
          >
            {station.contactPhone}
          </a>
        </div>
      )}

      {/* Get Directions button */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-secondary bg-secondary/8 hover:bg-secondary/15 px-3.5 py-2 rounded-xl transition-colors"
      >
        <MapPin size={12} />
        Get directions
      </a>
    </div>
  )
}

export default function DropOffLocations() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: stations, isLoading, error } = useSpeedafStations()

  const filtered = useMemo(() => {
    if (!stations) return []
    if (!searchQuery.trim()) return stations
    const q = searchQuery.toLowerCase()
    return stations.filter(
      (s) =>
        s.siteName.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.region?.toLowerCase().includes(q),
    )
  }, [stations, searchQuery])

  // Group by city
  const grouped = useMemo(() => {
    const map = new Map<string, SpeedafStationDto[]>()
    for (const station of filtered) {
      const key = station.city || 'Other'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(station)
    }
    // Sort cities alphabetically, but put Lagos first
    return [...map.entries()].sort(([a], [b]) => {
      if (a.toLowerCase().includes('lagos')) return -1
      if (b.toLowerCase().includes('lagos')) return 1
      return a.localeCompare(b)
    })
  }, [filtered])

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
            Locations
          </p>
          <h1 className="font-heading font-bold text-main text-3xl sm:text-4xl mb-3">
            Drop-off Centers
          </h1>
          <p className="text-main/50 text-sm max-w-xl mx-auto">
            Find a Speedaf drop-off center near you. Sellers drop books here after a sale, we handle
            the rest from inspection to delivery.
          </p>
        </div>

        {/* Big search bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-secondary/15 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-white rounded-2xl border-2 border-main/10 shadow-sm hover:border-secondary/40 focus-within:border-secondary focus-within:shadow-lg focus-within:shadow-secondary/10 transition-all duration-300 flex items-center overflow-hidden">
              <div className="pl-5 pr-3 py-4 flex items-center justify-center">
                <Search size={22} className="text-main/30 group-focus-within:text-secondary transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, area, or station name..."
                className="flex-1 text-sm text-main placeholder:text-main/35 bg-transparent outline-none py-4 pr-5 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-4 text-xs font-semibold text-main/40 hover:text-main transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          {/* Search stats */}
          {!isLoading && stations && (
            <p className="text-center text-xs text-main/40 mt-3">
              {searchQuery
                ? `${filtered.length} of ${stations.length} centers match "${searchQuery}"`
                : `${stations.length} drop-off centers across Nigeria`}
            </p>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-third p-16 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <MapPin size={22} className="text-secondary" />
            </div>
            <p className="text-main/50 text-sm">Loading drop-off centers…</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-third p-16 text-center">
            <p className="text-red-500 text-sm">{error.message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-third p-16 text-center">
            <div className="w-14 h-14 rounded-full bg-main/6 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-main/30" />
            </div>
            <h2 className="font-heading font-bold text-main text-lg mb-2">No centers found</h2>
            <p className="text-main/50 text-sm mb-4">
              {searchQuery
                ? `No drop-off centers match "${searchQuery}". Try a different search.`
                : 'No drop-off centers are available at the moment.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-2 bg-secondary text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-secondary/90 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {grouped.map(([city, cityStations]) => (
              <div key={city}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-secondary" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-main text-lg">{city}</h2>
                    <p className="text-xs text-main/40">{cityStations.length} center{cityStations.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cityStations.map((station) => (
                    <StationCard key={station.id} station={station} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info banner */}
        <div className="mt-12 bg-white rounded-2xl border border-third p-6 md:p-8 text-main">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <Package size={18} className="text-secondary" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-main text-lg mb-1.5">How drop-off works</h2>
              <p className="text-main/60 text-sm leading-relaxed mb-4">
                After a sale, sellers have 48 hours to package the book securely and drop it off at their
                nearest Speedaf station using the waybill number provided. From there, we handle inspection
                and delivery to the buyer.
              </p>
              <Link
                to="/how-it-works#delivery-logistics"
                className="inline-flex items-center gap-2 text-secondary text-sm font-semibold hover:text-secondary/80 transition-colors"
              >
                Learn more about our process →
              </Link>
            </div>
          </div>
        </div>

        {/* Contact support */}
        <div className="mt-6 bg-white rounded-2xl border border-third p-5">
          <p className="text-xs text-main/45 leading-relaxed">
            Can't find a center near you?{' '}
            <Link to="/contact" className="text-secondary font-semibold hover:underline">
              Contact us
            </Link>
            {' '}and we'll help you find the best option.
          </p>
        </div>

      </div>
    </div>
  )
}