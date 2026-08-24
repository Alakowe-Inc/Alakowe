import client from "../client"
import type { UpdateUserRequestDto, UserProfileResponse } from "../types"

export async function updateUserApi(request: UpdateUserRequestDto): Promise<UserProfileResponse> {
  const { data } = await client.put("/api/v1/user/update-user", request, { skipSuccessToast: true })
  return data as UserProfileResponse
}

export async function deleteAccountApi(): Promise<boolean> {
  const { data } = await client.delete("/api/v1/user/delete")
  return data as boolean
}
