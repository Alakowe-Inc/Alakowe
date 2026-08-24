import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Upload, CheckCircle, Package, ShieldAlert, X } from 'lucide-react'
import { RadioInput, FileUpload, TextareaControl } from '@/components/ui/form-controls'
import { useConfirmOrderDelivery, useOrder } from '../../lib/api/orders/orders.hooks'
import { useAuth } from '../../context/AuthContext'
import { compressImage, uploadToCloudinary, isImageTypeAllowed } from '../../lib/upload'
import { normalizeOrderStatus } from '../../lib/orders'

const ISSUE_TYPES = [
  'Wrong book received',
  'Book is damaged',
  'Book not received',
  'Condition worse than described',
  'Other',
]

const MAX_PHOTOS = 3

function Dispute() {
  const { orderId } = useParams<{ orderId: string }>()
  const numericOrderId = Number(orderId)
  const { data: order, isLoading } = useOrder(numericOrderId)
  const { user } = useAuth()

  const confirm = useConfirmOrderDelivery()

  const [issueType, setIssueType] = useState('')
  const [notes, setNotes] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [photoError, setPhotoError] = useState('')
  const [notesError, setNotesError] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [issueError, setIssueError] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadLabel, setUploadLabel] = useState('')

  const previewUrls = useMemo(
    () => photos.map(f => URL.createObjectURL(f)),
    [photos],
  )

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotoError('')
    const files = e.target.files
    if (!files) return
    const newFiles = Array.from(files)
    const totalCount = photos.length + newFiles.length
    if (totalCount > MAX_PHOTOS) {
      setPhotoError(`You can upload a maximum of ${MAX_PHOTOS} photos (${totalCount} selected)`)
      e.target.value = ''
      return
    }
    for (const f of newFiles) {
      if (!isImageTypeAllowed(f)) {
        setPhotoError(`"${f.name}" is not a supported format. Use JPG, JPEG or PNG only.`)
        e.target.value = ''
        return
      }
      if (f.size > 5 * 1024 * 1024) {
        setPhotoError(`"${f.name}" exceeds the 5 MB limit`)
        e.target.value = ''
        return
      }
    }
    setPhotos(prev => [...prev, ...newFiles])
    e.target.value = ''
  }

  function removePhoto(index: number) {
    setPhotos(prev => prev.filter((_, i) => i !== index))
    setPhotoError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const hasIssue = !!issueType
    const hasNotes = notes.trim().length > 0
    const hasPhotos = photos.length > 0
    if (!hasIssue) setIssueError(true)
    if (!hasNotes) setNotesError(true)
    if (!hasPhotos) setPhotoError('Please upload at least 1 photo')
    if (!hasIssue || !hasNotes || !hasPhotos) return

    setIssueError(false)
    setNotesError(false)
    setPhotoError('')
    setSubmitError(null)

    const reason = [issueType, notes.trim()].filter(Boolean).join(' — ')
    try {
      let imageFileNames: string[] = []
      if (photos.length > 0) {
        setIsUploading(true)
        setUploadLabel('Compressing photos…')
        const compressed = await Promise.all(photos.map(p => compressImage(p)))
        setUploadLabel('Uploading photos…')
        imageFileNames = await Promise.all(
          compressed.map((blob, i) => uploadToCloudinary(blob, photos[i].name))
        )
      }

      await confirm.mutateAsync({
        orderId: numericOrderId,
        confirm: false,
        note: reason,
        imageFileNames,
      })
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadLabel('')
    }
  }

  const isSubmitting = confirm.isPending || isUploading

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="bg-third min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-secondary" strokeWidth={1.5} />
          </div>
          <h1 className="font-heading font-bold text-main text-2xl mb-3">Dispute Submitted</h1>
          <p className="text-main/55 text-sm mb-6 leading-relaxed">
            We've received your report and will investigate within{' '}
            <span className="font-semibold text-main">24–48 hours</span>. Your payment stays in
            escrow while we review it — you'll hear from us via email.
          </p>
          <div className="bg-white rounded-2xl border border-third p-5 mb-6 text-left">
            <p className="text-xs font-semibold text-main/40 uppercase tracking-wider mb-1">
              Issue Reported
            </p>
            <p className="text-sm font-semibold text-main">{issueType}</p>
            {order?.orderNumber && (
              <p className="text-xs text-main/40 mt-1">Order: {order.orderNumber}</p>
            )}
          </div>
          <Link
            to={`/order/${orderId}/dispute/track`}
            className="inline-block bg-secondary text-white font-semibold px-8 py-3.5 rounded-xl text-sm hover:bg-secondary/90 transition-colors"
          >
            Track Dispute
          </Link>
          <Link
            to={`/order/${orderId}`}
            className="inline-block border border-main/15 text-main font-semibold px-8 py-3.5 rounded-xl text-sm hover:border-secondary/40 hover:text-secondary transition-colors mt-3"
          >
            Back to Order
          </Link>
        </div>
      </div>
    )
  }

  /* ── Loading / not found ── */
  if (isLoading) {
    return (
      <div className="bg-third min-h-screen flex items-center justify-center px-4">
        <p className="text-main/50 text-sm">Loading order…</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="bg-third min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-main/8 flex items-center justify-center mx-auto mb-6">
            <Package size={28} className="text-main/40" />
          </div>
          <h2 className="font-heading font-bold text-main text-xl mb-2">Order not found</h2>
          <p className="text-main/50 text-sm mb-6">
            This link may have expired or the order ID is incorrect.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 bg-main text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-main/90 transition-colors"
          >
            Browse Books
          </Link>
        </div>
      </div>
    )
  }

  const isBuyer = !!user?.userId && user.userId === String(order.userId)

  /* ── Already-open guard: route buyers to tracking instead of re-filing ── */
  if (normalizeOrderStatus(order.status) === 'disputed') {
    return (
      <div className="bg-third min-h-screen">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-10">
          <Link
            to={`/order/${orderId}`}
            className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium"
          >
            <ArrowLeft size={15} /> Back to Order
          </Link>
          <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
              <ShieldAlert size={28} className="text-red-600" />
            </div>
            <h1 className="font-heading font-bold text-main text-xl mb-2">Dispute already open</h1>
            <p className="text-main/55 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              You already have an active dispute for this order. Your payment stays in escrow while
              our support team reviews it.
            </p>
            <Link
              to={`/order/${orderId}/dispute/track`}
              className="inline-block bg-secondary text-white font-semibold px-8 py-3.5 rounded-xl text-sm hover:bg-secondary/90 transition-colors"
            >
              Track Dispute
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── Form ── */
  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-10">

        <Link
          to={`/order/${orderId}`}
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> Back to Order
        </Link>

        <h1 className="font-heading font-bold text-main text-2xl mb-1">Report an Issue</h1>
        <p className="text-main/45 text-sm mb-8">Order: {order.orderNumber}</p>

        {!isBuyer && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6 text-xs text-yellow-800">
            You can only file a dispute for your own orders.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Issue type */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-4">What's the issue?</h2>
            <div className="flex flex-col gap-3">
              {ISSUE_TYPES.map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                      issueType === type
                        ? 'border-secondary bg-secondary'
                        : 'border-main/25 group-hover:border-secondary/50'
                    }`}
                  >
                    {issueType === type && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <RadioInput
                    name="issueType"
                    value={type}
                    checked={issueType === type}
                    onChange={() => { setIssueType(type); setIssueError(false) }}
                    className="sr-only"
                  />
                  <span className="text-sm text-main">{type}</span>
                </label>
              ))}
            </div>
            {issueError && (
              <p className="text-xs text-red-500 mt-3">Please select an issue type</p>
            )}
          </div>

          {/* Photo upload */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">Upload Photos</h2>
            <p className="text-xs text-main/45 mb-4">
              Attach up to 3 photos showing the issue <span className="text-red-500">*</span>
            </p>
            <FileUpload
              id="dispute-photos"
              label="Click to upload photos"
              hint="PNG, JPG up to 5MB each"
              icon={Upload}
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              style="border-main/15 py-8 hover:border-secondary/40 bg-transparent hover:bg-transparent"
            />
            {photos.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {photos.map((f, i) => (
                  <div key={`${f.name}-${i}`} className="relative">
                    <div className="w-16 h-20 rounded-xl overflow-hidden border border-main/10 bg-main/5">
                      <img src={previewUrls[i]} alt={f.name} className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      aria-label={`Remove ${f.name}`}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-main text-white flex items-center justify-center shadow-sm hover:bg-main/80 transition-colors"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {photoError && (
              <p className="text-xs text-red-500 mt-3">{photoError}</p>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">Additional Notes</h2>
            <p className="text-xs text-main/45 mb-4">
              Tell us more about what happened <span className="text-red-500">*</span>
            </p>
            <TextareaControl
              value={notes}
              onChange={e => { setNotes(e.target.value); setNotesError(false) }}
              placeholder="Describe the issue in detail…"
              rows={4}
              style="border border-main/15 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus-visible:ring-0 focus:border-secondary transition-colors"
            />
            {notesError && (
              <p className="text-xs text-red-500 mt-3">Please tell us more about the issue</p>
            )}
          </div>

          {submitError && (
            <p className="text-xs text-red-600 leading-relaxed">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !user}
            className="w-full bg-secondary text-white font-semibold py-4 rounded-xl hover:bg-secondary/90 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isUploading ? uploadLabel : confirm.isPending ? 'Submitting…' : 'Submit Report'}
          </button>

          <p className="text-xs text-main/35 text-center leading-relaxed">
            Our support team will review your report and get back to you within 24–48 hours.
          </p>

        </form>
      </div>
    </div>
  )
}

export default Dispute
