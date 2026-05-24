import { useMemo } from 'react'
import { cn } from '@/utils/cn'
import { Card } from '@/components/ui/Card'

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

/**
 * Línea de tiempo vertical del historial de estados de un trámite.
 */
export function StatusTimeline({ title = 'Estado del trámite', entries }: StatusTimelineProps) {
  const ordered = useMemo(() => sortChronological(entries), [entries])

  return (
    <Card className="p-5" aria-label={title}>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
        {title}
      </h2>

      {ordered.length === 0 ? (
        <p className="text-sm text-gray-400">Sin registros de historial aún.</p>
      ) : (
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-3.5 w-px bg-gray-100" aria-hidden />
          <ol className="m-0 list-none space-y-4 p-0" role="list">
            {ordered.map((entry) => {
              const meta = formatHistorialTimestamp(entry.occurredAtIso)
              const isCurrent = entry.phase === 'current'
              const isPending = entry.phase === 'pending'

              return (
                <li key={entry.id} className="relative flex items-start gap-4 pl-9" role="listitem">
                  <span
                    className={cn(
                      'absolute left-2 mt-0.5 h-3 w-3 rounded-full border-2 bg-white',
                      entry.phase === 'completed' && 'border-success bg-success',
                      isCurrent && 'border-primary',
                      isPending && 'border-gray-200',
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'text-sm font-medium text-gray-900',
                        isPending && 'text-gray-400',
                      )}
                    >
                      {entry.estadoLabel}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      <span className="font-medium text-gray-600">{entry.usuarioNombre}</span>
                      {' · '}
                      <time dateTime={entry.occurredAtIso}>{meta}</time>
                    </p>
                    {isCurrent ? (
                      <p className="mt-0.5 text-xs font-medium text-primary">En proceso</p>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </Card>
  )
}
