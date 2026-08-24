import { useQuery } from "@tanstack/react-query"
import { getCourierCoverageApi } from "./config.api"

export function useCourierCoverage() {
  return useQuery({
    queryKey: ["courierCoverage"],
    queryFn: () => getCourierCoverageApi(),
    staleTime: Infinity,
  })
}
