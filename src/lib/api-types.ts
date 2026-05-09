export interface ApiResponse<T> {
  apiVersion: string | null
  success: boolean
  code: string | null
  message: string | null
  requestId: string | null
  data: T
}

export interface ProblemDetails {
  type: string | null
  title: string | null
  status: number | null
  detail: string | null
  instance: string | null
}

export interface LoginRequest {
  emailAddress: string
  password: string
}

export interface SignUpRequest {
  firstName: string
  lastName: string
  nickname?: string
  email: string
  phoneNumber?: string
  password: string
  confirmPassword: string
}

export interface LoginResponse {
  userId: string
  firstName: string | null
  lastName: string | null
  email: string | null
  phoneNumber: string | null
  roleId: number
  roleName: string | null
  isActive: boolean
  refreshToken: string | null
  token: string | null
  tokenExpiresAt: string | null
}

export interface VerifyEmailRequest {
  email: string
  otp: string
}

export interface EmailOnlyRequest {
  email: string
}

export interface CompletePasswordResetRequest {
  token: string
  newPassword: string
  confirmNewPassword: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}

export type BookCondition = 'New' | 'LikeNew' | 'Excellent' | 'Good' | 'Fair' | 'Poor'

export type ListingStatus = 'PendingApproval' | 'Approved' | 'Rejected' | 'Published' | 'Unpublished' | 'Sold'

export interface ListingResponse {
  id: number
  title: string | null
  isbn: string | null
  description: string | null
  loveNote: string | null
  price: number
  quantity: number
  bookCondition: BookCondition
  coverImageFileName: string | null
  imageFileNames: string[] | null
  author: string | null
  categoryId: number
  isPublished: boolean
  isSoldOut: boolean
  status: ListingStatus
  categoryName: string | null
  createdBy: string | null
  dateCreated: string | null
  dateModified: string | null
  cartItemCount: number
  wishlistItemCount: number
}

export interface PagedResult<T> {
  result: T[] | null
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  links: PageLinks
}

export interface PageLinks {
  firstPage: string | null
  currentPage: string | null
  nextPage: string | null
  lastPage: string | null
}

export interface ListingFilterParams {
  CategoryId?: number
  Title?: string
  Author?: string
  Status?: ListingStatus
  PageNumber?: number
  PageSize?: number
}

export interface SubmitListingRequest {
  title: string
  isbn?: string
  description?: string
  loveNote?: string
  price: number
  quantity: number
  bookCondition: BookCondition
  coverImageFileName?: string
  imageFileNames?: string[]
  author?: string
  categoryId: number
}

export interface UpdateListingRequest extends SubmitListingRequest {
  id: number
}

export interface CartItemResponse {
  id: number
  listingId: number
  title: string | null
  isbn: string | null
  author: string | null
  coverImageFileName: string | null
  unitPrice: number
  quantity: number
  isPublished: boolean
}

export interface CartResponse {
  id: number
  userId: number
  items: CartItemResponse[] | null
  totalItems: number
  totalAmount: number
}

export interface AddToCartRequest {
  listingId: number
  quantity: number
}

export interface BulkAddToCartRequest {
  items: CartItemRequest[]
}

export interface CartItemRequest {
  listingId: number
  quantity: number
}

export interface CartValidationResponse {
  isValid: boolean
  validItems: CartItemResponse[] | null
  issues: CartValidationIssue[] | null
}

export interface CartValidationIssue {
  listingId: number
  issue: string | null
}

export interface WishlistItemResponse {
  id: number
  listingId: number
  title: string | null
  isbn: string | null
  author: string | null
  coverImageFileName: string | null
  unitPrice: number
  isPublished: boolean
}

export interface WishlistResponse {
  userId: number
  items: WishlistItemResponse[] | null
  totalItems: number
}

export interface AddToWishlistRequest {
  listingId: number
}

export interface CategoryResponse {
  id: number
  name: string | null
}

export interface AddCategoryRequest {
  name: string
}

export interface UpdateCategoryRequest {
  name: string
  id: number
}
