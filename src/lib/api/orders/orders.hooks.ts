import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  confirmOrderDeliveryApi,
  getOrderByIdApi,
  getOrdersByUserApi,
  getSellerPayoutSummaryApi,
  getSellerSalesApi,
  requestSellerPayoutApi,
} from "./orders.api"

export function useOrdersByUser(userId: string) {
  return useQuery({
    queryKey: ["orders", "buyer", userId],
    queryFn: () => getOrdersByUserApi(userId),
    enabled: !!userId,
  })
}

export function useOrder(orderId: number) {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => getOrderByIdApi(orderId),
    enabled: Number.isInteger(orderId) && orderId > 0,
  })
}

export function useSellerPayoutSummary() {
  return useQuery({
    queryKey: ["seller", "payout-summary"],
    queryFn: getSellerPayoutSummaryApi,
  })
}

export function useSellerSales(pageNumber = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["seller", "sales", pageNumber, pageSize],
    queryFn: () => getSellerSalesApi(pageNumber, pageSize),
  })
}

export function useConfirmOrderDelivery() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      orderId,
      confirm,
      note,
      imageFileNames,
    }: {
      orderId: number
      confirm: boolean
      note?: string | null
      imageFileNames?: string[] | null
    }) => confirmOrderDeliveryApi(orderId, { confirm, note, imageFileNames }),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["orders", vars.orderId] })
      queryClient.invalidateQueries({ queryKey: ["orders", "buyer"] })
    },
  })
}

export function useRequestSellerPayout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (orderId: number) => requestSellerPayoutApi(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "sales"] })
      queryClient.invalidateQueries({ queryKey: ["seller", "payout-summary"] })
    },
  })
}
