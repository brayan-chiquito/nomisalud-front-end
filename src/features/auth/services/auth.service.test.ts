import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loginService, logoutService } from './auth.service'
import { http } from '@/services/http'

vi.mock('@/services/http', () => ({
  http: {
    post: vi.fn(),
  },
}))

const mockHttpPost = vi.mocked(http.post)

describe('loginService', () => {
  beforeEach(() => {
    mockHttpPost.mockClear()
  })

  it('llama a POST /api/v1/auth/login con las credenciales correctas', async () => {
    mockHttpPost.mockResolvedValueOnce({
      data: { access_token: 'fake.token', token_type: 'bearer' },
    })

    await loginService({ email: 'test@test.com', password: '123' })

    expect(mockHttpPost).toHaveBeenCalledWith('/auth/login', {
      email: 'test@test.com',
      password: '123',
    })
  })

  it('retorna el TokenResponse completo del servidor', async () => {
    const fakeToken = { access_token: 'fake.token', token_type: 'bearer' }
    mockHttpPost.mockResolvedValueOnce({ data: fakeToken })

    const result = await loginService({ email: 'test@test.com', password: '123' })

    expect(result).toEqual(fakeToken)
  })

  it('propaga el error si el request falla', async () => {
    mockHttpPost.mockRejectedValueOnce(new Error('Network Error'))

    await expect(loginService({ email: 'test@test.com', password: '123' })).rejects.toThrow(
      'Network Error',
    )
  })

  it('es una función async que devuelve una Promise', () => {
    mockHttpPost.mockResolvedValueOnce({ data: { access_token: 'x', token_type: 'bearer' } })
    const result = loginService({ email: 'test@test.com', password: '123' })
    expect(result).toBeInstanceOf(Promise)
  })
})

describe('logoutService', () => {
  it('elimina el access_token del localStorage', () => {
    localStorage.setItem('access_token', 'fake.token')
    logoutService()
    expect(localStorage.getItem('access_token')).toBeNull()
  })

  it('no lanza error si no hay token en localStorage', () => {
    localStorage.removeItem('access_token')
    expect(() => logoutService()).not.toThrow()
  })
})
