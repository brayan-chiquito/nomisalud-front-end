import type { LoginCredentials, LoginResponse } from '../types'

// TODO: reemplazar con llamada real al endpoint de autenticación
// Ejemplo: return http.post<LoginResponse>('/auth/login', credentials)
export async function loginService(_credentials: LoginCredentials): Promise<LoginResponse> {
  throw new Error('loginService: implementación pendiente')
}

// TODO: implementar cuando se integre el backend
// export async function logoutService(): Promise<void> {
//   return http.post('/auth/logout')
// }

// TODO: implementar refresh de token si el backend usa JWT con refresh token
// export async function refreshTokenService(): Promise<{ accessToken: string }> {
//   return http.post('/auth/refresh')
// }
