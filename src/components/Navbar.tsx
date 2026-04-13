import { useState, useRef, useEffect } from 'react'
import { Search, User, ShoppingBag, Menu, X, Plus } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/media/logos/logo.jpg'
import { useCart } from '../context/CartContext'

const navLinks = [
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

const utilityLinks = [
  { label: 'Login', to: '/login' },
  { label: 'Customer Service', to: '/customer-service' },
  { label: 'Shipping & Returns', to: '/shipping' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const desktopSearchInputRef = useRef<HTMLInputElement>(null)
  const focusOnOpenRef = useRef(false)
  const { count } = useCart()

  useEffect(() => {
    if (menuOpen && focusOnOpenRef.current) {
      searchInputRef.current?.focus()
      focusOnOpenRef.current = false
    }
  }, [menuOpen])

  useEffect(() => {
    if (desktopSearchOpen) {
      desktopSearchInputRef.current?.focus()
    }
  }, [desktopSearchOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDesktopSearchOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <header className="w-full border-b border-third bg-fourth sticky top-0 z-50">

        {/* Main bar */}
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 h-16 flex items-center justify-between gap-4">

          {/* Mobile + tablet — hamburger */}
          <button
            className="lg:hidden text-main"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} />
          </button>

          {/* Desktop — nav links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className="text-xs uppercase tracking-widest font-medium text-main hover:text-secondary transition-colors whitespace-nowrap"
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Center — logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <img src={logo} alt="Alakowé" className="h-7 md:h-8 w-auto object-contain" />
          </Link>

          {/* Right — icons */}
          <div className="flex items-center gap-5 ml-auto">
            <button
              aria-label="Search"
              className="lg:hidden text-main hover:text-secondary transition-colors"
              onClick={() => { focusOnOpenRef.current = true; setMenuOpen(true) }}
            >
              <Search size={20} />
            </button>
            <button
              aria-label="Search"
              className="hidden lg:block text-main hover:text-secondary transition-colors"
              onClick={() => setDesktopSearchOpen(v => !v)}
            >
              <Search size={20} />
            </button>
            {/* Desktop only */}
            <Link to="/login" aria-label="Account" className="hidden lg:block text-main hover:text-secondary transition-colors">
              <User size={20} />
            </Link>
            {/* Cart */}
            <Link to="/cart" aria-label="Cart" className="relative flex items-center gap-1 text-main hover:text-secondary transition-colors">
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Desktop — search dropdown */}
      {desktopSearchOpen && (
        <div className="hidden lg:block sticky top-16 z-40 border-b border-third bg-fourth">
          <div className="max-w-8xl mx-auto px-12 h-14 flex items-center gap-3">
            <Search size={16} className="text-main/50 shrink-0" />
            <input
              ref={desktopSearchInputRef}
              type="text"
              placeholder="Search for books, authors, genres…"
              className="flex-1 text-sm text-main placeholder-main/40 outline-none bg-transparent font-body"
            />
            <button
              aria-label="Close search"
              onClick={() => setDesktopSearchOpen(false)}
              className="text-main/50 hover:text-main transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile — full screen overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-fourth flex flex-col">

          {/* Top bar */}
          <div className="flex items-center h-14 border-b border-third">
            <button
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="w-14 flex items-center justify-center text-main shrink-0"
            >
              <X size={22} />
            </button>
            <div className="border-l border-third h-full" />
            <div className="flex items-center gap-2 px-4 flex-1">
              <Search size={16} className="text-main/50 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search"
                className="flex-1 text-sm text-main placeholder-main/40 outline-none bg-transparent font-body"
              />
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-5 py-5 border-b border-third text-xs uppercase tracking-widest font-semibold text-main hover:text-secondary transition-colors"
              >
                {label}
                <Plus size={16} className="text-main/50 shrink-0" />
              </NavLink>
            ))}
          </nav>

          {/* Utility links */}
          <div className="mt-auto px-5 pb-10 flex flex-col gap-4">
            {utilityLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-main hover:text-secondary transition-colors"
              >
                {label}
              </NavLink>
            ))}
          </div>

        </div>
      )}
    </>
  )
}

export default Navbar
