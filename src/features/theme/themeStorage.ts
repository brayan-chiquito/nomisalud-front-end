export type ThemeMode = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'nomisalud-theme'

export function readStoredTheme(): ThemeMode | null {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    return raw === 'dark' || raw === 'light' ? raw : null
  } catch {
    return null
  }
}

export function persistTheme(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch {
    /* almacenamiento no disponible */
  }
}

export function applyThemeToDocument(mode: ThemeMode): void {
  document.documentElement.classList.toggle('dark', mode === 'dark')
  document.documentElement.style.colorScheme = mode
}

/** Evita flash de tema incorrecto antes de montar React. */
export function initThemeFromStorage(): ThemeMode {
  const stored = readStoredTheme()
  const mode = stored ?? 'light'
  applyThemeToDocument(mode)
  return mode
}
