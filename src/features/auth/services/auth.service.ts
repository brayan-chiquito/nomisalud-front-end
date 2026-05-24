import { http } from '@/services/http'
import type { LoginCredentials, TokenResponse } from '../types'

export async function loginService(credentials: LoginCredentials): Promise<TokenResponse> {
  const { data } = await http.post<TokenResponse>('/auth/login', credentials)
  return data
}

export function logoutService(): void {
  localStorage.removeItem('access_token')
}
