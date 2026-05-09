import { isMockMode } from '@/lib/utils'
import { apiGet, apiPost, apiDelete } from '@/lib/api-client'
import type {
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
  EmailOnlyRequest,
  CompletePasswordResetRequest,
  ListingResponse,
  PagedResult,
  ListingFilterParams,
  CategoryResponse,
  AddCategoryRequest,
  UpdateCategoryRequest,
} from '@/lib/api-types'
import { listings as mockAdminListings } from '@/lib/mock-data'

const mockLoginResponse: LoginResponse = {
  userId: 'admin-mock',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@alakowe.com',
  phoneNumber: null,
  roleId: 2,
  roleName: 'Admin',
  isActive: true,
  refreshToken: 'mock-admin-refresh',
  token: 'mock-admin-jwt',
  tokenExpiresAt: new Date(Date.now() + 86400000).toISOString(),
}

export async function adminLogin(req: LoginRequest): Promise<LoginResponse> {
  if (isMockMode()) {
    if (req.emailAddress === 'admin@alakowe.com' && req.password === 'admin123') {
      return mockLoginResponse
    }
    throw new Error('Invalid admin credentials')
  }
  return apiPost<LoginResponse>('/api/v1/admin/auth/login', req)
}

export async function adminChangePassword(req: ChangePasswordRequest): Promise<boolean> {
  if (isMockMode()) {
    return true
  }
  return apiPost<boolean>('/api/v1/admin/auth/change-password', req)
}

export async function adminInitiatePasswordReset(req: EmailOnlyRequest): Promise<boolean> {
  if (isMockMode()) {
    return true
  }
  return apiPost<boolean>('/api/v1/admin/auth/initiate-password-reset', req)
}

export async function adminCompletePasswordReset(req: CompletePasswordResetRequest): Promise<boolean> {
  if (isMockMode()) {
    return true
  }
  return apiPost<boolean>('/api/v1/admin/auth/complete-password-reset', req)
}

export async function approveListing(id: number): Promise<boolean> {
  if (isMockMode()) {
    return true
  }
  return apiPost<boolean>(`/api/v1/AdminListing/approve/${id}`)
}

export async function declineListing(id: number): Promise<boolean> {
  if (isMockMode()) {
    return true
  }
  return apiPost<boolean>(`/api/v1/AdminListing/decline/${id}`)
}

export async function getAdminListings(filter?: ListingFilterParams): Promise<PagedResult<ListingResponse>> {
  if (isMockMode()) {
    const result: ListingResponse[] = mockAdminListings.map(l => ({
      id: parseInt(l.id.replace('L', '')),
      title: l.title,
      isbn: null,
      description: null,
      loveNote: null,
      price: l.price,
      quantity: 1,
      bookCondition: 'Good' as const,
      coverImageFileName: null,
      imageFileNames: null,
      author: l.seller,
      categoryId: 0,
      isPublished: l.status === 'Approved' || l.status === 'Sold',
      isSoldOut: l.status === 'Sold',
      status: mapMockAdminStatus(l.status),
      categoryName: l.category,
      createdBy: l.seller,
      dateCreated: null,
      dateModified: null,
      cartItemCount: 0,
      wishlistItemCount: 0,
    }))
    return {
      result,
      pageNumber: 1,
      pageSize: 20,
      totalCount: result.length,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
      links: { firstPage: null, currentPage: null, nextPage: null, lastPage: null },
    }
  }
  return apiGet<PagedResult<ListingResponse>>('/api/v1/AdminListing/by-filter', filter as Record<string, unknown>)
}

function mapMockAdminStatus(status: string): import('@/lib/api-types').ListingStatus {
  switch (status) {
    case 'Pending': return 'PendingApproval'
    case 'Approved': return 'Approved'
    case 'Rejected': return 'Rejected'
    case 'Flagged': return 'Rejected'
    case 'Sold': return 'Sold'
    default: return 'PendingApproval'
  }
}

export async function getAdminListing(id: number): Promise<ListingResponse> {
  if (isMockMode()) {
    const listing = mockAdminListings.find(l => parseInt(l.id.replace('L', '')) === id)
    if (!listing) throw new Error('Listing not found')
    return {
      id: parseInt(listing.id.replace('L', '')),
      title: listing.title,
      isbn: null,
      description: null,
      loveNote: null,
      price: listing.price,
      quantity: 1,
      bookCondition: 'Good' as const,
      coverImageFileName: null,
      imageFileNames: null,
      author: listing.seller,
      categoryId: 0,
      isPublished: listing.status === 'Approved' || listing.status === 'Sold',
      isSoldOut: listing.status === 'Sold',
      status: mapMockAdminStatus(listing.status),
      categoryName: listing.category,
      createdBy: listing.seller,
      dateCreated: null,
      dateModified: null,
      cartItemCount: 0,
      wishlistItemCount: 0,
    }
  }
  return apiGet<ListingResponse>(`/api/v1/AdminListing/${id}`)
}

export async function createCategory(req: AddCategoryRequest): Promise<CategoryResponse> {
  if (isMockMode()) {
    return { id: Date.now(), name: req.name }
  }
  return apiPost<CategoryResponse>('/api/v1/AdminCategory/create', req)
}

export async function updateCategory(req: UpdateCategoryRequest): Promise<CategoryResponse> {
  if (isMockMode()) {
    return { id: req.id, name: req.name }
  }
  return apiPost<CategoryResponse>('/api/v1/AdminCategory/update', req)
}

export async function deleteCategory(id: number): Promise<boolean> {
  if (isMockMode()) {
    return true
  }
  return apiDelete<boolean>(`/api/v1/AdminCategory/delete/${id}`)
}

export async function getCategory(id: number): Promise<CategoryResponse> {
  if (isMockMode()) {
    return { id, name: 'Mock Category' }
  }
  return apiGet<CategoryResponse>(`/api/v1/AdminCategory/${id}`)
}

export async function getAllCategories(): Promise<CategoryResponse[]> {
  if (isMockMode()) {
    return [
      { id: 1, name: 'Fiction' },
      { id: 2, name: 'Academic' },
      { id: 3, name: 'Non-Fiction' },
      { id: 4, name: 'Children' },
      { id: 5, name: 'Other' },
    ]
  }
  return apiGet<CategoryResponse[]>('/api/v1/AdminCategory/all')
}
