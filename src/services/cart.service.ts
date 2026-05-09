import { isMockMode } from '@/lib/utils'
import { apiGet, apiPost, apiDelete } from '@/lib/api-client'
import type {
  CartResponse,
  AddToCartRequest,
  BulkAddToCartRequest,
  CartValidationResponse,
} from '@/lib/api-types'

export async function getCart(): Promise<CartResponse> {
  if (isMockMode()) {
    return {
      id: 0,
      userId: 0,
      items: [],
      totalItems: 0,
      totalAmount: 0,
    }
  }
  return apiGet<CartResponse>('/api/v1/cart')
}

export async function addToCart(req: AddToCartRequest): Promise<CartResponse> {
  if (isMockMode()) {
    return {
      id: 0,
      userId: 0,
      items: [],
      totalItems: 0,
      totalAmount: 0,
    }
  }
  return apiPost<CartResponse>('/api/v1/cart/add-item', req)
}

export async function bulkAddToCart(req: BulkAddToCartRequest): Promise<CartResponse> {
  if (isMockMode()) {
    return {
      id: 0,
      userId: 0,
      items: [],
      totalItems: 0,
      totalAmount: 0,
    }
  }
  return apiPost<CartResponse>('/api/v1/cart/bulk-add-items', req)
}

export async function validateCart(): Promise<CartValidationResponse> {
  if (isMockMode()) {
    return { isValid: true, validItems: [], issues: [] }
  }
  return apiPost<CartValidationResponse>('/api/v1/cart/validate')
}

export async function removeCartItem(listingId: number): Promise<CartResponse> {
  if (isMockMode()) {
    return {
      id: 0,
      userId: 0,
      items: [],
      totalItems: 0,
      totalAmount: 0,
    }
  }
  return apiDelete<CartResponse>('/api/v1/cart/remove-item', { ListingId: listingId })
}
