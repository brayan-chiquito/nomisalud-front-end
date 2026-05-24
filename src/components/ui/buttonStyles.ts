import { cn } from '@/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon'

const base =
  'inline-flex items-center justify-center gap-2 text-sm font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-600/30 focus:ring-offset-1 focus:ring-offset-gray-50 active:scale-[0.98]',
  secondary: 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg',
  danger: 'bg-danger hover:brightness-110 text-white px-4 py-2 rounded-lg',
  ghost: 'hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg transition-colors duration-150',
  icon: 'p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors duration-150',
}

export function buttonClassName(variant: ButtonVariant, className?: string): string {
  return cn(base, variants[variant], className)
}

export const inputClassName =
  'h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-all duration-150 placeholder:text-gray-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60'

export const labelClassName =
  'mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500'
