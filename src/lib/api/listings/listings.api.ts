import client from "../client"
import type {
  SubmitListingRequestDto,
  UpdateListingRequestDto,
  ListingResponse,
  ListingResponsePagedResult,
  ListingStatus,
  SetListingDiscountRequest,
  MyListingSummaryResponse,
  LandingPageResponse,
} from "../types"

type SubmitListingBody = SubmitListingRequestDto
type UpdateListingBody = UpdateListingRequestDto

export interface ListingFilterParams {
  CategoryId?: number
  Title?: string
  Author?: string
  Status?: ListingStatus
  PageNumber?: number
  PageSize?: number
}

export interface MyListingsFilterParams {
  Title?: string
  Status?: ListingStatus
  IsPublished?: boolean
  PageNumber?: number
  PageSize?: number
}

export async function submitListingApi(body: SubmitListingBody): Promise<ListingResponse> {
  const { data } = await client.post("/api/v1/Listing/submit", body)
  return data as ListingResponse
}

export async function editListingApi(body: UpdateListingBody): Promise<ListingResponse> {
  const { data } = await client.post("/api/v1/Listing/edit", body)
  return data as ListingResponse
}

export async function getListingsByFilterApi(
  params?: ListingFilterParams,
): Promise<ListingResponsePagedResult> {
  const { data } = await client.get("/api/v1/Listing/by-filter", { params })
  return data as ListingResponsePagedResult
}

export async function getListingByIdApi(id: number): Promise<ListingResponse> {
  const { data } = await client.get(`/api/v1/Listing/${id}`)
  return data as ListingResponse
}

export async function getMyListingByIdApi(id: number): Promise<ListingResponse> {
  const { data } = await client.get(`/api/v1/Listing/my-listings/${id}`)
  return data as ListingResponse
}

export async function getMyListingsApi(
  params?: MyListingsFilterParams,
): Promise<ListingResponsePagedResult> {
  const { data } = await client.get("/api/v1/Listing/my-listings", { params })
  return data as ListingResponsePagedResult
}

export async function setDiscountApi(
  id: number,
  body: SetListingDiscountRequest,
): Promise<ListingResponse> {
  const { data } = await client.post(`/api/v1/Listing/set-discount/${id}`, body)
  return data as ListingResponse
}

export async function getMyListingSummaryApi(): Promise<MyListingSummaryResponse> {
  const { data } = await client.get("/api/v1/Listing/my-listings/summary")
  return data as MyListingSummaryResponse
}

export async function getLandingPageApi(): Promise<LandingPageResponse> {
  const { data } = await client.get("/api/v1/LandingPage/landing-page")
  return data as LandingPageResponse
}
