import client from "../client"
import type {
  PublicStoreProfileResponse,
  StoreProfileResponse,
  UpdateStoreProfileRequest,
} from "../types"

/** Public storefront profile (no auth) looked up by store slug. */
export async function getPublicStoreBySlugApi(slug: string): Promise<PublicStoreProfileResponse> {
  const { data } = await client.get(`/api/v1/store/by-slug/${encodeURIComponent(slug)}`)
  return data as PublicStoreProfileResponse
}

/** The authenticated seller's own store profile (lazily created server-side). */
export async function getSellerStoreProfileApi(): Promise<StoreProfileResponse> {
  const { data } = await client.get("/api/v1/seller/store")
  return data as StoreProfileResponse
}

export async function updateSellerStoreProfileApi(
  request: UpdateStoreProfileRequest,
): Promise<StoreProfileResponse> {
  const { data } = await client.put("/api/v1/seller/store", request, { skipSuccessToast: true })
  return data as StoreProfileResponse
}
