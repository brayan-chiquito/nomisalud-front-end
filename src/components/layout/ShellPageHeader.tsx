import type { ReactNode } from 'react'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/features/theme/components/ThemeToggle'
import { buttonClassName } from '@/components/ui/buttonStyles'
import {
  shellHeaderClass,
  shellHeaderSubtitleClass,
  shellHeaderTitleClass,
  shellMobileMenuButtonClass,
} from './shellLayout'

export type ShellPageHeaderProps = Readonly<{
  title: string
  subtitle?: string
  mobileNavOpen: boolean
  onMobileNavToggle: () => void
  /** Acciones extra a la derecha (antes del toggle de tema). */
  trailing?: ReactNode
}>

export function ShellPageHeader({
  title,
  subtitle,
  mobileNavOpen,
  onMobileNavToggle,
  trailing,
}: ShellPageHeaderProps) {
  return (
    <header className={shellHeaderClass}>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMobileNavToggle}
          className={buttonClassName('icon', shellMobileMenuButtonClass)}
          aria-expanded={mobileNavOpen}
          aria-label={mobileNavOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
        >
          {mobileNavOpen ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
        </button>
        <div className="min-w-0">
          <h1 className={shellHeaderTitleClass}>{title}</h1>
          {subtitle ? <p className={shellHeaderSubtitleClass}>{subtitle}</p> : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {trailing}
        <ThemeToggle />
      </div>
    </header>
  )
}
