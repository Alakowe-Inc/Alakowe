import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, Upload, X, CheckCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useListing, useEditListing } from '../../lib/api/listings/listings.hooks'
import { useSellerStoreProfile } from '../../lib/api/store/store.hooks'
import { GENRES, CONDITIONS } from '../../data/sellerData'
import type { BookCondition } from '../../lib/api/types'
import { useStates, useAreasByState } from '../../lib/api/location/location.hooks'
import { compressImage, uploadToCloudinary, isImageTypeAllowed } from '../../lib/upload'
import {
  clearListingDraft,
  dataUrlToFile,
  loadListingDraft,
  saveEditListingDraft,
} from '../../lib/listingDraft'
import { FormControl, SelectBoxControl, TextareaControl, FileUpload, type SelectOption } from '@/components/ui/form-controls'

type FormState = {
  title: string; author: string; genre: string; condition: string
  conditionDetail: string; description: string; price: string; discount: string; loveNote: string
  stateId: string; areaId: string
}

type NewPhotoEntry = {
  file: File
  preview: string
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
  const { data: listing } = useListing(Number(id))
  const { data: storeProfile } = useSellerStoreProfile(!!user)
  const editListing = useEditListing()
  const { data: states } = useStates()
  const [selectedStateId, setSelectedStateId] = useState<number>(0)
  const { data: areas } = useAreasByState(selectedStateId || undefined)

  const [form, setForm] = useState<FormState | null>(null)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [coverIndex, setCoverIndex] = useState(0)
  const [newPhotos, setNewPhotos] = useState<NewPhotoEntry[]>([])
  const [photoError, setPhotoError] = useState('')
  const [draftPhotosNote, setDraftPhotosNote] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [savingDraft, setSavingDraft] = useState(false)
  const hydratedForId = useRef<number | null>(null)

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

  useEffect(() => {
    if (!listing || !id) return
    const listingId = Number(id)
    if (!Number.isFinite(listingId) || hydratedForId.current === listingId) return
    hydratedForId.current = listingId

    const draft = loadListingDraft()
    if (draft?.kind === 'edit' && draft.listingId === listingId) {
      setForm(draft.form)
      setExistingImages(draft.existingImages)
      setCoverIndex(draft.coverIndex)
      setSelectedStateId(Number(draft.form.stateId) || 0)
      if (draft.photosOmitted) {
        setDraftPhotosNote('Newly added photos could not be restored from the draft. Please add them again if needed.')
      }
      if (draft.newPhotos.length > 0) {
        void (async () => {
          try {
            const entries: NewPhotoEntry[] = []
            for (const p of draft.newPhotos) {
              const file = await dataUrlToFile(p.dataUrl, p.name)
              entries.push({ file, preview: URL.createObjectURL(file) })
            }
            setNewPhotos(entries)
          } catch {
            setDraftPhotosNote('Newly added photos could not be restored from the draft. Please add them again if needed.')
          }
        })()
      }
      return
    }

    const stateId = listing.stateId ? String(listing.stateId) : ''
    const areaId = listing.areaId ? String(listing.areaId) : ''
    setForm({
      title: listing.title ?? '',
      author: listing.author ?? '',
      genre: listing.categoryName ?? '',
      condition: listing.bookCondition ?? '',
      conditionDetail: listing.conditionDetail ?? '',
      description: listing.description ?? '',
      price: String(Math.round((listing.price ?? 0) / 100)),
      discount: listing.discount != null ? String(listing.discount) : '0',
      loveNote: listing.loveNote ?? '',
      stateId,
      areaId,
    })
    if (listing.stateId) setSelectedStateId(listing.stateId)
    const imgs: string[] = []
    if (listing.coverImageFileName) imgs.push(listing.coverImageFileName)
    if (listing.imageFileNames) imgs.push(...listing.imageFileNames.filter(Boolean))
    setExistingImages(imgs)
  }, [listing, id])

  const notFound = !id || (!listing && !form)

  async function goToDeliverySettings() {
    if (!form || !id) return
    setSavingDraft(true)
    try {
      await saveEditListingDraft({
        listingId: Number(id),
        form,
        existingImages,
        coverIndex,
        newPhotos: newPhotos.map((p) => ({ file: p.file })),
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
        if (!p) return p
        const next = { ...p, [field]: value }
        if (field === 'stateId') next.areaId = ''
        return next
      })
      if (field === 'stateId') setSelectedStateId(Number(value) || 0)
    }
  }

  function setSelect(field: keyof FormState) {
    return (option: SelectOption) => {
      const value = String(option.value)
      setForm(p => {
        if (!p) return p
        const next = { ...p, [field]: value }
        if (field === 'stateId') next.areaId = ''
        return next
      })
      if (field === 'stateId') setSelectedStateId(Number(value) || 0)
    }
  }

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotoError('')
    const files = e.target.files
    if (!files) return
    const newFiles = Array.from(files)
    const totalCount = existingImages.length + newPhotos.length + newFiles.length
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
    const entries: NewPhotoEntry[] = newFiles.map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
    }))
    setNewPhotos(prev => [...prev, ...entries])
    setDraftPhotosNote(null)
    e.target.value = ''
  }

  function removeImage(index: number) {
    const existingCount = existingImages.length
    if (index < existingCount) {
      setExistingImages(prev => prev.filter((_, i) => i !== index))
      if (coverIndex === index) setCoverIndex(0)
      else if (coverIndex > index) setCoverIndex(prev => prev - 1)
    } else {
      const newIndex = index - existingCount
      const removed = newPhotos[newIndex]
      URL.revokeObjectURL(removed.preview)
      setNewPhotos(prev => prev.filter((_, i) => i !== newIndex))
      if (coverIndex === index) setCoverIndex(0)
      else if (coverIndex > index) setCoverIndex(prev => prev - 1)
    }
    setPhotoError('')
  }

  function setCoverImage(index: number) {
    setCoverIndex(index)
  }

  const allImages = [...existingImages, ...newPhotos.map(p => p.preview)]
  const totalImages = allImages.length

  function filenameFromUrl(url: string): string {
    const parts = url.split('/')
    return parts[parts.length - 1].split('?')[0]
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
    if (!form.stateId) e.stateId = 'Please select a state'
    if (!form.areaId) e.areaId = 'Please select an area'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form || !id) return
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})

    try {
      let coverImageFileName: string | undefined
      let imageFileNames: string[] | undefined

      if (totalImages > 0) {
        setUploadProgress('Compressing images…')
        const compressed = await Promise.all(
          newPhotos.map(p => compressImage(p.file))
        )

        setUploadProgress('Uploading images…')
        const uploadedFilenames = await Promise.all(
          compressed.map((blob, i) => uploadToCloudinary(blob, newPhotos[i].file.name))
        )

        imageFileNames = [...existingImages.map(filenameFromUrl), ...uploadedFilenames]
        coverImageFileName = imageFileNames[coverIndex] ?? imageFileNames[0]
      }

      await editListing.mutateAsync({
        id: Number(id),
        title: form.title.trim(),
        author: form.author.trim(),
        categoryId: GENRES.indexOf(form.genre) + 1 || 1,
        bookCondition: form.condition as BookCondition,
        conditionDetail: form.conditionDetail.trim() || undefined,
        description: form.description.trim(),
        price: Math.round(parseFloat(form.price) * 100),
        quantity: 1,
        loveNote: form.loveNote.trim() || undefined,
        coverImageFileName,
        imageFileNames,
        discount: form.discount ? Number(form.discount) : undefined,
        stateId: Number(form.stateId),
        areaId: Number(form.areaId),
      })
      clearListingDraft()
      navigate('/my-listings')
    } catch {
      setErrors({ title: 'Failed to save. Please try again.' })
    } finally {
      setUploading(false)
      setUploadProgress('')
    }
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

        <Link to="/my-listings" className="inline-flex items-center gap-2 text-sm text-main/55 hover:text-main mb-8 transition-colors font-medium">
          <ArrowLeft size={15} /> Back to My Listings
        </Link>

        <div className="mb-8">
          <h1 className="font-heading font-bold text-main text-3xl">Edit Listing</h1>
          <p className="text-main/50 text-sm mt-1">Saving changes will re-submit your listing for review.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-5">Book Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Book Title" required error={errors.title}>
                  <FormControl type="text" value={form.title} onChange={set('title')} style={inputClass(!!errors.title)} />
                </Field>
              </div>
              <Field label="Author" required error={errors.author}>
                <FormControl type="text" value={form.author} onChange={set('author')} style={inputClass(!!errors.author)} />
              </Field>
              <Field label="Genre" required error={errors.genre}>
                <SelectBoxControl
                  placeholder="Select genre"
                  options={GENRES.map(g => ({ label: g, value: g }))}
                  value={GENRES.map(g => ({ label: g, value: g })).find(o => o.value === form.genre) ?? null}
                  onChange={setSelect('genre')}
                  style={inputClass(!!errors.genre)}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Condition" required error={errors.condition}>
                  <SelectBoxControl
                    placeholder="Select condition"
                    options={CONDITIONS.map(c => ({ label: c, value: c }))}
                    value={CONDITIONS.map(c => ({ label: c, value: c })).find(o => o.value === form.condition) ?? null}
                    onChange={setSelect('condition')}
                    style={inputClass(!!errors.condition)}
                  />
                </Field>
              </div>
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

          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">Declare Book Condition</h2>
            <p className="text-xs text-main/45 mb-4">Be honest about its condition and any marks or damages.</p>
            <Field label="Condition Details">
              <TextareaControl value={form.conditionDetail} onChange={set('conditionDetail')} rows={3}
                placeholder="e.g. There's a small crease on the spine and a few pencil marks in chapter 3."
                style="border border-main/15 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus-visible:ring-0 focus:border-secondary transition-colors bg-white" />
            </Field>
            <div className="mt-4">
              <Field label="Description" required error={errors.description}>
                <TextareaControl value={form.description} onChange={set('description')} rows={5}
                  style="border border-main/15 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus-visible:ring-0 focus:border-secondary transition-colors bg-white" />
              </Field>
            </div>
          </div>

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

          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">Photos</h2>
            <p className="text-xs text-main/45 mb-4">Upload up to 5 photos. Tap a thumbnail to set it as the cover.</p>
            {draftPhotosNote && <p className="text-xs text-amber-700 mb-3">{draftPhotosNote}</p>}
            {photoError && <p className="text-xs text-red-500 mb-3">{photoError}</p>}
            {totalImages < 5 && (
              <FileUpload
                id="edit-listing-photos"
                label="Click to add photos"
                hint="PNG, JPG up to 5MB each"
                icon={Upload}
                multiple
                accept=".jpg,.jpeg,.png"
                onChange={handlePhotos}
                disabled={uploading}
                style="border-main/15 py-8 hover:border-secondary/40 hover:bg-transparent bg-transparent"
              />
            )}
            {totalImages > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {allImages.map((img, i) => (
                  <div key={`${img}-${i}`} className="relative group aspect-[3/4] rounded-xl overflow-hidden border border-main/10">
                    <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={uploading}>
                      <X size={14} />
                    </button>
                    {i === coverIndex ? (
                      <span className="absolute bottom-1 left-1 bg-secondary text-white text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <CheckCircle size={10} /> Cover
                      </span>
                    ) : (
                      <button type="button" onClick={() => setCoverImage(i)}
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

          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (₦)" required error={errors.price}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-main/40 font-medium">₦</span>
                  <FormControl type="number" min="100" value={form.price} onChange={set('price')} style={`${inputClass(!!errors.price)} pl-8`} />
                </div>
              </Field>
              <Field label="Discount (%)" error={errors.discount}>
                <div className="relative">
                  <FormControl type="number" min="0" max="50" value={form.discount} onChange={set('discount')} style={`${inputClass(!!errors.discount)} pr-8`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-main/40">%</span>
                </div>
              </Field>
            </div>
          </div>

          <div className="bg-secondary/6 border border-secondary/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={15} className="text-secondary" />
              <h2 className="font-heading font-bold text-main text-base">Love Note</h2>
            </div>
            <TextareaControl value={form.loveNote} onChange={set('loveNote')} rows={3}
              placeholder="A message to the next reader…"
              style="border border-secondary/25 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus-visible:ring-0 focus:border-secondary transition-colors bg-white" />
          </div>

          <button type="submit" disabled={editListing.isPending || uploading}
            className="w-full bg-main text-white font-semibold py-4 rounded-full hover:bg-main/90 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading…' : editListing.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}