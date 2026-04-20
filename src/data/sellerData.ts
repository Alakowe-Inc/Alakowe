export type ListingStatus = 'pending_review' | 'live' | 'rejected' | 'sold'
export type ConditionGrade = 'Like New' | 'Very Good' | 'Good' | 'Average' | 'Below Average'

export const CONDITIONS: ConditionGrade[] = [
  'Like New', 'Very Good', 'Good', 'Average', 'Below Average',
]

export const GENRES = [
  'African Fiction', 'Foreign Fiction', 'Romance', 'Thriller',
  'Fantasy', 'Children', 'Academic', 'Self Help', 'Business', 'Biography', 'Other',
]

export const LISTING_STATUS_LABEL: Record<ListingStatus, string> = {
  pending_review: 'Under Review',
  live: 'Live',
  rejected: 'Rejected',
  sold: 'Sold',
}

export const LISTING_STATUS_CLASS: Record<ListingStatus, string> = {
  pending_review: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  live: 'bg-green-50 text-green-700 border border-green-200',
  rejected: 'bg-red-50 text-red-600 border border-red-200',
  sold: 'bg-secondary/8 text-secondary border border-secondary/20',
}

const COVER_COLORS = [
  '#C8A97E', '#9B5DE5', '#F4A261', '#2D6A4F',
  '#E63946', '#457B9D', '#1D3557', '#E9C46A',
  '#6B6FFF', '#FF6B6B', '#52B788', '#F77F00',
]

export function assignCoverColor(id: string): string {
  const sum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return COVER_COLORS[sum % COVER_COLORS.length]
}

export interface Listing {
  id: string
  sellerEmail: string
  title: string
  author: string
  genre: string
  condition: ConditionGrade
  description: string
  price: number
  discount: number
  loveNote: string
  coverColor: string
  status: ListingStatus
  rejectionReason?: string
  createdAt: string
  views: number
}

export interface SellerOrder {
  id: string
  orderId: string
  linkedOrderId?: string
  bookTitle: string
  buyerInitials: string
  saleAmount: number
  platformFee: number
  netAmount: number
  status: 'awaiting_seller' | 'dropoff_scheduled' | 'received_by_alakowe' | 'dispatched' | 'delivered' | 'confirmed'
  dropoffCode?: string
  dropoffLocation?: string
  pickupSlot?: string
  createdAt: string
}

export interface Earning {
  id: string
  bookTitle: string
  saleAmount: number
  platformFee: number
  netAmount: number
  status: 'pending' | 'released'
  createdAt: string
}

/* ── Public seller profile ── */

export interface PublicSellerProfile {
  email: string
  fullName: string
  username?: string
  city: string
  state: string
  bio: string
}

const SELLER_PROFILES_KEY = 'alakowe_seller_profiles'

export function savePublicSellerProfile(profile: PublicSellerProfile): void {
  try {
    const raw = localStorage.getItem(SELLER_PROFILES_KEY)
    const all = raw ? JSON.parse(raw) : {}
    all[profile.email] = profile
    localStorage.setItem(SELLER_PROFILES_KEY, JSON.stringify(all))
  } catch {}
}

export function getPublicSellerProfile(email: string): PublicSellerProfile | null {
  try {
    const raw = localStorage.getItem(SELLER_PROFILES_KEY)
    const all = raw ? JSON.parse(raw) : {}
    return all[email] ?? null
  } catch {
    return null
  }
}

/* ── localStorage helpers ── */

const LISTINGS_KEY = 'alakowe_listings'

export function saveListing(listing: Listing): void {
  const all = getAllListings()
  all[listing.id] = listing
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(all))
}

export function getListing(id: string): Listing | null {
  return getAllListings()[id] ?? null
}

export function getAllListings(): Record<string, Listing> {
  try {
    const raw = localStorage.getItem(LISTINGS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getSellerListings(email: string): Listing[] {
  return Object.values(getAllListings())
    .filter(l => l.sellerEmail === email)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function updateListing(id: string, updates: Partial<Listing>): void {
  const l = getListing(id)
  if (l) saveListing({ ...l, ...updates })
}

export function deleteListing(id: string): void {
  const all = getAllListings()
  delete all[id]
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(all))
}

export function generateListingId(): string {
  return (
    'LST-' +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).substring(2, 5).toUpperCase()
  )
}

/* ── Seller order localStorage helpers ── */

const SELLER_ORDERS_KEY = 'alakowe_seller_orders'

export function saveSellerOrder(order: SellerOrder): void {
  const all = getAllSellerOrders()
  all[order.id] = order
  localStorage.setItem(SELLER_ORDERS_KEY, JSON.stringify(all))
}

export function getSellerOrder(id: string): SellerOrder | null {
  return getAllSellerOrders()[id] ?? null
}

export function getAllSellerOrders(): Record<string, SellerOrder> {
  try {
    const raw = localStorage.getItem(SELLER_ORDERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function updateSellerOrderStatus(
  id: string,
  status: SellerOrder['status'],
  extra?: Partial<SellerOrder>,
): void {
  const order = getSellerOrder(id)
  if (order) saveSellerOrder({ ...order, status, ...extra })
}

export function generateDropoffCode(): string {
  return (
    'DO-' +
    Date.now().toString(36).toUpperCase().slice(-3) +
    Math.random().toString(36).substring(2, 5).toUpperCase()
  )
}

export function seedSellerOrders(): void {
  const existing = getAllSellerOrders()
  if (Object.keys(existing).length > 0) return
  MOCK_SELLER_ORDERS.forEach(o => saveSellerOrder(o))
}

/* ── Demo data shown on seller orders & earnings pages ── */

export const MOCK_SELLER_ORDERS: SellerOrder[] = [
  {
    id: 'so-1',
    orderId: 'ORD-DEMO01',
    linkedOrderId: 'ORD-DEMO01',
    bookTitle: 'Things Fall Apart',
    buyerInitials: 'AO',
    saleAmount: 2500,
    platformFee: 250,
    netAmount: 2250,
    status: 'awaiting_seller',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'so-2',
    orderId: 'ORD-DEMO02',
    bookTitle: 'Americanah',
    buyerInitials: 'TM',
    saleAmount: 4000,
    platformFee: 400,
    netAmount: 3600,
    status: 'dispatched',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'so-3',
    orderId: 'ORD-DEMO03',
    bookTitle: 'Atomic Habits',
    buyerInitials: 'FN',
    saleAmount: 4500,
    platformFee: 450,
    netAmount: 4050,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const MOCK_EARNINGS: Earning[] = [
  {
    id: 'e-1',
    bookTitle: 'Atomic Habits',
    saleAmount: 4500,
    platformFee: 450,
    netAmount: 4050,
    status: 'released',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'e-2',
    bookTitle: 'Americanah',
    saleAmount: 4000,
    platformFee: 400,
    netAmount: 3600,
    status: 'pending',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]
