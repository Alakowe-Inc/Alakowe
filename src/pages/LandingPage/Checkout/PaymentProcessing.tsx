import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckout } from '../../../context/CheckoutContext'
import { usePaymentStatus } from '../../../lib/api/checkout/checkout.hooks'

function PaymentProcessing() {
  const checkout = useCheckout()
  const navigate = useNavigate()
  const sessionId = checkout.sessionId

  const [paymentPollingStartAt, setPaymentPollingStartAt] = useState<number | null>(null)
  const [paymentTimeout, setPaymentTimeout] = useState(false)
  const [statusMessage, setStatusMessage] = useState('Waiting for payment confirmation…')

  const {
    data: paymentStatus,
    refetch: refetchPaymentStatus,
  } = usePaymentStatus(sessionId ?? '')

  useEffect(() => {
    if (!sessionId) {
      navigate('/checkout')
      return
    }
    setPaymentPollingStartAt(Date.now())
  }, [sessionId, navigate])

  useEffect(() => {
    if (!sessionId || !paymentPollingStartAt) return

    let cancelled = false
    const pollEveryMs = 15000
    const maxDurationMs = 11 * 60 * 1000

    async function pollOnce() {
      if (cancelled) return

      const elapsed = Date.now() - paymentPollingStartAt
      if (elapsed >= maxDurationMs) {
        setPaymentTimeout(true)
        setStatusMessage('Transaction will be verified later')
        return
      }

      const result = await refetchPaymentStatus()
      const status = result?.data?.status?.toLowerCase?.() ?? result?.data?.status

      if (status === 'paid') {
        setStatusMessage('Payment confirmed!')
        const orders = result?.data?.orders ?? paymentStatus?.orders ?? []
        const orderId = orders?.[0]?.orderId ?? null
        navigate(orderId ? `/payment/success?orderId=${orderId}` : '/payment/success')
        return
      }

      if (status === 'failed' || status === 'failure') {
        setStatusMessage('Payment failed')
        navigate('/payment/failed')
        return
      }

      setStatusMessage('Waiting for payment confirmation…')
      setTimeout(pollOnce, pollEveryMs)
    }

    pollOnce()

    return () => {
      cancelled = true
    }
  }, [
    sessionId,
    paymentPollingStartAt,
    refetchPaymentStatus,
    navigate,
    paymentStatus,
  ])

  return (
    <div className="bg-third min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Loading spinner */}
        <div className="w-16 h-16 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin mx-auto mb-6" />

        <h1 className="font-heading font-bold text-main text-2xl mb-3">
          Verifying your payment
        </h1>
        <p className="text-main/55 text-sm leading-relaxed mb-6">
          This may take a few moments. Please don't close this page.
        </p>

        {/* Stage badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30">
          <span className="text-xs font-semibold text-main">{statusMessage}</span>
        </div>

        {paymentTimeout && (
          <div className="mt-8">
            <p className="text-sm text-main/55 leading-relaxed mb-4">
              Your transaction will be verified later. You can check the status from your orders.
            </p>
            <button
              type="button"
              onClick={() => navigate('/my-purchases')}
              className="text-secondary font-semibold text-sm hover:underline"
            >
              View My Orders
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentProcessing
