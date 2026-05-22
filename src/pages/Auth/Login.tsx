import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../../assets/media/logos/logo.png'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    login(email)
    navigate(redirect, { replace: true })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md flex flex-col items-center">

          {/* Logo */}
          <Link to="/" className="mb-8">
            <img src={logo} alt="Alakowé" className="h-8 w-auto object-contain" />
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 self-start mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 self-start mb-6">Welcome back</p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-full px-4 py-3 text-[.9rem] text-gray-800 placeholder-gray-400 outline-none focus:border-secondary transition-colors"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-full px-4 py-3 text-[.9rem] text-gray-800 placeholder-gray-400 outline-none focus:border-secondary transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-3.5 rounded-full transition-colors text-sm"
            >
              Sign in
            </button>
            <p className="text-xs text-gray-400 text-center mt-1">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="underline hover:text-gray-600 transition-colors">
                Terms of service
              </Link>
            </p>
          </form>

          <p className="text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-secondary font-semibold hover:underline">
              Sign up
            </Link>
          </p>

        </div>
      </div>

      {/* Privacy policy footer */}
      <p className="text-sm text-gray-500 text-center py-4">
        <Link to="/privacy" className="hover:text-gray-700 transition-colors">
          Privacy policy
        </Link>
      </p>

    </div>
  )
}

export default Login
