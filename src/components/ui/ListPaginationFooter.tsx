import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

export type ListPaginationFooterProps = Readonly<{
  start: number
  end: number
  total: number
  page: number
  totalPages: number
  loading: boolean
  onPrev: () => void
  onNext: () => void
  resultsLabel?: string
  pageBadgeClassName?: string
}>

export function ListPaginationFooter({
  start,
  end,
  total,
  page,
  totalPages,
  loading,
  onPrev,
  onNext,
  resultsLabel = 'resultados',
  pageBadgeClassName = 'bg-blue-600',
}: ListPaginationFooterProps) {
  const canPrev = page > 1 && !loading
  const canNext = totalPages > 0 && page < totalPages && !loading

  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 sm:px-6">
      <p className="text-[13px] text-slate-500">
        Mostrando {start} - {end} de {total}
        {resultsLabel ? ` ${resultsLabel}` : null}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={!canPrev}
          onClick={onPrev}
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span
          className={cn(
            'flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[13px] font-semibold text-white',
            pageBadgeClassName,
          )}
        >
          {totalPages === 0 ? 0 : page}
        </span>
        <button
          type="button"
          disabled={!canNext}
          onClick={onNext}
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </footer>
  )
}
