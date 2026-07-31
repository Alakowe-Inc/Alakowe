import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { withMock } from "../use-mock"
import {
  submitBookRequestApi,
  getMyBookActivityApi,
  getAllBookRequestsApi,
  leaveWaitlistApi,
} from "./requests.api"
import type {
  CreateBookRequestDto,
  BookRequestResponse,
  BookRequestFilterParams,
} from "../types"
import {
  saveRequest,
  getBuyerRequests,
  generateRequestId,
  closeRequest,
} from "../../../data/requestData"

function getSharedRequests(): BookRequestResponse[] {
  try {
    const raw = localStorage.getItem("alakowe_requests")
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Object.values(parsed) as BookRequestResponse[]
  } catch {
    return []
  }
}

/**
 * Submit a new book request.
 * Uses POST /api/v1/BookRequest under the hood (via withMock).
 */
export function useSubmitBookRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateBookRequestDto & { buyerEmail?: string }) => {
      const mockResult: BookRequestResponse = {
        id: generateRequestId(),
        buyerEmail: body.buyerEmail ?? "",
        title: body.title ?? "",
        author: body.author ?? "",
        category: body.category ?? "",
        condition: body.bookCondition ?? "",
        status: "open",
        createdAt: new Date().toISOString(),
        dateCreated: new Date().toISOString(),
        waitlist: body.buyerEmail ? [body.buyerEmail] : [],
        waitlistCount: 1,
        isUserOnWaitlist: true,
        isWaitlisted: true,
      }

      saveRequest({
        id: String(mockResult.id),
        buyerEmail: mockResult.buyerEmail ?? "",
        title: mockResult.title,
        author: mockResult.author ?? "",
        category: mockResult.category ?? "",
        condition: mockResult.condition ?? "",
        status: mockResult.status ?? "open",
        createdAt: mockResult.createdAt ?? new Date().toISOString(),
        waitlist: mockResult.waitlist ?? [],
      })

      return withMock(mockResult, () => submitBookRequestApi(body))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["my-book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["allBookRequests"] })
      queryClient.invalidateQueries({ queryKey: ["myBookRequests"] })
    },
  })
}

/**
 * Fetch the authenticated user's own requests & waitlists.
 * Uses GET /api/v1/BookRequest/my-activity.
 */
export function useMyBookRequests(userEmail?: string) {
  return useQuery({
    queryKey: ["my-book-requests", userEmail],
    queryFn: () => {
      const mockList: BookRequestResponse[] = userEmail
        ? getBuyerRequests(userEmail).map((r) => ({
            ...r,
            waitlistCount: r.waitlist?.length || 1,
            isUserOnWaitlist: r.waitlist?.includes(userEmail) || true,
            isWaitlisted: r.waitlist?.includes(userEmail) || true,
            dateCreated: r.createdAt,
          }))
        : []
      return withMock(mockList, () => getMyBookActivityApi())
    },
    enabled: !!userEmail,
  })
}

/**
 * Fetch ALL open book requests (community-wide) from GET /api/v1/BookRequest.
 */
export function useAllBookRequests(params?: BookRequestFilterParams, userEmail?: string) {
  return useQuery({
    queryKey: ["book-requests", params, userEmail],
    queryFn: async () => {
      const all = getSharedRequests()
      const mockList: BookRequestResponse[] = all
        .filter((r) => r.status === "open")
        .map((r) => ({
          ...r,
          waitlistCount: r.waitlist?.length || 1,
          isUserOnWaitlist: userEmail ? r.waitlist?.includes(userEmail) ?? false : false,
          isWaitlisted: userEmail ? r.waitlist?.includes(userEmail) ?? false : false,
          dateCreated: r.createdAt,
        }))
      return withMock(mockList, () => getAllBookRequestsApi(params))
    },
  })
}

/**
 * Join the waitlist for an existing book request.
 * Uses POST /api/v1/BookRequest endpoint.
 */
export function useJoinWaitlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateBookRequestDto & { requestId?: string | number; buyerEmail?: string | null }) => {
      const mockResult: BookRequestResponse = {
        id: body.requestId ? String(body.requestId) : generateRequestId(),
        buyerEmail: body.buyerEmail ?? "",
        title: body.title ?? "",
        author: body.author ?? "",
        category: body.category ?? "",
        condition: body.bookCondition ?? "",
        status: "open",
        createdAt: new Date().toISOString(),
        dateCreated: new Date().toISOString(),
        waitlist: body.buyerEmail ? [body.buyerEmail] : [],
        waitlistCount: 1,
        isUserOnWaitlist: true,
        isWaitlisted: true,
      }
      return withMock(mockResult, () => submitBookRequestApi(body))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["my-book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["allBookRequests"] })
      queryClient.invalidateQueries({ queryKey: ["myBookRequests"] })
    },
  })
}

/**
 * Leave the waitlist for a book request.
 * Uses POST /api/v1/BookRequest/{id}/leave endpoint.
 */
export function useLeaveWaitlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ requestId }: { requestId: string | number; buyerEmail?: string | null }) => {
      return withMock(undefined, () => leaveWaitlistApi(String(requestId)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["my-book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["allBookRequests"] })
      queryClient.invalidateQueries({ queryKey: ["myBookRequests"] })
    },
  })
}

/**
 * Close / fulfil a book request.
 */
export function useCloseBookRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (requestId: string) => {
      closeRequest(requestId)
      const mockResult: BookRequestResponse = {
        id: requestId,
        buyerEmail: "",
        title: "",
        status: "closed",
        createdAt: new Date().toISOString(),
        dateCreated: new Date().toISOString(),
      }
      return mockResult
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["my-book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["allBookRequests"] })
      queryClient.invalidateQueries({ queryKey: ["myBookRequests"] })
    },
  })
}
