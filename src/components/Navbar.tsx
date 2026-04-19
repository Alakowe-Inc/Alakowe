import { useState, useRef, useEffect } from 'react'
import { Search, User, ShoppingBag, Menu, X, ArrowRight, LogOut, Settings, BookOpen, Wallet, Bell } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/media/logos/logo.png'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Sell', to: '/sell' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const desktopSearchInputRef = useRef<HTMLInputElement>(null)
  const accountDropdownRef = useRef<HTMLDivElement>(null)
  const focusOnOpenRef = useRef(false)
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    setAccountOpen(false)
    setMenuOpen(false)
    navigate('/')
  }

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
      if (e.key === 'Escape') { setDesktopSearchOpen(false); setAccountOpen(false) }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target as Node)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
            <img src={logo} alt="Alakowé" className="h-5 md:h-6 w-auto object-contain" />
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
            {/* Desktop only — account */}
            <div ref={accountDropdownRef} className="hidden lg:block relative">
              {user ? (
                <>
                  <button
                    onClick={() => setAccountOpen(v => !v)}
                    aria-label="Account"
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold uppercase hover:bg-secondary/85 transition-colors"
                  >
                    {user.email[0]}
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-third rounded-2xl shadow-xl overflow-hidden z-50">
                      {/* Header */}
                      <div className="px-4 py-3 bg-third/50">
                        <p className="text-[11px] text-main/40 font-medium uppercase tracking-wide mb-0.5">Signed in as</p>
                        <p className="text-sm font-semibold text-main truncate">{user.email}</p>
                      </div>
                      {/* Account links */}
                      <div className="py-1">
                        <Link
                          to="/account"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-main hover:bg-third transition-colors"
                        >
                          <Settings size={15} className="text-main/40 shrink-0" /> My Profile
                        </Link>
                        <Link
                          to="/my-listings"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-main hover:bg-third transition-colors"
                        >
                          <BookOpen size={15} className="text-main/40 shrink-0" /> My Listings
                        </Link>
                        <Link
                          to="/my-earnings"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-main hover:bg-third transition-colors"
                        >
                          <Wallet size={15} className="text-main/40 shrink-0" /> My Earnings
                        </Link>
                        <Link
                          to="/my-requests"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-main hover:bg-third transition-colors"
                        >
                          <Bell size={15} className="text-main/40 shrink-0" /> My Requests
                        </Link>
                      </div>
                      {/* Sign out — separated */}
                      <div className="border-t border-third py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-main hover:bg-third transition-colors text-left"
                        >
                          <LogOut size={15} className="text-main/40 shrink-0" /> Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" aria-label="Account" className="text-main hover:text-secondary transition-colors">
                  <User size={20} />
                </Link>
              )}
            </div>
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
                <ArrowRight size={16} className="text-main/50 shrink-0" />
              </NavLink>
            ))}
          </nav>

          {/* Account / utility section */}
          <div className="mt-auto border-t border-third">
            {user ? (
              <>
                <div className="px-5 py-3.5 bg-third/50">
                  <p className="text-[11px] text-main/40 font-medium uppercase tracking-wide mb-0.5">Signed in as</p>
                  <p className="text-sm font-semibold text-main truncate">{user.email}</p>
                </div>
                <NavLink
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 border-b border-third text-sm text-main hover:text-secondary transition-colors"
                >
                  <Settings size={16} className="text-main/40 shrink-0" /> My Profile
                </NavLink>
                <NavLink
                  to="/my-listings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 border-b border-third text-sm text-main hover:text-secondary transition-colors"
                >
                  <BookOpen size={16} className="text-main/40 shrink-0" /> My Listings
                </NavLink>
                <NavLink
                  to="/my-earnings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 border-b border-third text-sm text-main hover:text-secondary transition-colors"
                >
                  <Wallet size={16} className="text-main/40 shrink-0" /> My Earnings
                </NavLink>
                <NavLink
                  to="/my-requests"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 border-b border-third text-sm text-main hover:text-secondary transition-colors"
                >
                  <Bell size={16} className="text-main/40 shrink-0" /> My Requests
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-4 border-b border-third text-sm text-main hover:text-secondary transition-colors text-left"
                >
                  <LogOut size={16} className="text-main/40 shrink-0" /> Sign out
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-4 border-b border-third text-sm text-main hover:text-secondary transition-colors"
              >
                <User size={16} className="text-main/40 shrink-0" /> Login
              </NavLink>
            )}
            <div className="px-5 pt-4 pb-10 flex flex-col gap-3">
              <NavLink
                to="/customer-service"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-main/50 hover:text-secondary transition-colors"
              >
                Customer Service
              </NavLink>
              <NavLink
                to="/shipping"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-main/50 hover:text-secondary transition-colors"
              >
                Shipping & Returns
              </NavLink>
            </div>
          </div>

        </div>
      )}
    </>
  )
}

export default Navbar
