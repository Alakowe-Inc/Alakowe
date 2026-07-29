import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAllBookRequestsApi,
  submitBookRequestApi,
  getMyBookActivityApi,
  leaveWaitlistApi,
} from "./requests.api"
import type {
  CreateBookRequestDto,
  BookRequestResponse,
  BookRequestFilterParams,
} from "../types"

/**
 * Submit a new book request or join an existing request waitlist.
 * Uses POST /api/v1/BookRequest under the hood.
 */
export function useSubmitBookRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateBookRequestDto) => submitBookRequestApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["my-book-requests"] })
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
    queryFn: async (): Promise<BookRequestResponse[]> => {
      const data = await getMyBookActivityApi()
      // API returns { myWaitlists: [...] }
      if (Array.isArray(data)) return data
      const anyData = data as any
      if (anyData?.myWaitlists && Array.isArray(anyData.myWaitlists)) return anyData.myWaitlists
      if (anyData?.myRequests && Array.isArray(anyData.myRequests)) return anyData.myRequests
      if (anyData?.data && Array.isArray(anyData.data)) return anyData.data
      if (anyData?.result && Array.isArray(anyData.result)) return anyData.result
      if (anyData?.items && Array.isArray(anyData.items)) return anyData.items
      // Last resort: find the first array value in the response
      if (anyData && typeof anyData === "object") {
        const firstArray = Object.values(anyData).find(v => Array.isArray(v))
        if (firstArray) return firstArray as BookRequestResponse[]
      }
      return []
    },
    enabled: !!userEmail,
    retry: false,
  })
}

/**
 * Fetch ALL open book requests (community-wide).
 * Uses GET /api/v1/BookRequest.
 * Ordered by most wanted (highest waitlist count) first.
 */
export function useAllBookRequests(params?: BookRequestFilterParams, userEmail?: string) {
  return useQuery({
    queryKey: ["book-requests", params, userEmail],
    queryFn: async (): Promise<BookRequestResponse[]> => {
      const data = await getAllBookRequestsApi(params)
      // API may return a wrapped object or a plain array
      if (Array.isArray(data)) return data
      const anyData = data as any
      if (anyData && Array.isArray(anyData.data)) return anyData.data
      if (anyData && Array.isArray(anyData.result)) return anyData.result
      return []
    },
    retry: false,
  })
}

/**
 * Join the waitlist for an existing book request or submit request.
 * Uses POST /api/v1/BookRequest.
 */
export function useJoinWaitlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      title,
      author,
      category,
      bookCondition,
    }: {
      requestId?: string
      buyerEmail?: string
      title?: string
      author?: string
      category?: string
      bookCondition?: string
    }) => {
      return submitBookRequestApi({
        title: title ?? "",
        author: author ?? "",
        category: category ?? "",
        bookCondition: bookCondition ?? "",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["my-book-requests"] })
    },
  })
}

/**
 * Leave a waitlist for a book request.
 * Uses POST /api/v1/BookRequest/{id}/leave.
 */
export function useLeaveWaitlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ requestId }: { requestId: string; buyerEmail?: string }) => {
      return leaveWaitlistApi(requestId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["my-book-requests"] })
    },
  })
}

/**
 * Close / fulfill a book request.
 */
export function useCloseBookRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (requestId: string) => {
      try {
        await leaveWaitlistApi(requestId)
      } catch {
        // ignore
      }
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["my-book-requests"] })
    },
  })
}
