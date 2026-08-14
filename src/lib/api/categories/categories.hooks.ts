import { useQuery } from "@tanstack/react-query"
import { getCategoriesApi } from "./categories.api"

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        return await getCategoriesApi()
      } catch (err) {
        console.error("Failed to fetch categories from API:", err)
        // Fallback for dev mode if server is unreachable
        return [
          { id: 2, name: "Fiction", slug: "romance" },
          { id: 1, name: "Non-Fiction", slug: "non-fiction" },
          { id: 6, name: "Children", slug: "children" },
          { id: 4, name: "Academic", slug: "academic-textbook" },
        ]
      }
    },
  })
}
