import client from "../client"
import type { CategoryResponse } from "../types"

export async function getCategoriesApi(): Promise<CategoryResponse[]> {
  const { data } = await client.get("/api/v1/Category/all")
  return data as CategoryResponse[]
}
