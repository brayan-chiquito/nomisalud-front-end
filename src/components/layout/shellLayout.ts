import { cn } from '@/utils/cn'

/** Navegación lateral (mismos estilos en todos los portales). */
export const shellNavItemBase =
  'flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-sm transition-colors duration-150'

export const shellNavInactive = 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'

export const shellNavActive = 'bg-primary/10 font-medium text-primary'

export const shellNavSectionLabel =
  'px-3 text-[10px] font-semibold tracking-widest text-gray-400 uppercase'

export const shellRootClass = 'min-h-screen bg-gray-50/80'

export function shellAsideClass(mobileOpen: boolean): string {
  return cn(
    'fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-gray-200 bg-white',
    'transition-transform duration-200 ease-out will-change-transform',
    'lg:translate-x-0',
    mobileOpen ? 'translate-x-0' : '-translate-x-full',
  )
}

export const shellAsideBrandClass = 'flex h-16 items-center gap-2.5 border-b border-gray-100 px-4'

export const shellAsideBrandTitleClass = 'text-sm font-semibold text-gray-900'

export const shellAsideFooterClass = 'relative z-40 overflow-visible border-t border-gray-100 p-3'

export const shellBackdropClass = 'fixed inset-0 z-30 bg-gray-950/50 backdrop-blur-[2px] lg:hidden'

export const shellMainClass = 'min-h-screen min-w-0 lg:ml-60'

export const shellHeaderClass =
  'sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 sm:px-6 lg:px-8'

export const shellHeaderTitleClass = 'text-base font-semibold text-gray-900'

export const shellHeaderSubtitleClass = 'text-xs text-gray-400'

export const shellContentClass = 'min-w-0 p-4 sm:p-6 lg:p-8'

export const shellMobileMenuButtonClass = 'lg:hidden'
