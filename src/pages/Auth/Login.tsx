import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import logo from '../../assets/media/logos/logo.jpg'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    // auth logic goes here
  }

  return (
    <div className="min-h-screen bg-third flex">

      {/* Left — decorative panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-main flex-col justify-between p-12">
        <Link to="/">
          <img src={logo} alt="Alakowé" className="h-8 w-auto object-contain brightness-0 invert" />
        </Link>

        <div>
          <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Welcome back
          </p>
          <h2 className="font-heading font-bold text-white text-4xl xl:text-5xl leading-tight mb-6">
            Every book has<br />a new home<br />waiting.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm">
            Log in to browse listings, manage your cart, and connect with readers across Nigeria.
          </p>
        </div>

        <p className="text-white/25 text-xs">
          © {new Date().getFullYear()} Alakowé. All rights reserved.
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Mobile logo */}
        <Link to="/" className="mb-10 lg:hidden">
          <img src={logo} alt="Alakowé" className="h-8 w-auto object-contain" />
        </Link>

        <div className="w-full max-w-md">
          <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-2">
            Sign in
          </p>
          <h1 className="font-heading font-bold text-main text-3xl mb-8">
            Welcome back
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

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
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                  Password
                </label>
                <a href="#" className="text-xs text-main/50 hover:text-secondary transition-colors font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Your password"
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

            <button
              type="submit"
              className="w-full bg-main text-white font-semibold py-3.5 rounded-md hover:bg-main/90 transition-colors text-sm mt-1"
            >
              Sign In
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
            Don't have an account?{' '}
            <Link to="/register" className="text-main font-semibold hover:text-secondary transition-colors">
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login
