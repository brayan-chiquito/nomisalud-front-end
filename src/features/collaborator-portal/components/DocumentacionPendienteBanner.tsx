import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import type { DocumentacionPendienteData } from '../utils/documentacionPendiente'
import { formatPlazoDocumentacion } from '../utils/documentacionPendiente'
import { buttonClassName } from '@/components/ui/buttonStyles'

export type DocumentacionPendienteBannerProps = Readonly<{
  data: DocumentacionPendienteData
  cargarDocumentosHref?: string
}>

/**
 * Banner superior: documentos faltantes y plazo de entrega (portal colaborador).
 */
export function DocumentacionPendienteBanner({
  data,
  cargarDocumentosHref = '/portal/radicar-incapacidad',
}: DocumentacionPendienteBannerProps) {
  const plazoTexto = formatPlazoDocumentacion(data)

  return (
    <div
      className="animate-fade-in flex items-start gap-3 border-b border-warning/20 bg-warning-light px-6 py-4"
      role="alert"
      aria-live="polite"
    >
      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-warning-text">
          Documentación pendiente — Requiere atención antes de continuar
        </p>
        <p className="mt-0.5 text-xs text-warning-text/80">Documentos pendientes:</p>
        <ul className="mt-2 space-y-1">
          {data.documentos.map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-xs text-warning-text">
              <span className="inline-block h-1 w-1 rounded-full bg-warning" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
        {plazoTexto ? (
          <p className="mt-2 text-xs font-medium text-warning-text">{plazoTexto}</p>
        ) : null}
      </div>
      <Link
        to={cargarDocumentosHref}
        className={buttonClassName(
          'secondary',
          'shrink-0 border-warning/30 text-warning-text hover:bg-white',
        )}
      >
        Cargar documentos
      </Link>
    </div>
  )
}
