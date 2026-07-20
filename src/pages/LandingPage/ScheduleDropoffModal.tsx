import { useMemo, useState } from 'react'
import { MapPin, Search, CheckCircle2, ExternalLink, Copy } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSellerStoreProfile } from '../../lib/api/store/store.hooks'
import { useScheduleSellerDropoff, useSpeedafStations } from '../../lib/api/logistics/logistics.hooks'
import type { SellerSaleResponse } from '../../lib/api/types'
import type { ScheduleSellerDropoffResponse, SpeedafStationDto } from '../../lib/api/logistics/logistics.api'
import { cn } from '@/lib/utils'
import { toast } from 'react-toastify'

type Props = {
  sale: SellerSaleResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ScheduleDropoffModal({ sale, open, onOpenChange }: Props) {
  const { data: store } = useSellerStoreProfile(open)
  const sellerCity = store?.city?.trim() || undefined
  const { data: stations = [], isLoading } = useSpeedafStations(undefined)
  const schedule = useScheduleSellerDropoff()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [confirmed, setConfirmed] = useState<ScheduleSellerDropoffResponse | null>(null)

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = [...stations]
    if (q) {
      list = list.filter((s) =>
        `${s.siteName} ${s.city} ${s.area} ${s.address}`.toLowerCase().includes(q),
      )
    }
    if (sellerCity) {
      const city = sellerCity.toLowerCase()
      list.sort((a, b) => {
        const aNear = a.city.toLowerCase().includes(city) || city.includes(a.city.toLowerCase()) ? 0 : 1
        const bNear = b.city.toLowerCase().includes(city) || city.includes(b.city.toLowerCase()) ? 0 : 1
        if (aNear !== bNear) return aNear - bNear
        return a.siteName.localeCompare(b.siteName)
      })
    } else {
      list.sort((a, b) => a.city.localeCompare(b.city) || a.siteName.localeCompare(b.siteName))
    }
    return list
  }, [stations, query, sellerCity])

  const selected = sorted.find((s) => s.id === selectedId) ?? null

  const reset = () => {
    setSelectedId(null)
    setQuery('')
    setConfirmed(null)
  }

  const submit = async () => {
    if (!sale || !selectedId) return
    try {
      const res = await schedule.mutateAsync({ orderId: sale.orderId, speedafStationId: selectedId })
      setConfirmed(res)
    } catch {
      /* toast from client */
    }
  }

  const copyBill = async () => {
    if (!confirmed?.speedafBillCode) return
    try {
      await navigator.clipboard.writeText(confirmed.speedafBillCode)
      toast.success('Waybill copied')
    } catch {
      toast.error('Could not copy waybill')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset()
        onOpenChange(next)
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-lg overflow-hidden sm:rounded-2xl">
        {confirmed ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-main inline-flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" /> Drop-off ready
              </DialogTitle>
              <DialogDescription className="text-main/55">
                Take your book(s) to this Speedaf station with your waybill. Speedaf will move the parcel toward Alákọ̀wé.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 rounded-xl border border-third bg-white p-4 text-sm">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-main/40">Station</p>
                <p className="font-heading font-bold text-main">{confirmed.preferredSpeedafStationName}</p>
                <p className="text-xs text-main/55 mt-0.5">
                  {[confirmed.preferredSpeedafStationAddress, confirmed.preferredSpeedafStationArea, confirmed.preferredSpeedafStationCity]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                {confirmed.preferredSpeedafStationPhone && (
                  <p className="text-xs text-main/45 mt-0.5">{confirmed.preferredSpeedafStationPhone}</p>
                )}
              </div>
              <div className="border-t border-third pt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-main/40">Waybill</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <p className="font-mono text-sm font-semibold text-main">{confirmed.speedafBillCode ?? '—'}</p>
                  {confirmed.speedafBillCode && (
                    <button type="button" onClick={copyBill} className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline">
                      <Copy size={12} /> Copy
                    </button>
                  )}
                </div>
                {confirmed.labelUrl && (
                  <a
                    href={confirmed.labelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
                  >
                    Open label / print <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                className="rounded-xl bg-main text-white hover:bg-main/90"
                onClick={() => {
                  reset()
                  onOpenChange(false)
                }}
              >
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-main">Schedule drop-off</DialogTitle>
              <DialogDescription className="text-main/55">
                {sale
                  ? `Pick the Speedaf station closest to you for “${sale.bookTitle}”. We’ll create your waybill right away.`
                  : 'Pick a Speedaf station closest to you.'}
              </DialogDescription>
            </DialogHeader>

            {(sellerCity || store?.state) && (
              <p className="text-xs text-main/50">
                Your location:{' '}
                <span className="font-semibold text-main">{[sellerCity, store?.state].filter(Boolean).join(', ')}</span>
                {sellerCity ? ' · stations near your city are listed first' : null}
              </p>
            )}

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-main/35" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by area, city, or station name"
                className="h-10 rounded-xl border-main/15 bg-white pl-9 text-sm text-main placeholder:text-main/30"
              />
            </div>

            <div className="max-h-[42vh] space-y-2 overflow-y-auto pr-1">
              {isLoading ? (
                <p className="py-8 text-center text-sm text-main/45">Loading Speedaf stations…</p>
              ) : sorted.length === 0 ? (
                <p className="py-8 text-center text-sm text-main/45">No stations match your search.</p>
              ) : (
                sorted.map((station) => (
                  <StationOption
                    key={station.id}
                    station={station}
                    selected={selectedId === station.id}
                    nearSeller={
                      !!sellerCity &&
                      (station.city.toLowerCase().includes(sellerCity.toLowerCase()) ||
                        sellerCity.toLowerCase().includes(station.city.toLowerCase()))
                    }
                    onSelect={() => setSelectedId(station.id)}
                  />
                ))
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => onOpenChange(false)}
                disabled={schedule.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-xl bg-main text-white hover:bg-main/90"
                disabled={!selected || schedule.isPending}
                onClick={submit}
              >
                {schedule.isPending
                  ? 'Creating waybill…'
                  : selected
                    ? `Confirm · ${selected.siteName}`
                    : 'Select a station'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function StationOption({
  station,
  selected,
  nearSeller,
  onSelect,
}: {
  station: SpeedafStationDto
  selected: boolean
  nearSeller: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full rounded-xl border px-3.5 py-3 text-left transition-colors',
        selected
          ? 'border-main bg-main/[0.04] ring-1 ring-main/20'
          : 'border-third bg-white hover:border-main/25',
      )}
    >
      <div className="flex items-start gap-2.5">
        <MapPin size={15} className={cn('mt-0.5 shrink-0', selected ? 'text-main' : 'text-main/35')} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-sm text-main">{station.siteName}</p>
            {nearSeller && (
              <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold text-secondary">
                Near you
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-main/55">
            {[station.area, station.city].filter(Boolean).join(', ')}
          </p>
          {station.address && (
            <p className="mt-0.5 text-[11px] text-main/40 line-clamp-2">{station.address}</p>
          )}
        </div>
      </div>
    </button>
  )
}
