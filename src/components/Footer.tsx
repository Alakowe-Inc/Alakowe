import { Link } from 'react-router-dom'
import logo from '../assets/media/logos/logo.jpg'

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

const socialLinks = [
  { Icon: IconInstagram, label: 'Instagram' },
  { Icon: IconX, label: 'X (Twitter)' },
  { Icon: IconFacebook, label: 'Facebook' },
]

function Footer() {
  return (
    <footer className="bg-main text-white">
      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div>
            <img
              src={logo}
              alt="Alakowé"
              className="h-8 w-auto object-contain mb-4 brightness-0 invert"
            />
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Read it. Love it. Pass it on.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="text-white/40 hover:text-secondary transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-heading font-semibold text-xs tracking-widest uppercase mb-5 text-white/60">
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Browse Books', to: '/browse' },
                { label: 'Sell a Book', to: '/sell' },
                { label: 'How it Works', to: '/how-it-works' },
                { label: 'Blog', to: '/blog' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-white/50 hover:text-secondary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-heading font-semibold text-xs tracking-widest uppercase mb-5 text-white/60">
              Help
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'FAQ', to: '/faq' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Terms & Conditions', to: '/terms' },
                { label: 'Privacy Policy', to: '/privacy' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-white/50 hover:text-secondary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-semibold text-xs tracking-widest uppercase mb-5 text-white/60">
              Stay in the loop
            </h4>
            <p className="text-sm text-white/50 mb-4 leading-relaxed">
              New arrivals, reading tips, and updates — straight to your inbox.
            </p>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-white/8 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-secondary transition-colors"
              />
              <button
                type="submit"
                className="bg-secondary text-main font-semibold text-sm rounded-lg px-4 py-2.5 hover:bg-secondary/80 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Alákọ̀wé. All rights reserved.
          </p>
          <p className="text-xs text-white/30">Made with love for Nigerian readers.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
