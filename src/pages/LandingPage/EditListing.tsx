import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Heart } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getListing,
  updateListing,
  CONDITIONS,
  GENRES,
} from '../../data/sellerData'
import type { ConditionGrade } from '../../data/sellerData'

type FormState = {
  title: string; author: string; genre: string; condition: string
  description: string; price: string; discount: string; loveNote: string
}

const inputClass = (err?: boolean) =>
  `w-full border rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus:border-secondary transition-colors bg-white ${err ? 'border-red-400' : 'border-main/15'}`

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-main/50 uppercase tracking-wider mb-1.5 block">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default function EditListing() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState | null>(null)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) { setNotFound(true); return }
    const listing = getListing(id)
    if (!listing || listing.sellerEmail !== user?.email) { setNotFound(true); return }
    setForm({
      title: listing.title,
      author: listing.author,
      genre: listing.genre,
      condition: listing.condition,
      description: listing.description,
      price: String(listing.price),
      discount: String(listing.discount),
      loveNote: listing.loveNote,
    })
  }, [id, user])

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => p ? { ...p, [field]: e.target.value } : p)
  }

  function validate(): Partial<FormState> {
    if (!form) return {}
    const e: Partial<FormState> = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.author.trim()) e.author = 'Author is required'
    if (!form.genre) e.genre = 'Please select a genre'
    if (!form.condition) e.condition = 'Please select a condition'
    if (!form.description.trim() || form.description.length < 20)
      e.description = 'Description must be at least 20 characters'
    const price = parseFloat(form.price)
    if (!form.price || isNaN(price) || price < 100)
      e.price = 'Enter a valid price (min ₦100)'
    const disc = parseFloat(form.discount)
    if (isNaN(disc) || disc < 0 || disc > 50)
      e.discount = 'Discount must be 0–50%'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form || !id) return
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSaving(true)

    setTimeout(() => {
      updateListing(id, {
        title: form.title.trim(),
        author: form.author.trim(),
        genre: form.genre,
        condition: form.condition as ConditionGrade,
        description: form.description.trim(),
        price: parseFloat(form.price),
        discount: parseFloat(form.discount) || 0,
        loveNote: form.loveNote.trim(),
        status: 'pending_review',
      })
      setSaving(false)
      setSaved(true)
      setTimeout(() => navigate('/my-listings'), 1200)
    }, 700)
  }

  if (notFound) {
    return (
      <div className="bg-third min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-main/60 text-sm mb-4">Listing not found or you don't have permission to edit it.</p>
          <Link to="/my-listings" className="text-secondary font-semibold text-sm hover:underline">Back to My Listings</Link>
        </div>
      </div>
    )
  }

  if (!form) return null

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">

        <Link
          to="/my-listings"
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> Back to My Listings
        </Link>

        <div className="mb-8">
          <h1 className="font-heading font-bold text-main text-3xl">Edit Listing</h1>
          <p className="text-main/50 text-sm mt-1">
            Saving changes will re-submit your listing for review.
          </p>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3.5 mb-6 text-sm font-semibold text-green-800">
            Saved! Redirecting to your listings…
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Book Details */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-5">Book Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Book Title" required error={errors.title}>
                  <input type="text" value={form.title} onChange={set('title')} className={inputClass(!!errors.title)} />
                </Field>
              </div>
              <Field label="Author" required error={errors.author}>
                <input type="text" value={form.author} onChange={set('author')} className={inputClass(!!errors.author)} />
              </Field>
              <Field label="Genre" required error={errors.genre}>
                <select value={form.genre} onChange={set('genre')}
                  className={`${inputClass(!!errors.genre)} text-main`}>
                  <option value="" disabled>Select genre</option>
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Condition" required error={errors.condition}>
                  <select value={form.condition} onChange={set('condition')}
                    className={`${inputClass(!!errors.condition)} text-main`}>
                    <option value="" disabled>Select condition</option>
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-4">About this Book</h2>
            <Field label="Description" required error={errors.description}>
              <textarea value={form.description} onChange={set('description')} rows={5}
                className="w-full border border-main/15 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus:border-secondary transition-colors resize-none bg-white" />
            </Field>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (₦)" required error={errors.price}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-main/40 font-medium">₦</span>
                  <input type="number" min="100" value={form.price} onChange={set('price')}
                    className={`${inputClass(!!errors.price)} pl-8`} />
                </div>
              </Field>
              <Field label="Discount (%)" error={errors.discount}>
                <div className="relative">
                  <input type="number" min="0" max="50" value={form.discount} onChange={set('discount')}
                    className={`${inputClass(!!errors.discount)} pr-8`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-main/40">%</span>
                </div>
              </Field>
            </div>
            {form.price && !errors.price && (
              <p className="text-xs text-main/45 mt-3">
                Estimated payout:{' '}
                <span className="font-semibold text-main">
                  ₦{Math.floor(parseFloat(form.price || '0') * 0.9).toLocaleString()}
                </span>
              </p>
            )}
          </div>

          {/* Love Note */}
          <div className="bg-secondary/6 border border-secondary/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={15} className="text-secondary" />
              <h2 className="font-heading font-bold text-main text-base">Love Note</h2>
            </div>
            <textarea
              value={form.loveNote}
              onChange={set('loveNote')}
              rows={3}
              placeholder="A message to the next reader…"
              className="w-full border border-secondary/25 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus:border-secondary transition-colors resize-none bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving || saved}
            className="w-full bg-main text-white font-semibold py-4 rounded-full hover:bg-main/90 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
          </button>

        </form>
      </div>
    </div>
  )
}
