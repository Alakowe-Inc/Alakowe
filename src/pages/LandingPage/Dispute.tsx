import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Upload, CheckCircle, Package } from 'lucide-react'
import { RadioInput, FileUpload, TextareaControl } from '@/components/ui/form-controls'
import { useConfirmOrderDelivery, useOrder } from '../../lib/api/orders/orders.hooks'
import { useAuth } from '../../context/AuthContext'

const ISSUE_TYPES = [
  'Wrong book received',
  'Book is damaged',
  'Book not received',
  'Condition worse than described',
  'Other',
]

function Dispute() {
  const { orderId } = useParams<{ orderId: string }>()
  const numericOrderId = Number(orderId)
  const { data: order, isLoading } = useOrder(numericOrderId)
  const { user } = useAuth()

  const confirm = useConfirmOrderDelivery()

  const [issueType, setIssueType] = useState('')
  const [notes, setNotes] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [issueError, setIssueError] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setPhotos(Array.from(e.target.files).slice(0, 3))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!issueType) { setIssueError(true); return }
    setIssueError(false)
    setSubmitError(null)

    const reason = [issueType, notes.trim()].filter(Boolean).join(' — ')
    try {
      await confirm.mutateAsync({ orderId: numericOrderId, confirm: false, note: reason })
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

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
            to={`/order/${orderId}`}
            className="inline-block bg-secondary text-white font-semibold px-8 py-3.5 rounded-xl text-sm hover:bg-secondary/90 transition-colors"
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
            <h2 className="font-heading font-bold text-main text-base mb-1">
              Upload Photos{' '}
              <span className="text-main/35 font-normal text-sm">(optional)</span>
            </h2>
            <p className="text-xs text-main/45 mb-4">Attach up to 3 photos showing the issue</p>
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
              <div className="mt-3 flex flex-wrap gap-2">
                {photos.map(f => (
                  <span
                    key={f.name}
                    className="text-xs bg-secondary/10 text-secondary font-medium px-3 py-1 rounded-full"
                  >
                    {f.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">
              Additional Notes{' '}
              <span className="text-main/35 font-normal text-sm">(optional)</span>
            </h2>
            <p className="text-xs text-main/45 mb-4">Tell us more about what happened</p>
            <TextareaControl
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Describe the issue in detail…"
              rows={4}
              style="border border-main/15 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus-visible:ring-0 focus:border-secondary transition-colors"
            />
          </div>

          {submitError && (
            <p className="text-xs text-red-600 leading-relaxed">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={confirm.isPending || !isBuyer}
            className="w-full bg-secondary text-white font-semibold py-4 rounded-xl hover:bg-secondary/90 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {confirm.isPending ? 'Submitting…' : 'Submit Report'}
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
