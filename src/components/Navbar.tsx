import { useState } from 'react'
import { Search, User, Heart, ShoppingBag, Menu, X, Plus } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/media/logos/logo.jpg'

const navLinks = [
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

const utilityLinks = [
  { label: 'Login', to: '/login' },
  { label: 'Your Wishlist', to: '/wishlist' },
  { label: 'Customer Service', to: '/customer-service' },
  { label: 'Shipping & Returns', to: '/shipping' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

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
            <button aria-label="Search" className="text-main hover:text-secondary transition-colors">
              <Search size={20} />
            </button>
            {/* Desktop only */}
            <button aria-label="Account" className="hidden lg:block text-main hover:text-secondary transition-colors">
              <User size={20} />
            </button>
            <button aria-label="Wishlist" className="hidden lg:block text-main hover:text-secondary transition-colors">
              <Heart size={20} />
            </button>
            {/* Cart — mobile shows count, desktop just icon */}
            <button aria-label="Cart" className="flex items-center gap-1 text-main hover:text-secondary transition-colors">
              <ShoppingBag size={20} />
            </button>
          </div>
        </div>
      </header>

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
