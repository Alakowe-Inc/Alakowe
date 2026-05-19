import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
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
  const [loading, setLoading] = useState(false)

  async function handleEmailSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setLoading(true)
    // send OTP logic goes here
    await new Promise(r => setTimeout(r, 700))
    setLoading(false)
    setStep('otp')
  }

  async function handleOtpSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setLoading(true)
    // verify OTP logic goes here
    await new Promise(r => setTimeout(r, 700))
    login(email)
    navigate(redirect, { replace: true })
  }

  const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-white to-gray-50 flex flex-col">
      {/* Ambient floating gradients */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full opacity-60 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(99,102,241,0.18), transparent)' }}
          animate={{ x: [0, 40, -10, 0], y: [0, 30, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 h-[480px] w-[480px] rounded-full opacity-50 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(236,72,153,0.14), transparent)' }}
          animate={{ x: [0, -30, 20, 0], y: [0, 20, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/4 h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(56,189,248,0.16), transparent)' }}
          animate={{ x: [0, 20, -30, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.04)_1px,transparent_0)] [background-size:22px_22px]" />
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full max-w-md"
        >
          {/* Glass card */}
          <motion.div
            variants={item}
            className="relative rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15),0_2px_8px_-2px_rgba(15,23,42,0.06)] px-6 sm:px-9 py-9 sm:py-10"
          >
            <div className="flex flex-col items-center">
              <motion.div variants={item}>
                <Link to="/" className="mb-7 inline-block transition-transform hover:scale-105">
                  <img src={logo} alt="Alákòwé" className="h-8 w-auto object-contain" />
                </Link>
              </motion.div>

              <AnimatePresence mode="wait">
                {step === 'email' ? (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full"
                  >
                    <motion.h1 variants={item} className="text-2xl sm:text-[1.7rem] font-bold tracking-tight text-gray-900 mb-1">
                      Welcome back
                    </motion.h1>
                    <motion.p variants={item} className="text-sm text-gray-500 mb-7">
                      Sign in or create an account to continue
                    </motion.p>

                    <motion.div variants={item} className="flex flex-col w-full mb-5 gap-y-3">
                      {/* Google */}
                      <motion.button
                        type="button"
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.985 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="group relative w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3.5 rounded-full text-sm shadow-sm hover:shadow-md transition-all"
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                      </motion.button>

                      {/* Apple */}
                      <motion.button
                        type="button"
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.985 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white font-semibold py-3.5 rounded-full text-sm shadow-sm hover:shadow-lg hover:shadow-black/20 transition-all"
                      >
                        <svg viewBox="0 0 814 1000" width="15" height="15" fill="white" aria-hidden="true">
                          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46 790.7 0 663.5 0 541.8c0-243 116-376.9 224.9-376.9 70.6 0 122.8 42.7 163.2 42.7 39 0 99.3-45 176.7-45 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                        </svg>
                        Continue with Apple
                      </motion.button>
                    </motion.div>

                    <motion.div variants={item} className="flex items-center gap-3 w-full mb-5">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                      <span className="text-xs uppercase tracking-wider text-gray-400">or</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    </motion.div>

                    <motion.form variants={item} onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-4">
                      <div className="relative group">
                        <input
                          type="email"
                          required
                          placeholder="Email address"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="peer w-full border border-gray-200 bg-white/80 rounded-full px-5 py-3.5 text-[.9rem] text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5 hover:border-gray-300"
                        />
                      </div>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={!loading ? { y: -1 } : {}}
                        whileTap={!loading ? { scale: 0.985 } : {}}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="relative w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-full text-sm shadow-md hover:shadow-xl hover:shadow-gray-900/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                      >
                        <AnimatePresence mode="wait">
                          {loading ? (
                            <motion.span
                              key="l"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="inline-flex items-center gap-2"
                            >
                              <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                              Sending code…
                            </motion.span>
                          ) : (
                            <motion.span key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                              Continue
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                      <p className="text-xs text-gray-400 text-center mt-1">
                        By continuing, you agree to our{' '}
                        <Link to="/terms" className="underline underline-offset-2 hover:text-gray-700 transition-colors">
                          Terms of service
                        </Link>
                      </p>
                    </motion.form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full"
                  >
                    <h1 className="text-2xl sm:text-[1.7rem] font-bold tracking-tight text-gray-900 mb-1">Check your email</h1>
                    <p className="text-sm text-gray-500 mb-7">
                      We sent a 6-digit code to <span className="font-medium text-gray-700">{email}</span>
                    </p>

                    <form onSubmit={handleOtpSubmit} className="w-full flex flex-col gap-4">
                      <input
                        type="text"
                        required
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={code}
                        onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full border border-gray-900 bg-white rounded-full px-5 py-3.5 text-lg tracking-[0.5em] font-bold placeholder:font-normal placeholder:tracking-widest text-gray-900 placeholder-gray-300 outline-none focus:ring-4 focus:ring-gray-900/10 transition-all text-center"
                      />
                      <motion.button
                        type="submit"
                        disabled={loading || code.length < 6}
                        whileHover={!loading && code.length === 6 ? { y: -1 } : {}}
                        whileTap={!loading && code.length === 6 ? { scale: 0.985 } : {}}
                        className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-full text-sm shadow-md hover:shadow-xl hover:shadow-gray-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                            Verifying…
                          </span>
                        ) : 'Verify & sign in'}
                      </motion.button>
                      <button
                        type="button"
                        onClick={() => { setStep('email'); setCode('') }}
                        className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-center"
                      >
                        ← Use a different email
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Sign up CTA */}
          <motion.p variants={item} className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="relative font-semibold text-gray-900 group inline-block"
            >
              <span className="transition-colors group-hover:text-black">Sign up</span>
              <span className="absolute left-0 -bottom-0.5 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-gray-900 via-indigo-500 to-pink-500 transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          </motion.p>
        </motion.div>
      </div>

      <p className="relative text-sm text-gray-400 text-center py-4">
        <Link to="/privacy" className="hover:text-gray-700 transition-colors">
          Privacy policy
        </Link>
      </p>
    </div>
  )
}

export default Login
