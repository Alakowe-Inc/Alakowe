import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ForgotPasswordModalProps {
  open: boolean
  onClose: () => void
}

function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Reset state when closed
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setEmail('')
        setSent(false)
        setError(null)
        setLoading(false)
      }, 200)
      return () => clearTimeout(t)
    }
  }, [open])

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // password reset logic goes here
      await new Promise(r => setTimeout(r, 800))
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputBase =
    'peer w-full border border-gray-200 bg-white/80 rounded-full px-5 py-3.5 text-[.9rem] text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5 hover:border-gray-300'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-pwd-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-3xl border border-white/60 bg-white/90 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25),0_4px_12px_-4px_rgba(15,23,42,0.08)] px-6 sm:px-9 py-8 sm:py-9"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 h-9 w-9 rounded-full grid place-items-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 id="forgot-pwd-title" className="text-2xl sm:text-[1.6rem] font-bold tracking-tight text-gray-900 mb-1">
                    Reset your password
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Enter the email associated with your account and we'll send you a link to reset your password.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder="Email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={inputBase}
                    />

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs px-4 py-2.5"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { y: -1 } : {}}
                      whileTap={!loading ? { scale: 0.985 } : {}}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="mt-1 w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-full text-sm shadow-md hover:shadow-xl hover:shadow-gray-900/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                          Sending link…
                        </span>
                      ) : 'Send reset link'}
                    </motion.button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-center"
                    >
                      ← Back to sign in
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-emerald-50 grid place-items-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 mb-1">
                    Check your inbox
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    We've sent a password reset link to{' '}
                    <span className="font-medium text-gray-700">{email}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-full text-sm shadow-md hover:shadow-xl hover:shadow-gray-900/20 transition-all"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ForgotPasswordModal