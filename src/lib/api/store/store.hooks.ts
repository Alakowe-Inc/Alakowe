import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getPublicStoreBySlugApi,
  getSellerStoreProfileApi,
  updateSellerStoreProfileApi,
} from "./store.api"
import type { UpdateStoreProfileRequest } from "../types"

export function usePublicStoreBySlug(slug: string) {
  return useQuery({
    queryKey: ["store", "public", slug.toLowerCase()],
    queryFn: () => getPublicStoreBySlugApi(slug),
    enabled: !!slug,
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
