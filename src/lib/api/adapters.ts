import type { ListingResponse, CartItemResponse, CartResponse } from "./types"

const COVER_COLORS = ["#C8A97E", "#2E4057", "#6B4E3E", "#8B4513", "#4A6FA5", "#7C5C4D", "#9B6B43", "#5D7A5D"]

function pickColor(id?: number): string {
  return COVER_COLORS[(id ?? 1) % COVER_COLORS.length]
}

export interface BookDisplay {
  id: string
  title: string
  author: string
  genre: string
  condition: string
  conditionDetail?: string
  format?: string
  quantity: number
  price: number
  originalPrice: number
  discount?: number
  isDiscountApplied?: boolean
  coverColor: string
  coverImageUrl?: string
  imageUrls?: string[]
  description: string
  loveNote?: string
  sellerName: string
  isbn?: string
  categoryId?: number
  location?: string
}

export function listingToBookDisplay(listing: ListingResponse): BookDisplay {
  const priceInNaira = Math.round((listing.price ?? 0) / 100)
  const discountPct = listing.discount ?? 0
  const discountedPrice = listing.isDiscountApplied && discountPct > 0
    ? Math.round(priceInNaira * (1 - discountPct / 100))
    : priceInNaira

  return {
    id: String(listing.id ?? ""),
    title: listing.title ?? "",
    author: listing.author ?? "",
    genre: listing.categoryName ?? "General",
    condition: listing.bookCondition ?? "Good",
    quantity: listing.quantity ?? 1,
    price: discountedPrice,
    originalPrice: priceInNaira,
    discount: discountPct,
    isDiscountApplied: listing.isDiscountApplied ?? false,
    coverColor: pickColor(listing.id),
    coverImageUrl: listing.coverImageFileName ?? undefined,
    imageUrls: listing.imageFileNames ?? undefined,
    conditionDetail: listing.conditionDetail ?? undefined,
    format: listing.format ?? undefined,
    description: listing.description ?? "",
    loveNote: listing.loveNote ?? undefined,
    sellerName: listing.createdBy ?? "Seller",
    isbn: listing.isbn ?? undefined,
    categoryId: listing.categoryId,
    location: listing.location ?? undefined,
  }
}

export interface CartItemDisplay {
  listingId: number
  title: string
  author: string
  coverColor: string
  unitPrice: number
  quantity: number
  isbn?: string
}

export function cartItemToDisplay(item: CartItemResponse): CartItemDisplay {
  return {
    listingId: item.listingId ?? 0,
    title: item.title ?? "",
    author: item.author ?? "",
    coverColor: pickColor(item.listingId),
    unitPrice: Math.round((item.unitPrice ?? 0) / 100),
    quantity: item.quantity ?? 1,
    isbn: item.isbn ?? undefined,
  }
}

export function cartToDisplay(cart: CartResponse): CartItemDisplay[] {
  return (cart.items ?? []).map(cartItemToDisplay)
}
