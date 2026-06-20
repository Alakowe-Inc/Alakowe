import client from "../client"


import type {
  CreateShippingAddressRequest,
  ShippingAddressResponse,
  UpdateShippingAddressRequest,
} from "../types"

type CreateShippingAddressBody = CreateShippingAddressRequest

type UpdateShippingAddressBody = UpdateShippingAddressRequest

export async function getShippingAddressesApi(): Promise<ShippingAddressResponse[]> {
  const { data } = await client.get("/api/v1/shipping-addresses")
  // client.ts unwraps ApiResponse envelope and returns body.data.
  return data as unknown as ShippingAddressResponse[]
}

export async function createShippingAddressApi(
  body: CreateShippingAddressBody,
): Promise<ShippingAddressResponse> {
  const { data } = await client.post("/api/v1/shipping-addresses", body)
  return data as unknown as ShippingAddressResponse
}

export async function getShippingAddressApi(id: number): Promise<ShippingAddressResponse> {
  const { data } = await client.get(`/api/v1/shipping-addresses/${id}`)
  return data as unknown as ShippingAddressResponse
}

export async function updateShippingAddressApi(
  id: number,
  body: UpdateShippingAddressBody,
): Promise<ShippingAddressResponse> {
  const { data } = await client.put(`/api/v1/shipping-addresses/${id}`, body)
  return data as unknown as ShippingAddressResponse
}

export async function deleteShippingAddressApi(id: number): Promise<boolean> {
  const { data } = await client.delete(`/api/v1/shipping-addresses/${id}`)
  return data as unknown as boolean
}

export async function setDefaultShippingAddressApi(id: number): Promise<boolean> {
  const { data } = await client.patch(`/api/v1/shipping-addresses/${id}/default`)
  return data as unknown as boolean
}


