export type BookCondition =
  | "New"
  | "LikeNew"
  | "Excellent"
  | "Good"
  | "Fair"
  | "Poor"

export type ListingStatus =
  | "PendingApproval"
  | "Approved"
  | "Rejected"
  | "Published"
  | "Unpublished"
  | "Sold"

export interface LoginRequestDto {
  emailAddress?: string | null
  password?: string | null
}

export interface SignUpRequestDto {
  firstName?: string | null
  lastName?: string | null
  nickname?: string | null
  email?: string | null
  phoneNumber?: string | null
  password?: string | null
  confirmPassword?: string | null
}

export interface VerifyEmailRequestDto {
  email?: string | null
  otp?: string | null
}

export interface EmailOnlyRequest {
  email?: string | null
}

export interface CompletePasswordResetRequestDto {
  token?: string | null
  newPassword?: string | null
  confirmNewPassword?: string | null
}

export interface ChangePasswordRequestDto {
  oldPassword?: string | null
  newPassword?: string | null
  confirmNewPassword?: string | null
}

export interface SubmitListingRequestDto {
  title?: string | null
  isbn?: string | null
  description?: string | null
  conditionDetail?: string | null
  loveNote?: string | null
  price?: number
  quantity?: number
  bookCondition?: BookCondition
  format?: string | null
  coverImageFileName?: string | null
  imageFileNames?: string[] | null
  author?: string | null
  categoryId?: number
}

export interface UpdateListingRequestDto {
  id?: number
  title?: string | null
  isbn?: string | null
  description?: string | null
  conditionDetail?: string | null
  loveNote?: string | null
  price?: number
  quantity?: number
  bookCondition?: BookCondition
  format?: string | null
  coverImageFileName?: string | null
  imageFileNames?: string[] | null
  author?: string | null
  categoryId?: number
}

export interface AddToCartRequestDto {
  listingId?: number
  quantity?: number
}

export interface CartItemRequest {
  listingId?: number
  quantity?: number
}

export interface BulkAddToCartRequestDto {
  items?: CartItemRequest[] | null
}

export interface AddToWishlistRequestDto {
  listingId?: number
}

export interface LoginResponse {
  userId?: string | null
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  phoneNumber?: string | null
  roleId?: number
  roleName?: string | null
  isActive?: boolean
  refreshToken?: string | null
  token?: string | null
  tokenExpiresAt?: string | null
}

export interface ListingResponse {
  id?: number
  title?: string | null
  isbn?: string | null
  description?: string | null
  conditionDetail?: string | null
  loveNote?: string | null
  price?: number
  quantity?: number
  bookCondition?: BookCondition
  format?: string | null
  coverImageFileName?: string | null
  imageFileNames?: string[] | null
  author?: string | null
  categoryId?: number
  isPublished?: boolean
  isSoldOut?: boolean
  status?: ListingStatus
  categoryName?: string | null
  createdBy?: string | null
  dateCreated?: string | null
  dateModified?: string | null
  cartItemCount?: number
  wishlistItemCount?: number
}

export interface PageLinks {
  firstPage?: string | null
  currentPage?: string | null
  nextPage?: string | null
  lastPage?: string | null
}

export interface ListingResponsePagedResult {
  result?: ListingResponse[] | null
  pageNumber?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
  links?: PageLinks
}

export interface CartItemResponse {
  id?: number
  listingId?: number
  title?: string | null
  isbn?: string | null
  author?: string | null
  coverImageFileName?: string | null
  unitPrice?: number
  quantity?: number
  isPublished?: boolean
}

export interface CartResponse {
  id?: number
  userId?: number
  items?: CartItemResponse[] | null
  totalItems?: number
  totalAmount?: number
}

export interface CartValidationIssue {
  listingId?: number
  issue?: string | null
}

export interface CartValidationResponse {
  isValid?: boolean
  validItems?: CartItemResponse[] | null
  issues?: CartValidationIssue[] | null
}

export interface CheckoutSessionItemResponse {
  listingId?: number
  title?: string | null
  isbn?: string | null
  author?: string | null
  coverImageFileName?: string | null
  unitPrice?: number
  quantity?: number
}

export interface SellerGroupResponse {
  sellerEmail?: string | null
  items?: CheckoutSessionItemResponse[] | null
  subtotal?: number
}

export interface CheckoutSessionResponse {
  sessionId?: string | null
  status?: string | null
  totalAmount?: number
  expiresAt?: string
  isExpired?: boolean
  sellerGroups?: SellerGroupResponse[] | null
}

export interface OrderResponse {
  orderId?: number
  orderNumber?: string | null
  status?: string | null
  totalAmount?: number
  orderDate?: string
  sessionId?: string | null
  sellerGroups?: SellerGroupResponse[] | null
}

export interface WishlistItemResponse {
  id?: number
  listingId?: number
  title?: string | null
  isbn?: string | null
  author?: string | null
  coverImageFileName?: string | null
  unitPrice?: number
  isPublished?: boolean
}

export interface WishlistResponse {
  userId?: number
  items?: WishlistItemResponse[] | null
  totalItems?: number
}

export interface CategoryResponse {
  id?: number
  name?: string | null
}
