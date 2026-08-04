import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
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
import { useConfirmSellerPickup } from '../../lib/api/logistics/logistics.hooks'
import type { SellerSaleResponse } from '../../lib/api/types'
import type { ConfirmSellerPickupResponse } from '../../lib/api/logistics/logistics.api'

type Props = {
  sale: SellerSaleResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function saleBookTitles(sale: SellerSaleResponse | null): string[] {
  if (!sale) return []
  if (sale.bookTitles?.length) return sale.bookTitles
  return sale.bookTitle ? [sale.bookTitle] : []
}

export function ConfirmPickupModal({ sale, open, onOpenChange }: Props) {
  const confirm = useConfirmSellerPickup()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState<ConfirmSellerPickupResponse | null>(null)

  const books = saleBookTitles(sale)

  const reset = () => {
    setCode('')
    setError(null)
    setConfirmed(null)
  }

  const submit = async () => {
    if (!sale || !code.trim()) return
    setError(null)
    try {
      const res = await confirm.mutateAsync({ orderId: sale.orderId, code: code.trim() })
      setConfirmed(res)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Wrong pickup code. Try again.'
      setError(message)
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
                <CheckCircle2 className="h-5 w-5 text-green-600" /> Pickup confirmed
              </DialogTitle>
              <DialogDescription className="text-main/55">
                {books.length > 1
                  ? 'The buyer has collected these books.'
                  : 'The buyer has collected their book.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 rounded-xl border border-third bg-white p-4 text-sm">
              <p className="text-xs text-main/55">
                Order {confirmed.orderNumber || sale?.orderNumber}
              </p>
              <ul className="space-y-1.5">
                {books.map((title) => (
                  <li key={title} className="font-heading font-bold text-main leading-snug">
                    {title}
                  </li>
                ))}
              </ul>
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
              <DialogTitle className="font-heading text-main">Mark as picked up</DialogTitle>
              <DialogDescription className="text-main/55">
                Enter the pickup code the buyer shows you. Confirm these are the books for this order.
              </DialogDescription>
            </DialogHeader>

            {sale && (
              <div className="rounded-xl border border-third bg-third/40 p-4 space-y-2">
                <p className="text-xs text-main/45">
                  Order {sale.orderNumber}
                  {sale.buyerInitials ? ` · Buyer: ${sale.buyerInitials}` : ''}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-main/45">
                  Books to hand over
                </p>
                <ul className="space-y-1.5">
                  {books.map((title) => (
                    <li key={title} className="text-sm font-semibold text-main leading-snug">
                      {title}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-main/50 uppercase tracking-wider mb-1.5 block">
                Pickup code
              </label>
              <Input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="Enter code"
                className="h-10 rounded-xl border-main/15 bg-white text-sm text-main placeholder:text-main/30 font-mono tracking-wider"
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    void submit()
                  }
                }}
              />
              {error && (
                <p className="text-xs text-red-600 mt-2 leading-relaxed">{error}</p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => onOpenChange(false)}
                disabled={confirm.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-xl bg-main text-white hover:bg-main/90"
                disabled={!code.trim() || confirm.isPending}
                onClick={submit}
              >
                {confirm.isPending ? 'Confirming…' : 'Confirm pickup'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
