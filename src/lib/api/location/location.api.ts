import client from "../client"
import type { StateResponse, AreaResponse } from "../types"

export async function getStatesApi(): Promise<StateResponse[]> {
  const { data } = await client.get("/api/v1/Location/states")
  return data as StateResponse[]
}

export async function getAreasByStateApi(stateId: number): Promise<AreaResponse[]> {
  const { data } = await client.get(`/api/v1/Location/areas/${stateId}`)
  return data as AreaResponse[]
}
