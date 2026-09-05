import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import logo from '../../assets/media/logos/logo.png'
import { useAuth } from '../../context/AuthContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function Login() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate(redirect, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md flex flex-col items-center">

          <Link to="/" className="mb-8">
            <img src={logo} alt="Alakowé" className="h-8 w-auto object-contain" />
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 self-start mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 self-start mb-6">Welcome back</p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <Input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded-xl border-gray-200 h-auto py-3 text-[.9rem] text-gray-800 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-secondary"
            />
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="rounded-xl border-gray-200 h-auto py-3 pr-11 text-[.9rem] text-gray-800 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-secondary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex justify-end -mt-2">
              <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-secondary transition-colors">
                Forgot password?
              </Link>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-secondary hover:bg-secondary/90 h-auto py-3.5 text-sm font-semibold"
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
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
    </div>
  )
}

export default Login
