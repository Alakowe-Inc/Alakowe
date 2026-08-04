import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, X } from 'lucide-react'
import {
  clearListingDraft,
  hasListingDraft,
  listingDraftReturnPath,
  loadListingDraft,
} from '../lib/listingDraft'

export function ContinueListingBanner() {
  const location = useLocation()
  const [show, setShow] = useState(false)
  const [returnPath, setReturnPath] = useState('/list')
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    const sync = () => {
      const draft = loadListingDraft()
      if (!draft) {
        setShow(false)
        return
      }
      const path = listingDraftReturnPath(draft)
      setReturnPath(path)
      setIsEdit(draft.kind === 'edit')
      setShow(hasListingDraft() && location.pathname !== path)
    }
    sync()
    window.addEventListener('alakowe:listing-draft', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('alakowe:listing-draft', sync)
      window.removeEventListener('storage', sync)
    }
  }, [location.pathname])

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[60] flex justify-center pointer-events-none sm:left-auto sm:right-6 sm:bottom-6 sm:justify-end">
      <div className="pointer-events-auto flex items-start gap-3 max-w-md w-full sm:w-auto rounded-2xl border border-third bg-white shadow-lg px-4 py-3.5">
        <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
          <BookOpen size={16} className="text-secondary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-main leading-snug">
            {isEdit ? 'Continue editing?' : 'Continue your listing?'}
          </p>
          <p className="text-xs text-main/50 mt-0.5 leading-relaxed">
            Your draft is saved. Pick up where you left off after updating delivery settings.
          </p>
          <Link
            to={returnPath}
            className="inline-block mt-2.5 text-xs font-semibold text-secondary hover:underline"
          >
            {isEdit ? 'Continue editing →' : 'Continue listing →'}
          </Link>
        </div>
        <button
          type="button"
          aria-label="Dismiss and discard listing draft"
          onClick={() => {
            clearListingDraft()
            setShow(false)
          }}
          className="shrink-0 p-1 rounded-lg text-main/35 hover:text-main/70 hover:bg-main/5 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
