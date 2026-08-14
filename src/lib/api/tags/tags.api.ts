import client from "../client"
import type { TagResponse } from "../types"

export async function getTagsApi(): Promise<TagResponse[]> {
  const { data } = await client.get("/api/v1/AdminTag/all")
  return data as TagResponse[]
}

export async function getTagsByCategoryApi(categoryId: number): Promise<TagResponse[]> {
  const { data } = await client.get(`/api/v1/AdminTag/by-category/${categoryId}`)
  return data as TagResponse[]
}
