import { CircleCheck, Loader2, TriangleAlert } from 'lucide-react'
import { buttonClassName, inputClassName, labelClassName } from '@/components/ui/buttonStyles'
import { cn } from '@/utils/cn'
import type { InconsistenciaItem } from '../utils/inconsistencias'

export type InconsistenciasReviewBannerProps = Readonly<{
  items: readonly InconsistenciaItem[]
  justificacion: string
  onJustificacionChange: (value: string) => void
  onRegistrarOverride: () => void
  overrideRegistrado: boolean
  submitting?: boolean
  error?: string | null
  disabled?: boolean
}>

/**
 * Banner de inconsistencias IA en revisión RRHH + captura de justificación de override.
 */
export function InconsistenciasReviewBanner({
  items,
  justificacion,
  onJustificacionChange,
  onRegistrarOverride,
  overrideRegistrado,
  submitting = false,
  error = null,
  disabled = false,
}: InconsistenciasReviewBannerProps) {
  if (items.length === 0) return null

  const canSubmit =
    !disabled && !submitting && !overrideRegistrado && justificacion.trim().length >= 10

  return (
    <div
      className="animate-fade-in border-b border-warning/25 bg-warning-light px-6 py-4"
      role="alert"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4">
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-warning-text">
              Inconsistencias detectadas — Requiere revisión o excepción documentada
            </p>
            <p className="mt-0.5 text-xs text-warning-text/80">
              Registra una excepción para pasar a En verificación (la justificación queda en el
              historial):
            </p>
            <ul className="mt-3 space-y-2">
              {items.map((item) => (
                <li
                  key={`${item.tipo}-${item.descripcion}`}
                  className="rounded-lg border border-warning/20 bg-white/60 px-3 py-2"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-warning-text">
                    {item.tipo}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-800">{item.descripcion}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {overrideRegistrado ? (
          <div className="flex items-start gap-2 rounded-lg border border-success/20 bg-success-light px-3 py-2.5">
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
            <p className="text-sm text-success-text">
              Excepción registrada. Puedes continuar con la confirmación de datos.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 rounded-lg border border-warning/30 bg-white/80 p-4">
            <label htmlFor="override-justificacion" className={labelClassName}>
              Justificación de la excepción <span className="text-danger">*</span>
            </label>
            <textarea
              id="override-justificacion"
              rows={3}
              value={justificacion}
              onChange={(e) => onJustificacionChange(e.target.value)}
              disabled={disabled || submitting}
              placeholder="Describe por qué se acepta continuar a pesar de las inconsistencias (mín. 10 caracteres)…"
              className={cn(inputClassName, 'h-auto resize-none py-3')}
            />
            {error ? (
              <p className="text-sm text-danger-text" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex justify-end">
              <button
                type="button"
                disabled={!canSubmit}
                onClick={onRegistrarOverride}
                className={buttonClassName('primary', 'gap-2')}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                Registrar excepción
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
