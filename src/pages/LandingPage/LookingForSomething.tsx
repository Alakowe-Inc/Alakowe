import { Users, Flame, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface WaitlistBook {
  id: string
  title: string
  author: string
  readersWaiting: number
}

const HIGH_DEMAND_THRESHOLD = 15

const waitlistBooks: WaitlistBook[] = [
  { id: '1', title: 'Fourth Wing', author: 'Rebecca Yarros', readersWaiting: 25 },
  { id: '2', title: 'A Court of Thorns and Roses', author: 'Sarah J. Maas', readersWaiting: 18 },
  { id: '3', title: 'The Song of Achilles', author: 'Madeline Miller', readersWaiting: 12 },
  { id: '4', title: 'Things Fall Apart', author: 'Chinua Achebe', readersWaiting: 9 },
  { id: '5', title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', readersWaiting: 8 },
]

export default function LookingForSomething() {
  return (
    <section className="py-16 bg-fourth/30">
      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 gap-4">
          <div>
            <h2 className="font-heading font-bold text-main text-3xl md:text-4xl mb-2">
              Looking for something?
            </h2>
            <p className="text-main/50 text-sm md:text-base">
              Join others waiting for books that are not yet listed.
            </p>
          </div>
          <Link
            to="/waitlist"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors whitespace-nowrap mt-1"
          >
            View more
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
          {waitlistBooks.map((book) => {
            const isHighDemand = book.readersWaiting >= HIGH_DEMAND_THRESHOLD

            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-third p-5 flex flex-col"
              >
                <h3 className="font-heading font-bold text-main text-base leading-snug mb-1">
                  {book.title}
                </h3>
                <p className="text-main/50 text-sm mb-4">{book.author}</p>

                <div className="flex items-center gap-1.5 text-main/60 text-sm mb-3">
                  <Users size={14} className="text-secondary shrink-0" />
                  <span>
                    <strong className="text-main font-semibold">{book.readersWaiting}</strong> readers waiting
                  </span>
                </div>

                {isHighDemand && (
                  <span className="inline-flex items-center gap-1 self-start bg-red-50 text-red-500 text-xs font-semibold px-2.5 py-1 rounded-full mb-5">
                    <Flame size={12} />
                    High demand
                  </span>
                )}

                {!isHighDemand && <div className="mb-5" />}

                <div className="mt-auto flex flex-col xs:flex-row gap-2">
                  <button
                    type="button"
                    className="flex-1 bg-secondary text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-secondary/90 transition-colors whitespace-nowrap"
                  >
                    Join waitlist
                  </button>
                  <button
                    type="button"
                    className="flex-1 border border-secondary/30 text-secondary text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-secondary/5 transition-colors whitespace-nowrap"
                  >
                    List this book
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile view more */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/waitlist"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors"
          >
            View more
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}