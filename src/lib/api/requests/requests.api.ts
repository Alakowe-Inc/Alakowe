import client from "../client"
import type {
  CreateBookRequestDto,
  BookRequestResponse,
  BookRequestFilterParams,
} from "../types"

export async function submitBookRequestApi(body: CreateBookRequestDto): Promise<BookRequestResponse> {
  const { data } = await client.post("/api/v1/BookRequest/submit", body)
  return data as BookRequestResponse
}

export async function getMyBookRequestsApi(): Promise<BookRequestResponse[]> {
  const { data } = await client.get("/api/v1/BookRequest/my-requests")
  return data as BookRequestResponse[]
}

export async function getAllBookRequestsApi(
  params?: BookRequestFilterParams,
): Promise<BookRequestResponse[]> {
  const { data } = await client.get("/api/v1/BookRequest/all", { params })
  return data as BookRequestResponse[]
}

export async function joinWaitlistApi(requestId: string): Promise<BookRequestResponse> {
  const { data } = await client.post(`/api/v1/BookRequest/${requestId}/waitlist`)
  return data as BookRequestResponse
}

export async function closeBookRequestApi(requestId: string): Promise<BookRequestResponse> {
  const { data } = await client.post(`/api/v1/BookRequest/${requestId}/close`)
  return data as BookRequestResponse
}
