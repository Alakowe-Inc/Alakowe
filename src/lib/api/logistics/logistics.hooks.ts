import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getOrderShipmentsApi,
  getSpeedafStationsApi,
  scheduleSellerDropoffApi,
} from "./logistics.api"

export function useSpeedafStations(city?: string, area?: string) {
  return useQuery({
    queryKey: ["speedaf-stations", city, area],
    queryFn: () => getSpeedafStationsApi(city, area),
    staleTime: 60_000,
  })
}

export function useOrderShipments(orderId?: number) {
  return useQuery({
    queryKey: ["order-shipments", orderId],
    queryFn: () => getOrderShipmentsApi(orderId!),
    enabled: typeof orderId === "number" && orderId > 0,
  })
}

export function useScheduleSellerDropoff() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, speedafStationId }: { orderId: number; speedafStationId: number }) =>
      scheduleSellerDropoffApi(orderId, speedafStationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "sales"] })
    },
  })
}
