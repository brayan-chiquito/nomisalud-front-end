export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: {
    id: string
    name: string
    email: string
  }
}

export type LoginFormState = 'idle' | 'loading' | 'error' | 'success'
