import type { OrderDto } from "./api/types"

export type DisplayOrderStatus =
  | "payment_received"
  | "awaiting_seller"
  | "dropoff_scheduled"
  | "in_transit_to_hub"
  | "received_by_alakowe"
  | "processing"
  | "dispatched"
  | "delivered"
  | "confirmed"

export const ORDER_STATUS_LABELS: Record<DisplayOrderStatus, string> = {
  payment_received: "Payment Received",
  awaiting_seller: "Awaiting Seller Action",
  dropoff_scheduled: "Drop-off Scheduled",
  in_transit_to_hub: "In Transit to Alakowe",
  received_by_alakowe: "Book Received by Alakowe",
  processing: "Order Processing",
  dispatched: "Dispatched",
  delivered: "Delivered",
  confirmed: "Delivery Confirmed",
}

export const ORDER_STATUS_DESCRIPTIONS: Record<DisplayOrderStatus, string> = {
  payment_received: "Your payment is held securely in escrow.",
  awaiting_seller: "We've notified the seller. They have 48 hours to hand over the book.",
  dropoff_scheduled: "The seller has scheduled a Speedaf drop-off and will hand over the book at their station.",
  in_transit_to_hub: "Your book is on its way to our Alakowe centre.",
  received_by_alakowe: "Your book has arrived at our centre and is being prepared for delivery.",
  processing: "Your order is being sorted and packed for delivery to you.",
  dispatched: "Your book is on its way to you.",
  delivered: "Your book has been delivered.",
  confirmed: "Delivery has been confirmed.",
}

export const ORDER_STATUSES: DisplayOrderStatus[] = [
  "payment_received",
  "awaiting_seller",
  "dropoff_scheduled",
  "in_transit_to_hub",
  "received_by_alakowe",
  "processing",
  "dispatched",
  "delivered",
  "confirmed",
]

/** Backend uses PascalCase (e.g. OutForDelivery); timeline keys use snake_case. */
export function backendStatusKey(status?: string | null): string {
  if (!status?.trim()) return ""
  return status
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase()
}

export function normalizeOrderStatus(status?: string | null): DisplayOrderStatus {
  const key = backendStatusKey(status)

  if (!key) return "payment_received"

  switch (key) {
    case "pending":
    case "payment_pending":
    case "paid":
    case "payment_confirmed":
      return "payment_received"

    // Checkout creates "Confirmed" = paid, waiting on seller — not buyer delivery confirmation.
    case "confirmed":
      return "awaiting_seller"

    case "awaiting_seller":
    case "awaiting_seller_action":
      return "awaiting_seller"

    case "awaiting_inbound":
    case "inbound_booked":
      return "dropoff_scheduled"

    case "in_transit_to_hub":
      return "in_transit_to_hub"

    case "at_hub":
    case "received":
    case "received_by_alakowe":
      return "received_by_alakowe"

    case "sorted":
    case "outbound_booked":
      return "processing"

    case "out_for_delivery":
    case "shipped":
    case "dispatched":
    case "in_transit":
      return "dispatched"

    case "delivered":
      return "delivered"

    case "delivery_confirmed":
    case "completed":
      return "confirmed"

    case "cancelled":
    case "canceled":
      return "awaiting_seller"

    default:
      break
  }

  if (ORDER_STATUSES.includes(key as DisplayOrderStatus)) {
    return key as DisplayOrderStatus
  }

  return "processing"
}

export type SellerSaleDisplayStatus =
  | "awaiting_seller"
  | "dropoff_scheduled"
  | "received_by_alakowe"
  | "dispatched"
  | "delivered"
  | "confirmed"

/** Seller-facing subset of the buyer timeline (same backend status strings). */
export function normalizeSellerSaleStatus(sale: {
  status?: string | null
  isSettled?: boolean
  preferredSpeedafStationId?: number | null
}): SellerSaleDisplayStatus {
  if (sale.isSettled) return "confirmed"

  const step = normalizeOrderStatus(sale.status)

  if (
    sale.preferredSpeedafStationId &&
    (step === "awaiting_seller" || step === "payment_received")
  ) {
    return "dropoff_scheduled"
  }

  switch (step) {
    case "payment_received":
    case "awaiting_seller":
      return "awaiting_seller"
    case "dropoff_scheduled":
    case "in_transit_to_hub":
      return "dropoff_scheduled"
    case "received_by_alakowe":
    case "processing":
      return "received_by_alakowe"
    case "dispatched":
      return "dispatched"
    case "delivered":
      return "delivered"
    case "confirmed":
      return "confirmed"
    default:
      return "awaiting_seller"
  }
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
