import client from "../client"
import type { CourierCoverageResponse } from "../types"

export async function getCourierCoverageApi(): Promise<CourierCoverageResponse> {
  const { data } = await client.get("/api/v1/Config/courier-coverage")
  return data as CourierCoverageResponse
}
