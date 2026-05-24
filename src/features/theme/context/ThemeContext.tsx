import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  applyThemeToDocument,
  initThemeFromStorage,
  persistTheme,
  type ThemeMode,
} from '../themeStorage'

export type ThemeContextValue = Readonly<{
  theme: ThemeMode
  setTheme: (mode: ThemeMode) => void
  toggleTheme: () => void
}>

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [theme, setThemeState] = useState<ThemeMode>(() => initThemeFromStorage())

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode)
    applyThemeToDocument(mode)
    persistTheme(mode)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark'
      applyThemeToDocument(next)
      persistTheme(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider')
  }
  return ctx
}
