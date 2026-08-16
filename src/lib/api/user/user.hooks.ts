import { useMutation } from "@tanstack/react-query"
import { withMock } from "../use-mock"
import { deleteAccountApi, updateUserApi } from "./user.api"
import type { UpdateUserRequestDto, UserProfileResponse } from "../types"

const mockUserResponse: UserProfileResponse = {
  userId: "1",
  firstName: "John",
  lastName: "Doe",
  fullName: "John Doe",
  userName: "john",
  email: "john@example.com",
  phoneNumber: "1234567890",
  isActive: true,
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: (request: UpdateUserRequestDto) =>
      withMock(mockUserResponse, () => updateUserApi(request)),
  })
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => withMock(true, () => deleteAccountApi()),
  })
}
