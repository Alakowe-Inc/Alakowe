export const LISTING_DRAFT_KEY = 'alakowe_listing_draft'

export type ListingDraftForm = {
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
  stateId: string
  areaId: string
}

export type EditListingDraftForm = {
  title: string
  author: string
  genre: string
  condition: string
  conditionDetail: string
  description: string
  price: string
  discount: string
  quantity: string
  loveNote: string
  stateId: string
  areaId: string
}

export type ListingDraftPhoto = {
  dataUrl: string
  name: string
  isCover: boolean
}

export type CreateListingDraft = {
  kind: 'create'
  form: ListingDraftForm
  photos: ListingDraftPhoto[]
  photosOmitted?: boolean
  savedAt: number
}

export type EditListingDraft = {
  kind: 'edit'
  listingId: number
  form: EditListingDraftForm
  existingImages: string[]
  coverIndex: number
  newPhotos: ListingDraftPhoto[]
  photosOmitted?: boolean
  savedAt: number
}

export type ListingDraft = CreateListingDraft | EditListingDraft

export function hasListingDraft(): boolean {
  try {
    return !!sessionStorage.getItem(LISTING_DRAFT_KEY)
  } catch {
    return false
  }
}

export function loadListingDraft(): ListingDraft | null {
  try {
    const raw = sessionStorage.getItem(LISTING_DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ListingDraft & { kind?: string }
    // Back-compat with drafts saved before `kind` existed.
    if (!parsed.kind) {
      return { ...(parsed as Omit<CreateListingDraft, 'kind'>), kind: 'create' }
    }
    return parsed as ListingDraft
  } catch {
    return null
  }
}

export function listingDraftReturnPath(draft: ListingDraft): string {
  if (draft.kind === 'edit') return `/my-listings/${draft.listingId}/edit`
  return '/list'
}

export function clearListingDraft() {
  try {
    sessionStorage.removeItem(LISTING_DRAFT_KEY)
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event('alakowe:listing-draft'))
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read photo'))
    reader.readAsDataURL(file)
  })
}

export async function dataUrlToFile(dataUrl: string, name: string): Promise<File> {
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  return new File([blob], name, { type: blob.type || 'image/jpeg' })
}

async function photosToPayload(
  photos: { file: File; isCover?: boolean }[],
): Promise<ListingDraftPhoto[]> {
  const photoPayload: ListingDraftPhoto[] = []
  for (const p of photos) {
    photoPayload.push({
      dataUrl: await fileToDataUrl(p.file),
      name: p.file.name || 'photo.jpg',
      isCover: !!p.isCover,
    })
  }
  return photoPayload
}

function persistDraft(draft: ListingDraft, slimFallback: ListingDraft) {
  try {
    sessionStorage.setItem(LISTING_DRAFT_KEY, JSON.stringify(draft))
  } catch {
    sessionStorage.setItem(LISTING_DRAFT_KEY, JSON.stringify(slimFallback))
  }
  window.dispatchEvent(new Event('alakowe:listing-draft'))
}

export async function saveListingDraft(input: {
  form: ListingDraftForm
  photos: { file: File; isCover: boolean }[]
}): Promise<void> {
  const photoPayload = await photosToPayload(input.photos)
  const draft: CreateListingDraft = {
    kind: 'create',
    form: { ...input.form },
    photos: photoPayload,
    savedAt: Date.now(),
  }
  persistDraft(draft, {
    kind: 'create',
    form: { ...input.form },
    photos: [],
    photosOmitted: photoPayload.length > 0,
    savedAt: Date.now(),
  })
}

export async function saveEditListingDraft(input: {
  listingId: number
  form: EditListingDraftForm
  existingImages: string[]
  coverIndex: number
  newPhotos: { file: File }[]
}): Promise<void> {
  const photoPayload = await photosToPayload(input.newPhotos)
  const draft: EditListingDraft = {
    kind: 'edit',
    listingId: input.listingId,
    form: { ...input.form },
    existingImages: [...input.existingImages],
    coverIndex: input.coverIndex,
    newPhotos: photoPayload,
    savedAt: Date.now(),
  }
  persistDraft(draft, {
    kind: 'edit',
    listingId: input.listingId,
    form: { ...input.form },
    existingImages: [...input.existingImages],
    coverIndex: input.coverIndex,
    newPhotos: [],
    photosOmitted: photoPayload.length > 0,
    savedAt: Date.now(),
  })
}
