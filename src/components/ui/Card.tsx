import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export type CardProps = Readonly<{
  children: ReactNode
  className?: string
}>

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card border border-gray-200/60 bg-white shadow-card transition-shadow duration-200 hover:shadow-card-hover',
        className,
      )}
    >
      {children}
    </div>
  )
}
