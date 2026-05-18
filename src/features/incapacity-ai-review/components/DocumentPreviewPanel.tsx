import { useMemo, type ReactNode } from 'react'
import { FileWarning, Loader2, Minus, Plus } from 'lucide-react'

export type DocumentPreviewPanelProps = Readonly<{
  archivoTipo: string | undefined
  objectUrl: string | null
  loading: boolean
  error: string | null
  zoomPercent: number
  onZoomIn: () => void
  onZoomOut: () => void
}>

function urlListo(url: string | null): url is string {
  return url !== null && url.length > 0
}

function previewBody(
  kind: 'pdf' | 'image' | 'unsupported',
  props: Readonly<{
    archivoTipo: string | undefined
    objectUrl: string | null
    loading: boolean
    error: string | null
    zoomPercent: number
  }>,
): ReactNode {
  const { archivoTipo, objectUrl, loading, error, zoomPercent } = props

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-2 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" aria-hidden />
        <span className="text-sm">Cargando documento…</span>
      </div>
    )
  }

  if (error) {
    return (
      <p className="max-w-sm text-center text-sm text-red-600" role="alert">
        {error}
      </p>
    )
  }

  if (kind === 'unsupported') {
    return (
      <div className="flex max-w-sm flex-col items-center gap-2 text-center text-slate-500">
        <FileWarning className="h-10 w-10 text-amber-500" aria-hidden />
        <p className="text-sm">
          Vista previa no disponible para este tipo de archivo ({archivoTipo || 'desconocido'}).
        </p>
      </div>
    )
  }

  if (!urlListo(objectUrl)) {
    return (
      <p className="text-center text-sm text-slate-500">No hay archivo adjunto para mostrar.</p>
    )
  }

  if (kind === 'pdf') {
    // No usar `sandbox` en el iframe con `blob:`: Edge (y otros Chromium) pueden bloquear
    // el visor PDF integrado y mostrar "bloqueó esta página". El blob proviene de nuestra propia petición autenticada.
    return (
      <div className="flex h-full min-h-[480px] w-full flex-col gap-3">
        <div
          className="min-h-0 flex-1 overflow-auto"
          style={{
            transform: `scale(${zoomPercent / 100})`,
            transformOrigin: 'top center',
          }}
        >
          <iframe
            title="Vista previa del PDF"
            src={objectUrl}
            className="h-[720px] w-full min-w-[320px] rounded border border-slate-200 bg-slate-100"
          />
        </div>
        <a
          href={objectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-center text-sm font-medium text-blue-600 underline decoration-blue-600/40 underline-offset-2 hover:text-blue-700"
        >
          Abrir PDF en nueva pestaña
        </a>
      </div>
    )
  }

  return (
    <div
      className="flex max-h-[80vh] max-w-full justify-center overflow-auto p-2"
      style={{
        transform: `scale(${zoomPercent / 100})`,
        transformOrigin: 'top center',
      }}
    >
      <img
        src={objectUrl}
        alt="Documento de incapacidad"
        className="max-w-none rounded border border-slate-200 shadow-sm"
      />
    </div>
  )
}

export function DocumentPreviewPanel({
  archivoTipo,
  objectUrl,
  loading,
  error,
  zoomPercent,
  onZoomIn,
  onZoomOut,
}: DocumentPreviewPanelProps) {
  const kind = useMemo(() => {
    const t = archivoTipo?.trim().toLowerCase() ?? ''
    if (t === 'pdf') return 'pdf' as const
    if (t === 'jpg' || t === 'jpeg' || t === 'png') return 'image' as const
    return 'unsupported' as const
  }, [archivoTipo])

  const zoomDisabled = loading || !urlListo(objectUrl)

  return (
    <aside className="flex min-h-[320px] flex-1 flex-col gap-3 bg-slate-50 p-5 lg:max-w-[50%]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800">Documento adjunto</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onZoomOut}
            disabled={zoomPercent <= 50 || zoomDisabled}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Alejar"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[52px] rounded-md border border-slate-200 bg-white px-2.5 py-1 text-center text-xs text-slate-700">
            {zoomPercent}%
          </span>
          <button
            type="button"
            onClick={onZoomIn}
            disabled={zoomPercent >= 200 || zoomDisabled}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Acercar"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex min-h-[280px] flex-1 items-center justify-center overflow-auto rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        {previewBody(kind, { archivoTipo, objectUrl, loading, error, zoomPercent })}
      </div>
    </aside>
  )
}
