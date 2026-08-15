import { Link } from 'react-router-dom'
import logo from '../assets/media/logos/logo white.png'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5zm2 0v.01L12 12l8-6.99V5H4zm16 14V7.51l-7.4 6.48a1 1 0 0 1-1.2 0L4 7.51V19h16z" />
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

const socialLinks = [
  { Icon: IconInstagram, label: 'Instagram', href: 'https://www.instagram.com/the_alakowe?igsh=ODJkcjd6cXh1bWNs&utm_source=qr' },
  { Icon: IconFacebook, label: 'Facebook', href: 'https://www.facebook.com/share/1BhTzfqmYv/?mibextid=wwXIfr' },
  { Icon: IconEmail, label: ' Email', href: 'igsh=ODJkcjd6cXh1bWNs&utm_source=qr' },
]

function Footer() {
  return (
    <footer className="bg-secondary text-white">

      {/* ── Main columns ────────────────────────────────────────── */}
      <div>
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 pt-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-6">

            {/* Brand */}
            <div>
              <Link to="/">
                <img
                  src={logo}
                  alt="Alakowé"
                  className="h-7 w-auto object-contain mb-3"
                />
              </Link>
              <p className="text-xs text-white/60 leading-relaxed mb-4 font-medium">
                A new way to read.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Explore */}
            <div>
              <h4 className="font-heading font-bold text-[11px] tracking-[0.15em] uppercase mb-3 text-white/70">
                Explore
              </h4>
              <ul className="space-y-2">
                {[
                  { label: 'Browse Books', to: '/browse' },
                  { label: 'Sell Books', to: '/sell' },
                  { label: 'Request Books', to: '/requests' },
                  { label: 'View our Drop-off Centers', to: '/' },
                ].map(({ label, to }, idx) => (
                  <li key={`${to}-${idx}`}>
                    <Link to={to} className="text-xs text-white/70 hover:text-white font-medium transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="font-heading font-bold text-[11px] tracking-[0.15em] uppercase mb-3 text-white/70">
                Help
              </h4>
              <ul className="space-y-2">
                {[
                  { label: 'How It Works', to: '/how-it-works' },
                  { label: 'FAQ', to: '/faq' },
                  { label: 'Customer Service', to: '/customer-service' },
                  { label: 'Shipping & Returns', to: '/shipping' },
                  { label: 'Contact Us', to: '/contact' },
                  { label: 'Terms & Conditions', to: '/terms' },
                  { label: 'Privacy Policy', to: '/privacy' },
                ].map(({ label, to }) => (
                  <li key={to}>
                    <Link to={to} className="text-xs text-white/70 hover:text-white font-medium transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter — compact card */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
              <h4 className="font-heading font-bold text-[11px] tracking-[0.15em] uppercase mb-2 text-white/80">
                Stay in the loop
              </h4>
              <p className="text-xs text-white/60 mb-3 leading-relaxed">
                New arrivals, reading tips, and updates straight to your inbox.
              </p>
              <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-white/10 border-white/20 rounded-xl h-auto px-3 py-2 text-xs text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-white"
                />
                <Button
                  type="submit"
                  className="bg-white text-secondary font-semibold text-xs rounded-xl h-auto px-3 py-2 hover:bg-white/90 shadow-xs"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/15 pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-white/40">
              © {new Date().getFullYear()} Alákọ̀wé. All rights reserved.
            </p>
            <p className="text-[11px] text-white/40">Made with love for Nigerian readers.</p>
          </div>
        </div>
      </div>

    </footer>
  )
}

export default Footer
