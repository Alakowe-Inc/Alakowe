import { useQuery } from "@tanstack/react-query"
import { getTagsApi, getTagsByCategoryApi } from "./tags.api"
import type { TagResponse } from "../types"

const fallbackTags: TagResponse[] = [
  { id: 1, name: "African Fiction", slug: "african-fiction", categoryId: 2, categoryName: "Fiction" },
  { id: 2, name: "Foreign Fiction", slug: "foreign-fiction", categoryId: 2, categoryName: "Fiction" },
  { id: 3, name: "Romance", slug: "romance", categoryId: 2, categoryName: "Fiction" },
  { id: 4, name: "Thriller", slug: "thriller", categoryId: 2, categoryName: "Fiction" },
  { id: 5, name: "Fantasy", slug: "fantasy", categoryId: 2, categoryName: "Fiction" },
  { id: 6, name: "Historical Fiction", slug: "historical-fiction", categoryId: 2, categoryName: "Fiction" },
  { id: 7, name: "Erotic Fiction", slug: "erotic-fiction", categoryId: 2, categoryName: "Fiction" },
  { id: 8, name: "Contemporary Fiction", slug: "contemporary-fiction", categoryId: 2, categoryName: "Fiction" },
  { id: 9, name: "Non-fiction", slug: "non-fiction", categoryId: 1, categoryName: "Non-Fiction" },
  { id: 10, name: "Business", slug: "business", categoryId: 1, categoryName: "Non-Fiction" },
  { id: 11, name: "Politics & History", slug: "politics-history", categoryId: null, categoryName: null },
]

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      try {
        const data = await getTagsApi()
        return data && data.length > 0 ? data : fallbackTags
      } catch (err) {
        console.error("Failed to fetch tags from API:", err)
        return fallbackTags
      }
    },
  })
}

export function useTagsByCategory(categoryId?: number) {
  return useQuery({
    queryKey: ["tags", "by-category", categoryId],
    queryFn: async () => {
      if (!categoryId) return []
      try {
        const data = await getTagsByCategoryApi(categoryId)
        return data && data.length > 0
          ? data
          : fallbackTags.filter((t) => t.categoryId === categoryId || t.categoryId === null)
      } catch (err) {
        console.error(`Failed to fetch tags for category ${categoryId}:`, err)
        return fallbackTags.filter((t) => t.categoryId === categoryId || t.categoryId === null)
      }
    },
    enabled: !!categoryId,
  })
}
