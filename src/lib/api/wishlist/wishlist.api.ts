import client from "../client"
import type { AddToWishlistRequestDto, WishlistResponse } from "../types"

type AddToWishlistBody = AddToWishlistRequestDto

export async function getWishlistApi(): Promise<WishlistResponse> {
  const { data } = await client.get("/api/v1/wishlist")
  return data as WishlistResponse
}

export async function addToWishlistApi(body: AddToWishlistBody): Promise<WishlistResponse> {
  const { data } = await client.post("/api/v1/wishlist/add-item", body)
  return data as WishlistResponse
}

export async function removeFromWishlistApi(listingId: number): Promise<WishlistResponse> {
  const { data } = await client.delete("/api/v1/wishlist/remove-item", {
    params: { ListingId: listingId },
  })
  return data as WishlistResponse
}
