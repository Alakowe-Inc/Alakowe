import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { withMock } from "../use-mock"
import {
  getPublicStoreBySlugApi,
  getSellerStoreProfileApi,
  updateSellerStoreProfileApi,
  getStoreListingsApi,
} from "./store.api"
import type { UpdateStoreProfileRequest, ListingResponse, ListingResponsePagedResult } from "../types"

const mockStoreListings: ListingResponse[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `Store Book ${i + 1}`,
  isbn: `987-6543210${String(i + 1).padStart(3, '0')}`,
  description: `A store book description #${i + 1}`,
  price: 150000 + i * 3000,
  quantity: 1,
  bookCondition: "Good",
  author: `Author ${i + 1}`,
  categoryId: 1,
  isPublished: true,
  isSoldOut: false,
  status: i % 5 === 0 ? "Rejected" : "Approved",
  categoryName: "Fiction",
  createdBy: "seller-a@example.com",
  dateCreated: new Date(Date.now() - i * 86400000).toISOString(),
  cartItemCount: 0,
  wishlistItemCount: 0,
  isDiscountApplied: i % 4 === 0,
  discount: i % 4 === 0 ? 10 : 0,
  location: ["Lagos", "Abuja", "Port Harcourt"][i % 3],
  numberOfPages: 320,
  storeSlug: "test-store",
  storeName: "Test Store",
  username: "testuser",
}))

function getMockStorePagedResult(slug: string, pageNumber?: number, pageSize?: number): ListingResponsePagedResult {
  const ps = pageSize ?? 20
  const pn = pageNumber ?? 1
  const totalCount = mockStoreListings.length
  const totalPages = Math.max(1, Math.ceil(totalCount / ps))
  const start = (pn - 1) * ps
  const result = mockStoreListings.slice(start, start + ps)

  return {
    result,
    pageNumber: pn,
    pageSize: ps,
    totalCount,
    totalPages,
    hasPreviousPage: pn > 1,
    hasNextPage: pn < totalPages,
  }
}

export function usePublicStoreBySlug(slug: string) {
  return useQuery({
    queryKey: ["store", "public", slug.toLowerCase()],
    queryFn: () => getPublicStoreBySlugApi(slug),
    enabled: !!slug,
    retry: false,
  })
}

export function useSellerStoreProfile(enabled = true) {
  return useQuery({
    queryKey: ["store", "mine"],
    queryFn: getSellerStoreProfileApi,
    enabled,
    retry: false,
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

export function useStoreListings(slug: string, pageNumber?: number, pageSize?: number) {
  return useQuery({
    queryKey: ["store-listings", slug.toLowerCase(), pageNumber, pageSize],
    queryFn: () => withMock(
      getMockStorePagedResult(slug, pageNumber, pageSize),
      () => getStoreListingsApi(slug, pageNumber, pageSize),
    ),
    enabled: !!slug,
    retry: false,
  })
}
