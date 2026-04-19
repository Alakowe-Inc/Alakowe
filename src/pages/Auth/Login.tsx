import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../../assets/media/logos/logo.png'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') ?? '/'

  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  function handleEmailSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    // send OTP logic goes here
    setStep('otp')
  }

  function handleOtpSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    // verify OTP logic goes here
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

          {step === 'email' ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 self-start mb-1">Sign in</h1>
              <p className="text-sm text-gray-500 self-start mb-6">Sign in or create an account</p>

              <div className="flex flex-col w-full mb-5 gap-y-3">
                {/* Google */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-3.5 rounded-full transition-colors text-sm shadow-sm"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                {/* Apple */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white font-semibold py-3.5 rounded-full transition-colors text-sm"
                >
                  <svg viewBox="0 0 814 1000" width="15" height="15" fill="white" aria-hidden="true">
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46 790.7 0 663.5 0 541.8c0-243 116-376.9 224.9-376.9 70.6 0 122.8 42.7 163.2 42.7 39 0 99.3-45 176.7-45 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                  </svg>
                  Continue with Apple
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 w-full mb-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-4">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-full px-4 py-3 text-[.9rem] text-gray-800 placeholder-gray-400 outline-none focus:border-secondary transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-3.5 rounded-full transition-colors text-sm"
                >
                  Continue
                </button>
                <p className="text-xs text-gray-400 text-center mt-1">
                  By continuing, you agree to our{' '}
                  <Link to="/terms" className="underline hover:text-gray-600 transition-colors">
                    Terms of service
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 self-start mb-1">Enter code</h1>
              <p className="text-sm text-gray-500 self-start mb-6">Sent to {email}</p>

              <form onSubmit={handleOtpSubmit} className="w-full flex flex-col gap-4">
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6-digit code"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full border border-gray-900 rounded-full px-4 py-3 text-[.9rem] tracking-widest font-bold placeholder:font-normal text-gray-800 placeholder-gray-400 outline-none focus:border-secondary transition-colors text-center"
                />
                <button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-3.5 rounded-full transition-colors text-sm"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('email'); setCode('') }}
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors text-left"
                >
                  Sign in with a different email
                </button>
              </form>
            </>
          )}
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
