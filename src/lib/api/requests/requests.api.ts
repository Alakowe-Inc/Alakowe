import client from "../client"
import type {
  CreateBookRequestDto,
  BookRequestResponse,
  BookRequestFilterParams,
} from "../types"

/**
 * Returns all requested books for the public browse/request page.
 * Ordered by most wanted (highest waitlist count) first.
 * GET /api/v1/BookRequest
 */
export async function getAllBookRequestsApi(
  params?: BookRequestFilterParams,
): Promise<BookRequestResponse[]> {
  try {
    const { data } = await client.get("/api/v1/BookRequest", { params })
    return data as BookRequestResponse[]
  } catch (error: any) {
    // Handle 405 Method Not Allowed gracefully by trying fallback endpoint variants
    if (error?.response?.status === 405) {
      try {
        const { data } = await client.get("/api/v1/BookRequest/", { params })
        return data as BookRequestResponse[]
      } catch {
        try {
          const { data } = await client.get("/api/v1/BookRequest/all", { params })
          return data as BookRequestResponse[]
        } catch {
          try {
            const { data } = await client.get("/api/v1/BookRequests", { params })
            return data as BookRequestResponse[]
          } catch {
            return []
          }
        }
      }
    }
    throw error
  }
}

/**
 * Creates a new book request or joins the waitlist of an existing request.
 * POST /api/v1/BookRequest
 */
export async function submitBookRequestApi(
  body: CreateBookRequestDto,
): Promise<BookRequestResponse> {
  const { data } = await client.post("/api/v1/BookRequest", body)
  return data as BookRequestResponse
}

/**
 * Retrieves requests created by the authenticated customer and waitlists they joined.
 * GET /api/v1/BookRequest/my-activity
 */
export function getMyBookActivityApi(): Promise<BookRequestResponse[]> {
  return client.get("/api/v1/BookRequest/my-activity").then(res => res.data)
}

/**
 * Removes the authenticated customer from the waitlist of a book request.
 * POST /api/v1/BookRequest/{id}/leave
 */
export async function leaveWaitlistApi(
  requestId: string,
): Promise<void> {
  await client.post(`/api/v1/BookRequest/${requestId}/leave`)
}