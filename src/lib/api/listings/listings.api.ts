import client from "../client"
import type {
  SubmitListingRequestDto,
  UpdateListingRequestDto,
  ListingResponse,
  ListingResponsePagedResult,
  ListingStatus,
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
