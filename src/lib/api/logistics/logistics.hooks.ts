import { useQuery } from "@tanstack/react-query"
import { getOrderShipmentsApi, getSpeedafStationsApi } from "./logistics.api"

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
