import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { withMock } from "../use-mock"
import {
  createBankDetailApi,
  getBankDetailsApi,
  getBanksApi,
  updateBankDetailApi,
} from "./bank.api"
import type {
  BankResponse,
  CreateUserBankDetailsRequest,
  UpdateUserBankDetailsRequest,
  UserBankDetailsResponse,
} from "../types"

const mockBanks: BankResponse[] = [
  { id: 1, name: "Access Bank", slug: "access-bank", code: "044" },
  { id: 2, name: "Guaranty Trust Bank (GTBank)", slug: "gtbank", code: "058" },
  { id: 3, name: "Kuda Bank", slug: "kuda", code: "50211" },
  { id: 4, name: "OPay", slug: "opay", code: "999992" },
]

const mockBankDetails: UserBankDetailsResponse[] = [
  {
    id: 1,
    bankId: 1,
    bankName: "Access Bank",
    accountNumber: "0123456789",
    accountName: "John Doe",
    isActive: true,
  },
]

export function useBanks(enabled = true) {
  return useQuery({
    queryKey: ["banks"],
    queryFn: () => withMock(mockBanks, () => getBanksApi()),
    enabled,
    retry: false,
  })
}

export function useBankDetails(enabled = true) {
  return useQuery({
    queryKey: ["bank-details"],
    queryFn: () => withMock(mockBankDetails, () => getBankDetailsApi()),
    enabled,
    retry: false,
  })
}

export function useCreateBankDetail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreateUserBankDetailsRequest) =>
      withMock(mockBankDetails[0], () => createBankDetailApi(request)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-details"] })
    },
  })
}

export function useUpdateBankDetail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateUserBankDetailsRequest }) =>
      withMock(mockBankDetails[0], () => updateBankDetailApi(id, body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-details"] })
    },
  })
}
