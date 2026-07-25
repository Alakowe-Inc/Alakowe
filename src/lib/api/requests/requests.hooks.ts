import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { withMock } from "../use-mock"
import {
  submitBookRequestApi,
  getMyBookActivityApi,
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
  addToWaitlist,
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
    mutationFn: (body: CreateBookRequestDto & { buyerEmail: string }) => {
      const mockResult: BookRequestResponse = {
        id: generateRequestId(),
        buyerEmail: body.buyerEmail,
        title: body.title ?? "",
        author: body.author ?? "",
        genre: body.category ?? "",
        condition: body.bookCondition ?? "",
        status: "open",
        createdAt: new Date().toISOString(),
        waitlist: [body.buyerEmail],
        waitlistCount: 1,
        isUserOnWaitlist: true,
      }

      saveRequest({
        id: mockResult.id,
        buyerEmail: mockResult.buyerEmail,
        title: mockResult.title,
        author: mockResult.author ?? "",
        genre: mockResult.genre ?? "",
        condition: mockResult.condition ?? "",
        maxPrice: mockResult.maxPrice ?? 0,
        notes: mockResult.notes ?? "",
        status: mockResult.status,
        createdAt: mockResult.createdAt,
        waitlist: mockResult.waitlist ?? [],
      })

      return withMock(mockResult, () => submitBookRequestApi(body))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["my-book-requests"] })
    },
  })
}

/**
 * Fetch the authenticated user's own requests & waitlists.
 * Uses GET /api/v1/BookRequest/my-activity under the hood (via withMock).
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
          }))
        : []
      return withMock(mockList, () => getMyBookActivityApi())
    },
    enabled: !!userEmail,
  })
}

/**
 * Fetch ALL open book requests (community-wide).
 * No dedicated backend endpoint yet — uses localStorage mock only.
 */
export function useAllBookRequests(_params?: BookRequestFilterParams, userEmail?: string) {
  return useQuery({
    queryKey: ["book-requests", _params, userEmail],
    queryFn: async () => {
      const all = getSharedRequests()
      const mockList: BookRequestResponse[] = all
        .filter((r) => r.status === "open")
        .map((r) => ({
          ...r,
          waitlistCount: r.waitlist?.length || 1,
          isUserOnWaitlist: userEmail ? r.waitlist?.includes(userEmail) ?? false : false,
        }))
      return mockList
    },
  })
}

/**
 * Join the waitlist for an existing book request.
 * No dedicated backend endpoint yet — uses localStorage mock only.
 * (The POST /api/v1/BookRequest endpoint handles join-or-create on the backend.)
 */
export function useJoinWaitlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ requestId, buyerEmail }: { requestId: string; buyerEmail: string }) => {
      addToWaitlist(requestId, buyerEmail)
      const all = getSharedRequests()
      const updated = all.find((r) => r.id === requestId) ?? {
        id: requestId,
        buyerEmail,
        title: "",
        status: "open" as const,
        createdAt: new Date().toISOString(),
      }
      return updated as BookRequestResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["my-book-requests"] })
    },
  })
}

/**
 * Close / fulfil a book request.
 * No dedicated backend endpoint yet — uses localStorage mock only.
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
      }
      return mockResult
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["my-book-requests"] })
    },
  })
}
