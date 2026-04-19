import { Link } from 'react-router-dom'
import { XCircle } from 'lucide-react'

function PaymentFailed() {
  return (
    <div className="bg-third min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle size={40} className="text-red-500" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="font-heading font-bold text-main text-3xl mb-3">Payment Unsuccessful</h1>
        <p className="text-main/55 text-sm mb-8 leading-relaxed">
          Something went wrong while processing your payment.<br />
          Your cart is still saved — please try again.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/checkout"
            className="w-full bg-main text-white font-semibold py-4 rounded-full hover:bg-main/90 transition-colors text-sm text-center"
          >
            Retry Payment
          </Link>
          <Link
            to="/contact"
            className="w-full text-center text-sm text-main/50 hover:text-main transition-colors font-medium py-2"
          >
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  )
}

export default PaymentFailed
