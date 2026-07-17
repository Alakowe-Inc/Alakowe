import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getPublicStoreByEmailApi,
  getSellerStoreProfileApi,
  updateSellerStoreProfileApi,
} from "./store.api"
import type { UpdateStoreProfileRequest } from "../types"

export function usePublicStoreByEmail(email: string) {
  return useQuery({
    queryKey: ["store", "public", email.toLowerCase()],
    queryFn: () => getPublicStoreByEmailApi(email),
    enabled: !!email,
  })
}

export function useSellerStoreProfile(enabled = true) {
  return useQuery({
    queryKey: ["store", "mine"],
    queryFn: getSellerStoreProfileApi,
    enabled,
  })
}

export function useUpdateSellerStoreProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: UpdateStoreProfileRequest) => updateSellerStoreProfileApi(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] })
    },
  })
}
