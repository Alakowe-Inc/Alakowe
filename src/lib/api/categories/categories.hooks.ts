import { useQuery } from "@tanstack/react-query"
import { withMock } from "../use-mock"
import { getCategoriesApi } from "./categories.api"
import type { CategoryResponse } from "../types"

const mockCategories: CategoryResponse[] = [
  { id: 1, name: "African Fiction" },
  { id: 2, name: "Foreign Fiction" },
  { id: 3, name: "Romance" },
  { id: 4, name: "Thriller" },
  { id: 5, name: "Fantasy" },
  { id: 6, name: "Children" },
  { id: 7, name: "Academic" },
  { id: 8, name: "Self Help" },
  { id: 9, name: "Business" },
  { id: 10, name: "Biography" },
  { id: 11, name: "Other" },
]

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => withMock(mockCategories, () => getCategoriesApi()),
  })
}
