export type OrderStatus =
  | 'payment_received'
  | 'awaiting_seller'
  | 'dropoff_scheduled'
  | 'received_by_alakowe'
  | 'processing'
  | 'dispatched'
  | 'delivered'
  | 'confirmed'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  payment_received: 'Payment Received',
  awaiting_seller: 'Awaiting Seller Action',
  dropoff_scheduled: 'Drop-off Scheduled',
  received_by_alakowe: 'Book Received by Alakowe',
  processing: 'Order Processing',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
  confirmed: 'Delivery Confirmed',
}

export const ORDER_STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  payment_received: 'Your payment is held securely in escrow.',
  awaiting_seller: 'We\'ve notified the seller. They have 48 hours to drop off or request a pickup.',
  dropoff_scheduled: 'The seller has scheduled a drop-off or pickup.',
  received_by_alakowe: 'Your book has arrived at our centre and is being prepared for delivery.',
  processing: 'Your order is being packed and processed.',
  dispatched: 'Your book is on its way to you.',
  delivered: 'Your book has been delivered. Please confirm receipt below.',
  confirmed: 'You\'ve confirmed delivery. Thank you for using Alakowe!',
}

export const ORDER_STATUSES: OrderStatus[] = [
  'payment_received',
  'awaiting_seller',
  'dropoff_scheduled',
  'received_by_alakowe',
  'processing',
  'dispatched',
  'delivered',
]

export interface OrderItem {
  bookId: string
  title: string
  author: string
  coverColor: string
  price: number
  quantity: number
  condition: string
  sellerName: string
}

export interface DeliveryAddress {
  street: string
  city: string
  state: string
}

export interface Order {
  id: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: DeliveryAddress
  createdAt: string
}

const ORDERS_KEY = 'alakowe_orders'

export function saveOrder(order: Order): void {
  const orders = getAllOrders()
  orders[order.id] = order
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function getOrder(orderId: string): Order | null {
  const orders = getAllOrders()
  return orders[orderId] ?? null
}

export function getAllOrders(): Record<string, Order> {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  const order = getOrder(orderId)
  if (order) saveOrder({ ...order, status })
}

export function generateOrderId(): string {
  return (
    'ORD-' +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).substring(2, 5).toUpperCase()
  )
}

export function seedDemoOrder(): void {
  if (getOrder('ORD-DEMO01')) return
  const demo: Order = {
    id: 'ORD-DEMO01',
    items: [
      {
        bookId: 'demo-1',
        title: 'Things Fall Apart',
        author: 'Chinua Achebe',
        coverColor: '#C8A97E',
        price: 2500,
        quantity: 1,
        condition: 'Very Good',
        sellerName: 'Seller A',
      },
    ],
    subtotal: 2500,
    deliveryFee: 1500,
    total: 4000,
    status: 'awaiting_seller',
    customerName: 'Amaka Okonkwo',
    customerEmail: 'amaka@example.com',
    customerPhone: '08012345678',
    deliveryAddress: { street: '12 Broad Street', city: 'Lagos', state: 'Lagos' },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  }
  saveOrder(demo)
}
