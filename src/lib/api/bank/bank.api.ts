import client from "../client"
import type {
  BankResponse,
  CreateUserBankDetailsRequest,
  UpdateUserBankDetailsRequest,
  UserBankDetailsResponse,
} from "../types"

export async function getBanksApi(): Promise<BankResponse[]> {
  const { data } = await client.get("/api/v1/userbank/banks")
  return data as unknown as BankResponse[]
}

export async function getBankDetailsApi(): Promise<UserBankDetailsResponse[]> {
  const { data } = await client.get("/api/v1/userbank/bank-details")
  return data as unknown as UserBankDetailsResponse[]
}

export async function createBankDetailApi(
  request: CreateUserBankDetailsRequest,
): Promise<UserBankDetailsResponse> {
  const { data } = await client.post("/api/v1/userbank/bank-details", request, {
    skipSuccessToast: true,
  })
  return data as unknown as UserBankDetailsResponse
}

export async function updateBankDetailApi(
  id: number,
  request: UpdateUserBankDetailsRequest,
): Promise<UserBankDetailsResponse> {
  const { data } = await client.put(`/api/v1/userbank/bank-details/${id}`, request, {
    skipSuccessToast: true,
  })
  return data as unknown as UserBankDetailsResponse
}
