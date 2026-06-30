import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Heart, BookOpen, Camera, DollarSign, CheckCircle, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  saveListing,
  generateListingId,
  assignCoverColor,
  CONDITIONS,
  GENRES,
} from '../../data/sellerData'
import type { Listing, ConditionGrade } from '../../data/sellerData'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

type FormState = {
  title: string
  author: string
  genre: string
  condition: string
  quantity: string
  format: string
  conditionNotes: string
  description: string
  price: string
  discount: string
  loveNote: string
}

const empty: FormState = {
  title: '',
  author: '',
  genre: '',
  condition: '',
  quantity: '1',
  format: '',
  conditionNotes: '',
  description: '',
  price: '',
  discount: '0',
  loveNote: '',
}

const inputClass = (err?: boolean) =>
  cn(
    'rounded-xl h-auto py-3 text-sm text-main placeholder:text-main/30 bg-white focus-visible:ring-0 focus-visible:border-secondary transition-colors',
    err ? 'border-red-400' : 'border-main/15',
  )

const selectClass = (err?: boolean) =>
  cn(
    'rounded-xl h-auto py-3 text-sm bg-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0',
    err ? 'border-red-400' : 'border-main/15',
  )

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

const HOW_TO_STEPS = [
  {
    icon: BookOpen,
    title: 'Fill in Book Details',
    desc: 'Add the title, author, genre, condition, and format of your book.',
  },
  {
    icon: Camera,
    title: 'Upload Photos',
    desc: 'Take clear photos of the front cover, back cover, and any wear or marks.',
  },
  {
    icon: DollarSign,
    title: 'Set Your Price',
    desc: 'Price your book fairly. We add a 10% buyer fee on top — you keep 90% of your listed price.',
  },
  {
    icon: CheckCircle,
    title: 'Submit for Review',
    desc: "Hit 'Submit' and our team will review your listing. It usually goes live within 24 hours.",
  },
]

export default function ListBook() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [photos, setPhotos] = useState<File[]>([])
  const [photoURLs, setPhotoURLs] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [guideStep, setGuideStep] = useState(0)

  useEffect(() => {
    setShowGuide(true)
  }, [])

  const { icon: StepIcon, title: stepTitle, desc: stepDesc } = HOW_TO_STEPS[guideStep]
  const isLastStep = guideStep === HOW_TO_STEPS.length - 1

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }))
  }

  function setSelect(field: keyof FormState) {
    return (value: string) => setForm(p => ({ ...p, [field]: value }))
  }

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5)
      photoURLs.forEach(url => URL.revokeObjectURL(url))
      setPhotos(files)
      setPhotoURLs(files.map(f => URL.createObjectURL(f)))
    }
  }

  function removePhoto(index: number) {
    URL.revokeObjectURL(photoURLs[index])
    setPhotos(p => p.filter((_, i) => i !== index))
    setPhotoURLs(u => u.filter((_, i) => i !== index))
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
      conditionNotes: form.conditionNotes.trim(),
      quantity: Number(form.quantity),
      format: form.format,
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

      {/* How-to-list guide dialog */}
      <Dialog open={showGuide} onOpenChange={(open) => { if (!open) { setShowGuide(false); setGuideStep(0) } }}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl [&>button:last-of-type]:hidden">
          <DialogTitle className="sr-only">How to list a book</DialogTitle>
          <DialogDescription className="sr-only">A step-by-step guide to listing your book on Alakowe</DialogDescription>

          {/* Coloured header */}
          <div className="bg-main px-7 py-6 relative">
            <DialogClose className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-white/30">
              <X size={18} />
              <span className="sr-only">Close</span>
            </DialogClose>
            <p className="text-white/55 text-xs font-semibold uppercase tracking-widest mb-1">
              How to list a book
            </p>
            <h2 className="font-heading font-bold text-white text-xl leading-snug">
              Here's how to get started
            </h2>
          </div>

          {/* Step body */}
          <div className="px-7 pt-6 pb-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-1.5">
                {HOW_TO_STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`block rounded-full transition-all ${i === guideStep ? 'w-6 h-2 bg-main' : 'w-2 h-2 bg-main/15'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-main/40 font-medium">
                Step {guideStep + 1} of {HOW_TO_STEPS.length}
              </span>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-5">
              <StepIcon size={28} className="text-secondary" />
            </div>
            <h3 className="font-heading font-bold text-main text-lg mb-2">{stepTitle}</h3>
            <p className="text-sm text-main/55 leading-relaxed">{stepDesc}</p>
          </div>

          {/* Footer nav */}
          <div className="px-7 py-5 flex items-center justify-between border-t border-main/8 mt-6">
            <Button
              variant="ghost"
              onClick={() => setGuideStep(s => s - 1)}
              disabled={guideStep === 0}
              className="flex items-center gap-1.5 text-sm text-main/40 hover:text-main disabled:opacity-0 disabled:pointer-events-none h-auto p-0"
            >
              <ArrowLeft size={14} /> Back
            </Button>

            {isLastStep ? (
              <DialogClose asChild>
                <Button className="bg-main text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-main/90 h-auto">
                  Start listing
                </Button>
              </DialogClose>
            ) : (
              <Button
                onClick={() => setGuideStep(s => s + 1)}
                className="bg-main text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-main/90 h-auto"
              >
                Next
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
            Fill in the details below. Your listing will go live once our team reviews it. Usually within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* ── Book Details ── */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-5">Book Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Field label="Book Title" required error={errors.title}>
                  <Input type="text" placeholder="e.g. Things Fall Apart" value={form.title}
                    onChange={set('title')} className={inputClass(!!errors.title)} />
                </Field>
              </div>
              <Field label="Author" required error={errors.author}>
                <Input type="text" placeholder="e.g. Chinua Achebe" value={form.author}
                  onChange={set('author')} className={inputClass(!!errors.author)} />
              </Field>
              <Field label="Category" required error={errors.genre}>
                <Select value={form.genre} onValueChange={setSelect('genre')}>
                  <SelectTrigger className={cn(selectClass(!!errors.genre), !form.genre && 'text-main/30')}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENRES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Condition" required error={errors.condition}>
                <Select value={form.condition} onValueChange={setSelect('condition')}>
                  <SelectTrigger className={cn(selectClass(!!errors.condition), !form.condition && 'text-main/30')}>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Quantity" required>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 2"
                  value={form.quantity}
                  onChange={set('quantity')}
                  className={inputClass()}
                />
              </Field>
              <Field label="Format" required>
                <Select value={form.format} onValueChange={setSelect('format')}>
                  <SelectTrigger className={cn(selectClass(), !form.format && 'text-main/30')}>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hardcover">Hardcover</SelectItem>
                    <SelectItem value="Paperback">Paperback</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>

          {/* ── Condition Notes ── */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">Declare Book Condition</h2>
            <p className="text-xs text-main/45 mb-4">Be honest about its condition and any marks or damages.</p>
            <Field label="Condition" required error={errors.description}>
              <Textarea
                placeholder="e.g. There's a small crease on the spine and a few pencil marks in chapter 3. Pages are clean overall."
                value={form.conditionNotes}
                onChange={set('conditionNotes')}
                rows={5}
                className="rounded-xl text-sm text-main placeholder:text-main/30 border-main/15 bg-white focus-visible:ring-0 focus-visible:border-secondary transition-colors resize-none"
              />
            </Field>
          </div>

          {/* ── Book Overview ── */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">Book Overview</h2>
            <p className="text-xs text-main/45 mb-4">Provide a brief overview of the book.</p>
            <Field label="Description" required error={errors.description}>
              <Textarea
                value={form.description}
                onChange={set('description')}
                rows={5}
                className="rounded-xl text-sm text-main placeholder:text-main/30 border-main/15 bg-white focus-visible:ring-0 focus-visible:border-secondary transition-colors resize-none"
              />
            </Field>
          </div>

          {/* ── Pricing ── */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">Pricing</h2>
            <p className="text-xs text-main/45 mb-4">Set a fair price. Listings priced too high may be flagged during review.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Price (₦)" required error={errors.price}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-main/40 font-medium">₦</span>
                  <Input
                    type="number"
                    min="100"
                    placeholder="e.g. 3000"
                    value={form.price}
                    onChange={set('price')}
                    className={cn(inputClass(!!errors.price), 'pl-8')}
                  />
                </div>
              </Field>
              <Field label="Discount (%)" error={errors.discount}>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    placeholder="0"
                    value={form.discount}
                    onChange={set('discount')}
                    className={cn(inputClass(!!errors.discount), 'pr-8')}
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
            <h2 className="font-heading font-bold text-main text-base mb-1">Photos</h2>
            <p className="text-xs text-main/45 mb-4">Upload up to 5 photos: front cover, back cover, and any marks.</p>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-main/15 rounded-xl py-8 cursor-pointer hover:border-secondary/40 transition-colors">
              <Upload size={24} className="text-main/30 mb-2" />
              <span className="text-sm text-main/50 font-medium">Click to upload photos</span>
              <span className="text-xs text-main/30 mt-1">PNG, JPG up to 5MB each</span>
              <input type="file" multiple accept="image/*" className="sr-only" onChange={handlePhotos} />
            </label>
            {photoURLs.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {photoURLs.map((url, i) => (
                  <div key={url} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-main/10">
                    <img src={url} alt={photos[i]?.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
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
            <Textarea
              placeholder="e.g. This book changed how I see the world. I hope it does the same for you…"
              value={form.loveNote}
              onChange={set('loveNote')}
              rows={3}
              className="rounded-xl text-sm text-main placeholder:text-main/30 border-secondary/25 bg-white focus-visible:ring-0 focus-visible:border-secondary transition-colors resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-main text-white font-semibold h-auto py-4 rounded-xl hover:bg-main/90 transition-colors text-sm disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit Listing for Review'}
          </Button>

          <p className="text-xs text-main/35 text-center">
            Our team will review your listing within 24 hours. You'll be notified by email.
          </p>

        </form>
      </div>
    </div>
  )
}
