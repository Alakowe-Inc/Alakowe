import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface BookCarouselProps {
  label: string
  icon?: ReactNode
  seeAllLink?: string
  children: ReactNode
}

function BookCarousel({ label, icon, seeAllLink = '/browse', children }: BookCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(direction: 'left' | 'right') {
    if (!scrollRef.current) return
    const firstChild = scrollRef.current.children[0] as HTMLElement | undefined
    const cardWidth = firstChild ? firstChild.offsetWidth : scrollRef.current.offsetWidth / 4
    scrollRef.current.scrollBy({ left: direction === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Row header */}
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-2">
          {icon && <span className="text-base">{icon}</span>}
          <h3 className="font-heading font-bold text-main text-base md:text-xl">{label}</h3>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            to={seeAllLink}
            className="text-xs font-semibold text-secondary hover:underline underline-offset-2"
          >
            See all
          </Link>
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border border-main/15 flex items-center justify-center text-main/40 hover:border-main/40 hover:text-main transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border border-main/15 flex items-center justify-center text-main/40 hover:border-main/40 hover:text-main transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  )
}

export default BookCarousel
