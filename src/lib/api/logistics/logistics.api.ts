import client from "../client"

export interface SpeedafStationDto {
  id: number
  siteName: string
  siteMode: string
  city: string
  area: string
  address: string
  contactPhone: string
  region: string
}

export interface OrderShipmentsDto {
  orderId: number
  orderStatus: string
  usesSpeedaf: boolean
  preferredSpeedafStationId?: number | null
  preferredSpeedafStationName?: string | null
  preferredSpeedafStationAddress?: string | null
  preferredSpeedafStationCity?: string | null
  sellerDropoffScheduledAt?: string | null
  shipments: Array<{
    id: number
    leg: string
    carrier: string
    status: string
    speedafBillCode?: string
    labelUrl?: string
    lastTrackMessage?: string
    lastTrackAt?: string
    pickupType: number
  }>
}

export interface ScheduleSellerDropoffResponse {
  orderId: number
  orderNumber: string
  status: string
  preferredSpeedafStationId: number
  preferredSpeedafStationName: string
  preferredSpeedafStationAddress: string
  preferredSpeedafStationCity: string
  preferredSpeedafStationArea?: string
  preferredSpeedafStationPhone?: string
  sellerDropoffScheduledAt: string
  speedafBillCode?: string
  labelUrl?: string
  inboundShipmentId?: number
}

export async function getSpeedafStationsApi(city?: string, area?: string): Promise<SpeedafStationDto[]> {
  const { data } = await client.get("/api/v1/speedaf/stations", { params: { city, area } })
  return data as SpeedafStationDto[]
}

export async function getOrderShipmentsApi(orderId: number): Promise<OrderShipmentsDto> {
  const { data } = await client.get(`/api/v1/orders/${orderId}/shipments`)
  return data as OrderShipmentsDto
}

export async function scheduleSellerDropoffApi(
  orderId: number,
  speedafStationId: number,
): Promise<ScheduleSellerDropoffResponse> {
  const { data } = await client.post(`/api/v1/seller/orders/${orderId}/schedule-dropoff`, {
    speedafStationId,
  })
  return data as ScheduleSellerDropoffResponse
}
