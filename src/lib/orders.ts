import type { OrderDto } from "./api/types"

export type DisplayOrderStatus =
  | "payment_received"
  | "awaiting_seller"
  | "dropoff_scheduled"
  | "received_by_alakowe"
  | "processing"
  | "dispatched"
  | "delivered"
  | "confirmed"

export const ORDER_STATUS_LABELS: Record<DisplayOrderStatus, string> = {
  payment_received: "Payment Received",
  awaiting_seller: "Awaiting Seller Action",
  dropoff_scheduled: "Drop-off Scheduled",
  received_by_alakowe: "Book Received by Alakowe",
  processing: "Order Processing",
  dispatched: "Dispatched",
  delivered: "Delivered",
  confirmed: "Delivery Confirmed",
}

export const ORDER_STATUS_DESCRIPTIONS: Record<DisplayOrderStatus, string> = {
  payment_received: "Your payment is held securely in escrow.",
  awaiting_seller: "We've notified the seller. They have 48 hours to hand over the book.",
  dropoff_scheduled: "The seller has scheduled a drop-off or pickup.",
  received_by_alakowe: "Your book has arrived at our centre and is being prepared for delivery.",
  processing: "Your order is being packed and processed.",
  dispatched: "Your book is on its way to you.",
  delivered: "Your book has been delivered.",
  confirmed: "Delivery has been confirmed.",
}

export const ORDER_STATUSES: DisplayOrderStatus[] = [
  "payment_received",
  "awaiting_seller",
  "dropoff_scheduled",
  "received_by_alakowe",
  "processing",
  "dispatched",
  "delivered",
  "confirmed",
]

export function normalizeOrderStatus(status?: string | null): DisplayOrderStatus {
  const normalized = status?.trim().toLowerCase().replace(/[\s-]+/g, "_")

  // Checkout currently creates an order as "Confirmed"; in the existing
  // backend this means payment/order confirmation, not buyer delivery confirmation.
  if (normalized === "confirmed") return "awaiting_seller"

  if (normalized === "paid" || normalized === "payment_confirmed") return "payment_received"
  if (normalized === "awaiting_seller_action") return "awaiting_seller"
  if (normalized === "received" || normalized === "received_by_alakowe") return "received_by_alakowe"
  if (normalized === "shipped" || normalized === "out_for_delivery") return "dispatched"
  if (normalized === "delivery_confirmed" || normalized === "completed") return "confirmed"
  if (normalized && ORDER_STATUSES.includes(normalized as DisplayOrderStatus)) {
    return normalized as DisplayOrderStatus
  }

  return "processing"
}

export function orderTotalInNaira(order: OrderDto): number {
  return (order.totalAmount ?? 0) / 100
}

export function moneyInNaira(amount?: number | null): number {
  return (amount ?? 0) / 100
}

export function sellerDisplayName(item: {
  sellerName?: string | null
  sellerEmail?: string | null
}): string {
  const name = item.sellerName?.trim()
  if (name) return name
  return item.sellerEmail?.trim() || "Seller"
}

export function formatOrderShippingAddress(order: OrderDto): string {
  const address = order.deliveryAddress
  const parts = [
    address?.street?.trim() || order.shippingAddress?.trim(),
    address?.city?.trim() || order.shippingAreaName?.trim(),
    address?.state?.trim() || order.shippingStateName?.trim(),
  ].filter(Boolean) as string[]

  return parts.length > 0 ? parts.join(", ") : "Address on order"
}

export function getOrderDeliveryAddress(order: OrderDto): {
  fullName: string
  street: string
  city: string
  state: string
  phone: string
} {
  const address = order.deliveryAddress
  return {
    fullName: address?.fullName?.trim() || "",
    street: address?.street?.trim() || order.shippingAddress?.trim() || "",
    city: address?.city?.trim() || order.shippingAreaName?.trim() || "",
    state: address?.state?.trim() || order.shippingStateName?.trim() || "",
    phone: address?.phone?.trim() || "",
  }
}
