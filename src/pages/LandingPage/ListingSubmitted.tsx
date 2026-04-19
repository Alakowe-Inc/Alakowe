import { Link, useSearchParams } from 'react-router-dom'
import { Clock, ListChecks, PlusCircle } from 'lucide-react'

export default function ListingSubmitted() {
  const [params] = useSearchParams()
  const id = params.get('id')

  return (
    <div className="bg-third min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">

        <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
          <Clock size={36} className="text-secondary" strokeWidth={1.5} />
        </div>

        <h1 className="font-heading font-bold text-main text-2xl mb-3">
          Your book is under review
        </h1>
        <p className="text-main/55 text-sm mb-8 leading-relaxed">
          Our team will check your listing and get back to you within{' '}
          <span className="font-semibold text-main">24 hours</span>. We'll notify you by email once it's live.
        </p>

        {id && (
          <div className="bg-white rounded-2xl border border-third p-4 mb-8 text-left">
            <p className="text-xs font-semibold text-main/40 uppercase tracking-wider mb-1">Listing ID</p>
            <p className="font-heading font-bold text-main text-sm">{id}</p>
          </div>
        )}

        <div className="bg-secondary/8 border border-secondary/20 rounded-xl px-5 py-4 mb-8 text-left">
          <p className="text-sm text-main/65 leading-relaxed">
            <span className="font-semibold text-main">While you wait:</span> Make sure your payout details are set up in your profile so we can pay you as soon as a sale goes through.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/my-listings"
            className="w-full bg-main text-white font-semibold py-4 rounded-full hover:bg-main/90 transition-colors text-sm text-center flex items-center justify-center gap-2"
          >
            <ListChecks size={16} /> View My Listings
          </Link>
          <Link
            to="/list"
            className="w-full border border-main/15 text-main font-semibold py-4 rounded-full hover:bg-main/5 transition-colors text-sm text-center flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} /> List Another Book
          </Link>
        </div>

      </div>
    </div>
  )
}
