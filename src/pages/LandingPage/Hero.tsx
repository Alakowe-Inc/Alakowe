import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import heroImage2 from '../../assets/media/images/banny2.png'
import heroImage3 from '../../assets/media/images/banny3.png'
import heroImageMobile1 from '../../assets/media/images/p1.png'
import heroImageMobile2 from '../../assets/media/images/p2.png'

const desktopSlides = [heroImage2, heroImage3]
const mobileSlides = [heroImageMobile1, heroImageMobile2]

export default function Hero() {
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((i) => (i + 1) % desktopSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-full h-[calc(90vh-100px)] flex flex-col overflow-hidden">
      {/* Mobile background slides */}
      {mobileSlides.map((src, i) => (
        <img
          key={`mobile-${i}`}
          src={src}
          alt=""
          aria-hidden
          className="sm:hidden absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
          style={{ opacity: i === slideIndex ? 1 : 0 }}
        />
      ))}

      {/* Desktop background slides */}
      {desktopSlides.map((src, i) => (
        <img
          key={`desktop-${i}`}
          src={src}
          alt=""
          aria-hidden
          className="hidden sm:block absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
          style={{ opacity: i === slideIndex ? 1 : 0 }}
        />
      ))}

      {/* Uniform dark overlay */}
      <div className="absolute inset-0 bg-main/10" />

      {/* Centered content */}
      <div className="relative flex-1 flex flex-col items-start justify-start md:py-[430px] py-[350px] text-center px-5 sm:px-8 lg:px-24">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            to="/browse"
            className="w-full sm:w-auto inline-flex justify-center items-center border border-white text-white font-semibold px-8 sm:px-10 py-3 sm:py-3.5 hover:bg-white hover:text-main transition-all duration-200 text-[11px] sm:text-xs tracking-widest uppercase rounded-xl"
          >
            Browse Books
          </Link>
          <Link
            to="/list"
            className="w-full sm:w-auto inline-flex justify-center items-center border border-white bg-white text-main font-semibold px-8 sm:px-10 py-3 sm:py-3.5 hover:bg-white/85 transition-all duration-200 text-[11px] sm:text-xs tracking-widest uppercase rounded-xl"
          >
            List a Book
          </Link>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="relative flex items-center justify-center gap-2.5 pb-6 sm:pb-8">
        {desktopSlides.map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setSlideIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === slideIndex ? 'w-2.5 h-2.5 bg-white' : 'w-2 h-2 bg-white/40'
            }`}
          >
            <span className="sr-only">Go to slide {i + 1}</span>
          </button>
        ))}
      </div>
    </section>
  )
}