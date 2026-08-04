import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Upload, Heart, BookOpen, Camera, DollarSign, CheckCircle, X, Loader2, Bell, Truck, Sparkles, HelpCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSubmitListing } from '../../lib/api/listings/listings.hooks'
import { useSellerStoreProfile } from '../../lib/api/store/store.hooks'
import { CONDITIONS } from '../../data/sellerData'
import type { BookCondition } from '../../lib/api/types'
import { compressImage, uploadToCloudinary, isImageTypeAllowed } from '../../lib/upload'
import {
  clearListingDraft,
  dataUrlToFile,
  loadListingDraft,
  saveListingDraft,
} from '../../lib/listingDraft'
import { useCategories } from '../../lib/api/categories/categories.hooks'
import { useStates, useAreasByState } from '../../lib/api/location/location.hooks'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FormControl, SelectBoxControl, TextareaControl, FileUpload, type SelectOption } from '@/components/ui/form-controls'

const HOW_TO_STEPS = [
  {
    step: 1,
    title: 'List your book in minutes and start reaching readers across Nigeria.',
    type: 'simple',
    icon: BookOpen,
  },
  {
    step: 2,
    title: "You'll be notified immediately your book sells and be guided through the next steps.",
    type: 'simple',
    icon: Bell,
  },
  {
    step: 3,
    title: 'Depending on your listing, you can:',
    type: 'options',
    options: [
      'drop the book off at our partner location nearest to you',
      'or',
      'meet the buyer for direct pickup from you'
    ],
    icon: Truck,
  },
  {
    step: 4,
    title: 'Once your order is completed, your earnings are sent directly to your bank account.',
    type: 'simple',
    icon: DollarSign,
  },
  {
    step: 5,
    title: 'You’re all set.',
    subtitle: 'It only takes a few minutes to list your first book.',
    type: 'final',
    icon: Sparkles,
  },
]

type PhotoEntry = {
  file: File
  preview: string
  isCover: boolean
}

type FormState = {
  title: string
  author: string
  genre: string
  subGenre: string
  pageCount: string
  condition: string
  quantity: string
  format: string
  conditionNotes: string
  description: string
  price: string
  discount: string
  loveNote: string
  stateId: string
  areaId: string
}

const empty: FormState = {
  title: '',
  author: '',
  genre: '',
  subGenre: '',
  pageCount: '',
  condition: '',
  quantity: '1',
  format: '',
  conditionNotes: '',
  description: '',
  price: '',
  discount: '0',
  loveNote: '',
  stateId: '',
  areaId: '',
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
  const submitListing = useSubmitListing()
  const { data: storeProfile } = useSellerStoreProfile(!!user)
  const { data: categories } = useCategories()
  const { data: states } = useStates()
  const [selectedStateId, setSelectedStateId] = useState<number>(0)
  const { data: areas } = useAreasByState(selectedStateId || undefined)
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [photos, setPhotos] = useState<PhotoEntry[]>([])
  const [photoError, setPhotoError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [showGuide, setShowGuide] = useState(false)
  const [showConditionGuide, setShowConditionGuide] = useState(false)
  const [guideStep, setGuideStep] = useState(0)
  const [savingDraft, setSavingDraft] = useState(false)
  const [draftPhotosNote, setDraftPhotosNote] = useState<string | null>(null)
  const previewUrls = useRef<string[]>([])

  const basePrice = parseFloat(form.price) || 0
  const discountPercent = parseFloat(form.discount) || 0
  const effectivePrice = Math.max(0, basePrice * (1 - discountPercent / 100))
  const listedPrice = Math.round(effectivePrice * 1.10)
  const platformFee = Math.round(effectivePrice * 0.10)
  const payoutAmount = Math.max(0, effectivePrice - platformFee)

  useEffect(() => {
    const draft = loadListingDraft()
    if (!draft || draft.kind !== 'create') {
      setShowGuide(true)
      return
    }

    setShowGuide(false)
    setForm({ ...empty, ...draft.form })
    setSelectedStateId(Number(draft.form.stateId) || 0)

    if (draft.photosOmitted) {
      setDraftPhotosNote('Your photos could not be restored from the draft. Please add them again.')
    }

    if (draft.photos.length === 0) return

    let cancelled = false
    ;(async () => {
      try {
        const entries: PhotoEntry[] = []
        for (const p of draft.photos) {
          const file = await dataUrlToFile(p.dataUrl, p.name)
          const preview = URL.createObjectURL(file)
          previewUrls.current.push(preview)
          entries.push({ file, preview, isCover: p.isCover })
        }
        if (!cancelled) {
          if (entries.length > 0 && !entries.some((e) => e.isCover)) {
            entries[0].isCover = true
          }
          setPhotos(entries)
        }
      } catch {
        if (!cancelled) {
          setDraftPhotosNote('Your photos could not be restored from the draft. Please add them again.')
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const fulfillmentOption = storeProfile?.fulfillmentOption ?? 'Courier'
  const fulfillmentCopy =
    fulfillmentOption === 'Pickup'
      ? {
          label: 'Buyer pickup',
          hint: 'Buyers collect from your address.',
        }
      : fulfillmentOption === 'Both'
        ? {
            label: 'Delivery or pickup',
            hint: 'Buyers choose at checkout. Delivery means you drop off at a Speedaf station after the sale.',
          }
        : {
            label: 'Alákòwé delivery',
            hint: 'After a sale, you drop the book at a Speedaf station.',
          }

  const isLastStep = guideStep === HOW_TO_STEPS.length - 1

  useEffect(() => {
    const urls = previewUrls.current
    return () => urls.forEach(u => URL.revokeObjectURL(u))
  }, [])

  async function goToDeliverySettings() {
    setSavingDraft(true)
    try {
      await saveListingDraft({
        form,
        photos: photos.map((p) => ({ file: p.file, isCover: p.isCover })),
      })
      navigate('/account#delivery')
    } finally {
      setSavingDraft(false)
    }
  }

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value
      setForm(p => {
        const next = { ...p, [field]: value }
        if (field === 'stateId') {
          next.areaId = ''
        }
        return next
      })
      if (field === 'stateId') {
        setSelectedStateId(Number(value) || 0)
      }
    }
  }

  function setSelect(field: keyof FormState) {
    return (option: SelectOption) => {
      const value = String(option.value)
      setForm(p => {
        const next = { ...p, [field]: value }
        if (field === 'stateId') {
          next.areaId = ''
        }
        return next
      })
      if (field === 'stateId') {
        setSelectedStateId(Number(value) || 0)
      }
    }
  }

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotoError('')
    const files = e.target.files
    if (!files) return
    const newFiles = Array.from(files)
    const totalCount = photos.length + newFiles.length
    if (totalCount > 5) {
      setPhotoError(`You can upload a maximum of 5 photos (${totalCount} selected)`)
      e.target.value = ''
      return
    }
    for (const f of newFiles) {
      if (!isImageTypeAllowed(f)) {
        setPhotoError(`"${f.name}" is not a supported format. Use JPG, JPEG or PNG only.`)
        e.target.value = ''
        return
      }
      if (f.size > 5 * 1024 * 1024) {
        setPhotoError(`"${f.name}" exceeds the 5 MB limit`)
        e.target.value = ''
        return
      }
    }
    const newPreviews = newFiles.map(f => URL.createObjectURL(f))
    previewUrls.current.push(...newPreviews)
    setPhotos(prev => {
      const entries: PhotoEntry[] = newFiles.map((f, i) => ({
        file: f,
        preview: newPreviews[i],
        isCover: false,
      }))
      const updated = [...prev, ...entries]
      if (updated.length > 0 && !updated.some(p => p.isCover)) {
        updated[0].isCover = true
      }
      return updated
    })
    setDraftPhotosNote(null)
    e.target.value = ''
  }

  function removePhoto(index: number) {
    const removed = photos[index]
    URL.revokeObjectURL(removed.preview)
    setPhotos(prev => {
      const updated = prev.filter((_, i) => i !== index)
      if (removed.isCover && updated.length > 0) {
        updated[0].isCover = true
      }
      return updated
    })
    setPhotoError('')
  }

  function setCover(index: number) {
    setPhotos(prev => prev.map((p, i) => ({ ...p, isCover: i === index })))
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
    if (!form.stateId) e.stateId = 'Please select a state'
    if (!form.areaId) e.areaId = 'Please select an area'
    return e
  }

  function validatePhotos(): string | null {
    if (photos.length < 3) return 'At least 3 photos are required'
    if (photos.length > 5) return 'Maximum of 5 photos allowed'
    for (const p of photos) {
      if (p.file.size > 5 * 1024 * 1024) return `"${p.file.name}" exceeds the 5 MB limit`
    }
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    const photoErr = validatePhotos()
    if (photoErr) setPhotoError(photoErr)
    if (Object.keys(errs).length > 0 || photoErr) { setErrors(errs); return }
    setErrors({})
    setPhotoError('')

    setUploading(true)
    setUploadProgress('Compressing images…')

    try {
      const compressed = await Promise.all(
        photos.map(p => compressImage(p.file))
      )

      setUploadProgress('Uploading images…')

      const filenames = await Promise.all(
        compressed.map((blob, i) => uploadToCloudinary(blob, photos[i].file.name))
      )

      const cover = photos.findIndex(p => p.isCover)
      const coverFile = filenames[cover] ?? filenames[0]

      const result = await submitListing.mutateAsync({
        title: form.title.trim(),
        author: form.author.trim(),
        categoryId: Number(form.genre),
        bookCondition: form.condition as BookCondition,
        conditionDetail: form.conditionNotes.trim() || undefined,
        format: form.format || undefined,
        description: form.description.trim(),
        price: Math.round(parseFloat(form.price) * 100),
        quantity: Number(form.quantity),
        loveNote: form.loveNote.trim() || undefined,
        isbn: undefined,
        coverImageFileName: coverFile,
        imageFileNames: filenames,
        discount: form.discount ? Number(form.discount) : undefined,
        stateId: Number(form.stateId),
        areaId: Number(form.areaId),
      })
      clearListingDraft()
      navigate(`/listing-submitted?id=${result.id}`)
    } catch {
      setErrors({ title: 'Failed to submit listing. Please try again.' })
    } finally {
      setUploading(false)
      setUploadProgress('')
    }
  }

  return (
    <div className="bg-third min-h-screen">

      {/* How-to-list guide dialog */}
      <Dialog open={showGuide} onOpenChange={(open) => { if (!open) { setShowGuide(false); setGuideStep(0) } }}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border-0 shadow-2xl [&>button:last-of-type]:hidden">
          <DialogTitle className="sr-only">How to list a book</DialogTitle>
          <DialogDescription className="sr-only">A step-by-step guide to listing your book on Alakowe</DialogDescription>

          {/* Coloured Header Banner */}
          <div className="bg-gradient-to-r from-main to-main/90 px-7 py-6 relative text-white">
            <DialogClose className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors rounded-full p-1 focus:outline-none">
              <X size={18} />
              <span className="sr-only">Close</span>
            </DialogClose>
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles size={12} className="text-secondary" />
              <span>Seller Guide</span>
            </div>
            <h2 className="font-heading font-bold text-white text-xl leading-snug">
              List Your Book on Alákòwé
            </h2>
          </div>

          {/* Step body */}
          <div className="px-7 pt-6 pb-2">
            {/* Step progress pills */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-1.5">
                {HOW_TO_STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`block rounded-full transition-all ${i === guideStep ? 'w-7 h-2 bg-secondary' : 'w-2 h-2 bg-main/15'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-main/40 font-semibold">
                Step {guideStep + 1} of {HOW_TO_STEPS.length}
              </span>
            </div>

            {/* Illustration Frame */}
            <div className="w-full h-32 bg-gradient-to-br from-violet-50/80 to-indigo-50/50 border border-violet-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center mb-6 relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-white border border-violet-100 shadow-sm flex items-center justify-center text-secondary mb-1">
                {guideStep === 0 && <BookOpen size={28} />}
                {guideStep === 1 && <Bell size={28} />}
                {guideStep === 2 && <Truck size={28} />}
                {guideStep === 3 && <DollarSign size={28} />}
                {guideStep === 4 && <Sparkles size={28} />}
              </div>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                {guideStep === 4 ? 'Ready to List' : `Step 0${guideStep + 1}`}
              </span>
            </div>

            {/* Content text */}
            {HOW_TO_STEPS[guideStep].type === 'final' ? (
              <div className="text-center space-y-2 py-1">
                <h3 className="font-heading font-bold text-main text-2xl">
                  {HOW_TO_STEPS[guideStep].title}
                </h3>
                <p className="text-sm text-main/60 leading-relaxed max-w-xs mx-auto">
                  {HOW_TO_STEPS[guideStep].subtitle}
                </p>
              </div>
            ) : HOW_TO_STEPS[guideStep].type === 'options' ? (
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-main text-base leading-snug">
                  {HOW_TO_STEPS[guideStep].title}
                </h3>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-start gap-2.5 text-xs text-main/80 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-1.5" />
                    <span>drop the book off at our partner location nearest to you</span>
                  </div>
                  <div className="text-center text-[11px] font-bold text-secondary uppercase tracking-wider py-0.5">
                    or
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-main/80 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-1.5" />
                    <span>meet the buyer for direct pickup from you</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-heading font-bold text-main text-base sm:text-lg leading-relaxed">
                  {HOW_TO_STEPS[guideStep].title}
                </p>
              </div>
            )}
          </div>

          {/* Footer nav */}
          <div className="px-7 py-5 flex items-center justify-between border-t border-main/8 mt-6">
            {guideStep > 0 ? (
              <Button
                variant="outline"
                onClick={() => setGuideStep(s => s - 1)}
                className="flex items-center gap-1.5 text-xs font-semibold text-main/70 border-main/15 hover:bg-main/5 rounded-xl px-4 py-2.5 h-auto"
              >
                <ArrowLeft size={14} /> Previous
              </Button>
            ) : <div />}

            {guideStep < HOW_TO_STEPS.length - 1 ? (
              <Button
                onClick={() => setGuideStep(s => s + 1)}
                className="bg-primary text-primary-foreground text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 shadow-sm h-auto flex items-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight size={14} />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowGuide(false)
                    navigate('/sell')
                  }}
                  className="text-xs font-semibold border-main/15 text-main hover:bg-main/5 rounded-xl px-4 py-2.5 h-auto"
                >
                  Learn More
                </Button>
                <DialogClose asChild>
                  <Button className="bg-primary text-primary-foreground text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 shadow-sm h-auto">
                    Start Listing
                  </Button>
                </DialogClose>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Condition Guide Dialog */}
      <Dialog open={showConditionGuide} onOpenChange={setShowConditionGuide}>
        <DialogContent className="max-w-lg rounded-3xl p-6">
          <DialogTitle className="font-heading font-bold text-main text-xl mb-1">
            Understanding Book Conditions
          </DialogTitle>
          <DialogDescription className="text-xs text-main/55 mb-4">
            How we classify books on Alákòwé to help buyers buy with confidence.
          </DialogDescription>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="font-bold text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded mr-2">New</span>
              <p className="text-xs text-main/70 mt-1">Brand new, unread, perfect condition with no missing pages or marks.</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="font-bold text-xs text-violet-700 bg-violet-100 px-2 py-0.5 rounded mr-2">Like New</span>
              <p className="text-xs text-main/70 mt-1">Looks unread. May have tiny shelf wear, but no writing or folded pages.</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="font-bold text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded mr-2">Excellent</span>
              <p className="text-xs text-main/70 mt-1">Lightly read with minimal cover wear. Spine intact and pages clean.</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="font-bold text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded mr-2">Good</span>
              <p className="text-xs text-main/70 mt-1">Shows normal reading wear, minor creases on cover or spine, or light notes/highlighting.</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="font-bold text-xs text-rose-700 bg-rose-100 px-2 py-0.5 rounded mr-2">Fair / Poor</span>
              <p className="text-xs text-main/70 mt-1">Well-read with noticeable wear, water spots, or heavy annotations, but complete and readable.</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowConditionGuide(false)} className="bg-primary text-primary-foreground text-xs font-bold px-6 py-2.5 rounded-xl">
              Got it
            </Button>
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

          {/* 1. Photos */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">Photos</h2>
            <p className="text-xs text-main/45 mb-4">Upload 3–5 photos of your book. Tap a thumbnail to set it as the cover.</p>
            {photoError && <p className="text-xs text-red-500 mb-3">{photoError}</p>}
            {photos.length < 5 && (
              <FileUpload
                id="book-photos"
                label="Click to upload photos"
                hint="PNG, JPG up to 5MB each"
                icon={Upload}
                multiple
                accept=".jpg,.jpeg,.png"
                onChange={handlePhotos}
                disabled={uploading}
                style="border-main/15 py-8 hover:border-secondary/40 hover:bg-transparent bg-transparent"
              />
            )}
            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {photos.map((p, i) => (
                  <div key={p.preview} className="relative group aspect-[3/4] rounded-xl overflow-hidden border border-main/10">
                    <img src={p.preview} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={uploading}>
                      <X size={14} />
                    </button>
                    {p.isCover ? (
                      <span className="absolute bottom-1 left-1 bg-secondary text-white text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <CheckCircle size={10} /> Cover
                      </span>
                    ) : (
                      <button type="button" onClick={() => setCover(i)}
                        className="absolute bottom-1 left-1 bg-black/40 text-white text-[10px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={uploading}>
                        Make Cover
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {uploading && (
              <div className="mt-4 flex items-center gap-2 text-sm text-secondary font-medium">
                <Loader2 size={16} className="animate-spin" />
                {uploadProgress}
              </div>
            )}
          </div>

          {/* 2. Book Details */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-5">Book Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Field label="Book Title" required error={errors.title}>
                  <FormControl type="text" placeholder="e.g. Things Fall Apart" value={form.title}
                    onChange={set('title')} style={inputClass(!!errors.title)} />
                </Field>
              </div>
              <Field label="Author" required error={errors.author}>
                <FormControl type="text" placeholder="e.g. Chinua Achebe" value={form.author}
                  onChange={set('author')} style={inputClass(!!errors.author)} />
              </Field>

              {/* Category, Genre, No. of Pages placed together */}
              <Field label="Category" required error={errors.genre}>
                <SelectBoxControl
                  placeholder="Select category"
                  options={categories?.map(c => ({ label: c.name, value: c.id })) ?? []}
                  value={categories?.map(c => ({ label: c.name, value: c.id })).find(o => String(o.value) === form.genre) ?? null}
                  onChange={setSelect('genre')}
                  style={inputClass(!!errors.genre)}
                />
              </Field>
              <Field label="Genre">
                <FormControl type="text" placeholder="e.g. Historical Fiction" value={form.subGenre}
                  onChange={set('subGenre')} style={inputClass()} />
              </Field>
              <Field label="No. of Pages">
                <FormControl type="number" min="1" placeholder="e.g. 215" value={form.pageCount}
                  onChange={set('pageCount')} style={inputClass()} />
              </Field>

              <Field label="Quantity" required>
                <FormControl type="number" min="1" placeholder="e.g. 1" value={form.quantity}
                  onChange={set('quantity')} style={inputClass()} />
              </Field>
              <Field label="Format" required>
                <SelectBoxControl
                  placeholder="Select format"
                  options={[{ label: 'Hardcover', value: 'Hardcover' }, { label: 'Paperback', value: 'Paperback' }]}
                  value={form.format ? { label: form.format, value: form.format } : null}
                  onChange={setSelect('format')}
                  style={inputClass()}
                />
              </Field>
              <Field label="State" required error={errors.stateId}>
                <SelectBoxControl
                  placeholder="Select state"
                  options={states?.map(s => ({ label: s.name, value: s.id })) ?? []}
                  value={states?.map(s => ({ label: s.name, value: s.id })).find(o => String(o.value) === form.stateId) ?? null}
                  onChange={setSelect('stateId')}
                  style={inputClass(!!errors.stateId)}
                />
              </Field>
              <Field label="Area" required error={errors.areaId}>
                <SelectBoxControl
                  placeholder={selectedStateId ? 'Select area' : 'Select state first'}
                  options={areas?.map(a => ({ label: a.name, value: a.id })) ?? []}
                  value={areas?.map(a => ({ label: a.name, value: a.id })).find(o => String(o.value) === form.areaId) ?? null}
                  onChange={setSelect('areaId')}
                  disabled={!selectedStateId}
                  style={inputClass(!!errors.areaId)}
                />
              </Field>
            </div>
          </div>

          {/* 3. Declare Book Condition */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h2 className="font-heading font-bold text-main text-base">Declare Book Condition</h2>
              <button
                type="button"
                onClick={() => setShowConditionGuide(true)}
                className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1 focus:outline-none"
              >
                <HelpCircle size={14} />
                <span>Learn more</span>
              </button>
            </div>
            <p className="text-xs text-main/45 mb-4">Be honest about its condition and any marks or damages.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Field label="Condition Grade" required error={errors.condition}>
                <SelectBoxControl
                  placeholder="Select condition"
                  options={CONDITIONS.map(c => ({ label: c, value: c }))}
                  value={CONDITIONS.map(c => ({ label: c, value: c })).find(o => o.value === form.condition) ?? null}
                  onChange={setSelect('condition')}
                  style={inputClass(!!errors.condition)}
                />
              </Field>
            </div>

            <Field label="Condition Notes / Defects">
              <TextareaControl placeholder="e.g. There's a small crease on the spine and a few pencil marks in chapter 3."
                value={form.conditionNotes} onChange={set('conditionNotes')} rows={4}
                style="border border-main/15 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus-visible:ring-0 focus:border-secondary transition-colors bg-white" />
            </Field>
          </div>

          {/* 4. Pricing */}
          <div className="bg-white rounded-2xl border border-third p-6 sm:p-7">
            <h2 className="font-heading font-bold text-main text-lg sm:text-xl mb-1">Pricing</h2>
            <p className="text-xs text-main/50 mb-5">
              Set a fair price. Listings priced too high may be flagged during review.
            </p>

feature/landing
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <Field label="PRICE (₦)" required error={errors.price}
          {/* Delivery option from store settings */}
          <div className="bg-white rounded-2xl border border-third p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-main/45 mb-1">
                How buyers get this book
              </p>
              <p className="text-sm font-semibold text-main">{fulfillmentCopy.label}</p>
              <p className="text-xs text-main/50 mt-1 leading-relaxed">{fulfillmentCopy.hint}</p>
            </div>
            <button
              type="button"
              onClick={() => void goToDeliverySettings()}
              disabled={savingDraft}
              className="text-xs font-semibold text-secondary hover:underline shrink-0 disabled:opacity-60"
            >
              {savingDraft ? 'Saving draft…' : 'Change delivery settings →'}
            </button>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">Pricing</h2>
            <p className="text-xs text-main/45 mb-4">Set a fair price.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Price (₦)" required error={errors.price}>dev
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-main/40 font-semibold select-none">
                    ₦
                  </span>
                  <FormControl
                    type="number"
                    min="100"
                    placeholder="3000"
                    value={form.price}
                    onChange={set('price')}
                    style={`${inputClass(!!errors.price)} pl-9 rounded-2xl focus:ring-1 focus:ring-secondary`}
                  />
                </div>
              </Field>
              <Field label="DISCOUNT (%)" error={errors.discount}>
                <div className="relative">
                  <FormControl
                    type="number"
                    min="0"
                    max="50"
                    placeholder="0"
                    value={form.discount}
                    onChange={set('discount')}
                    style={`${inputClass(!!errors.discount)} pr-10 rounded-2xl focus:ring-1 focus:ring-secondary`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-main/40 font-medium select-none">
                    %
                  </span>
                </div>
              </Field>
            </div>
                feature/landing
            {/* Payout Breakdown Box */}
            <div className="bg-[#F8F9FC] border border-main/8 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-main/60 font-medium">Listed price (what buyer pays)</span>
                <span className="text-main font-bold">₦{listedPrice.toLocaleString()}</span>

          {/* Photos */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">Photos</h2>
            <p className="text-xs text-main/45 mb-4">Upload 3–5 photos. Tap a thumbnail to set it as the cover.</p>
            {draftPhotosNote && <p className="text-xs text-amber-700 mb-3">{draftPhotosNote}</p>}
            {photoError && <p className="text-xs text-red-500 mb-3">{photoError}</p>}
            {photos.length < 5 && (
              <FileUpload
                id="book-photos"
                label="Click to upload photos"
                hint="PNG, JPG up to 5MB each"
                icon={Upload}
                multiple
                accept=".jpg,.jpeg,.png"
                onChange={handlePhotos}
                disabled={uploading}
                style="border-main/15 py-8 hover:border-secondary/40 hover:bg-transparent bg-transparent"
              />
            )}
            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {photos.map((p, i) => (
                  <div key={p.preview} className="relative group aspect-[3/4] rounded-xl overflow-hidden border border-main/10">
                    <img src={p.preview} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={uploading}>
                      <X size={14} />
                    </button>
                    {p.isCover ? (
                      <span className="absolute bottom-1 left-1 bg-secondary text-white text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <CheckCircle size={10} /> Cover
                      </span>
                    ) : (
                      <button type="button" onClick={() => setCover(i)}
                        className="absolute bottom-1 left-1 bg-black/40 text-white text-[10px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={uploading}>
                        Make Cover
                      </button>
                    )}
                  </div>
                ))}
                dev
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-main/60 font-medium">Alakowe fee (10%)</span>
                <span className="text-main/50 font-medium">-₦{platformFee.toLocaleString()}</span>
              </div>
              <hr className="border-t border-main/10 my-1" />
              <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
                <span className="text-main font-bold">Your payout</span>
                <span className="text-main font-bold text-base">₦{payoutAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 5. Book Synopsis */}
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">Book Synopsis</h2>
            <p className="text-xs text-main/45 mb-4">Provide a clear synopsis/description of the book so buyers know what to expect.</p>
            <Field label="Synopsis" required error={errors.description}>
              <TextareaControl value={form.description} onChange={set('description')} rows={5} placeholder="Describe the storyline, theme, or summary of the book..."
                style="border border-main/15 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus-visible:ring-0 focus:border-secondary transition-colors bg-white" />
            </Field>
          </div>

          {/* 6. Love Note */}
          <div className="bg-secondary/6 border border-secondary/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Heart size={15} className="text-secondary" />
              <h2 className="font-heading font-bold text-main text-base">Love Note to the Next Reader</h2>
            </div>
            <p className="text-xs text-main/45 mb-4">
              Leave a personal message for whoever buys this book.
            </p>
            <TextareaControl placeholder="e.g. This book changed how I see the world…" value={form.loveNote}
              onChange={set('loveNote')} rows={3}
              style="border border-secondary/25 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus-visible:ring-0 focus:border-secondary transition-colors bg-white" />
          </div>

          <button type="submit" disabled={submitListing.isPending || uploading}
            className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-4 rounded-xl transition-colors text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading…' : submitListing.isPending ? 'Submitting…' : 'Submit Listing for Review'}
          </button>

          <p className="text-xs text-main/35 text-center">
            Our team will review your listing within 24 hours. You'll be notified by email.
          </p>

        </form>
      </div>
    </div>
  )
}
