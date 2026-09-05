import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Clock, Info, Package, ShieldAlert } from 'lucide-react'
import { useOrder, useOrderDispute } from '../../lib/api/orders/orders.hooks'
import { useAuth } from '../../context/AuthContext'
import { decisionLabel, resolutionSummary, resolutionTone } from '../../lib/orders'
import type { OrderDisputeResponse } from '../../lib/api/types'

const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string; hint: string }> = {
  Open: {
    label: 'Open',
    badge: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
    dot: 'bg-yellow-500',
    hint: "We've received your report and are looking into it.",
  },
  UnderReview: {
    label: 'Under Review',
    badge: 'bg-blue-50 text-blue-800 border border-blue-200',
    dot: 'bg-blue-500',
    hint: 'Our support team is reviewing the case and the evidence you submitted.',
  },
  Resolved: {
    label: 'Resolved',
    badge: 'bg-green-50 text-green-800 border border-green-200',
    dot: 'bg-green-500',
    hint: 'A decision has been reached on this dispute.',
  },
  Rejected: {
    label: 'Rejected',
    badge: 'bg-red-50 text-red-800 border border-red-200',
    dot: 'bg-red-500',
    hint: 'The dispute was reviewed and not upheld.',
  },
  Closed: {
    label: 'Closed',
    badge: 'bg-gray-100 text-gray-700 border border-gray-200',
    dot: 'bg-gray-400',
    hint: 'This dispute was closed without a ruling.',
  },
}

function statusConfig(status: string) {
  return (
    STATUS_CONFIG[status] ?? {
      label: status,
      badge: 'bg-main/8 text-main border border-main/10',
      dot: 'bg-main',
      hint: '',
    }
  )
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const day = date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
  const time = date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
  return `${day}, ${time}`
}

function DecisionCard({ dispute, isBuyer }: { dispute: OrderDisputeResponse; isBuyer: boolean }) {
  const decision = dispute.decision ?? ''
  const tone = resolutionTone(decision, isBuyer)
  const cls =
    tone === 'good'
      ? 'bg-green-50 border-green-200'
      : tone === 'bad'
        ? 'bg-red-50 border-red-200'
        : 'bg-white border-third'
  const Icon = tone === 'good' ? CheckCircle : tone === 'bad' ? ShieldAlert : Info
  const iconColor =
    tone === 'good' ? 'text-green-600' : tone === 'bad' ? 'text-red-600' : 'text-secondary'

  return (
    <div className={`rounded-2xl border px-5 py-4 mb-6 flex items-start gap-3 ${cls}`}>
      <Icon size={16} className={`${iconColor} shrink-0 mt-0.5`} />
      <div>
        <p className="text-sm font-semibold text-main mb-0.5">
          Decision — {decisionLabel(decision)}
        </p>
        <p className="text-sm text-main/70 leading-relaxed">
          {resolutionSummary(decision, isBuyer)}
        </p>
        {dispute.resolution && (
          <p className="text-xs text-main/55 mt-2 leading-relaxed">“{dispute.resolution}”</p>
        )}
        {dispute.decidedAt && (
          <p className="text-xs text-main/40 mt-1">Decided {formatDate(dispute.decidedAt)}</p>
        )}
      </div>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  message,
  children,
}: {
  icon: React.ReactNode
  title: string
  message: string
  children?: React.ReactNode
}) {
  return (
    <div className="bg-third min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-main/8 flex items-center justify-center mx-auto mb-6">
          {icon}
        </div>
        <h2 className="font-heading font-bold text-main text-xl mb-2">{title}</h2>
        <p className="text-main/50 text-sm mb-6 leading-relaxed">{message}</p>
        {children}
      </div>
    </div>
  )
}

function DisputeTracking() {
  const { orderId } = useParams<{ orderId: string }>()
  const numericOrderId = Number(orderId)
  const { user } = useAuth()
  const { data: order, isLoading: orderLoading, error: orderError } = useOrder(numericOrderId)
  const { data: dispute, isLoading: disputeLoading, error: disputeError } = useOrderDispute(
    numericOrderId,
    !!user,
  )

  const invalid = !Number.isInteger(numericOrderId) || numericOrderId <= 0

  if (invalid || orderError) {
    return (
      <EmptyState
        icon={<Package size={28} className="text-main/40" />}
        title="Order not found"
        message="This link may have expired or the order ID is incorrect."
      >
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 bg-main text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-main/90 transition-colors"
        >
          Browse Books
        </Link>
      </EmptyState>
    )
  }

  if (!user) {
    return (
      <EmptyState
        icon={<ShieldAlert size={28} className="text-main/40" />}
        title="Log in to view this dispute"
        message="Only the buyer or seller of an order can view its dispute record."
      >
        <Link
          to="/login"
          className="inline-block bg-secondary text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-secondary/90 transition-colors"
        >
          Log in
        </Link>
      </EmptyState>
    )
  }

  if (orderLoading || !order) {
    return (
      <div className="bg-third min-h-screen flex items-center justify-center px-4">
        <p className="text-main/50 text-sm">Loading order…</p>
      </div>
    )
  }

  const isBuyer = !!user.userId && user.userId === String(order.userId)
  const viewerEmail = user.email?.toLowerCase() ?? ''
  const isSeller =
    !!viewerEmail &&
    (viewerEmail === (order.sellerEmail ?? '').toLowerCase() ||
      order.items.some(item => viewerEmail === (item.sellerEmail ?? '').toLowerCase()))

  if (!isBuyer && !isSeller) {
    return (
      <EmptyState
        icon={<ShieldAlert size={28} className="text-main/40" />}
        title="You can't view this dispute"
        message="Only the buyer or seller of this order can view its dispute record."
      >
        <Link
          to={`/order/${orderId}`}
          className="inline-flex items-center gap-2 bg-main text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-main/90 transition-colors"
        >
          Back to Order
        </Link>
      </EmptyState>
    )
  }

  if (disputeLoading) {
    return (
      <div className="bg-third min-h-screen flex items-center justify-center px-4">
        <p className="text-main/50 text-sm">Loading dispute…</p>
      </div>
    )
  }

  if (disputeError || !dispute) {
    return (
      <EmptyState
        icon={<ShieldAlert size={28} className="text-main/40" />}
        title="Dispute unavailable"
        message={
          disputeError instanceof Error && disputeError.message
            ? disputeError.message
            : "We couldn't load the dispute record for this order right now."
        }
      >
        <Link
          to={`/order/${orderId}`}
          className="inline-flex items-center gap-2 bg-main text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-main/90 transition-colors"
        >
          Back to Order
        </Link>
      </EmptyState>
    )
  }

  const cfg = statusConfig(dispute.status)
  const open = dispute.status === 'Open' || dispute.status === 'UnderReview'

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-10">

        <Link
          to={`/order/${orderId}`}
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> Back to Order
        </Link>

        <p className="text-xs font-semibold text-main/40 uppercase tracking-wider mb-1">
          Dispute · {dispute.disputeNumber}
        </p>
        <h1 className="font-heading font-bold text-main text-2xl mb-1">Dispute Tracking</h1>
        <p className="text-main/45 text-sm mb-8">
          Order {order.orderNumber} — {dispute.bookTitle}
        </p>

        {/* Status */}
        <div className="bg-white rounded-2xl border border-third p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${cfg.dot}`} />
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${cfg.badge}`}>
                {cfg.label}
              </span>
            </div>
            <span className="text-xs text-main/40">Filed {formatDate(dispute.filedAt)}</span>
          </div>
          <p className="text-sm text-main/60 mt-3">{cfg.hint}</p>

          {open && (
            <div className="flex items-start gap-2 mt-4 bg-main/5 border border-main/10 rounded-xl px-4 py-3">
              <Clock size={14} className="text-secondary shrink-0 mt-0.5" />
              <p className="text-xs text-main/60 leading-relaxed">
                <span className="font-semibold text-main">
                  Response due by {formatDate(dispute.dueAt)}.
                </span>{' '}
                {dispute.status === 'UnderReview'
                  ? 'Our support team is reviewing your case right now.'
                  : "We'll review your report and get back to you within 24–48 hours."}
              </p>
            </div>
          )}
        </div>

        {/* Decision */}
        {dispute.decision && <DecisionCard dispute={dispute} isBuyer={isBuyer} />}

        {/* Activity */}
        <div className="bg-white rounded-2xl border border-third p-6 mb-6">
          <h2 className="font-heading font-bold text-main text-base mb-5">Activity</h2>
          <div className="flex flex-col">
            {dispute.activity.map((entry, i) => {
              const isLast = i === dispute.activity.length - 1
              const isPast = !isLast
              return (
                <div key={`${entry.ts}-${i}`} className="flex items-start gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-3.5 h-3.5 rounded-full ${isPast ? 'bg-green-500' : cfg.dot}`} />
                    {!isLast && <div className="w-0.5 h-8 bg-main/10" />}
                  </div>
                  <div className="pb-5 min-w-0">
                    <p className={`text-sm font-medium ${isPast ? 'text-main/50' : 'text-main'}`}>
                      {entry.text}
                    </p>
                    <p className="text-xs text-main/40 mt-0.5">{formatDate(entry.ts)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Report */}
        <div className="bg-white rounded-2xl border border-third p-6 mb-6">
          <h2 className="font-heading font-bold text-main text-base mb-1">
            {isBuyer ? 'Your Report' : "The Buyer's Report"}
          </h2>
          <p className="text-xs text-main/45 mb-4">
            Filed by {dispute.filedBy} · {dispute.delivery} fulfilment
          </p>
          <p className="text-sm text-main leading-relaxed">{dispute.reason}</p>
          {dispute.evidence.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {dispute.evidence.map(src => (
                <img
                  key={src}
                  src={src}
                  alt="Dispute evidence"
                  className="w-24 h-32 rounded-xl object-cover border border-main/10"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>

        {/* Escrow note */}
        {open && (
          <div className="bg-white rounded-2xl border border-third p-5 mb-6">
            <p className="text-xs text-main/45 leading-relaxed">
              <span className="font-semibold text-main">
                ₦{(dispute.amount / 100).toLocaleString()}
              </span>{' '}
              is held in escrow while this dispute is{' '}
              {dispute.status === 'UnderReview' ? 'under review' : 'open'}. It will be released to
              the winning party when a decision is reached.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default DisputeTracking
