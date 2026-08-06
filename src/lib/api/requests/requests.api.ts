import client from "../client"
import type {
  CreateBookRequestDto,
  BookRequestResponse,
  BookRequestFilterParams,
} from "../types"

/**
 * Returns all requested books for the public browse/request page from the API.
 * GET /api/v1/BookRequest
 */
export async function getAllBookRequestsApi(
  params?: BookRequestFilterParams,
): Promise<BookRequestResponse[]> {
  const response = await client.get("/api/v1/BookRequest", { params })
  const data = response.data
  if (Array.isArray(data)) return data as BookRequestResponse[]
  if (data && typeof data === 'object') {
    if (Array.isArray(data.data)) return data.data as BookRequestResponse[]
    if (Array.isArray(data.result)) return data.result as BookRequestResponse[]
    if (Array.isArray(data.items)) return data.items as BookRequestResponse[]
    if (Array.isArray(data.requests)) return data.requests as BookRequestResponse[]
    if (Array.isArray(data.bookRequests)) return data.bookRequests as BookRequestResponse[]
    const firstArray = Object.values(data).find((val) => Array.isArray(val))
    if (firstArray) return firstArray as BookRequestResponse[]
  }
  return []
}

/**
 * Creates a new book request or joins the waitlist of an existing request.
 * POST /api/v1/BookRequest
 */
export async function submitBookRequestApi(
  body: CreateBookRequestDto,
  config?: import('axios').AxiosRequestConfig
): Promise<BookRequestResponse> {
  const { data } = await client.post("/api/v1/BookRequest", body, config)
  return data as BookRequestResponse
}

/**
 * Retrieves requests created by the authenticated customer and waitlists they joined.
 * GET /api/v1/BookRequest/my-activity
 */
export async function getMyBookActivityApi(): Promise<BookRequestResponse[]> {
  const response = await client.get("/api/v1/BookRequest/my-activity")
  const data = response.data
  if (Array.isArray(data)) return data as BookRequestResponse[]
  if (data && typeof data === 'object') {
    if (Array.isArray(data.myWaitlists)) return data.myWaitlists as BookRequestResponse[]
    if (Array.isArray(data.data)) return data.data as BookRequestResponse[]
    if (Array.isArray(data.result)) return data.result as BookRequestResponse[]
    if (Array.isArray(data.items)) return data.items as BookRequestResponse[]
    if (Array.isArray(data.requests)) return data.requests as BookRequestResponse[]
    const firstArray = Object.values(data).find((val) => Array.isArray(val))
    if (firstArray) return firstArray as BookRequestResponse[]
  }
  return []
}

/**
 * Removes the authenticated customer from the waitlist of a book request.
 * POST /api/v1/BookRequest/{id}/leave
 */
export async function leaveWaitlistApi(
  requestId: string | number,
): Promise<void> {
  await client.post(`/api/v1/BookRequest/${requestId}/leave`)
}