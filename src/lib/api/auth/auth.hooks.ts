import { useMutation } from "@tanstack/react-query"
import { withMock } from "../use-mock"
import {
  loginApi,
  signupApi,
  verifyEmailApi,
  resendOtpApi,
  initiatePasswordResetApi,
  completePasswordResetApi,
  changePasswordApi,
} from "./auth.api"
import type {
  LoginRequestDto,
  SignUpRequestDto,
  VerifyEmailRequestDto,
  EmailOnlyRequest,
  CompletePasswordResetRequestDto,
  ChangePasswordRequestDto,
  LoginResponse,
} from "../types"

type LoginBody = LoginRequestDto
type SignUpBody = SignUpRequestDto
type VerifyEmailBody = VerifyEmailRequestDto
type EmailOnlyBody = EmailOnlyRequest
type CompletePasswordResetBody = CompletePasswordResetRequestDto
type ChangePasswordBody = ChangePasswordRequestDto

const mockLoginResponse: LoginResponse = {
  userId: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phoneNumber: "1234567890",
  roleId: 1,
  roleName: "User",
  isActive: true,
  token: "mock-token",
  tokenExpiresAt: new Date(Date.now() + 86400000).toISOString(),
}

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginBody) =>
      withMock(mockLoginResponse, () => loginApi(credentials)),
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: (body: SignUpBody) =>
      withMock(true, () => signupApi(body)),
  })
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (body: VerifyEmailBody) =>
      withMock(true, () => verifyEmailApi(body)),
  })
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (body: EmailOnlyBody) =>
      withMock(true, () => resendOtpApi(body)),
  })
}

export function useInitiatePasswordReset() {
  return useMutation({
    mutationFn: (body: EmailOnlyBody) =>
      withMock(true, () => initiatePasswordResetApi(body)),
  })
}

export function useCompletePasswordReset() {
  return useMutation({
    mutationFn: (body: CompletePasswordResetBody) =>
      withMock(true, () => completePasswordResetApi(body)),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (body: ChangePasswordBody) =>
      withMock(true, () => changePasswordApi(body)),
  })
}
