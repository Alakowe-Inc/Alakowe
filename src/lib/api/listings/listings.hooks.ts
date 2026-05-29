import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { withMock } from "../use-mock"
import {
  submitListingApi,
  editListingApi,
  getListingsByFilterApi,
  getListingByIdApi,
  getMyListingsApi,
  getMyListingByIdApi,
  setDiscountApi,
  getMyListingSummaryApi,
  type ListingFilterParams,
  type MyListingsFilterParams,
} from "./listings.api"
import type {
  SubmitListingRequestDto,
  UpdateListingRequestDto,
  ListingResponse,
  ListingResponsePagedResult,
  SetListingDiscountRequest,
  MyListingSummaryResponse,
} from "../types"

type SubmitListingBody = SubmitListingRequestDto
type UpdateListingBody = UpdateListingRequestDto

const mockListing: ListingResponse = {
  id: 1,
  title: "Mock Book",
  isbn: "123-4567890123",
  description: "A mock book description",
  price: 250000,
  quantity: 1,
  bookCondition: "Good",
  author: "Mock Author",
  categoryId: 1,
  isPublished: false,
  isSoldOut: false,
  status: "PendingApproval",
  categoryName: "Fiction",
  createdBy: "user@example.com",
  dateCreated: new Date().toISOString(),
  cartItemCount: 0,
  wishlistItemCount: 0,
  isDiscountApplied: false,
  location: "Yaba, Lagos",
}

const mockPagedResult: ListingResponsePagedResult = {
  result: [mockListing],
  pageNumber: 1,
  pageSize: 20,
  totalCount: 1,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
}

const mockSummary: MyListingSummaryResponse = {
  totalListings: 1,
  activePublished: 0,
  pendingApproval: 1,
  rejected: 0,
}

export function useListings(params?: ListingFilterParams) {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => withMock(mockPagedResult, () => getListingsByFilterApi(params)),
  })
}

export function useMyListings(params?: MyListingsFilterParams) {
  return useQuery({
    queryKey: ["my-listings", params],
    queryFn: () => withMock(mockPagedResult, () => getMyListingsApi(params)),
  })
}

export function useMyListingSummary() {
  return useQuery({
    queryKey: ["my-listings-summary"],
    queryFn: () => withMock(mockSummary, () => getMyListingSummaryApi()),
  })
}

export function useMyListing(id: number) {
  return useQuery({
    queryKey: ["my-listing", id],
    queryFn: () => withMock(mockListing, () => getMyListingByIdApi(id)),
    enabled: !!id,
  })
}

export function useListing(id: number) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => withMock(mockListing, () => getListingByIdApi(id)),
    enabled: !!id,
  })
}

export function useSubmitListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: SubmitListingBody) =>
      withMock(mockListing, () => submitListingApi(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] })
    },
  })
}

export function useEditListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateListingBody) =>
      withMock(mockListing, () => editListingApi(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] })
    },
  })
}

export function useSetDiscount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: SetListingDiscountRequest }) =>
      withMock(mockListing, () => setDiscountApi(id, body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-listings"] })
      queryClient.invalidateQueries({ queryKey: ["my-listing"] })
    },
  })
}
