import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { withMock } from "../use-mock"
import {
  getWishlistApi,
  addToWishlistApi,
  removeFromWishlistApi,
} from "./wishlist.api"
import type { AddToWishlistRequestDto, WishlistResponse } from "../types"

type AddToWishlistBody = AddToWishlistRequestDto

const mockWishlist: WishlistResponse = {
  userId: 1,
  items: [],
  totalItems: 0,
}

export function useWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: () => withMock(mockWishlist, () => getWishlistApi()),
    enabled: import.meta.env.VITE_USE_MOCK === "true" || !!localStorage.getItem("token"),
  })
}

export function useAddToWishlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: AddToWishlistBody) =>
      withMock(mockWishlist, () => addToWishlistApi(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] })
    },
  })
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (listingId: number) =>
      withMock(mockWishlist, () => removeFromWishlistApi(listingId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] })
    },
  })
}
