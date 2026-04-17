import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  BookOpen,
  Package,
  Wallet,
  CreditCard,
  User,
  Lock,
  Trash2,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import logoWhite from '../assets/media/logos/logo white.png'
import logo from '../assets/media/logos/logo.png'

const sellerNav = [
  { to: '/dashboard/seller', label: 'Overview', Icon: LayoutGrid, end: true },
  { to: '/dashboard/seller/listings', label: 'My Listings', Icon: BookOpen },
  { to: '/dashboard/seller/orders', label: 'Orders', Icon: Package },
  { to: '/dashboard/seller/earnings', label: 'Earnings', Icon: Wallet },
  { to: '/dashboard/seller/payment', label: 'Payment Info', Icon: CreditCard },
]

const buyerNav = [
  { to: '/dashboard/buyer', label: 'My Orders', Icon: Package, end: true },
]

const accountNav = [
  { to: '/dashboard/account', label: 'Profile', Icon: User, end: true },
  { to: '/dashboard/account/password', label: 'Change Password', Icon: Lock },
  { to: '/dashboard/account/delete', label: 'Delete Account', Icon: Trash2, danger: true },
]

type NavItem = {
  to: string
  label: string
  Icon: React.ElementType
  end?: boolean
  danger?: boolean
}

function SidebarLink({ to, label, Icon, end, danger }: NavItem) {
  return (
    <NavLink to={to} end={end}>
      {({ isActive }) => (
        <div
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
            isActive
              ? 'bg-white/10 text-white'
              : danger
              ? 'text-red-400/60 hover:text-red-400 hover:bg-white/5'
              : 'text-white/50 hover:text-white hover:bg-white/6'
          }`}
        >
          {/* Left accent indicator */}
          <span
            className={`w-0.75 h-3.75 rounded-full shrink-0 transition-colors ${
              isActive ? 'bg-secondary' : 'bg-transparent'
            }`}
          />
          <Icon
            size={15}
            className={`shrink-0 transition-colors ${
              isActive ? 'text-secondary' : ''
            }`}
          />
          <span className="flex-1">{label}</span>
          {isActive && (
            <ChevronRight size={13} className="text-white/30 shrink-0" />
          )}
        </div>
      )}
    </NavLink>
  )
}

function NavSection({ label, items }: { label: string; items: NavItem[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 px-3 mb-1.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">{label}</p>
        <div className="flex-1 h-px bg-white/6" />
      </div>
      <div className="flex flex-col gap-0.5">
        {items.map(item => (
          <SidebarLink key={item.to} {...item} />
        ))}
      </div>
    </div>
  )
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate()

  return (
    <aside className="w-64 bg-main flex flex-col border-r border-white/5" style={{ minHeight: '100%' }}>
      {/* Logo row */}
      <div className="flex items-center justify-between px-5 py-5 shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoWhite}
            alt="Alakowé"
            className="h-6 w-auto object-contain"
          />
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/[0.07] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/12 transition-all lg:hidden"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-2 pb-4 flex flex-col gap-5 overflow-y-auto">
        <NavSection label="Seller" items={sellerNav} />
        <NavSection label="Buyer" items={buyerNav} />
        <NavSection label="Account" items={accountNav} />
      </nav>

      {/* User info */}
      <div className="px-4 py-4 border-t border-white/[0.07] shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer mb-2">
          <div className="w-8 h-8 rounded-full bg-secondary/25 border border-secondary/30 flex items-center justify-center shrink-0">
            <span className="text-secondary text-xs font-bold">C</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold leading-tight truncate">Chidi O.</p>
            <p className="text-white/30 text-[11px] truncate">chidi@email.com</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center gap-2.5 text-white/30 hover:text-white/60 text-xs transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  )
}

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f0eff6] flex">
      {/* Desktop sidebar — sticky */}
      <div className="hidden lg:flex lg:w-64 shrink-0">
        <div className="fixed top-0 left-0 w-64 h-screen overflow-hidden">
          <Sidebar />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-main/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 h-full">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden bg-white/80 backdrop-blur-md border-b border-third px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 rounded-lg border border-third flex items-center justify-center text-main/50 hover:text-main hover:border-main/20 transition-all"
          >
            <Menu size={17} />
          </button>
          <Link to="/">
            <img src={logo} alt="Alakowé" className="h-5 w-auto object-contain" />
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
