import { useQuery } from "@tanstack/react-query"
import {
  getOrderByIdApi,
  getOrdersByUserApi,
  getSellerPayoutSummaryApi,
  getSellerSalesApi,
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
