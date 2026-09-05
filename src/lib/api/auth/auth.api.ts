import client from "../client"
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

export async function loginApi(body: LoginBody): Promise<LoginResponse> {
  const { data } = await client.post("/api/v1/auth/login", body)
  return data as LoginResponse
}

export async function signupApi(body: SignUpBody): Promise<boolean> {
  const { data } = await client.post("/api/v1/auth/signup", body)
  return data as boolean
}

export async function verifyEmailApi(body: VerifyEmailBody): Promise<boolean> {
  const { data } = await client.post("/api/v1/auth/verify-email", body)
  return data as boolean
}

export async function resendOtpApi(body: EmailOnlyBody): Promise<boolean> {
  const { data } = await client.post("/api/v1/auth/resend-otp", body)
  return data as boolean
}

export async function initiatePasswordResetApi(body: EmailOnlyBody): Promise<boolean> {
  const { data } = await client.post("/api/v1/auth/initiate-password-reset", body)
  return data as boolean
}

export async function completePasswordResetApi(body: CompletePasswordResetBody): Promise<boolean> {
  const { data } = await client.post("/api/v1/auth/complete-password-reset", body)
  return data as boolean
}

export async function changePasswordApi(body: ChangePasswordBody): Promise<boolean> {
  const { data } = await client.post("/api/v1/auth/change-password", body)
  return data as boolean
}
