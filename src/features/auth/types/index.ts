export interface LoginCredentials {
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface AuthUser {
  id: string
  email: string
  role: string
}

export type LoginFormState = 'idle' | 'loading' | 'error' | 'success'
