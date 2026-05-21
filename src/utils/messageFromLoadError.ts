import axios from 'axios'

export function messageFromLoadError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const d = error.response?.data
    if (d && typeof d === 'object' && 'detail' in d) {
      const detail = (d as { detail: unknown }).detail
      if (typeof detail === 'string') return detail
    }
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return fallback
}
