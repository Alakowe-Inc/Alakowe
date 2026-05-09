import { isMockMode } from '@/lib/utils'
import { apiPost } from '@/lib/api-client'
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  VerifyEmailRequest,
  EmailOnlyRequest,
  CompletePasswordResetRequest,
  ChangePasswordRequest,
} from '@/lib/api-types'

export async function login(req: LoginRequest): Promise<LoginResponse> {
  if (isMockMode()) {
    return {
      userId: 'mock-user-id',
      firstName: 'Test',
      lastName: 'User',
      email: req.emailAddress,
      phoneNumber: null,
      roleId: 1,
      roleName: 'User',
      isActive: true,
      refreshToken: 'mock-refresh-token',
      token: 'mock-jwt-token',
      tokenExpiresAt: new Date(Date.now() + 86400000).toISOString(),
    }
  }
  return apiPost<LoginResponse>('/api/v1/auth/login', req)
}

export async function signup(req: SignUpRequest): Promise<boolean> {
  if (isMockMode()) {
    return true
  }
  return apiPost<boolean>('/api/v1/auth/signup', req)
}

export async function verifyEmail(req: VerifyEmailRequest): Promise<boolean> {
  if (isMockMode()) {
    return true
  }
  return apiPost<boolean>('/api/v1/auth/verify-email', req)
}

export async function resendOtp(req: EmailOnlyRequest): Promise<boolean> {
  if (isMockMode()) {
    return true
  }
  return apiPost<boolean>('/api/v1/auth/resend-otp', req)
}

export async function initiatePasswordReset(req: EmailOnlyRequest): Promise<boolean> {
  if (isMockMode()) {
    return true
  }
  return apiPost<boolean>('/api/v1/auth/initiate-password-reset', req)
}

export async function completePasswordReset(req: CompletePasswordResetRequest): Promise<boolean> {
  if (isMockMode()) {
    return true
  }
  return apiPost<boolean>('/api/v1/auth/complete-password-reset', req)
}

export async function changePassword(req: ChangePasswordRequest): Promise<boolean> {
  if (isMockMode()) {
    return true
  }
  return apiPost<boolean>('/api/v1/auth/change-password', req)
}
