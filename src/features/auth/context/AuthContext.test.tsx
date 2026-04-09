import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from './AuthContext'

function makeFakeJwt(payload: Record<string, unknown>): string {
  const base64 = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  return `header.${base64}.signature`
}

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>

describe('useAuth', () => {
  it('lanza error cuando se usa fuera de un AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth debe usarse dentro de un AuthProvider',
    )
  })
})

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('inicialización', () => {
    it('inicia con user null e isAuthenticated false cuando no hay token', () => {
      const { result } = renderHook(() => useAuth(), { wrapper })
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('inicia con el usuario del token si hay un JWT válido en localStorage', () => {
      const token = makeFakeJwt({ user_id: '42', email: 'ana@test.com', role: 'admin' })
      localStorage.setItem('access_token', token)

      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.user).toEqual({ id: '42', email: 'ana@test.com', role: 'admin' })
      expect(result.current.isAuthenticated).toBe(true)
    })

    it('inicia con user null si el JWT en localStorage tiene payload inválido', () => {
      localStorage.setItem('access_token', 'header.invalido.signature')

      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('inicia con user null si el JWT no contiene los campos requeridos', () => {
      const token = makeFakeJwt({ sub: 'solo-sub-sin-role' })
      localStorage.setItem('access_token', token)

      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.user).toBeNull()
    })
  })

  describe('login', () => {
    it('guarda el token en localStorage y actualiza el usuario', () => {
      const { result } = renderHook(() => useAuth(), { wrapper })
      const token = makeFakeJwt({ user_id: '7', email: 'luis@test.com', role: 'colaborador' })

      act(() => {
        result.current.login(token)
      })

      expect(localStorage.getItem('access_token')).toBe(token)
      expect(result.current.user).toEqual({ id: '7', email: 'luis@test.com', role: 'colaborador' })
      expect(result.current.isAuthenticated).toBe(true)
    })

    it('convierte user_id numérico a string', () => {
      const { result } = renderHook(() => useAuth(), { wrapper })
      const token = makeFakeJwt({ user_id: 99, email: 'test@test.com', role: 'admin' })

      act(() => {
        result.current.login(token)
      })

      expect(result.current.user?.id).toBe('99')
    })

    it('reemplaza la sesión anterior al llamar login de nuevo', () => {
      const token1 = makeFakeJwt({ user_id: '1', email: 'primero@test.com', role: 'colaborador' })
      const token2 = makeFakeJwt({ user_id: '2', email: 'segundo@test.com', role: 'admin' })
      const { result } = renderHook(() => useAuth(), { wrapper })

      act(() => result.current.login(token1))
      act(() => result.current.login(token2))

      expect(result.current.user?.email).toBe('segundo@test.com')
      expect(localStorage.getItem('access_token')).toBe(token2)
    })
  })

  describe('logout', () => {
    it('elimina el token de localStorage y resetea el estado', () => {
      const token = makeFakeJwt({ user_id: '1', email: 'test@test.com', role: 'admin' })
      localStorage.setItem('access_token', token)

      const { result } = renderHook(() => useAuth(), { wrapper })
      expect(result.current.isAuthenticated).toBe(true)

      act(() => {
        result.current.logout()
      })

      expect(localStorage.getItem('access_token')).toBeNull()
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('no lanza error si se llama logout sin sesión activa', () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(() => act(() => result.current.logout())).not.toThrow()
    })
  })
})
