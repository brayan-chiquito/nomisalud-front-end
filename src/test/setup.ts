import '@testing-library/jest-dom'
import { vi } from 'vitest'

/** Evita ThemeProvider en tests que renderizan shells sin envolver la app. */
vi.mock('@/features/theme/components/ThemeToggle', () => ({
  ThemeToggle: () => null,
}))
