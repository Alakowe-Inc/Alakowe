import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { withMock } from "../use-mock"
import {
  getCartApi,
  addToCartApi,
  bulkAddToCartApi,
  validateCartApi,
  removeFromCartApi,
} from "./cart.api"
import type {
  AddToCartRequestDto,
  BulkAddToCartRequestDto,
  CartResponse,
  CartValidationResponse,
} from "../types"

type AddToCartBody = AddToCartRequestDto
type BulkAddToCartBody = BulkAddToCartRequestDto

const mockCart: CartResponse = {
  id: 1,
  userId: 1,
  items: [],
  totalItems: 0,
  totalAmount: 0,
}

const mockValidation: CartValidationResponse = {
  isValid: true,
  validItems: [],
  issues: [],
}

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => withMock(mockCart, () => getCartApi()),
    enabled: import.meta.env.VITE_USE_MOCK === "true" || !!localStorage.getItem("token"),
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: AddToCartBody) =>
      withMock(mockCart, () => addToCartApi(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}

export function useBulkAddToCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: BulkAddToCartBody) =>
      withMock(mockCart, () => bulkAddToCartApi(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}

export function useValidateCart() {
  return useMutation({
    mutationFn: () => withMock(mockValidation, () => validateCartApi()),
  })
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (listingId: number) =>
      withMock(mockCart, () => removeFromCartApi(listingId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}
