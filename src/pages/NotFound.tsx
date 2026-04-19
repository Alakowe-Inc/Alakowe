import { Link } from 'react-router-dom'
import heroImage from '../assets/media/images/Books with Elegant Bookend.png'

function NotFound() {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src={heroImage}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-main/60" />

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center text-center px-5 sm:px-8">
        <p className="text-white/70 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] sm:tracking-[0.35em] mb-4">
          Error 404
        </p>

        <h1 className="font-heading font-bold text-white uppercase leading-none mb-4 text-6xl sm:text-8xl md:text-9xl">
          404
        </h1>

        <p className="text-white/65 text-xs sm:text-sm md:text-base leading-relaxed mb-3 max-w-xs sm:max-w-sm md:max-w-md">
          Looks like this page got lost on the shelf.
        </p>

        <p className="text-white/50 text-[11px] sm:text-xs leading-relaxed mb-8 sm:mb-10 max-w-xs sm:max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex justify-center items-center border border-white bg-white text-main font-semibold px-8 sm:px-10 py-3 sm:py-3.5 hover:bg-white/85 transition-all duration-200 text-[11px] sm:text-xs tracking-widest uppercase rounded-full"
          >
            Go Home
          </Link>
          <Link
            to="/browse"
            className="w-full sm:w-auto inline-flex justify-center items-center border border-white text-white font-semibold px-8 sm:px-10 py-3 sm:py-3.5 hover:bg-white hover:text-main transition-all duration-200 text-[11px] sm:text-xs tracking-widest uppercase rounded-full"
          >
            Browse Books
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
