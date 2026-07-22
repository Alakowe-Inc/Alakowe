import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { withMock } from "../use-mock"
import {
  submitBookRequestApi,
  getMyBookRequestsApi,
  getAllBookRequestsApi,
  joinWaitlistApi,
  closeBookRequestApi,
} from "./requests.api"
import type {
  CreateBookRequestDto,
  BookRequestResponse,
  BookRequestFilterParams,
} from "../types"
import {
  saveRequest,
  getBuyerRequests,
  closeRequest,
  addToWaitlist,
  generateRequestId,
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

export function useSubmitBookRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateBookRequestDto & { buyerEmail: string }) => {
      const mockResult: BookRequestResponse = {
        id: generateRequestId(),
        buyerEmail: body.buyerEmail,
        title: body.title ?? "",
        author: body.author ?? "",
        genre: body.genre ?? "",
        condition: body.bookCondition ?? "",
        maxPrice: body.maxPrice ?? 0,
        notes: body.notes ?? "",
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
      return withMock(mockList, () => getMyBookRequestsApi())
    },
    enabled: !!userEmail,
  })
}

export function useAllBookRequests(params?: BookRequestFilterParams, userEmail?: string) {
  return useQuery({
    queryKey: ["book-requests", params, userEmail],
    queryFn: () => {
      const all = getSharedRequests()
      const mockList: BookRequestResponse[] = all
        .filter((r) => r.status === "open")
        .map((r) => ({
          ...r,
          waitlistCount: r.waitlist?.length || 1,
          isUserOnWaitlist: userEmail ? r.waitlist?.includes(userEmail) ?? false : false,
        }))
      return withMock(mockList, () => getAllBookRequestsApi(params))
    },
  })
}

export function useJoinWaitlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, buyerEmail }: { requestId: string; buyerEmail: string }) => {
      addToWaitlist(requestId, buyerEmail)
      const all = getSharedRequests()
      const updated = all.find((r) => r.id === requestId) ?? {
        id: requestId,
        buyerEmail,
        title: "",
        status: "open" as const,
        createdAt: new Date().toISOString(),
      }
      return withMock(updated, () => joinWaitlistApi(requestId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["my-book-requests"] })
    },
  })
}

export function useCloseBookRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: string) => {
      closeRequest(requestId)
      const mockResult: BookRequestResponse = {
        id: requestId,
        buyerEmail: "",
        title: "",
        status: "closed",
        createdAt: new Date().toISOString(),
      }
      return withMock(mockResult, () => closeBookRequestApi(requestId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-requests"] })
      queryClient.invalidateQueries({ queryKey: ["my-book-requests"] })
    },
  })
}
