export type ListingStatus = 'live' | 'pending' | 'rejected' | 'sold'

export type OrderStatus =
  | 'payment_received'
  | 'awaiting_seller'
  | 'dropoff_scheduled'
  | 'received_by_alakowe'
  | 'processing'
  | 'dispatched'
  | 'delivered'
  | 'confirmed'
  | 'funds_released'

export interface SellerListing {
  id: string
  title: string
  author: string
  genre: string
  condition: string
  price: number
  status: ListingStatus
  rejectionReason?: string
  createdAt: string
  views: number
}

export interface SellerOrder {
  id: string
  orderId: string
  bookTitle: string
  bookAuthor: string
  buyerInitials: string
  amount: number
  status: OrderStatus
  createdAt: string
  dropoffDeadline?: string
  dropoffCode?: string
  pickupCode?: string
}

export interface Earning {
  id: string
  bookTitle: string
  saleAmount: number
  platformFee: number
  netAmount: number
  status: 'pending' | 'released'
  date: string
}

export interface BuyerOrder {
  id: string
  orderId: string
  bookTitle: string
  author: string
  sellerInitials: string
  amount: number
  status: OrderStatus
  createdAt: string
  coverColor: string
}

export const BUYER_ORDER_STATUSES: OrderStatus[] = [
  'payment_received',
  'awaiting_seller',
  'dropoff_scheduled',
  'received_by_alakowe',
  'processing',
  'dispatched',
  'delivered',
]

export const SELLER_ORDER_STATUSES: OrderStatus[] = [
  'payment_received',
  'awaiting_seller',
  'dropoff_scheduled',
  'received_by_alakowe',
  'processing',
  'dispatched',
  'delivered',
  'confirmed',
  'funds_released',
]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  payment_received: 'Payment Received',
  awaiting_seller: 'Awaiting Your Action',
  dropoff_scheduled: 'Drop-off Scheduled',
  received_by_alakowe: 'Received by Alakowe',
  processing: 'Order Processing',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
  confirmed: 'Buyer Confirmed',
  funds_released: 'Funds Released',
}

export const BUYER_ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  payment_received: 'Payment Received',
  awaiting_seller: 'Awaiting Seller Action',
  dropoff_scheduled: 'Seller Drop-off Scheduled',
  received_by_alakowe: 'Received by Alakowe',
  processing: 'Order Processing',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
  confirmed: 'Delivery Confirmed',
  funds_released: 'Complete',
}

export const sellerListings: SellerListing[] = [
  {
    id: '1',
    title: 'Things Fall Apart',
    author: 'Chinua Achebe',
    genre: 'African Fiction',
    condition: 'Good',
    price: 2500,
    status: 'live',
    createdAt: '2026-03-10',
    views: 42,
  },
  {
    id: '2',
    title: 'Purple Hibiscus',
    author: 'Chimamanda Ngozi Adichie',
    genre: 'African Fiction',
    condition: 'Very Good',
    price: 3000,
    status: 'sold',
    createdAt: '2026-02-28',
    views: 67,
  },
  {
    id: '3',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self Help',
    condition: 'Good',
    price: 4500,
    status: 'pending',
    createdAt: '2026-04-12',
    views: 0,
  },
  {
    id: '4',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Foreign Fiction',
    condition: 'Average',
    price: 8000,
    status: 'rejected',
    rejectionReason:
      'Price appears too high for the stated condition. Please review and resubmit at a more competitive price.',
    createdAt: '2026-04-08',
    views: 0,
  },
  {
    id: '5',
    title: 'Stay With Me',
    author: 'Ayobami Adeyemi',
    genre: 'African Fiction',
    condition: 'Like New',
    price: 3200,
    status: 'live',
    createdAt: '2026-04-01',
    views: 18,
  },
]

export const sellerOrders: SellerOrder[] = [
  {
    id: '1',
    orderId: 'ALK-0041',
    bookTitle: 'Purple Hibiscus',
    bookAuthor: 'Chimamanda Ngozi Adichie',
    buyerInitials: 'T.O.',
    amount: 3000,
    status: 'funds_released',
    createdAt: '2026-03-15',
    dropoffCode: 'ALK-DROP-7X2K',
  },
  {
    id: '2',
    orderId: 'ALK-0059',
    bookTitle: 'Things Fall Apart',
    bookAuthor: 'Chinua Achebe',
    buyerInitials: 'F.A.',
    amount: 2500,
    status: 'awaiting_seller',
    createdAt: '2026-04-14',
    dropoffDeadline: '2026-04-16',
  },
]

export const sellerEarnings: Earning[] = [
  {
    id: '1',
    bookTitle: 'Purple Hibiscus',
    saleAmount: 3000,
    platformFee: 300,
    netAmount: 2700,
    status: 'released',
    date: '2026-03-28',
  },
  {
    id: '2',
    bookTitle: 'Things Fall Apart',
    saleAmount: 2500,
    platformFee: 250,
    netAmount: 2250,
    status: 'pending',
    date: '2026-04-14',
  },
]

export const buyerOrders: BuyerOrder[] = [
  {
    id: '1',
    orderId: 'ALK-0062',
    bookTitle: 'Half of a Yellow Sun',
    author: 'Chimamanda Ngozi Adichie',
    sellerInitials: 'T.M.',
    amount: 3500,
    status: 'dispatched',
    createdAt: '2026-04-10',
    coverColor: '#F4A261',
  },
  {
    id: '2',
    orderId: 'ALK-0071',
    bookTitle: 'Americanah',
    author: 'Chimamanda Ngozi Adichie',
    sellerInitials: 'N.A.',
    amount: 4000,
    status: 'awaiting_seller',
    createdAt: '2026-04-14',
    coverColor: '#2D6A4F',
  },
  {
    id: '3',
    orderId: 'ALK-0023',
    bookTitle: 'The Famished Road',
    author: 'Ben Okri',
    sellerInitials: 'E.R.',
    amount: 2000,
    status: 'delivered',
    createdAt: '2026-03-20',
    coverColor: '#E63946',
  },
]
