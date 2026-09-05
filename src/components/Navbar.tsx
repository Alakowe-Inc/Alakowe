import { useState, useRef, useEffect } from 'react'
import { Search, ShoppingCart, Menu, X } from 'lucide-react'
import { UserIcon } from '@heroicons/react/24/outline'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import logoWhite from '../assets/media/logos/logo white.png'
import logoColor from '../assets/media/logos/logo.png'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useSellerStoreProfile } from '../lib/api/store/store.hooks'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetClose, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { FormControl } from '@/components/ui/form-controls'

const navLinks = [
  { label: 'Browse Books', to: '/browse' },
  { label: 'List Books', to: '/list' },
  { label: 'Requests', to: '/request-book' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Contact Us', to: '/contact' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const desktopSearchInputRef = useRef<HTMLInputElement>(null)
  const focusOnOpenRef = useRef(false)
  const { count } = useCart()
  const { user, logout } = useAuth()
  const { data: storeProfile } = useSellerStoreProfile(!!user)
  const navigate = useNavigate()
  const location = useLocation()

  const isHomePage = location.pathname === '/'

  function handleLogout() {
    logout()
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
      if (e.key === 'Escape') setDesktopSearchOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <header
        className={
          isHomePage
            ? 'absolute top-0 left-0 right-0 z-50 bg-transparent text-white'
            : 'sticky top-0 left-0 right-0 z-50 bg-secondary text-white shadow-sm'
        }
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 h-20 flex items-center justify-between gap-4">

          {/* Mobile + tablet — hamburger */}
          <button
            className="lg:hidden text-white"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} />
          </button>

          {/* Left / Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={logoWhite}
              alt="Alákòwé"
              className="h-7 md:h-8 w-auto object-contain"
            />
          </Link>

          {/* Center/Right — Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 ml-auto mr-6">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-xs font-semibold transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-white/80 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right — Search + Login / Sign up action buttons */}
          <div className="flex items-center gap-4 shrink-0">
           

            {user ? (
              <div className="hidden lg:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-label="Account"
                      className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold uppercase hover:bg-white/30 transition-colors outline-none border border-white/30"
                    >
                      {user.email[0]}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 rounded-2xl p-0 overflow-hidden border-third shadow-xl"
                  >
                    <DropdownMenuLabel className="px-4 py-3.5 flex items-center gap-3 border-b border-third font-normal">
                      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-white text-sm font-bold uppercase shrink-0">
                        {user.email[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-main truncate">{storeProfile?.username || storeProfile?.userName || user.email.split('@')[0]}</p>
                        <p className="text-xs text-main/40 truncate">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <div className="py-1">
                      {[
                        { to: '/my-purchases', label: 'Purchases' },
                        { to: '/my-listings', label: 'Listings' },
                        { to: '/my-sales', label: 'Sales' },
                        { to: '/my-earnings', label: 'Earnings' },
                        { to: '/my-requests', label: 'My Requests' },
                        { to: '/account', label: 'Profile' },
                      ].map(({ to, label }) => (
                        <DropdownMenuItem key={to} asChild className="px-4 py-2.5 text-sm text-main cursor-pointer rounded-none">
                          <Link to={to}>{label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                    <DropdownMenuSeparator className="bg-third" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="px-4 py-3 text-sm text-red-600 font-semibold cursor-pointer rounded-none"
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/login"
                  className="border border-white/60 hover:bg-white/10 text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-white hover:bg-white/90 text-[#2c305c] text-xs font-bold px-5 py-2 rounded-xl transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative flex items-center gap-1 text-white hover:text-white/80 transition-colors"
            >
              <ShoppingCart size={20} />
              {count > 0 && (
                <span
                  className="absolute -top-2 -right-2 bg-white text-[#2c305c] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                >
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
            <div className="flex-1">
              <FormControl
                ref={desktopSearchInputRef}
                type="text"
                placeholder="Search for books, authors, genres…"
                style="min-h-0 text-sm text-main placeholder:text-main/40 outline-none bg-transparent border-0 rounded-none focus-visible:ring-0 font-body"
              />
            </div>
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

      {/* Mobile menu — Sheet */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="left"
          className="w-full sm:max-w-full p-0 bg-fourth border-0 flex flex-col [&>button:last-of-type]:hidden"
        >
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>

          {/* Top bar */}
          <div className="flex items-center justify-between px-5 h-16 shrink-0">
            <SheetClose asChild>
              <button aria-label="Close menu" className="text-main">
                <X size={20} />
              </button>
            </SheetClose>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <img src={logoWhite} alt="Alákòwé" className="h-5 w-auto object-contain" />
            </Link>
            <div className="w-5" />
          </div>

          {/* Search */}
          <div className="px-5 pb-4 shrink-0">
            <div className="flex items-center gap-2 border-b border-main/15 pb-2">
              <Search size={14} className="text-main/35 shrink-0" />
              <div className="flex-1">
                <FormControl
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search books, authors…"
                  style="min-h-0 text-[15px] text-main placeholder:text-main/30 outline-none bg-transparent border-0 rounded-none focus-visible:ring-0 font-body"
                />
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5">

            {/* Nav links */}
            <nav className="flex flex-col py-4 border-b border-main/8">
              {navLinks.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-xs uppercase tracking-widest font-medium text-main hover:text-secondary transition-colors"
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Account links */}
            <div className="py-4 border-b border-main/8 flex flex-col">
              {user ? (
                <>
                  <p className="text-xs text-main/30 font-medium mb-2 truncate">{user.email}</p>
                  {[
                    { to: '/account', label: 'My Profile' },
                    { to: '/my-purchases', label: 'My Purchases' },
                    { to: '/my-listings', label: 'My Listings' },
                    { to: '/my-sales', label: 'My Sales' },
                    { to: '/my-earnings', label: 'My Earnings' },
                    { to: '/my-requests', label: 'My Requests' },
                  ].map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className="py-3 text-xs uppercase tracking-widest font-medium text-main hover:text-secondary transition-colors"
                    >
                      {label}
                    </NavLink>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="py-3 text-xs uppercase tracking-widest font-medium text-main hover:text-secondary transition-colors text-left"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-xs uppercase tracking-widest font-medium text-main hover:text-secondary transition-colors"
                >
                  Login
                </NavLink>
              )}
            </div>

            {/* Utility */}
            <div className="py-4 flex flex-col pb-[max(2.5rem,env(safe-area-inset-bottom))]">
              {[
                { to: '/customer-service', label: 'Customer Service' },
                { to: '/shipping', label: 'Shipping & Returns' },
              ].map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 text-sm text-main/40 hover:text-secondary transition-colors"
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Navbar
