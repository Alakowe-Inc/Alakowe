import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, Upload, X, CheckCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useListing, useEditListing } from '../../lib/api/listings/listings.hooks'
import { GENRES, CONDITIONS } from '../../data/sellerData'
import type { BookCondition } from '../../lib/api/types'
import { compressImage, uploadToCloudinary, isImageTypeAllowed } from '../../lib/upload'

type FormState = {
  title: string; author: string; genre: string; condition: string
  conditionDetail: string; description: string; price: string; discount: string; loveNote: string
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
  const editListing = useEditListing()

  const [form, setForm] = useState<FormState | null>(null)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [coverIndex, setCoverIndex] = useState(0)
  const [newPhotos, setNewPhotos] = useState<NewPhotoEntry[]>([])
  const [photoError, setPhotoError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  useEffect(() => {
    if (listing) {
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
      })
      const imgs: string[] = []
      if (listing.coverImageFileName) imgs.push(listing.coverImageFileName)
      if (listing.imageFileNames) imgs.push(...listing.imageFileNames.filter(Boolean))
      setExistingImages(imgs)
    }
  }, [listing])

  const notFound = !id || (!listing && !form)

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => p ? { ...p, [field]: e.target.value } : p)
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
      })
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
                  <input type="text" value={form.title} onChange={set('title')} className={inputClass(!!errors.title)} />
                </Field>
              </div>
              <Field label="Author" required error={errors.author}>
                <input type="text" value={form.author} onChange={set('author')} className={inputClass(!!errors.author)} />
              </Field>
              <Field label="Genre" required error={errors.genre}>
                <select value={form.genre} onChange={set('genre')} className={`${inputClass(!!errors.genre)} text-main`}>
                  <option value="" disabled>Select genre</option>
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Condition" required error={errors.condition}>
                  <select value={form.condition} onChange={set('condition')} className={`${inputClass(!!errors.condition)} text-main`}>
                    <option value="" disabled>Select condition</option>
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">Declare Book Condition</h2>
            <p className="text-xs text-main/45 mb-4">Be honest about its condition and any marks or damages.</p>
            <Field label="Condition Details">
              <textarea value={form.conditionDetail} onChange={set('conditionDetail')} rows={3}
                placeholder="e.g. There's a small crease on the spine and a few pencil marks in chapter 3."
                className="w-full border border-main/15 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus:border-secondary transition-colors resize-none bg-white" />
            </Field>
            <div className="mt-4">
              <Field label="Description" required error={errors.description}>
                <textarea value={form.description} onChange={set('description')} rows={5}
                  className="w-full border border-main/15 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus:border-secondary transition-colors resize-none bg-white" />
              </Field>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-third p-6">
            <h2 className="font-heading font-bold text-main text-base mb-1">Photos</h2>
            <p className="text-xs text-main/45 mb-4">Upload up to 5 photos. Tap a thumbnail to set it as the cover.</p>
            {photoError && <p className="text-xs text-red-500 mb-3">{photoError}</p>}
            {totalImages < 5 && (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-main/15 rounded-xl py-8 cursor-pointer hover:border-secondary/40 transition-colors">
                <Upload size={24} className="text-main/30 mb-2" />
                <span className="text-sm text-main/50 font-medium">Click to add photos</span>
                <span className="text-xs text-main/30 mt-1">PNG, JPG up to 5MB each</span>
                <input type="file" multiple accept=".jpg,.jpeg,.png" className="sr-only" onChange={handlePhotos} disabled={uploading} />
              </label>
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
                  <input type="number" min="100" value={form.price} onChange={set('price')} className={`${inputClass(!!errors.price)} pl-8`} />
                </div>
              </Field>
              <Field label="Discount (%)" error={errors.discount}>
                <div className="relative">
                  <input type="number" min="0" max="50" value={form.discount} onChange={set('discount')} className={`${inputClass(!!errors.discount)} pr-8`} />
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
            <textarea value={form.loveNote} onChange={set('loveNote')} rows={3}
              placeholder="A message to the next reader…"
              className="w-full border border-secondary/25 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main/30 outline-none focus:border-secondary transition-colors resize-none bg-white" />
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
