import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL as string

if (!BASE_URL) {
  throw new Error('VITE_API_URL environment variable is not defined')
}

/**
 * Cliente Axios para peticiones multipart sin el header JSON por defecto de `http`.
 * Evita que se pierda el boundary de `multipart/form-data`.
 */
export const uploadHttp = axios.create({
  baseURL: BASE_URL,
  timeout: 120_000,
})

uploadHttp.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => Promise.reject(error),
)

uploadHttp.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const requestUrl = error.config?.url ?? ''
      const isAuthRequest = requestUrl.includes('/auth/login')
      if (!isAuthRequest) {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)
