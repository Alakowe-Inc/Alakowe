import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { saveRequest, generateRequestId } from '../../data/requestData'
import { CONDITIONS, GENRES } from '../../data/sellerData'

type FormState = {
  title: string
  author: string
  genre: string
  condition: string
  maxPrice: string
  notes: string
}

const empty: FormState = {
  title: '', author: '', genre: '', condition: '',
  maxPrice: '', notes: '',
}

const inputClass = (err?: boolean) =>
  `w-full border rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus:border-secondary transition-colors bg-white ${err ? 'border-red-400' : 'border-main/15'}`

function Field({ label, required, hint, error, children }: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <label className="text-xs font-semibold text-main/50 uppercase tracking-wider">
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {hint && <span className="text-xs text-main/40">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default function RequestBook() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [form, setForm] = useState<FormState>({
    ...empty,
    title: params.get('title') ?? '',
    author: params.get('author') ?? '',
  })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitting, setSubmitting] = useState(false)

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }))
  }

  function validate(): Partial<FormState> {
    const e: Partial<FormState> = {}
    if (!form.title.trim()) e.title = 'Book title is required'
    if (!form.genre) e.genre = 'Please select a genre'
    const price = parseFloat(form.maxPrice)
    if (form.maxPrice && (isNaN(price) || price < 100))
      e.maxPrice = 'Enter a valid amount (min ₦100)'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)

    setTimeout(() => {
      saveRequest({
        id: generateRequestId(),
        buyerEmail: user!.email,
        title: form.title.trim(),
        author: form.author.trim(),
        genre: form.genre,
        condition: form.condition,
        maxPrice: parseFloat(form.maxPrice) || 0,
        notes: form.notes.trim(),
        status: 'open',
        createdAt: new Date().toISOString(),
      })
      navigate('/my-requests')
    }, 700)
  }

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">

        <Link
          to="/my-requests"
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> My Requests
        </Link>

        <div className="mb-8">
          <h1 className="font-heading font-bold text-main text-3xl">Request a Book</h1>
          <p className="text-main/50 text-sm mt-1">
            Can't find what you're looking for? Submit a request and we'll notify you when a matching book is listed.
          </p>
        </div>

        {/* How it works */}
        <div className="flex items-start gap-3 bg-secondary/6 border border-secondary/20 rounded-xl px-5 py-4 mb-8">
          <Bell size={16} className="text-secondary shrink-0 mt-0.5" />
          <p className="text-sm text-main/65 leading-relaxed">
            Once a seller lists a book that matches your request, you'll receive an{' '}
            <span className="font-semibold text-main">email notification</span> with a direct link to the listing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Book Info */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-5">Book Details</h2>
            <div className="flex flex-col gap-4">
              <Field label="Book Title" required error={errors.title}>
                <input
                  type="text"
                  placeholder="e.g. Purple Hibiscus"
                  value={form.title}
                  onChange={set('title')}
                  className={inputClass(!!errors.title)}
                />
              </Field>
              <Field label="Author" hint="Leave blank if you're not sure">
                <input
                  type="text"
                  placeholder="e.g. Chimamanda Ngozi Adichie"
                  value={form.author}
                  onChange={set('author')}
                  className={inputClass()}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Genre" required error={errors.genre}>
                  <select
                    value={form.genre}
                    onChange={set('genre')}
                    className={`${inputClass(!!errors.genre)} ${!form.genre ? 'text-main/30' : 'text-main'}`}
                  >
                    <option value="" disabled>Select genre</option>
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
                <Field label="Min. Condition" hint="Optional">
                  <select
                    value={form.condition}
                    onChange={set('condition')}
                    className={`${inputClass()} ${!form.condition ? 'text-main/30' : 'text-main'}`}
                  >
                    <option value="">Any condition</option>
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-4">Budget</h2>
            <Field label="Maximum Price (₦)" hint="Optional — helps sellers know your budget" error={errors.maxPrice}>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-main/40 font-medium">₦</span>
                <input
                  type="number"
                  min="100"
                  placeholder="e.g. 5000"
                  value={form.maxPrice}
                  onChange={set('maxPrice')}
                  className={`${inputClass(!!errors.maxPrice)} pl-8`}
                />
              </div>
            </Field>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-4">Additional Notes</h2>
            <Field label="Notes" hint="Any edition preference, urgency, or extra details for sellers">
              <textarea
                placeholder="e.g. Looking for the 2006 Farafina edition. Need it before end of month."
                value={form.notes}
                onChange={set('notes')}
                rows={4}
                className="w-full border border-main/15 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus:border-secondary transition-colors resize-none bg-white"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-main text-white font-semibold py-4 rounded-full hover:bg-main/90 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting…' : 'Submit Request'}
          </button>

        </form>
      </div>
    </div>
  )
}
