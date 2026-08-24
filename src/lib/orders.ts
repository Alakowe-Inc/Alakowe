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
  | "disputed"
  | "cancelled"
  | "resolved"

export const ORDER_STATUS_LABELS: Record<DisplayOrderStatus, string> = {
  payment_received: "Payment Received",
  awaiting_seller: "Awaiting Seller Action",
  dropoff_scheduled: "Drop-off Scheduled",
  in_transit_to_hub: "Dropped Off",
  received_by_alakowe: "Book Received by Alakowe",
  processing: "Order Processing",
  dispatched: "Dispatched",
  delivered: "Delivered",
  confirmed: "Delivery Confirmed",
  disputed: "Dispute Open",
  cancelled: "Cancelled",
  resolved: "Dispute Resolved",
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
  disputed: "A dispute has been opened for this order. Your payment stays in escrow until it's resolved.",
  cancelled: "This order was cancelled. If it was cancelled after a dispute, the buyer's payment was refunded.",
  resolved: "The dispute on this order has been resolved.",
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
  "disputed",
  "cancelled",
  "resolved",
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

    case "disputed":
      return "disputed"

    case "delivery_confirmed":
    case "completed":
      return "confirmed"

    case "cancelled":
    case "canceled":
      return "cancelled"

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
  | "disputed"
  | "cancelled"

/** Seller-facing subset of the buyer timeline (same backend status strings). */
export function normalizeSellerSaleStatus(sale: {
  status?: string | null
  isSettled?: boolean
  preferredSpeedafStationId?: number | null
  fulfillmentType?: string | null
}): SellerSaleDisplayStatus {
  if (sale.isSettled) return "confirmed"

  const isPickup = (sale.fulfillmentType ?? "").toLowerCase() === "pickup"
  const step = normalizeOrderStatus(sale.status)

  if (
    !isPickup &&
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
    case "disputed":
      return "disputed"
    case "cancelled":
      return "cancelled"
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

export function isPickupOrder(order: {
  fulfillmentType?: string | null
}): boolean {
  return (order.fulfillmentType ?? "").toLowerCase() === "pickup"
}

export function formatPickupPreferredDates(dates?: string[] | null): string {
  if (!dates?.length) return ""
  return dates
    .map((d) => {
      const parsed = new Date(d)
      if (Number.isNaN(parsed.getTime())) return d
      return parsed.toLocaleDateString("en-NG", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    })
    .join("; ")
}

export function pickupMapsUrl(address?: string | null): string | null {
  const query = address?.trim()
  if (!query) return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function formatOrderShippingAddress(order: OrderDto): string {
  if (isPickupOrder(order)) {
    return order.pickupAddress?.trim() || "Pickup address on order"
  }

  const address = order.deliveryAddress
  const parts = [
    address?.street?.trim() || order.shippingAddress?.trim(),
    address?.city?.trim() || order.shippingAreaName?.trim(),
    address?.state?.trim() || order.shippingStateName?.trim(),
  ].filter(Boolean) as string[]

  return parts.length > 0 ? parts.join(", ") : "Address on order"
}

export function orderStatusLabel(
  status: DisplayOrderStatus,
  fulfillmentType?: string | null,
): string {
  if (isPickupOrder({ fulfillmentType })) {
    if (status === "awaiting_seller") return "Ready for pickup"
    if (status === "delivered") return "Picked up"
    if (status === "confirmed") return "Pickup confirmed"
  }
  return ORDER_STATUS_LABELS[status]
}

export function orderStatusDescription(
  status: DisplayOrderStatus,
  fulfillmentType?: string | null,
): string {
  if (isPickupOrder({ fulfillmentType })) {
    if (status === "awaiting_seller") {
      return "Show your pickup code to the seller when you collect the book."
    }
    if (status === "delivered") {
      return "The seller confirmed you collected the book."
    }
    if (status === "confirmed") {
      return "This pickup order is complete."
    }
  }
  return ORDER_STATUS_DESCRIPTIONS[status]
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

export type ResolutionTone = "good" | "bad" | "neutral"

export function decisionLabel(decision: string): string {
  switch (decision) {
    case "RefundBuyer":
      return "Refunded to buyer"
    case "RuleForSeller":
      return "Ruled for seller"
    case "Close":
      return "Dispute closed"
    default:
      return "Resolved"
  }
}

export function resolutionSummary(decision: string, isBuyer: boolean): string {
  switch (decision) {
    case "RefundBuyer":
      return isBuyer
        ? "The dispute was resolved in your favour — your payment has been refunded and the order cancelled."
        : "This dispute was resolved in the buyer’s favour — the payment was refunded, so this sale has no payout."
    case "RuleForSeller":
      return isBuyer
        ? "Your dispute was reviewed and resolved in the seller’s favour — the order is complete."
        : "The dispute was resolved in your favour — the payment has been released to you. You can request your payout."
    case "Close":
      return "The dispute was closed without a ruling and the order returned to normal."
    default:
      return "The dispute on this order has been resolved."
  }
}

export function resolutionTone(
  decision: string,
  isBuyer: boolean,
): ResolutionTone {
  if (decision === "RefundBuyer") return isBuyer ? "good" : "bad"
  if (decision === "RuleForSeller") return isBuyer ? "bad" : "good"
  return "neutral"
}
