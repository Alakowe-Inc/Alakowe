import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { withMock } from "../use-mock"
import {
  submitListingApi,
  editListingApi,
  getListingsByFilterApi,
  getListingByIdApi,
  type ListingFilterParams,
} from "./listings.api"
import type {
  SubmitListingRequestDto,
  UpdateListingRequestDto,
  ListingResponse,
  ListingResponsePagedResult,
} from "../types"

type SubmitListingBody = SubmitListingRequestDto
type UpdateListingBody = UpdateListingRequestDto

const mockListing: ListingResponse = {
  id: 1,
  title: "Mock Book",
  isbn: "123-4567890123",
  description: "A mock book description",
  price: 2500,
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

export function useListings(params?: ListingFilterParams) {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => withMock(mockPagedResult, () => getListingsByFilterApi(params)),
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
