import { describe, it, expect } from 'vitest'
import { loginService } from './auth.service'

describe('loginService', () => {
  it('lanza un error porque la implementación está pendiente', async () => {
    await expect(loginService({ email: 'test@test.com', password: '123' })).rejects.toThrow(
      'implementación pendiente',
    )
  })

  it('es una función async que devuelve una Promise', () => {
    const result = loginService({ email: 'test@test.com', password: '123' })
    expect(result).toBeInstanceOf(Promise)
    result.catch(() => {})
  })
})
