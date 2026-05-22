import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/media/logos/logo.png'
import { useAuth } from '../../context/AuthContext'

function SignUp() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<'register' | 'verify'>('register')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')

  function handleRegisterSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    // submit registration — backend sends verification code
    setStep('verify')
  }

  function handleVerifySubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    // verify code and confirm account
    login(email)
    navigate('/', { replace: true })
  }

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md flex flex-col items-center">
            <Link to="/" className="mb-8">
              <img src={logo} alt="Alakowé" className="h-8 w-auto object-contain" />
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 self-start mb-1">Verify your email</h1>
            <p className="text-sm text-gray-500 self-start mb-6">
              Enter the 6-digit code sent to {email}
            </p>

            <form onSubmit={handleVerifySubmit} className="w-full flex flex-col gap-4">
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
                Verify account
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-500 text-center py-4">
          <Link to="/privacy" className="hover:text-gray-700 transition-colors">
            Privacy policy
          </Link>
        </p>
      </div>
    )
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

          <h1 className="text-2xl font-bold text-gray-900 self-start mb-1">Create an account</h1>
          <p className="text-sm text-gray-500 self-start mb-6">
            Join Alakowé and start buying & selling books
          </p>

          <form onSubmit={handleRegisterSubmit} className="w-full flex flex-col gap-4">
            <div className="flex gap-3">
              <input
                type="text"
                required
                placeholder="First name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="flex-1 w-full border border-gray-200 rounded-full px-4 py-3 text-[.9rem] text-gray-800 placeholder-gray-400 outline-none focus:border-secondary transition-colors"
              />
              <input
                type="text"
                required
                placeholder="Last name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="flex-1 w-full border border-gray-200 rounded-full px-4 py-3 text-[.9rem] text-gray-800 placeholder-gray-400 outline-none focus:border-secondary transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="Nickname (optional)"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="w-full border border-gray-200 rounded-full px-4 py-3 text-[.9rem] text-gray-800 placeholder-gray-400 outline-none focus:border-secondary transition-colors"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-full px-4 py-3 text-[.9rem] text-gray-800 placeholder-gray-400 outline-none focus:border-secondary transition-colors"
            />
            <input
              type="tel"
              required
              placeholder="Phone number"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
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
            <input
              type="password"
              required
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-full px-4 py-3 text-[.9rem] text-gray-800 placeholder-gray-400 outline-none focus:border-secondary transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-3.5 rounded-full transition-colors text-sm"
            >
              Create account
            </button>
            <p className="text-xs text-gray-400 text-center mt-1">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="underline hover:text-gray-600 transition-colors">
                Terms of service
              </Link>
            </p>
          </form>

          <p className="text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-semibold hover:underline">
              Sign in
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

export default SignUp
