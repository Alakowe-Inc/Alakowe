import { useQuery } from "@tanstack/react-query"
import { getStatesApi, getAreasByStateApi } from "./location.api"
import type { StateResponse, AreaResponse } from "../types"

export function useStates() {
  return useQuery({
    queryKey: ["states"],
    queryFn: () => getStatesApi(),
  })
}

export function useAreasByState(stateId: number | undefined) {
  return useQuery({
    queryKey: ["areas", stateId],
    queryFn: () => getAreasByStateApi(stateId!),
    enabled: !!stateId,
  })
}
