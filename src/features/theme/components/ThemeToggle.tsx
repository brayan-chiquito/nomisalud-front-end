import { Moon, Sun } from 'lucide-react'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { useTheme } from '../context/ThemeContext'

/** Alterna entre modo claro y oscuro; persiste en localStorage. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={buttonClassName('icon')}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
    </button>
  )
}
