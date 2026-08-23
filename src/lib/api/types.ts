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
  tagIds?: number[] | null
  tags?: string[] | null
  discount?: number
  stateId?: number
  areaId?: number
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
  tagIds?: number[] | null
  tags?: string[] | null
  discount?: number
  stateId?: number
  areaId?: number
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

export type StoreFulfillmentOption = "Courier" | "Pickup" | "Both"
export type OrderFulfillmentType = "Courier" | "Pickup"

export interface ListingResponse {
  id?: number
  title?: string | null
  isbn?: string | null
  description?: string | null
  conditionDetail?: string | null
  loveNote?: string | null
  price?: number
  priceOfNew?: number
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
  discount?: number
  isDiscountApplied?: boolean
  buyerPrice?: number
  stateId?: number
  areaId?: number
  location?: string | null
  storeProfileId?: number | null
  storeName?: string | null
  storeSlug?: string | null
  username?: string | null
  userName?: string | null
  fulfillmentOption?: StoreFulfillmentOption
  pickupAddressLine?: string | null
  pickupCity?: string | null
  pickupState?: string | null
  tags?: string[] | null
  tagNames?: string[] | null
  numberOfPages?: number | null
}

export interface SetListingDiscountRequest {
  isDiscountApplied?: boolean
  discount?: number
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

export interface PagedResult<T> {
  result?: T[] | null
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
  buyerPrice: number
  quantity?: number
  isPublished?: boolean
  sellerEmail?: string | null
  storeName?: string | null
  storeSlug?: string | null
  fulfillmentOption?: StoreFulfillmentOption
  pickupAddressLine?: string | null
  pickupCity?: string | null
  pickupState?: string | null
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
  buyerPrice?: number
  quantity?: number
}

export interface SellerGroupResponse {
  sellerEmail?: string | null
  storeName?: string | null
  storeSlug?: string | null
  allowedFulfillmentOption?: StoreFulfillmentOption
  selectedFulfillmentType?: OrderFulfillmentType
  pickupAddressLine?: string | null
  pickupCity?: string | null
  pickupState?: string | null
  pickupDates?: string[] | null
  items?: CheckoutSessionItemResponse[] | null
  subtotal?: number
  deliveryFee?: number
}

export interface CheckoutSessionResponse {
  sessionId?: string | null
  status?: string | null
  totalAmount?: number
  deliveryFee?: number | null
  shippingStateId?: number | null
  shippingAreaId?: number | null
  shippingAddress?: string | null
  deliveryFullName?: string | null
  deliveryPhoneNumber?: string | null
  deliveryEmail?: string | null
  expiresAt?: string
  isExpired?: boolean
  sellerGroups?: SellerGroupResponse[] | null
}

export interface SellerFulfillmentChoice {
  sellerEmail: string
  fulfillmentType: OrderFulfillmentType
  pickupDates?: string[]
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

export interface PaymentInitiateResponse {
  authorizationUrl?: string | null
  accessCode?: string | null
  reference?: string | null
  expiresAt?: string
}

export interface PaymentStatusResponse {
  status?: string | null
  message?: string | null
  reference?: string | null
  paidAt?: string | null
  orders?: OrderResponse[] | null
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
  slug?: string | null
}

export interface TagResponse {
  id: number
  name: string
  slug?: string | null
  categoryId?: number | null
  categoryName?: string | null
}

export interface StateResponse {
  id?: number
  name?: string | null
}

export interface AreaResponse {
  id?: number
  stateId?: number
  name?: string | null
}

export interface CreateShippingAddressRequest {
  label?: string | null
  stateId?: number
  areaId?: number
  addressLine?: string | null
  isDefault?: boolean
}

export interface UpdateShippingAddressRequest {
  label?: string | null
  stateId?: number
  areaId?: number
  addressLine?: string | null
  isDefault?: boolean
}

export interface ShippingAddressResponse {
  id?: number
  label?: string | null
  stateId?: number
  stateName?: string | null
  areaId?: number
  areaName?: string | null
  addressLine?: string | null
  isDefault?: boolean
}

export interface CheckoutStartRequest {
  shippingAddressId?: number
  shippingStateId?: number | null
  shippingAreaId?: number | null
  shippingAddress?: string | null
  cartItemIds?: number[] | null
  deliveryFullName?: string | null
  deliveryPhoneNumber?: string | null
  deliveryEmail?: string | null
  sellerFulfillments: SellerFulfillmentChoice[]
}

export interface MyListingSummaryResponse {
  totalListings?: number
  activePublished?: number
  pendingApproval?: number
  rejected?: number
}

/* ───────── Landing Page ───────── */

export interface LandingPageSectionResponse {
  id?: number
  title?: string | null
  sectionType?: string | null
  filterParam?: Record<string, unknown> | null
  listings?: ListingResponse[] | null
}

export interface LandingPageResponse {
  sections?: LandingPageSectionResponse[] | null
}

/* ───────── Book Requests ───────── */

export interface CreateBookRequestDto {
  
  title?: string | null
  author?: string | null
  category?: string | null
  bookCondition?: string | null
}

export interface BookRequestResponse {
  // The API may return id as number or string
  id: string | number
  buyerEmail?: string | null
  title: string
  author?: string | null
  // Category can come as `category`, `genre`, or `categoryName`
  category?: string | null
  genre?: string | null
  // Condition can come as `condition`, `bookCondition`
  condition?: string | null
  bookCondition?: string | null
  // Status from the API ("open", "matched", "closed", "Pending", etc.)
  status?: string | null
  // The API returns `dateCreated`; `createdAt` is kept for backward compat
  dateCreated?: string | null
  createdAt?: string | null
  // joinedAt / dateJoined is the date a user joined the waitlist (my-activity API returns dateJoined)
  dateJoined?: string | null
  joinedAt?: string | null
  waitlist?: string[] | null
  waitlistCount?: number
  // API returns `isWaitlisted`; `isUserOnWaitlist` kept for backward compat
  isWaitlisted?: boolean | null
  isUserOnWaitlist?: boolean
}

export interface BookRequestFilterParams {
  Title?: string
  category?: string
  Status?: string
  PageNumber?: number
  PageSize?: number
}

/* ───────── Orders & seller payouts ───────── */

export interface OrderDeliveryAddress {
  fullName?: string | null
  phone?: string | null
  email?: string | null
  street?: string | null
  city?: string | null
  state?: string | null
}

export interface OrderItemDto {
  id: number
  listingId: number
  bookTitle: string
  sellerEmail: string
  sellerName?: string | null
  sellerPhone?: string | null
  coverImageFileName?: string | null
  quantity: number
  unitPrice: number
  totalPrice: number
  buyerPrice: number
  sellerPayout: number
  platformFee: number
  markupAmount: number
  commissionAmount: number
}

export interface OrderStatusEventResponse {
  id: number
  status: string
  note?: string | null
  occurredAt?: string | null
  by?: string | null
}

export interface OrderDto {
  id: number
  orderNumber: string
  totalAmount: number
  status: string
  shippingAddress?: string | null
  deliveryFee?: number | null
  shippingStateId?: number | null
  shippingAreaId?: number | null
  shippingStateName?: string | null
  shippingAreaName?: string | null
  deliveryAddress?: OrderDeliveryAddress | null
  orderDate: string
  shippedDate?: string | null
  deliveredDate?: string | null
  userId: string
  sellerEmail: string
  sellerName?: string | null
  sellerPhone?: string | null
  baseAmount: number
  sellerPayout: number
  platformFee: number
  markupTotal: number
  commissionTotal: number
  isSettled: boolean
  settledAt?: string | null
  fulfillmentType?: OrderFulfillmentType | string | null
  pickupCode?: string | null
  pickupPreferredDates?: string[] | null
  pickupAddress?: string | null
  items: OrderItemDto[]
  inboundWaybillNumber: string | null
  outboundWaybillNumber: string | null
  statusEvents?: OrderStatusEventResponse[] | null
}

/* ───────── Dispute tracking ───────── */

export interface OrderDisputeActivityResponse {
  ts: string
  text: string
}

export interface OrderDisputeResponse {
  orderId: number
  orderNumber: string
  disputeNumber: string
  status: string
  decision?: string | null
  reason: string
  filedBy: string
  bookTitle: string
  amount: number
  delivery: string
  evidence: string[]
  resolution?: string | null
  filedAt: string
  dueAt: string
  reviewedAt?: string | null
  decidedAt?: string | null
  activity: OrderDisputeActivityResponse[]
}

/* ───────── Store profiles ───────── */

export interface StoreProfileResponse {
  id: number
  userId: number
  storeName: string
  storeSlug: string
  fullName?: string | null
  username?: string | null
  userName?: string | null
  phone?: string | null
  phoneNumber?: string | null
  description?: string | null
  city?: string | null
  state?: string | null
  isOnVacation: boolean
  vacationMessage?: string | null
  fulfillmentOption: StoreFulfillmentOption
  pickupAddressLine?: string | null
  pickupCity?: string | null
  pickupState?: string | null
  pickupConsentGiven: boolean
  currentlyReading?: string | null
  favouriteBook?: string | null
  favouriteAuthor?: string | null
  mostlyRead?: string | null
  readMostly?: string | null
  hobbies?: string | null
}

export interface PublicStoreProfileResponse {
  storeName: string
  storeSlug: string
  description?: string | null
  username?: string | null
  userName?: string | null
  phone?: string | null
  phoneNumber?: string | null
  city?: string | null
  state?: string | null
  isOnVacation: boolean
  vacationMessage?: string | null
  sellerEmail: string
  sellerName: string
  memberSince?: string | null
  booksSold: number
  fulfillmentOption: StoreFulfillmentOption
  pickupAddressLine?: string | null
  pickupCity?: string | null
  pickupState?: string | null
  currentlyReading?: string | null
  favouriteBook?: string | null
  favouriteAuthor?: string | null
  mostlyRead?: string | null
  readMostly?: string | null
  hobbies?: string | null
}

export interface UpdateStoreProfileRequest {
  storeName: string
  username?: string | null
  description?: string | null
  city?: string | null
  state?: string | null
  isOnVacation: boolean
  vacationMessage?: string | null
  fulfillmentOption: StoreFulfillmentOption
  pickupAddressLine?: string | null
  pickupCity?: string | null
  pickupState?: string | null
  pickupConsentGiven: boolean
  currentlyReading?: string | null
  favouriteBook?: string | null
  favouriteAuthor?: string | null
  readMostly?: string | null
  hobbies?: string | null
}

/* ───────── User account ───────── */

export interface UpdateUserRequestDto {
  fullName?: string | null
  nickname?: string | null
  phoneNumber?: string | null
}

export interface UserProfileResponse {
  userId?: string | null
  firstName?: string | null
  lastName?: string | null
  fullName?: string | null
  userName?: string | null
  email?: string | null
  phoneNumber?: string | null
  isActive?: boolean
}

/* ───────── User bank details ───────── */

export interface BankResponse {
  id: number
  name: string
  slug: string
  code: string
}

export interface UserBankDetailsResponse {
  id: number
  bankId: number
  bankName: string
  accountNumber: string
  accountName: string
  isActive: boolean
}

export interface CreateUserBankDetailsRequest {
  bankId: number
  accountNumber: string
  accountName: string
  isActive: boolean
}

export interface UpdateUserBankDetailsRequest {
  bankId: number
  accountNumber: string
  accountName: string
  isActive: boolean
}

export interface PayoutSummaryResponse {
  sellerEmail: string
  totalEarned: number
  totalPaidOut: number
  pendingPayout: number
  orderCount: number
}

export interface PayoutRequestResponse {
  id: number
  requestNumber: string
  orderId: number
  orderNumber: string
  sellerEmail: string
  sellerName: string
  amount: number
  status: string
  requestedAt: string
  bankName: string
  accountName: string
  accountNumber: string
  approvedAt?: string | null
  paidAt?: string | null
  note?: string | null
}

export interface SellerSaleResponse {
  orderId: number
  orderNumber: string
  bookTitle: string
  bookTitles?: string[] | null
  buyerInitials: string
  saleAmount: number
  platformFee: number
  sellerPayout: number
  status: string
  isSettled: boolean
  payoutRequested: boolean
  orderDate: string
  preferredSpeedafStationId?: number | null
  preferredSpeedafStationName?: string | null
  preferredSpeedafStationAddress?: string | null
  sellerDropoffScheduledAt?: string | null
  speedafBillCode?: string | null
  labelUrl?: string | null
  fulfillmentType?: OrderFulfillmentType | string
  pickupCode?: string | null
  pickupPreferredDates?: string[] | null
  pickupAddress?: string | null
}
