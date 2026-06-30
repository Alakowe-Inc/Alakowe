import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/media/logos/logo.png'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    // TODO: wire up reset email API call
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md flex flex-col items-center">

          <Link to="/" className="mb-8">
            <img src={logo} alt="Alakowé" className="h-8 w-auto object-contain" />
          </Link>

          {submitted ? (
            <div className="w-full text-center">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
              <p className="text-sm text-gray-500 mb-6">
                We sent a password reset link to <span className="font-medium text-gray-700">{email}</span>.
                Check your inbox and follow the instructions.
              </p>
              <Link to="/login" className="text-sm text-secondary font-semibold hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 self-start mb-1">Forgot password?</h1>
              <p className="text-sm text-gray-500 self-start mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <Input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="rounded-xl border-gray-200 h-auto py-3 text-[.9rem] text-gray-800 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-secondary"
                />
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-secondary hover:bg-secondary/90 h-auto py-3.5 text-sm font-semibold"
                >
                  Send reset link
                </Button>
              </form>

              <p className="text-sm text-gray-500 mt-8">
                Remember your password?{' '}
                <Link to="/login" className="text-secondary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
