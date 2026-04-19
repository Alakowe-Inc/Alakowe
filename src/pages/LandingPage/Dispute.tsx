import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react'
import { getOrder } from '../../data/orderData'

const ISSUE_TYPES = [
  'Wrong book received',
  'Book is damaged',
  'Book not received',
  'Condition worse than described',
  'Other',
]

function Dispute() {
  const { orderId } = useParams<{ orderId: string }>()
  const order = orderId ? getOrder(orderId) : null

  const [issueType, setIssueType] = useState('')
  const [notes, setNotes] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [issueError, setIssueError] = useState(false)

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setPhotos(Array.from(e.target.files).slice(0, 3))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!issueType) { setIssueError(true); return }
    setIssueError(false)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
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
            <span className="font-semibold text-main">24–48 hours</span>. You'll hear from us via email.
          </p>
          <div className="bg-white rounded-2xl border border-third p-5 mb-6 text-left">
            <p className="text-xs font-semibold text-main/40 uppercase tracking-wider mb-1">
              Issue Reported
            </p>
            <p className="text-sm font-semibold text-main">{issueType}</p>
            {orderId && (
              <p className="text-xs text-main/40 mt-1">Order: {orderId}</p>
            )}
          </div>
          <Link
            to="/browse"
            className="inline-block bg-main text-white font-semibold px-8 py-3.5 rounded-full text-sm hover:bg-main/90 transition-colors"
          >
            Back to Browse
          </Link>
        </div>
      </div>
    )
  }

  /* ── Form ── */
  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-10">

        <Link
          to={orderId ? `/order/${orderId}` : '/'}
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> Back to Order
        </Link>

        <h1 className="font-heading font-bold text-main text-2xl mb-1">Report an Issue</h1>
        {order && (
          <p className="text-main/45 text-sm mb-8">Order: {order.id}</p>
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
                  <input
                    type="radio"
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
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-main/15 rounded-xl py-8 cursor-pointer hover:border-secondary/40 transition-colors">
              <Upload size={24} className="text-main/30 mb-2" />
              <span className="text-sm text-main/50 font-medium">Click to upload photos</span>
              <span className="text-xs text-main/30 mt-1">PNG, JPG up to 5MB each</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                onChange={handlePhotoChange}
              />
            </label>
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
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Describe the issue in detail…"
              rows={4}
              className="w-full border border-main/15 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus:border-secondary transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-main text-white font-semibold py-4 rounded-full hover:bg-main/90 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting…' : 'Submit Report'}
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
