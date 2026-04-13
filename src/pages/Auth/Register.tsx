import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Check, ShoppingBag, BookOpen } from 'lucide-react'
import logo from '../../assets/media/logos/logo.jpg'

type Role = 'buyer' | 'seller'

const roleConfig = {
  buyer: {
    label: 'Mostly buying',
    description: 'Start by browsing books',
    icon: ShoppingBag,
    perks: [
      'Browse and buy used books across Nigeria',
      'List your own books whenever you\'re ready',
      'Save books to your wishlist',
      'Track orders and manage listings in one place',
    ],
    headline: 'Find your next\nfavourite book\nfor less.',
    eyebrow: 'Welcome to Alakowé',
  },
  seller: {
    label: 'Mostly selling',
    description: 'Start by listing your books',
    icon: BookOpen,
    perks: [
      'List your books and reach buyers nationwide',
      'Buy books from other sellers too',
      'Get paid directly by buyers',
      'Manage all your listings and orders easily',
    ],
    headline: 'Turn your shelf\ninto someone\nelse\'s story.',
    eyebrow: 'Welcome to Alakowé',
  },
}

function Register() {
  const [role, setRole] = useState<Role>('buyer')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword
  const config = roleConfig[role]

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    // auth logic goes here
  }

  return (
    <div className="h-screen overflow-hidden bg-third flex">

      {/* Left — decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-main flex-col justify-between p-12">
        <Link to="/">
          <img src={logo} alt="Alakowé" className="h-8 w-auto object-contain brightness-0 invert" />
        </Link>

        <div>
          <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            {config.eyebrow}
          </p>
          <h2 className="font-heading font-bold text-white text-4xl xl:text-5xl leading-tight mb-8 whitespace-pre-line">
            {config.headline}
          </h2>

          <ul className="flex flex-col gap-4">
            {config.perks.map(perk => (
              <li key={perk} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} className="text-secondary" />
                </span>
                <span className="text-white/65 text-sm">{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-white/25 text-xs">
          © {new Date().getFullYear()} Alakowé. All rights reserved.
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center px-6 py-12">

        {/* Mobile logo */}
        <Link to="/" className="mb-10 lg:hidden">
          <img src={logo} alt="Alakowé" className="h-8 w-auto object-contain" />
        </Link>

        <div className="w-full max-w-md">
          <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-2">
            Get started
          </p>
          <h1 className="font-heading font-bold text-main text-3xl mb-7">
            Create your account
          </h1>

          {/* Role selector */}
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-1">
              What will you mostly do?
            </p>
            <p className="text-xs text-main/45 mb-3">All accounts can buy and sell — this just personalises your start.</p>
            <div className="grid grid-cols-2 gap-3">
              {(['buyer', 'seller'] as Role[]).map(r => {
                const Icon = roleConfig[r].icon
                const active = role === r
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all text-left ${active
                      ? 'border-main bg-main/5'
                      : 'border-third bg-white hover:border-main/30'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center ${active ? 'bg-main text-white' : 'bg-main/8 text-main/50'}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${active ? 'text-main' : 'text-main/60'}`}>
                        {roleConfig[r].label}
                      </p>
                      <p className="text-xs text-main/40 mt-0.5 leading-snug">
                        {roleConfig[r].description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-2 block">
                  First name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ada"
                  value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  className="w-full bg-white border border-third rounded-md px-4 py-3 text-sm text-main placeholder-main/40 outline-none focus:border-secondary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-2 block">
                  Last name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Okonkwo"
                  value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  className="w-full bg-white border border-third rounded-md px-4 py-3 text-sm text-main placeholder-main/40 outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-2 block">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-white border border-third rounded-md px-4 py-3 text-sm text-main placeholder-main/40 outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-2 block">
                Your location
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ikeja, Lagos"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full bg-white border border-third rounded-md px-4 py-3 text-sm text-main placeholder-main/40 outline-none focus:border-secondary transition-colors"
              />
              <p className="text-xs text-main/40 mt-1.5">
                Helps match you with books and buyers near you.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full bg-white border border-third rounded-md px-4 py-3 pr-11 text-sm text-main placeholder-main/40 outline-none focus:border-secondary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-main/35 hover:text-main/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-2 block">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  className={`w-full bg-white border rounded-md px-4 py-3 pr-11 text-sm text-main placeholder-main/40 outline-none transition-colors ${form.confirmPassword.length > 0
                    ? passwordsMatch
                      ? 'border-green-400 focus:border-green-500'
                      : 'border-red-300 focus:border-red-400'
                    : 'border-third focus:border-secondary'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-main/35 hover:text-main/60 transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-red-400 mt-1.5">Passwords don't match</p>
              )}
            </div>

            <p className="text-xs text-main/45 leading-relaxed -mt-1">
              By creating an account you agree to our{' '}
              <a href="#" className="text-main/70 underline underline-offset-2 hover:text-secondary transition-colors">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-main/70 underline underline-offset-2 hover:text-secondary transition-colors">Privacy Policy</a>.
            </p>

            <button
              type="submit"
              disabled={form.confirmPassword.length > 0 && !passwordsMatch}
              className="w-full bg-main text-white font-semibold py-3.5 rounded-md hover:bg-main/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-third" />
            <span className="text-xs text-main/35 font-medium">or</span>
            <div className="flex-1 h-px bg-third" />
          </div>

          {/* Google OAuth placeholder */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border border-third rounded-md py-3 text-sm font-semibold text-main hover:bg-third transition-colors"
          >
            <svg viewBox="0 0 24 24" width="17" height="17">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-main/50 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-main font-semibold hover:text-secondary transition-colors">
              Sign in
            </Link>
          </p>

        </div>
      </div>
      </div>
    </div>
  )
}

export default Register
