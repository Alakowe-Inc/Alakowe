import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  BookOpen,
  User,
  FileText,
  AlertCircle,
  ArrowRight,
  Phone,
} from 'lucide-react'
import { FormControl, TextareaControl, SelectBoxControl } from '@/components/ui/form-controls'

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={15} height={15}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

const TOPICS = [
  'General Inquiry',
  'Order & Delivery Support',
  'Selling & Bookstore Assistance',
  'Book Request Help',
  'Account & Payment Issue',
  'Report Fraud / Suspicious Activity',
]

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-main/70">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {hint && <span className="text-[10px] text-main/40">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function inputClass(hasError?: boolean) {
  return `w-full bg-white border ${
    hasError ? 'border-red-400 focus:border-red-500' : 'border-main/15 focus:border-secondary'
  } rounded-xl px-3.5 py-2.5 text-xs text-main placeholder:text-main/40 outline-none transition-colors`
}

function Contact() {
  const [activeTab, setActiveTab] = useState<'form' | 'channels' | 'faq'>('form')
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'General Inquiry',
    orderNumber: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    if (!form.email.trim()) {
      errs.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Please enter a valid email address'
    }
    if (!form.message.trim()) errs.message = 'Please enter your message'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setIsSubmitting(true)

    // Simulate server dispatch
    await new Promise((res) => setTimeout(res, 800))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  function handleResetForm() {
    setForm({
      name: '',
      email: '',
      topic: 'General Inquiry',
      orderNumber: '',
      message: '',
    })
    setSubmitted(false)
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10">

        {/* Hero Banner Card — Replicates RequestBook Banner Design */}
        <div className="bg-gradient-to-br from-violet-50/70 to-indigo-50/40 border border-violet-100/80 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">

          {/* Icon Avatar */}
          <div className="w-20 h-20 rounded-full bg-violet-100 border-4 border-white flex items-center justify-center shrink-0 shadow-sm">
            <MessageSquare size={30} className="text-secondary" />
          </div>

          {/* Header Text */}
          <div className="flex-1 text-center md:text-left z-10 min-w-0">
            <h1 className="font-heading font-bold text-main text-2xl sm:text-3xl leading-snug">
              Contact & Support
            </h1>
            <p className="text-xs sm:text-sm text-main/55 mt-1.5 max-w-md">
              Have a question, feedback, or need order assistance? We're here to help you every step of the way.
            </p>

            {/* Response Time Info Pill */}
            <div className="inline-flex items-center gap-2 mt-4 bg-white/70 border border-violet-100 rounded-full px-3.5 py-1.5">
              <Clock size={11} className="text-secondary shrink-0" />
              <span className="text-[11px] text-main/60 font-medium">
                Average response time: <span className="font-semibold text-main">24–48 hours</span>
              </span>
            </div>
          </div>

          {/* Decorative Illustration — Mirrors RequestBook storefront graphic */}
          <div className="absolute right-8 bottom-0 hidden lg:block select-none opacity-40 pointer-events-none z-0">
            <svg width="200" height="100" viewBox="0 0 220 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="80" cy="50" r="30" stroke="#6B6FFF" strokeWidth="3" fill="#E8E8FF" />
              <circle cx="80" cy="50" r="18" stroke="#6B6FFF" strokeWidth="2" fill="#F3F3FF" />
              <line x1="103" y1="73" x2="125" y2="95" stroke="#6B6FFF" strokeWidth="4" strokeLinecap="round" />
              <rect x="145" y="60" width="14" height="40" rx="2" fill="#E8E8FF" stroke="#6B6FFF" strokeWidth="2" />
              <rect x="161" y="50" width="12" height="50" rx="2" fill="#F3F3FF" stroke="#6B6FFF" strokeWidth="2" />
              <rect x="175" y="55" width="16" height="45" rx="2" fill="#E8E8FF" stroke="#6B6FFF" strokeWidth="2" />
              <line x1="130" y1="100" x2="210" y2="100" stroke="#6B6FFF" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="20" r="3" fill="#6B6FFF" opacity="0.5" />
              <circle cx="130" cy="15" r="2" fill="#6B6FFF" opacity="0.4" />
              <circle cx="170" cy="25" r="2.5" fill="#6B6FFF" opacity="0.3" />
            </svg>
          </div>
        </div>

        {/* Divider Nav Line — 3 Navigation Tabs */}
        <div className="flex border-b border-main/10 mb-8 overflow-x-auto">
          {[
            { id: 'form', label: 'Send a Message' },
            { id: 'channels', label: 'Support Channels' },
            { id: 'faq', label: 'Help & FAQs' },
          ].map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all -mb-px whitespace-nowrap ${
                  isActive
                    ? 'border-secondary text-main font-bold'
                    : 'border-transparent text-main/45 hover:text-main'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* TAB 1: CONTACT FORM & SIDEBAR */}
        {activeTab === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
            
            {/* Form Container */}
            <div className="border border-main/10 rounded-2xl bg-white p-6 md:p-8 shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
                    <CheckCircle2 size={28} className="text-emerald-600" />
                  </div>
                  <h2 className="font-heading font-bold text-main text-xl sm:text-2xl mb-2">
                    Message Sent Successfully!
                  </h2>
                  <p className="text-xs sm:text-sm text-main/60 max-w-sm leading-relaxed mb-6">
                    Thank you for contacting Alákòwé. We’ve received your message and will respond to <strong className="text-main">{form.email}</strong> within 24–48 hours.
                  </p>
                  <button
                    onClick={handleResetForm}
                    className="bg-secondary text-white text-xs font-semibold px-6 py-2.5 rounded-xl hover:bg-secondary/90 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center gap-3 mb-2 pb-4 border-b border-main/8">
                    <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                      <Mail size={16} className="text-secondary" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-main text-base">How can we help?</h2>
                      <p className="text-xs text-main/50">Fill out the fields below to reach our team.</p>
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Your Name" required error={errors.name}>
                      <FormControl
                        type="text"
                        placeholder="Full name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        style={inputClass(!!errors.name)}
                      />
                    </Field>
                    <Field label="Email Address" required error={errors.email}>
                      <FormControl
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        style={inputClass(!!errors.email)}
                      />
                    </Field>
                  </div>

                  {/* Topic Select & Optional Order Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Inquiry Topic">
                      <SelectBoxControl
                        placeholder="Select Topic"
                        options={TOPICS.map((t) => ({ label: t, value: t }))}
                        value={{ label: form.topic, value: form.topic }}
                        onChange={(opt) => setForm((f) => ({ ...f, topic: String(opt.value) }))}
                        style={inputClass()}
                      />
                    </Field>
                    <Field label="Order Number" hint="— Optional">
                      <FormControl
                        type="text"
                        placeholder="e.g. ALK-849201"
                        value={form.orderNumber}
                        onChange={(e) => setForm((f) => ({ ...f, orderNumber: e.target.value }))}
                        style={inputClass()}
                      />
                    </Field>
                  </div>

                  {/* Message Textarea */}
                  <Field label="Your Message" required error={errors.message}>
                    <TextareaControl
                      rows={5}
                      placeholder="Please describe your question or issue in detail..."
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      style={inputClass(!!errors.message)}
                    />
                  </Field>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-3.5 rounded-xl transition-colors text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      'Sending Message...'
                    ) : (
                      <>
                        <Send size={14} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar Cards — Replicates RequestBook Sidebar Styling */}
            <div className="flex flex-col gap-5">
              
              {/* Card 1: What happens next */}
              <div className="border border-violet-100 rounded-2xl bg-gradient-to-b from-violet-50/60 to-indigo-50/30 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-secondary" />
                  <p className="text-xs font-bold uppercase tracking-wider text-secondary">What Happens Next</p>
                </div>
                {[
                  { step: '1', text: 'Submit your message with relevant details' },
                  { step: '2', text: 'Our support team reviews your inquiry' },
                  { step: '3', text: 'You receive a response in 24–48 hours' },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-secondary/15 text-secondary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {step}
                    </span>
                    <p className="text-xs text-main/70 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>

              {/* Card 2: Official Social Channels */}
              <div className="border border-main/10 rounded-2xl bg-white p-5 space-y-3.5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-main/80">Follow Alákòwé</p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { Icon: IconInstagram, label: '@alakowe.books', href: 'https://instagram.com' },
                    { Icon: IconX, label: '@alakowe_books', href: 'https://x.com' },
                    { Icon: IconFacebook, label: 'Alakowe Marketplace', href: 'https://facebook.com' },
                  ].map(({ Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-main/65 hover:text-secondary text-xs transition-colors p-2 rounded-lg hover:bg-main/5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-main/5 flex items-center justify-center">
                        <Icon />
                      </div>
                      <span className="font-medium">{label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Card 3: Urgent Order Notice */}
              <div className="border border-amber-200/80 rounded-2xl bg-amber-50/50 p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs">
                  <AlertCircle size={14} className="text-amber-600 shrink-0" />
                  <span>Urgent Order Issues?</span>
                </div>
                <p className="text-[11px] text-amber-900/70 leading-relaxed">
                  Please include your <strong className="text-amber-950">Order Number</strong> in the subject line or form for prioritized assistance.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: SUPPORT CHANNELS */}
        {activeTab === 'channels' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/customer-service"
              className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all group block"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare size={22} />
              </div>
              <h3 className="font-heading font-bold text-main text-base mb-1.5 flex items-center justify-between">
                Customer Service
                <ArrowRight size={14} className="text-main/40 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-main/60 leading-relaxed">
                Need help with an order, delivery tracking, or refund policy? Check out our Customer Service portal.
              </p>
            </Link>

            <Link
              to="/how-it-works"
              className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all group block"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen size={22} />
              </div>
              <h3 className="font-heading font-bold text-main text-base mb-1.5 flex items-center justify-between">
                How It Works Guide
                <ArrowRight size={14} className="text-main/40 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-main/60 leading-relaxed">
                Learn how buying, selling, payments, and Buyer Pickup work in detail on Alákòwé.
              </p>
            </Link>

            <Link
              to="/request-book"
              className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all group block"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText size={22} />
              </div>
              <h3 className="font-heading font-bold text-main text-base mb-1.5 flex items-center justify-between">
                Book Request Hub
                <ArrowRight size={14} className="text-main/40 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-main/60 leading-relaxed">
                Looking for a title not currently listed? Submit a book request or join existing waitlists.
              </p>
            </Link>
          </div>
        )}

        {/* TAB 3: HELP & FAQS */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            {[
              {
                q: 'How quickly will I receive a response?',
                a: 'We process all support inquiries in the order they arrive. Most emails receive a response within 24 to 48 business hours.',
              },
              {
                q: 'What if I need help with an existing order?',
                a: 'Please include your Order Number (e.g. ALK-XXXXXX) when sending a message. This allows our team to look up your order details immediately.',
              },
              {
                q: 'How do I report a fake listing or suspicious buyer/seller?',
                a: 'If you notice fraudulent activity or suspicious behavior, select "Report Fraud / Suspicious Activity" as your topic or email support immediately.',
              },
              {
                q: 'Can I change my delivery address after placing an order?',
                a: 'Contact us as soon as possible with your Order Number. If the seller has not handed over the package to logistics, we can update the address for you.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm">
                <h4 className="font-heading font-bold text-main text-sm mb-2 flex items-center gap-2">
                  <HelpCircle size={16} className="text-secondary shrink-0" />
                  {q}
                </h4>
                <p className="text-xs text-main/65 leading-relaxed pl-6">{a}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Contact
