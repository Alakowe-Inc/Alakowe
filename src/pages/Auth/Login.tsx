import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import logo from '../../assets/media/logos/logo.png'
import { useAuth } from '../../context/AuthContext'

/**
 * ALÁKÒWÉ — Premium Login
 * Luxury split-screen authentication experience.
 * Warm earthy luxury palette: cream / beige / soft green accents.
 */
function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setError(null)
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      // sign-in logic goes here
      await new Promise(r => setTimeout(r, 900))
      login(email)
      navigate(redirect, { replace: true })
    } catch {
      setError('Unable to sign in. Please try again.')
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

  const inputBase =
    'peer w-full bg-white/70 border border-[#e7dfd0] rounded-2xl pl-12 pr-12 py-3.5 text-[.95rem] text-[#2b2418] placeholder-[#a89a82] outline-none transition-all duration-500 ease-out focus:border-[#5b7a55] focus:bg-white focus:ring-4 focus:ring-[#5b7a55]/10 hover:border-[#d8cdb7]'

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#faf6ee] text-[#2b2418] flex flex-col lg:flex-row">
      {/* ============ LEFT — Cinematic luxury imagery ============ */}
      <div className="relative lg:w-1/2 h-64 sm:h-80 lg:h-auto overflow-hidden">
        <motion.img
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80"
          alt="Premium African library — cinematic editorial books"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Warm earthy gradient veil */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c150b]/85 via-[#2b1f10]/55 to-[#5b7a55]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1208]/80 via-transparent to-transparent" />

        {/* Floating ambient gradients */}
        <motion.div
          aria-hidden
          className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(closest-side, rgba(212,175,108,0.55), transparent)' }}
          animate={{ x: [0, 40, -20, 0], y: [0, 30, 10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-0 right-0 h-[480px] w-[480px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(closest-side, rgba(91,122,85,0.55), transparent)' }}
          animate={{ x: [0, -30, 20, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Editorial overlay copy */}
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
              The Reader's Atelier
            </motion.p>
            <motion.h1
              variants={item}
              className="font-serif text-4xl xl:text-5xl leading-[1.1] text-[#faf6ee] max-w-md"
            >
              Where every story finds its rightful reader.
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-5 text-[#e7dfd0]/85 max-w-md leading-relaxed"
            >
              Step back into your curated library of rare editions, signed copies and
              celebrated African voices.
            </motion.p>
          </div>

          <motion.div
            variants={item}
            className="hidden lg:flex items-center gap-4 text-[#e7dfd0]/70 text-xs tracking-widest uppercase"
          >
            <span className="h-px w-12 bg-[#d4af6c]/60" />
            Est. Lagos · Curated Worldwide
          </motion.div>
        </motion.div>
      </div>

      {/* ============ RIGHT — Glassmorphism card ============ */}
      <div className="relative flex-1 flex items-center justify-center px-5 sm:px-10 py-10 lg:py-16">
        {/* Ambient warm gradients */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(212,175,108,0.35), transparent)' }}
          animate={{ x: [0, 20, -20, 0], y: [0, 30, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-[380px] w-[380px] rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(91,122,85,0.3), transparent)' }}
          animate={{ x: [0, 30, -10, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative w-full max-w-md"
        >
          {/* Animated border glow */}
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
              Welcome back
            </motion.p>
            <motion.h2 variants={item} className="font-serif text-3xl sm:text-[2rem] leading-tight text-[#2b2418]">
              Sign in to your library
            </motion.h2>
            <motion.p variants={item} className="mt-2 text-sm text-[#6b5d45]">
              Continue your reading journey with Alákòwé.
            </motion.p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Email */}
              <motion.div variants={item} className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a89a82] peer-focus:text-[#5b7a55]" />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputBase}
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={item} className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a89a82] peer-focus:text-[#5b7a55]" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  className={inputBase}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a89a82] hover:text-[#2b2418] transition-colors"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </motion.div>

              {/* Remember / forgot */}
              <motion.div variants={item} className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none text-[#6b5d45]">
                  <span className="relative inline-flex">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={e => setRemember(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="h-4 w-4 rounded-md border border-[#d8cdb7] bg-white peer-checked:bg-[#5b7a55] peer-checked:border-[#5b7a55] transition-all" />
                  </span>
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[#5b7a55] hover:text-[#3f5a3a] font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </motion.div>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <motion.button
                variants={item}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-full bg-[#2b2418] text-[#faf6ee] py-3.5 font-medium tracking-wide shadow-[0_18px_40px_-15px_rgba(43,36,24,0.7)] transition-all duration-500 ease-out hover:bg-[#3a3022] disabled:opacity-70"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#d4af6c]/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
                <span className="relative inline-flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Enter your library
                      <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </motion.button>

              {/* ============ Social login — temporarily disabled ============
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-[#e7dfd0]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="bg-white/75 px-3 text-[#a89a82]">or continue with</span>
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

              <motion.p variants={item} className="text-center text-sm text-[#6b5d45] pt-2">
                New to Alákòwé?{' '}
                <Link to="/signup" className="text-[#5b7a55] font-semibold hover:text-[#3f5a3a] transition-colors">
                  Create an account
                </Link>
              </motion.p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
