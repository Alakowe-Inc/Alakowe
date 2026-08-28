import { useState } from "react"
import { Instagram, MessageSquare, X, Send, CheckCircle } from "lucide-react"
import { useSubmitFeedback } from "../lib/api/feedback/feedback.hooks"
import { toast } from "react-toastify"

export function FloatingActions() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const submitFeedback = useSubmitFeedback()

  function playBuzzerSound() {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      // Create a pleasant "pop/ding" notification sound
      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05)

      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.2)
    } catch (err) {
      // Ignore if browser blocks audio
    }
  }

  function handleClose() {
    setOpen(false)
    // reset after close animation
    setTimeout(() => {
      setSent(false)
      setName("")
      setEmail("")
      setMessage("")
    }, 300)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return

    try {
      await submitFeedback.mutateAsync({
        name: name.trim() || null,
        email: email.trim() || null,
        message: message.trim(),
      })
      setSent(true)
      playBuzzerSound()
    } catch {
      toast.error("Could not send feedback. Please try again.")
    }
  }

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        {/* Instagram */}
        <a
          href="https://www.instagram.com/the_alakowe?igsh=ODJkcjd6cXh1bWNs&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          aria-label="Follow us on Instagram"
        >
          <Instagram size={20} className="group-hover:scale-110 transition-transform" />
        </a>

        {/* Feedback */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto flex items-center gap-2 bg-[#6B6FFF] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#5a5ee0] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          aria-label="Send feedback"
        >
          <MessageSquare size={18} />
          <span className="font-semibold text-sm">Feedback</span>
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center sm:justify-end sm:pr-6 sm:pb-6"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          {/* Modal card */}
          <div className="w-full sm:w-[380px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#6B6FFF]/10 flex items-center justify-center">
                  <MessageSquare size={14} className="text-[#6B6FFF]" />
                </div>
                <h2 className="font-bold text-gray-900 text-sm">Send Feedback</h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            {sent ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 text-center">
                <CheckCircle size={44} className="text-[#6B6FFF]" />
                <h3 className="font-bold text-gray-900 text-base">Thank you!</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Your feedback has been received. We really appreciate it!
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-2 px-6 py-2.5 bg-[#6B6FFF] text-white text-sm font-semibold rounded-full hover:bg-[#5a5ee0] transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-5">
                <p className="text-xs text-gray-500 leading-relaxed -mt-1 mb-1">
                  We read every message. Tell us what you think or report an issue.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Name <span className="text-gray-400">(optional)</span></label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6B6FFF] focus:ring-1 focus:ring-[#6B6FFF] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email <span className="text-gray-400">(optional)</span></label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6B6FFF] focus:ring-1 focus:ring-[#6B6FFF] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Message <span className="text-red-400">*</span></label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Share your thoughts, ideas, or issues..."
                    rows={4}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6B6FFF] focus:ring-1 focus:ring-[#6B6FFF] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!message.trim() || submitFeedback.isPending}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#6B6FFF] text-white font-semibold text-sm rounded-xl hover:bg-[#5a5ee0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitFeedback.isPending ? (
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <Send size={15} />
                  )}
                  {submitFeedback.isPending ? "Sending..." : "Send Feedback"}
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  )
}
