import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Camera,
  FileText,
  Tag,
  Bell,
  Truck,
  PackageCheck,
  MapPin,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Layers,
  ChevronRight,
  Info,
  DollarSign,
  Store
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export default function Sell() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'guide' | 'fulfillment' | 'conditions'>('guide')
  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null)

  function openLearnMore(title: string, text: string) {
    setModalContent({ title, text })
  }

  const listBookUrl = user ? '/list' : '/login?redirect=/list'

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* ── Banner Card — replicated from RequestBook.tsx ── */}
        <div className="bg-gradient-to-br from-violet-50/70 to-indigo-50/40 border border-violet-100/80 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">

          {/* Icon Avatar */}
          <div className="w-20 h-20 rounded-full bg-violet-100 border-4 border-white flex items-center justify-center shrink-0 shadow-sm">
            <Tag size={30} className="text-secondary" />
          </div>

          {/* Header Text */}
          <div className="flex-1 text-center md:text-left z-10 min-w-0">
            <div className="inline-flex items-center gap-2 mb-2 bg-white/80 border border-violet-100 rounded-full px-3 py-1">
              <Sparkles size={12} className="text-secondary shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                The Pre-Listing Page
              </span>
            </div>

            <h1 className="font-heading font-bold text-main text-2xl sm:text-3xl md:text-4xl leading-snug">
              List your books in less than 5 minutes
            </h1>
            <p className="text-xs sm:text-sm text-main/60 mt-2 max-w-lg">
              Your bookshelf could be worth more than you think. Turn your pre-loved novels, textbooks, and non-fiction into cash on Alákòwé.
            </p>

            {/* CTA & Info pill */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-5">
              <Link
                to={listBookUrl}
                className="bg-secondary text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <span>List a Book</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/store/sample"
                className="bg-white hover:bg-main/5 text-main border border-violet-200 text-xs font-semibold px-5 py-3 rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5"
              >
                <Store size={14} className="text-secondary" />
                <span>Preview Sample Storefront</span>
              </Link>
              <div className="inline-flex items-center gap-2 bg-white/70 border border-violet-100 rounded-full px-3.5 py-2">
                <ShieldCheck size={13} className="text-secondary shrink-0" />
                <span className="text-[11px] text-main/60 font-medium">
                  Free listing &bull; Escrow protected payouts
                </span>
              </div>
            </div>
          </div>
        </div>



        {/* ── Navigation Tabs — replicated from RequestBook.tsx ── */}
        <div className="flex border-b border-main/10 mb-8 overflow-x-auto">
          {[
            { id: 'guide', label: 'Pre-Listing Steps' },
            { id: 'fulfillment', label: 'After Your Book Sells' },
            { id: 'conditions', label: 'Book Conditions & FAQs' },
          ].map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all -mb-px whitespace-nowrap ${
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

        {/* ── TAB 1: PRE-LISTING GUIDE ── */}
        {activeTab === 'guide' && (
          <div className="space-y-8">
            <div className="text-center max-w-lg mx-auto mb-4">
              <h2 className="font-heading font-bold text-main text-2xl sm:text-3xl">
                List your books in 5 minutes
              </h2>
              <p className="text-xs sm:text-sm text-main/55 mt-1">
                Follow these three simple tips to create clean, attractive listings that sell fast.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1: Snap your book */}
              <div className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-violet-50 text-secondary font-bold text-xs flex items-center justify-center">
                  01
                </div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                    <Camera size={22} />
                  </div>
                  <h3 className="font-heading font-bold text-main text-lg mb-2">
                    Snap your book
                  </h3>
                  <p className="text-xs text-main/60 leading-relaxed mb-4">
                    Snap clear photos of the actual book, and don't hide marks or damage. Honest listings build trust and sell faster.
                  </p>
                </div>

                {/* Mock phone preview illustration */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 text-center">
                  <div className="w-full h-24 bg-violet-100/60 rounded-lg border border-dashed border-violet-200 flex items-center justify-center text-xs text-secondary font-semibold gap-1.5">
                    <Camera size={14} />
                    <span>Clear Cover & Back Photo</span>
                  </div>
                </div>

                <Link
                  to="/how-it-works#selling-books"
                  className="w-full text-xs font-semibold py-2.5 px-4 rounded-xl border border-main/15 text-main hover:bg-main/5 transition-colors flex items-center justify-center gap-1"
                >
                  <span>Learn more</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              {/* Step 2: Write a clear condition note */}
              <div className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-violet-50 text-secondary font-bold text-xs flex items-center justify-center">
                  02
                </div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                    <FileText size={22} />
                  </div>
                  <h3 className="font-heading font-bold text-main text-lg mb-2">
                    Write a clear condition note
                  </h3>
                  <p className="text-xs text-main/60 leading-relaxed mb-4">
                    Tell buyers exactly what they'll receive. Mention highlights like annotations, missing pages, writing, or wear so there are no surprises after delivery.
                  </p>
                </div>

                {/* Mock condition note preview */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-main/70 font-medium">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    <span>Note highlights & pen marks</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-main/70 font-medium">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    <span>Mention page state & binding</span>
                  </div>
                </div>

                <Link
                  to="/how-it-works#selling-books"
                  className="w-full text-xs font-semibold py-2.5 px-4 rounded-xl border border-main/15 text-main hover:bg-main/5 transition-colors flex items-center justify-center gap-1"
                >
                  <span>Learn more</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              {/* Step 3: Pricing your book */}
              <div className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-violet-50 text-secondary font-bold text-xs flex items-center justify-center">
                  03
                </div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                    <Tag size={22} />
                  </div>
                  <h3 className="font-heading font-bold text-main text-lg mb-2">
                    Pricing your book
                  </h3>
                  <p className="text-xs text-main/60 leading-relaxed mb-4">
                    A fair price helps your book sell faster. You can check what similar books are selling for and consider the book's condition before deciding your price.
                  </p>
                </div>

                <Link
                  to="/how-it-works#selling-books"
                  className="w-full text-xs font-semibold py-2.5 px-4 rounded-xl border border-main/15 text-main hover:bg-main/5 transition-colors flex items-center justify-center gap-1"
                >
                  <span>Learn more</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: FULFILLMENT & SALES ── */}
        {activeTab === 'fulfillment' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-violet-50/80 via-slate-50 to-indigo-50/50 border border-violet-100/80 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
              <div className="max-w-md">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary/10 text-secondary px-3 py-1 rounded-full">
                  Fulfillment & Payouts
                </span>
                <h2 className="font-heading font-bold text-main text-xl sm:text-2xl mt-2.5">
                  After your book sells
                </h2>
                <p className="text-main/60 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  From sale notification to packaging, delivery, and bank payout — we guide you every step of the way.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. You'll receive a notification */}
              <div className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 text-secondary flex items-center justify-center shrink-0">
                      <Bell size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Step 1</span>
                      <h3 className="font-heading font-bold text-main text-base">You'll receive a notification</h3>
                    </div>
                  </div>
                  <p className="text-xs text-main/60 leading-relaxed mb-4">
                    We'll send you an email and show the order in your account with clear instructions.
                  </p>
                </div>
                <Link
                  to="/how-it-works#selling-books"
                  className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1 w-fit"
                >
                  <span>Learn more</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              {/* 2. Choose how to fulfil your order */}
              <div className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 text-secondary flex items-center justify-center shrink-0">
                      <Truck size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Step 2</span>
                      <h3 className="font-heading font-bold text-main text-base">Choose how to fulfil your order</h3>
                    </div>
                  </div>
                  <p className="text-xs text-main/60 leading-relaxed mb-4">
                    Depending on the delivery option you selected when listing, you'll either meet the buyer or drop the book off at one of our partner centres.
                  </p>
                </div>
                <Link
                  to="/how-it-works#delivery-logistics"
                  className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1 w-fit"
                >
                  <span>Learn more</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              {/* 3. Prepare your package */}
              <div className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 text-secondary flex items-center justify-center shrink-0">
                      <PackageCheck size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Step 3</span>
                      <h3 className="font-heading font-bold text-main text-base">Prepare your package</h3>
                    </div>
                  </div>
                  <p className="text-xs text-main/60 leading-relaxed mb-4">
                    A few minutes spent packaging your book properly helps protect it during delivery. Use a suitable envelope or box and keep the book secure inside.
                  </p>
                </div>
                <Link
                  to="/how-it-works#delivery-logistics"
                  className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1 w-fit"
                >
                  <span>Learn more</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              {/* 4. Drop off or hand it over */}
              <div className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 text-secondary flex items-center justify-center shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Step 4</span>
                      <h3 className="font-heading font-bold text-main text-base">Drop off or hand it over</h3>
                    </div>
                  </div>
                  <p className="text-xs text-main/60 leading-relaxed mb-4">
                    If you're dropping off, simply choose your preferred partner location, generate your waybill, and hand over the package. If it's buyer pickup or home pickup, we'll guide you through those steps too.
                  </p>
                </div>
                <Link
                  to="/how-it-works#delivery-logistics"
                  className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1 w-fit"
                >
                  <span>Learn more</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: BOOK CONDITIONS & FAQS ── */}
        {activeTab === 'conditions' && (
          <div className="space-y-8">
            <div className="text-center max-w-lg mx-auto mb-4">
              <h2 className="font-heading font-bold text-main text-2xl sm:text-3xl">
                Book Conditions
              </h2>
              <p className="text-xs sm:text-sm text-main/55 mt-1">
                Guidelines on what you can sell and choosing the right condition label.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* What you can sell */}
              <div className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-violet-100 text-secondary flex items-center justify-center mb-4">
                    <BookOpen size={18} />
                  </div>
                  <h3 className="font-heading font-bold text-main text-base mb-2">
                    What you can sell
                  </h3>
                  <p className="text-xs text-main/60 leading-relaxed mb-4">
                    From novels, non-fiction, primary school textbooks, secondary school textbooks, children’s to university textbooks, many books can find a second reader—as long as they meet our listing guidelines.
                  </p>
                </div>
                <Link
                  to="/how-it-works#selling-books"
                  className="w-full text-xs font-semibold py-2.5 px-4 rounded-xl border border-main/15 text-main hover:bg-main/5 transition-colors flex items-center justify-center gap-1"
                >
                  <span>Learn more</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              {/* Choosing the right condition */}
              <div className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-violet-100 text-secondary flex items-center justify-center mb-4">
                    <Layers size={18} />
                  </div>
                  <h3 className="font-heading font-bold text-main text-base mb-2">
                    Choosing the right condition
                  </h3>
                  <p className="text-xs text-main/60 leading-relaxed mb-4">
                    Whether your book is Like New or Well Loved, we have broken down book conditions into categories. All you have to do is choose the condition that best matches the current state of your book.
                  </p>
                </div>
                <Link
                  to="/how-it-works#selling-books"
                  className="w-full text-xs font-semibold py-2.5 px-4 rounded-xl border border-main/15 text-main hover:bg-main/5 transition-colors flex items-center justify-center gap-1"
                >
                  <span>Learn more</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              {/* Our quality standards */}
              <div className="border border-main/10 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-violet-100 text-secondary flex items-center justify-center mb-4">
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="font-heading font-bold text-main text-base mb-2">
                    Our quality standards
                  </h3>
                  <p className="text-xs text-main/60 leading-relaxed mb-4">
                    We appreciate when every listing accurately represents the book being sold. Clear photos and honest descriptions help keep Alákòwé a trusted marketplace for everyone.
                  </p>
                </div>
                <Link
                  to="/how-it-works#selling-books"
                  className="w-full text-xs font-semibold py-2.5 px-4 rounded-xl border border-main/15 text-main hover:bg-main/5 transition-colors flex items-center justify-center gap-1"
                >
                  <span>Learn more</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* ── FAQ Section Card ── */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 text-secondary flex items-center justify-center shrink-0">
                  <HelpCircle size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-main text-lg">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-xs sm:text-sm text-main/60 mt-1 max-w-xl leading-relaxed">
                    Still have questions? We've answered the ones sellers ask most—from listing and delivery to payments and account management.
                  </p>
                </div>
              </div>

              <Link
                to="/faq"
                className="shrink-0 bg-secondary text-white text-xs font-semibold px-5 py-3 rounded-xl hover:bg-secondary/90 transition-colors inline-flex items-center gap-2"
              >
                <span>Browse all FAQs</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* ── CTA BANNER AT BOTTOM ── */}
        <div className="mt-8 bg-white border border-main/10 rounded-2xl p-6 sm:p-8 text-center shadow-sm relative overflow-hidden">
          <div className="max-w-md mx-auto z-10 relative">
            <h2 className="font-heading font-bold text-main text-xl sm:text-2xl mb-2">
              Ready to start selling?
            </h2>
            <p className="text-main/70 text-xs sm:text-sm font-medium mb-1">
              Your bookshelf could be worth more than you think.
            </p>
            <p className="text-main/45 text-xs mb-6">
              List your first book today and let it find its next reader.
            </p>

            <Link
              to={listBookUrl}
              className="inline-flex items-center gap-2 bg-secondary text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all active:scale-[0.98] shadow-xs uppercase tracking-wider"
            >
              <span>List a Book</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Learn More Popup Modal ── */}
      <Dialog open={!!modalContent} onOpenChange={(open) => !open && setModalContent(null)}>
        <DialogContent className="max-w-md rounded-3xl border-0 shadow-2xl p-6 md:p-8">
          <DialogTitle className="font-heading font-bold text-lg text-main flex items-center gap-2 mb-2">
            <Info size={18} className="text-secondary" />
            <span>{modalContent?.title}</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-main/60 leading-relaxed mt-2">
            {modalContent?.text}
          </DialogDescription>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setModalContent(null)}
              className="bg-secondary text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-secondary/90 transition-colors"
            >
              Got it
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
