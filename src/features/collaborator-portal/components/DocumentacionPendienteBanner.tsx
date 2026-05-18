import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import type { DocumentacionPendienteData } from '../utils/documentacionPendiente'
import { formatPlazoDocumentacion } from '../utils/documentacionPendiente'

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
      className="flex items-start gap-3 border-b border-amber-300 bg-amber-50 px-6 py-3.5"
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-[13px] font-semibold text-amber-900">
          Documentación pendiente — Requiere atención antes de continuar
        </p>
        <ul className="list-inside list-disc text-xs text-slate-600">
          {data.documentos.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {plazoTexto ? <p className="text-xs font-medium text-amber-700">{plazoTexto}</p> : null}
      </div>
      <Link
        to={cargarDocumentosHref}
        className="shrink-0 rounded-lg border border-amber-600 bg-white px-4 py-2 text-[13px] font-semibold text-amber-700 hover:bg-amber-50"
      >
        Cargar documentos
      </Link>
    </div>
  )
}
