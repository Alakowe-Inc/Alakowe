import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

interface Note {
  quote: string
  name: string
  book: string
}

const notes: Note[] = [
  { quote: "I didn't expect this book to hit me like this...", name: 'Tolu', book: 'The Midnight Library' },
  { quote: 'This one healed a part of me I didn\'t know was hurting.', name: 'Feyi', book: 'Homegoing' },
  { quote: "Couldn't put it down. Read it in one sitting!", name: 'David', book: 'The Alchemist' },
  { quote: 'A story that stayed with me long after the last page.', name: 'Ada', book: 'Purple Hibiscus' },
]

export default function NotesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <section className="bg-white py-24 border-t border-b border-third">
      <div className="max-w-9xl  mx-auto px-4 md:px-8 text-center">
        <h2 className="font-heading font-bold text-main text-3xl md:text-4xl mb-12">
          Notes from the pages
        </h2>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {notes.map((note, i) => (
              <div
                key={i}
                className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-3"
              >
                <div className="relative bg-[#FDF6E3] rounded-md shadow-sm px-7 py-8 h-full text-left">
                  {/* tape */}
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#e8dcc0]/80 rotate-[-3deg] rounded-sm" />

                  <p className="font-[cursive] text-main text-xl leading-relaxed mb-8">
                    {note.quote}
                  </p>
                  <p className="text-main/80 text-sm font-medium">{note.name}</p>
                  <p className="text-main/50 text-sm">{note.book}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* dots */}
        <div className="flex items-center justify-center gap-2.5 mt-8">
          {notes.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === selectedIndex ? 'w-2.5 h-2.5 bg-main' : 'w-2 h-2 bg-main/20'
              }`}
            >
              <span className="sr-only">Go to note {i + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}