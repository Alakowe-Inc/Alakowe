import { isMockMode } from '@/lib/utils'
import { apiGet, apiPost } from '@/lib/api-client'
import type {
  ListingResponse,
  PagedResult,
  ListingFilterParams,
  SubmitListingRequest,
  UpdateListingRequest,
} from '@/lib/api-types'
import { books } from '@/data/mockData'
import { getAllListings, saveListing as saveSellerListing } from '@/data/sellerData'
import type { BookCondition } from '@/lib/api-types'

const conditionMap: Record<string, BookCondition> = {
  'Best Value': 'Good',
  'Recently Added': 'Excellent',
  'Like New': 'LikeNew',
  'Very Good': 'Excellent',
  Good: 'Good',
  Average: 'Fair',
  'Below Average': 'Poor',
}

function mapBookToListing(book: typeof books[0]): ListingResponse {
  return {
    id: Number(book.id),
    title: book.title,
    isbn: null,
    description: book.description,
    loveNote: book.loveNote,
    price: book.price,
    quantity: 1,
    bookCondition: conditionMap[book.condition] || 'Good',
    coverImageFileName: null,
    imageFileNames: null,
    author: book.author,
    categoryId: 0,
    isPublished: true,
    isSoldOut: false,
    status: 'Published',
    categoryName: book.genre,
    createdBy: book.sellerName,
    dateCreated: null,
    dateModified: null,
    cartItemCount: 0,
    wishlistItemCount: 0,
  }
}

export async function getListings(filter?: ListingFilterParams): Promise<PagedResult<ListingResponse>> {
  if (isMockMode()) {
    let result = books.map(mapBookToListing)
    if (filter?.Title) {
      result = result.filter(b => b.title?.toLowerCase().includes(filter.Title!.toLowerCase()))
    }
    if (filter?.Author) {
      result = result.filter(b => b.author?.toLowerCase().includes(filter.Author!.toLowerCase()))
    }
    if (filter?.CategoryId) {
      result = result.filter(b => b.categoryId === filter.CategoryId)
    }
    const page = filter?.PageNumber || 1
    const size = filter?.PageSize || 20
    const total = result.length
    const paged = result.slice((page - 1) * size, page * size)
    return {
      result: paged,
      pageNumber: page,
      pageSize: size,
      totalCount: total,
      totalPages: Math.ceil(total / size),
      hasPreviousPage: page > 1,
      hasNextPage: page * size < total,
      links: {
        firstPage: null,
        currentPage: null,
        nextPage: null,
        lastPage: null,
      },
    }
  }
  return apiGet<PagedResult<ListingResponse>>('/api/v1/Listing/by-filter', filter as Record<string, unknown>)
}

export async function getListingById(id: number): Promise<ListingResponse> {
  if (isMockMode()) {
    const book = books.find(b => b.id === String(id))
    if (!book) throw new Error('Listing not found')
    return mapBookToListing(book)
  }
  return apiGet<ListingResponse>(`/api/v1/Listing/${id}`)
}

export async function submitListing(req: SubmitListingRequest): Promise<ListingResponse> {
  if (isMockMode()) {
    const listing = {
      id: Date.now(),
      title: req.title,
      isbn: req.isbn || null,
      description: req.description || null,
      loveNote: req.loveNote || null,
      price: req.price,
      quantity: req.quantity,
      bookCondition: req.bookCondition,
      coverImageFileName: req.coverImageFileName || null,
      imageFileNames: req.imageFileNames || null,
      author: req.author || null,
      categoryId: req.categoryId,
      isPublished: false,
      isSoldOut: false,
      status: 'PendingApproval' as const,
      categoryName: null,
      createdBy: null,
      dateCreated: new Date().toISOString(),
      dateModified: null,
      cartItemCount: 0,
      wishlistItemCount: 0,
    }
    return listing
  }
  return apiPost<ListingResponse>('/api/v1/Listing/submit', req)
}

export async function updateListing(req: UpdateListingRequest): Promise<ListingResponse> {
  if (isMockMode()) {
    const allListings = getAllListings()
    const existing = allListings[String(req.id)]
    if (!existing) throw new Error('Listing not found')
    const updated = {
      ...existing,
      title: req.title,
      isbn: req.isbn || null,
      description: req.description || null,
      loveNote: req.loveNote || null,
      price: req.price,
      quantity: req.quantity,
      bookCondition: req.bookCondition,
      coverImageFileName: req.coverImageFileName || null,
      imageFileNames: req.imageFileNames || null,
      author: req.author || null,
      categoryId: req.categoryId,
    }
    saveSellerListing(updated as unknown as import('@/data/sellerData').Listing)
    return {
      id: req.id,
      title: req.title,
      isbn: req.isbn || null,
      description: req.description || null,
      loveNote: req.loveNote || null,
      price: req.price,
      quantity: req.quantity,
      bookCondition: req.bookCondition,
      coverImageFileName: req.coverImageFileName || null,
      imageFileNames: req.imageFileNames || null,
      author: req.author || null,
      categoryId: req.categoryId,
      isPublished: false,
      isSoldOut: false,
      status: 'PendingApproval' as const,
      categoryName: null,
      createdBy: null,
      dateCreated: null,
      dateModified: new Date().toISOString(),
      cartItemCount: 0,
      wishlistItemCount: 0,
    }
  }
  return apiPost<ListingResponse>('/api/v1/Listing/edit', req)
}
