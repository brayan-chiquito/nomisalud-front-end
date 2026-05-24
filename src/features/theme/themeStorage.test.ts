import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  applyThemeToDocument,
  persistTheme,
  readStoredTheme,
  THEME_STORAGE_KEY,
} from './themeStorage'

describe('themeStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = ''
  })

  it('persiste y lee el tema', () => {
    persistTheme('dark')
    expect(readStoredTheme()).toBe('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('aplica clase dark al documento', () => {
    applyThemeToDocument('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    applyThemeToDocument('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('readStoredTheme devuelve null si el valor es inválido', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'invalid')
    expect(readStoredTheme()).toBeNull()
  })

  it('persistTheme ignora errores de almacenamiento', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    expect(() => persistTheme('dark')).not.toThrow()
  })
})
