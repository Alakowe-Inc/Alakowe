import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
} from 'lucide-react'
import logo from '../../assets/media/logos/logo.png'
import { useAuth } from '../../context/AuthContext'

/**
 * ALÁKÒWÉ — Premium Multi-Step Signup
 * Step 1: First name, Last name
 * Step 2: Nickname, Email, Phone number
 * Step 3: Password, Confirm password
 */
function Signup() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [direction, setDirection] = useState<1 | -1>(1)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [agree, setAgree] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const strength = useMemo(() => {
    let s = 0
    if (password.length >= 8) s++
    if (/[A-Z]/.test(password)) s++
    if (/\d/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    return s
  }, [password])

  const strengthLabel = ['Too short', 'Weak', 'Okay', 'Strong', 'Excellent'][strength]
  const strengthColor = [
    'bg-[#e7dfd0]',
    'bg-rose-400',
    'bg-amber-400',
    'bg-[#7a9774]',
    'bg-[#5b7a55]',
  ][strength]

  function validateStep(): string | null {
    if (step === 1) {
      if (!firstName.trim() || !lastName.trim()) return 'Please enter your first and last name.'
    }
    if (step === 2) {
      if (!nickname.trim()) return 'Choose a nickname so we can greet you warmly.'
      if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email address.'
      if (phone.trim().length < 7) return 'Please enter a valid phone number.'
    }
    if (step === 3) {
      if (password.length < 8) return 'Password must be at least 8 characters.'
      if (password !== confirm) return 'Passwords do not match.'
      if (!agree) return 'Please accept the Terms to continue.'
    }
    return null
  }

  function next() {
    const err = validateStep()
    if (err) return setError(err)
    setError(null)
    setDirection(1)
    setStep(s => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s))
  }

  function back() {
    setError(null)
    setDirection(-1)
    setStep(s => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    const err = validateStep()
    if (err) return setError(err)
    setLoading(true)
    try {
      // sign-up logic goes here
      await new Promise(r => setTimeout(r, 1000))
      login(email)
      navigate('/', { replace: true })
    } catch {
      setError('Unable to create your account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.08 },
    },
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  const stepVariants: Variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40, transition: { duration: 0.3, ease: 'easeIn' } }),
  }

  const inputBase =
    'peer w-full bg-white/70 border border-[#e7dfd0] rounded-2xl pl-12 pr-4 py-3.5 text-[.95rem] text-[#2b2418] placeholder-[#a89a82] outline-none transition-all duration-500 ease-out focus:border-[#5b7a55] focus:bg-white focus:ring-4 focus:ring-[#5b7a55]/10 hover:border-[#d8cdb7]'

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#faf6ee] text-[#2b2418] flex flex-col lg:flex-row-reverse">
      {/* ============ RIGHT (visual top on mobile) — Cinematic imagery ============ */}
      <div className="relative lg:w-1/2 h-64 sm:h-80 lg:h-auto overflow-hidden">
        <motion.img
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1600&q=80"
          alt="Stacked premium African literature — editorial luxury"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-bl from-[#1c150b]/85 via-[#2b1f10]/55 to-[#5b7a55]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1208]/80 via-transparent to-transparent" />

        <motion.div
          aria-hidden
          className="absolute -bottom-24 -left-24 h-[460px] w-[460px] rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(closest-side, rgba(212,175,108,0.55), transparent)' }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute top-0 right-0 h-[420px] w-[420px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(closest-side, rgba(91,122,85,0.55), transparent)' }}
          animate={{ x: [0, -40, 20, 0], y: [0, 30, -10, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex h-full flex-col justify-between p-8 sm:p-12 lg:p-16"
        >
          <motion.div variants={item} className="flex items-center gap-3">
            <img src={logo} alt="Alákòwé" className="h-10 w-auto drop-shadow-lg" />
            <span className="text-[#f6efdf] tracking-[0.35em] text-xs uppercase">Alákòwé</span>
          </motion.div>

          <div className="hidden lg:block">
            <motion.p
              variants={item}
              className="text-[#d4af6c] uppercase tracking-[0.4em] text-[11px] mb-4"
            >
              Join the Atelier
            </motion.p>
            <motion.h1
              variants={item}
              className="font-serif text-4xl xl:text-5xl leading-[1.1] text-[#faf6ee] max-w-md"
            >
              A library shaped around the stories you love.
            </motion.h1>
            <motion.p variants={item} className="mt-5 text-[#e7dfd0]/85 max-w-md leading-relaxed">
              Become part of a quiet, world-class community of readers, collectors and lovers of
              African literature.
            </motion.p>
          </div>

          <motion.div
            variants={item}
            className="hidden lg:flex items-center gap-4 text-[#e7dfd0]/70 text-xs tracking-widest uppercase"
          >
            <span className="h-px w-12 bg-[#d4af6c]/60" />
            Crafted for the Modern Reader
          </motion.div>
        </motion.div>
      </div>

      {/* ============ LEFT — Multi-step glass form ============ */}
      <div className="relative flex-1 flex items-center justify-center px-5 sm:px-10 py-10 lg:py-16">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(212,175,108,0.35), transparent)' }}
          animate={{ x: [0, 20, -20, 0], y: [0, 30, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(91,122,85,0.3), transparent)' }}
          animate={{ x: [0, -30, 10, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative w-full max-w-md"
        >
          <motion.div
            aria-hidden
            className="absolute -inset-[1px] rounded-[28px] opacity-70 blur-md"
            style={{
              background:
                'linear-gradient(135deg, rgba(212,175,108,0.55), rgba(91,122,85,0.4), rgba(212,175,108,0.55))',
              backgroundSize: '200% 200%',
            }}
            animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative rounded-[26px] bg-white/75 backdrop-blur-2xl border border-white/60 shadow-[0_30px_80px_-30px_rgba(60,40,15,0.35)] p-8 sm:p-10">
            <motion.div variants={item} className="lg:hidden mb-6 flex items-center gap-3">
              <img src={logo} alt="Alákòwé" className="h-8 w-auto" />
              <span className="tracking-[0.35em] text-[10px] uppercase text-[#7a6a4e]">Alákòwé</span>
            </motion.div>

            <motion.p variants={item} className="text-[#7a6a4e] uppercase tracking-[0.35em] text-[10px] mb-3">
              Create your account
            </motion.p>
            <motion.h2 variants={item} className="font-serif text-3xl sm:text-[2rem] leading-tight text-[#2b2418]">
              {step === 1 && 'Let’s start with your name'}
              {step === 2 && 'How can we reach you?'}
              {step === 3 && 'Secure your library'}
            </motion.h2>
            <motion.p variants={item} className="mt-2 text-sm text-[#6b5d45]">
              {step === 1 && 'A warm welcome begins with knowing you.'}
              {step === 2 && 'For order updates and curated recommendations.'}
              {step === 3 && 'Choose a strong password — your shelves deserve it.'}
            </motion.p>

            {/* Stepper */}
            <motion.div variants={item} className="mt-6 flex items-center gap-3">
              {[1, 2, 3].map(n => (
                <div key={n} className="flex-1 flex items-center gap-3">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-all duration-500 ${
                      step >= (n as 1 | 2 | 3)
                        ? 'bg-[#2b2418] text-[#faf6ee]'
                        : 'bg-[#efe7d4] text-[#a89a82]'
                    }`}
                  >
                    {step > (n as 1 | 2 | 3) ? <Check className="h-3.5 w-3.5" /> : n}
                  </div>
                  {n < 3 && (
                    <div className="flex-1 h-px bg-[#efe7d4] relative overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-[#5b7a55]"
                        initial={false}
                        animate={{ width: step > n ? '100%' : '0%' }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="relative min-h-[230px]">
                <AnimatePresence mode="wait" custom={direction}>
                  {step === 1 && (
                    <motion.div
                      key="step-1"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-5"
                    >
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a89a82]" />
                        <input
                          type="text"
                          autoComplete="given-name"
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          placeholder="First name"
                          className={inputBase}
                        />
                      </div>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a89a82]" />
                        <input
                          type="text"
                          autoComplete="family-name"
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          placeholder="Last name"
                          className={inputBase}
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step-2"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-5"
                    >
                      <div className="relative">
                        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a89a82]" />
                        <input
                          type="text"
                          autoComplete="nickname"
                          value={nickname}
                          onChange={e => setNickname(e.target.value)}
                          placeholder="Nickname"
                          className={inputBase}
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a89a82]" />
                        <input
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="Email address"
                          className={inputBase}
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a89a82]" />
                        <input
                          type="tel"
                          autoComplete="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="Phone number"
                          className={inputBase}
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step-3"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-5"
                    >
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a89a82]" />
                        <input
                          type={showPwd ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="Create password"
                          className={inputBase + ' pr-12'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd(v => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a89a82] hover:text-[#2b2418] transition-colors"
                          aria-label={showPwd ? 'Hide password' : 'Show password'}
                        >
                          {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* Strength meter */}
                      <div>
                        <div className="flex gap-1.5">
                          {[0, 1, 2, 3].map(i => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                                i < strength ? strengthColor : 'bg-[#efe7d4]'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-[#7a6a4e]">
                          Password strength: <span className="font-semibold">{strengthLabel}</span>
                        </p>
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a89a82]" />
                        <input
                          type={showPwd ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={confirm}
                          onChange={e => setConfirm(e.target.value)}
                          placeholder="Confirm password"
                          className={inputBase}
                        />
                      </div>

                      <label className="flex items-start gap-3 text-sm text-[#6b5d45] cursor-pointer select-none">
                        <span className="relative inline-flex mt-0.5">
                          <input
                            type="checkbox"
                            checked={agree}
                            onChange={e => setAgree(e.target.checked)}
                            className="peer sr-only"
                          />
                          <span className="h-4 w-4 rounded-md border border-[#d8cdb7] bg-white peer-checked:bg-[#5b7a55] peer-checked:border-[#5b7a55] transition-all" />
                        </span>
                        <span>
                          I agree to the{' '}
                          <Link to="/terms" className="text-[#5b7a55] hover:text-[#3f5a3a] font-medium">
                            Terms
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-[#5b7a55] hover:text-[#3f5a3a] font-medium">
                            Privacy Policy
                          </Link>
                          .
                        </span>
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5"
                >
                  {error}
                </motion.p>
              )}

              {/* Nav buttons */}
              <div className="mt-7 flex items-center gap-3">
                {step > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    type="button"
                    onClick={back}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e7dfd0] bg-white/70 px-5 py-3.5 text-sm font-medium text-[#2b2418] hover:bg-white transition-all duration-500"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </motion.button>
                )}

                {step < 3 ? (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    type="button"
                    onClick={next}
                    className="group relative flex-1 overflow-hidden rounded-full bg-[#2b2418] text-[#faf6ee] py-3.5 font-medium tracking-wide shadow-[0_18px_40px_-15px_rgba(43,36,24,0.7)] transition-all duration-500 ease-out hover:bg-[#3a3022]"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#d4af6c]/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                    <span className="relative inline-flex items-center justify-center gap-2">
                      Continue
                      <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                    </span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    disabled={loading}
                    className="group relative flex-1 overflow-hidden rounded-full bg-[#2b2418] text-[#faf6ee] py-3.5 font-medium tracking-wide shadow-[0_18px_40px_-15px_rgba(43,36,24,0.7)] transition-all duration-500 ease-out hover:bg-[#3a3022] disabled:opacity-70"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#d4af6c]/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                    <span className="relative inline-flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating your account…
                        </>
                      ) : (
                        <>
                          Create my account
                          <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </motion.button>
                )}
              </div>

              {/* ============ Social signup — temporarily disabled ============
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-[#e7dfd0]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="bg-white/75 px-3 text-[#a89a82]">or sign up with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="rounded-full border border-[#e7dfd0] bg-white/70 py-3 text-sm font-medium text-[#2b2418] hover:bg-white transition-all"
                >
                  Continue with Google
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[#e7dfd0] bg-white/70 py-3 text-sm font-medium text-[#2b2418] hover:bg-white transition-all"
                >
                  Continue with Apple
                </button>
              </div>
              ============================================================ */}

              <p className="mt-6 text-center text-sm text-[#6b5d45]">
                Already part of Alákòwé?{' '}
                <Link to="/login" className="text-[#5b7a55] font-semibold hover:text-[#3f5a3a] transition-colors">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Signup
