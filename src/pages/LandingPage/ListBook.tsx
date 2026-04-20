import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Heart } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  saveListing,
  generateListingId,
  assignCoverColor,
  CONDITIONS,
  GENRES,
} from '../../data/sellerData'
import type { Listing, ConditionGrade } from '../../data/sellerData'

type FormState = {
  title: string
  author: string
  genre: string
  condition: string
  description: string
  price: string
  discount: string
  loveNote: string
}

const empty: FormState = {
  title: '', author: '', genre: '', condition: '',
  description: '', price: '', discount: '0', loveNote: '',
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

export default function ListBook() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [photos, setPhotos] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }))
  }

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setPhotos(Array.from(e.target.files).slice(0, 5))
  }

  function validate(): Partial<FormState> {
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
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)

    const id = generateListingId()
    const listing: Listing = {
      id,
      sellerEmail: user!.email,
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre,
      condition: form.condition as ConditionGrade,
      description: form.description.trim(),
      price: parseFloat(form.price),
      discount: parseFloat(form.discount) || 0,
      loveNote: form.loveNote.trim(),
      coverColor: assignCoverColor(id),
      status: 'pending_review',
      createdAt: new Date().toISOString(),
      views: 0,
    }

    setTimeout(() => {
      saveListing(listing)
      navigate(`/listing-submitted?id=${id}`)
    }, 800)
  }

  return (
    <div className="bg-third min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">

        <Link
          to="/sell"
          className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> Back
        </Link>

        <div className="mb-8">
          <h1 className="font-heading font-bold text-main text-3xl">List a Book</h1>
          <p className="text-main/50 text-sm mt-1">
            Fill in the details below. Your listing will go live once our team reviews it — usually within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* ── Book Details ── */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-5">Book Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Book Title" required error={errors.title}>
                  <input type="text" placeholder="e.g. Things Fall Apart" value={form.title}
                    onChange={set('title')} className={inputClass(!!errors.title)} />
                </Field>
              </div>
              <Field label="Author" required error={errors.author}>
                <input type="text" placeholder="e.g. Chinua Achebe" value={form.author}
                  onChange={set('author')} className={inputClass(!!errors.author)} />
              </Field>
              <Field label="Genre" required error={errors.genre}>
                <select value={form.genre} onChange={set('genre')}
                  className={`${inputClass(!!errors.genre)} ${!form.genre ? 'text-main/30' : 'text-main'}`}>
                  <option value="" disabled>Select genre</option>
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Condition" required error={errors.condition}>
                  <select value={form.condition} onChange={set('condition')}
                    className={`${inputClass(!!errors.condition)} ${!form.condition ? 'text-main/30' : 'text-main'}`}>
                    <option value="" disabled>Select condition</option>
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          {/* ── Description ── */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">About this Book</h2>
            <p className="text-xs text-main/45 mb-4">Describe the book briefly. Be honest about its condition and any marks.</p>
            <Field label="Description" required error={errors.description}>
              <textarea
                placeholder="e.g. A classic novel in good condition. There's a small crease on the spine and a few pencil marks in chapter 3. Pages are clean overall."
                value={form.description}
                onChange={set('description')}
                rows={5}
                className="w-full border border-main/15 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus:border-secondary transition-colors resize-none bg-white"
              />
            </Field>
          </div>

          {/* ── Pricing ── */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">Pricing</h2>
            <p className="text-xs text-main/45 mb-4">Set a fair price. Listings priced too high may be flagged during review.</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (₦)" required error={errors.price}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-main/40 font-medium">₦</span>
                  <input
                    type="number"
                    min="100"
                    placeholder="e.g. 3000"
                    value={form.price}
                    onChange={set('price')}
                    className={`${inputClass(!!errors.price)} pl-8`}
                  />
                </div>
              </Field>
              <Field label="Discount (%)" error={errors.discount}>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    placeholder="0"
                    value={form.discount}
                    onChange={set('discount')}
                    className={`${inputClass(!!errors.discount)} pr-8`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-main/40">%</span>
                </div>
              </Field>
            </div>
            {form.price && !errors.price && (
              <div className="mt-3 bg-third rounded-xl px-4 py-3 flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-main/50">Listed price (what buyer pays)</span>
                  <span className="font-semibold text-main">
                    ₦{Math.round(parseFloat(form.price || '0') * 1.1).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-main/50">Alakowe fee (10%)</span>
                  <span className="font-semibold text-main/50">
                    −₦{Math.floor(parseFloat(form.price || '0') * 0.1).toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-main/10 pt-1.5 flex justify-between text-xs">
                  <span className="font-semibold text-main">Your payout</span>
                  <span className="font-semibold text-main">
                    ₦{Math.floor(parseFloat(form.price || '0') * 0.9).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Photos ── */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">
              Photos <span className="text-main/35 font-normal text-sm">(optional)</span>
            </h2>
            <p className="text-xs text-main/45 mb-4">Upload up to 5 photos — front cover, back cover, and any marks.</p>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-main/15 rounded-xl py-8 cursor-pointer hover:border-secondary/40 transition-colors">
              <Upload size={24} className="text-main/30 mb-2" />
              <span className="text-sm text-main/50 font-medium">Click to upload photos</span>
              <span className="text-xs text-main/30 mt-1">PNG, JPG up to 5MB each</span>
              <input type="file" multiple accept="image/*" className="sr-only" onChange={handlePhotos} />
            </label>
            {photos.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {photos.map(f => (
                  <span key={f.name} className="text-xs bg-secondary/10 text-secondary font-medium px-3 py-1 rounded-full">
                    {f.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Love Note ── */}
          <div className="bg-secondary/6 border border-secondary/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Heart size={15} className="text-secondary" />
              <h2 className="font-heading font-bold text-main text-base">Love Note to the Next Reader</h2>
            </div>
            <p className="text-xs text-main/45 mb-4">
              Leave a personal message for whoever buys this book. What did it mean to you? Why are you passing it on?
            </p>
            <textarea
              placeholder="e.g. This book changed how I see the world. I hope it does the same for you…"
              value={form.loveNote}
              onChange={set('loveNote')}
              rows={3}
              className="w-full border border-secondary/25 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus:border-secondary transition-colors resize-none bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-main text-white font-semibold py-4 rounded-full hover:bg-main/90 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting…' : 'Submit Listing for Review'}
          </button>

          <p className="text-xs text-main/35 text-center">
            Our team will review your listing within 24 hours. You'll be notified by email.
          </p>

        </form>
      </div>
    </div>
  )
}
