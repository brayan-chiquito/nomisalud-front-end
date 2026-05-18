import { useMemo } from 'react'
import { CheckCircle2, Circle, RefreshCw } from 'lucide-react'
import { cn } from '@/utils/cn'

export type StatusTimelinePhase = 'completed' | 'current' | 'pending'

/** Registro de historial de estados (orden se normaliza por fecha ascendente). */
export type StatusTimelineRecord = Readonly<{
  id: string
  estadoLabel: string
  phase: StatusTimelinePhase
  usuarioNombre: string
  occurredAtIso: string
}>

export type StatusTimelineProps = Readonly<{
  title?: string
  entries: readonly StatusTimelineRecord[]
}>

function formatHistorialTimestamp(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const datePart = new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
  const timePart = new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
  return `${datePart} · ${timePart} hrs`
}

function sortChronological(entries: readonly StatusTimelineRecord[]): StatusTimelineRecord[] {
  return [...entries].sort(
    (a, b) => new Date(a.occurredAtIso).getTime() - new Date(b.occurredAtIso).getTime(),
  )
}

function NodeIcon({ phase }: Readonly<{ phase: StatusTimelinePhase }>) {
  if (phase === 'completed') {
    return <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-500" aria-hidden />
  }
  if (phase === 'current') {
    return <RefreshCw className="h-7 w-7 shrink-0 text-blue-600" aria-hidden />
  }
  return <Circle className="h-7 w-7 shrink-0 text-slate-300" aria-hidden />
}

/**
 * Línea de tiempo vertical del historial de estados de un trámite.
 */
export function StatusTimeline({ title = 'Estado del trámite', entries }: StatusTimelineProps) {
  const ordered = useMemo(() => sortChronological(entries), [entries])

  return (
    <section
      className="w-full max-w-[680px] space-y-4 rounded-2xl bg-white p-6 shadow-md"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
      aria-label={title}
    >
      <h2 className="text-[15px] font-bold text-slate-800">{title}</h2>

      <ol className="relative m-0 list-none space-y-0 p-0" role="list">
        {ordered.map((entry, index) => {
          const isLast = index === ordered.length - 1
          const meta = formatHistorialTimestamp(entry.occurredAtIso)
          const isCurrent = entry.phase === 'current'
          const isPending = entry.phase === 'pending'

          return (
            <li
              key={entry.id}
              className={cn(
                'relative flex gap-3.5 pb-4 pl-0',
                !isLast && 'border-b border-slate-100',
                isCurrent && 'rounded-lg bg-sky-50 px-1 py-1',
              )}
              role="listitem"
            >
              <div className="flex shrink-0 flex-col items-center pt-0.5">
                <NodeIcon phase={entry.phase} />
                {!isLast ? (
                  <span
                    className="mt-1 min-h-[8px] w-px flex-1 bg-slate-200"
                    aria-hidden
                    style={{ marginLeft: 0 }}
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 space-y-1 pb-1 pt-0.5">
                <p
                  className={cn(
                    'text-sm font-semibold',
                    entry.phase === 'completed' && 'text-emerald-600',
                    isCurrent && 'font-bold text-blue-600',
                    isPending && 'text-slate-400',
                  )}
                >
                  {entry.estadoLabel}
                </p>
                <p className={cn('text-xs', isPending ? 'text-slate-300' : 'text-slate-500')}>
                  <span className="font-medium text-slate-600">{entry.usuarioNombre}</span>
                  {' · '}
                  <time dateTime={entry.occurredAtIso}>{meta}</time>
                </p>
                {isCurrent ? <p className="text-xs font-medium text-blue-600">En proceso</p> : null}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
