import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { withMock } from "../use-mock"

import {
  createShippingAddressApi,
  deleteShippingAddressApi,
  getShippingAddressApi,
  getShippingAddressesApi,
  setDefaultShippingAddressApi,
  updateShippingAddressApi,
} from "./shipping-addresses.api"

import type {
  CreateShippingAddressRequest,
  ShippingAddressResponse,
  UpdateShippingAddressRequest,
} from "../types"

// Minimal mock data; real app behavior depends on backend.
const mockShippingAddresses: ShippingAddressResponse[] = [
  {
    id: 1,
    label: "Home",
    stateId: 1,
    stateName: "",
    areaId: 1,
    areaName: "",
    addressLine: "",
    isDefault: true,
  },
]

export function useShippingAddresses() {
  return useQuery({
    queryKey: ["shipping-addresses"],
    queryFn: () => withMock(mockShippingAddresses, () => getShippingAddressesApi()),
    enabled: import.meta.env.VITE_USE_MOCK === "true" || !!localStorage.getItem("token"),
  })
}

export function useCreateShippingAddress(options?: { skipSuccessToast?: boolean }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateShippingAddressRequest) =>
      withMock(mockShippingAddresses[0], () => createShippingAddressApi(body, options)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-addresses"] })
    },
  })
}

export function useUpdateShippingAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateShippingAddressRequest }) =>
      withMock(mockShippingAddresses[0], () => updateShippingAddressApi(id, body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-addresses"] })
    },
  })
}

export function useDeleteShippingAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      withMock(true, () => deleteShippingAddressApi(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-addresses"] })
    },
  })
}

export function useSetDefaultShippingAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      withMock(true, () => setDefaultShippingAddressApi(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-addresses"] })
    },
  })
}

export function useShippingAddress(id: number | undefined) {
  return useQuery({
    queryKey: ["shipping-address", id],
    queryFn: () => withMock(mockShippingAddresses[0], () => getShippingAddressApi(id!)),
    enabled: !!id && (import.meta.env.VITE_USE_MOCK === "true" || !!localStorage.getItem("token")),
  })
}

