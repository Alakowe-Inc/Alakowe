import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import logo from '../../assets/media/logos/logo.png'
import { useAuth } from '../../context/AuthContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

  const inputClass = "rounded-xl border-gray-200 h-auto py-3 text-[.9rem] text-gray-800 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-secondary"
  const submitClass = "w-full rounded-xl bg-secondary hover:bg-secondary/90 h-auto py-3.5 text-sm font-semibold"

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md flex flex-col items-center">
            <Link to="/" className="mb-8">
              <img src={logo} alt="Alakowé" className="h-8 w-auto object-contain" />
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 self-start mb-1">Verify your email</h1>
            <p className="text-sm text-gray-500 self-start mb-8">
              Enter the 6-digit code sent to {email}
            </p>

            <form onSubmit={handleVerifySubmit} className="w-full flex flex-col items-center gap-6">
              <InputOTP maxLength={6} value={code} onChange={setCode}>
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="h-14 w-12 text-lg font-bold border-gray-200 first:rounded-l-xl last:rounded-r-xl"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <Button type="submit" className={submitClass} disabled={code.length < 6}>
                Verify account
              </Button>
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
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md flex flex-col items-center">

          <Link to="/" className="mb-8">
            <img src={logo} alt="Alakowé" className="h-8 w-auto object-contain" />
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 self-start mb-1">Create an account</h1>
          <p className="text-sm text-gray-500 self-start mb-6">
            Join Alakowé and start buying & selling books
          </p>

          <form onSubmit={handleRegisterSubmit} className="w-full flex flex-col gap-4">
            <div className="flex gap-3">
              <Input
                type="text"
                required
                placeholder="First name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className={inputClass}
              />
              <Input
                type="text"
                required
                placeholder="Last name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className={inputClass}
              />
            </div>
            <Input
              type="text"
              placeholder="Nickname (optional)"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className={inputClass}
            />
            <Input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={inputClass}
            />
            <Input
              type="tel"
              required
              placeholder="Phone number"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className={inputClass}
            />
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`${inputClass} pr-11`}
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
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Button type="submit" className={submitClass}>
              Create account
            </Button>
          </form>

          <p className="text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-semibold hover:underline">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default SignUp
