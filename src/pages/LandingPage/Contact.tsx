import { useState } from 'react'
import { Mail } from 'lucide-react'

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={17} height={17}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={17} height={17}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={17} height={17}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-third">

      {/* Header */}
      <div className="bg-main text-white pt-14 pb-16">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">
          <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Get in touch
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            Contact Us
          </h1>
          <p className="text-white/55 max-w-lg text-sm leading-relaxed">
            Have a question, issue, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Form */}
          <div className="bg-white rounded-lg border border-third p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-14 h-14 rounded-lg bg-secondary/15 border border-secondary/20 flex items-center justify-center mb-5">
                  <Mail size={24} className="text-main" />
                </div>
                <h2 className="font-heading font-bold text-main text-2xl mb-2">Message sent!</h2>
                <p className="text-main/55 text-sm leading-relaxed">
                  Thanks for reaching out. We typically respond within 24–48 hours.
                </p>
              </div>
            ) : (
              <>
                <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                  Send a message
                </p>
                <h2 className="font-heading font-bold text-main text-2xl mb-8">
                  How can we help?
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-2 block">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-third border border-third rounded-md px-4 py-3 text-sm text-main placeholder-main/40 outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-third border border-third rounded-md px-4 py-3 text-sm text-main placeholder-main/40 outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-2 block">
                      Message
                    </label>
                    <textarea
                      required
                      placeholder="How can we help you?"
                      rows={6}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full bg-third border border-third rounded-md px-4 py-3 text-sm text-main placeholder-main/40 outline-none focus:border-secondary transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-main text-white font-semibold px-7 py-3.5 rounded-md hover:bg-main/90 transition-colors text-sm"
                  >
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Info cards */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-lg border border-third p-7">
              <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                Support Email
              </p>
              <a
                href="mailto:hello@alakowe.com"
                className="flex items-center gap-3 text-main/65 hover:text-secondary transition-colors"
              >
                <Mail size={17} />
                <span className="text-sm font-medium">hello@alakowe.com</span>
              </a>
            </div>

            <div className="bg-white rounded-lg border border-third p-7">
              <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                Follow Us
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { Icon: IconInstagram, label: '@alakowe', href: '#' },
                  { Icon: IconX, label: '@alakowe', href: '#' },
                  { Icon: IconFacebook, label: 'Alakowe Books', href: '#' },
                ].map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-3 text-main/65 hover:text-secondary transition-colors"
                  >
                    <Icon />
                    <span className="text-sm">{label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-7">
              <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                Response Time
              </p>
              <p className="text-sm text-main/65 leading-relaxed">
                We typically respond within{' '}
                <strong className="text-main">24–48 hours</strong>. For urgent order
                issues, include your order number in the subject line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
