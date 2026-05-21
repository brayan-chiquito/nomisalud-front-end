import { cn } from '@/utils/cn'

export function cobradasListFrameClass(hasError: boolean): string {
  return cn(
    'max-h-48 overflow-y-auto rounded-lg border bg-gray-50/80',
    hasError ? 'border-danger/30' : 'border-gray-200',
  )
}
