import client from "../client"
import type {
  AddToCartRequestDto,
  BulkAddToCartRequestDto,
  CartResponse,
  CartValidationResponse,
} from "../types"

type AddToCartBody = AddToCartRequestDto
type BulkAddToCartBody = BulkAddToCartRequestDto

export async function getCartApi(): Promise<CartResponse> {
  const { data } = await client.get("/api/v1/cart")
  return data as CartResponse
}

export async function addToCartApi(body: AddToCartBody): Promise<CartResponse> {
  const { data } = await client.post("/api/v1/cart/add-item", body)
  return data as CartResponse
}

export async function bulkAddToCartApi(body: BulkAddToCartBody): Promise<CartResponse> {
  const { data } = await client.post("/api/v1/cart/bulk-add-items", body)
  return data as CartResponse
}

export async function validateCartApi(): Promise<CartValidationResponse> {
  const { data } = await client.post("/api/v1/cart/validate")
  return data as CartValidationResponse
}

export async function removeFromCartApi(listingId: number): Promise<CartResponse> {
  const { data } = await client.delete("/api/v1/cart/remove-item", {
    params: { ListingId: listingId },
  })
  return data as CartResponse
}
