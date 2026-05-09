import { isMockMode } from '@/lib/utils'
import { apiGet, apiPost, apiDelete } from '@/lib/api-client'
import type {
  WishlistResponse,
  AddToWishlistRequest,
} from '@/lib/api-types'

export async function getWishlist(): Promise<WishlistResponse> {
  if (isMockMode()) {
    return { userId: 0, items: [], totalItems: 0 }
  }
  return apiGet<WishlistResponse>('/api/v1/wishlist')
}

export async function addToWishlist(req: AddToWishlistRequest): Promise<WishlistResponse> {
  if (isMockMode()) {
    return { userId: 0, items: [], totalItems: 0 }
  }
  return apiPost<WishlistResponse>('/api/v1/wishlist/add-item', req)
}

export async function removeWishlistItem(listingId: number): Promise<WishlistResponse> {
  if (isMockMode()) {
    return { userId: 0, items: [], totalItems: 0 }
  }
  return apiDelete<WishlistResponse>('/api/v1/wishlist/remove-item', { ListingId: listingId })
}
