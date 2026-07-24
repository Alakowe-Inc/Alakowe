import client from "../client"
import type {
  CreateBookRequestDto,
  BookRequestResponse,
} from "../types"

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
export async function getMyBookActivityApi(): Promise<BookRequestResponse[]> {
  const { data } = await client.get("/api/v1/BookRequest/my-activity")
  return data as BookRequestResponse[]
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