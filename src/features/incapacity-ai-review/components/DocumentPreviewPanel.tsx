import { useMemo, type ReactNode } from 'react'
import { FileWarning, Loader2, Minus, Plus } from 'lucide-react'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { Card } from '@/components/ui/Card'

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
      <div className="flex flex-col items-center gap-2 text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" aria-hidden />
        <span className="text-sm">Cargando documento…</span>
      </div>
    )
  }

  if (error) {
    return (
      <p className="max-w-sm text-center text-sm text-danger-text" role="alert">
        {error}
      </p>
    )
  }

  if (kind === 'unsupported') {
    return (
      <div className="flex max-w-sm flex-col items-center gap-2 text-center text-gray-500">
        <FileWarning className="h-10 w-10 text-warning" aria-hidden />
        <p className="text-sm">
          Vista previa no disponible para este tipo de archivo ({archivoTipo || 'desconocido'}).
        </p>
      </div>
    )
  }

  if (!urlListo(objectUrl)) {
    return <p className="text-center text-sm text-gray-500">No hay archivo adjunto para mostrar.</p>
  }

  if (kind === 'pdf') {
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
            className="h-[720px] w-full min-w-[320px] rounded-lg border border-gray-200/60 bg-gray-50"
          />
        </div>
        <a
          href={objectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-center text-sm font-medium text-primary-600 underline decoration-primary-600/40 underline-offset-2 hover:text-primary-700"
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
        className="max-w-none rounded-lg border border-gray-200/60 shadow-sm"
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
    <Card className="flex min-h-[320px] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <span className="text-sm font-medium text-gray-700">Documento adjunto</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onZoomOut}
            disabled={zoomPercent <= 50 || zoomDisabled}
            className={buttonClassName('icon', 'h-[30px] w-[30px]')}
            aria-label="Alejar"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[52px] rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-center text-xs text-gray-700 tabular-nums">
            {zoomPercent}%
          </span>
          <button
            type="button"
            onClick={onZoomIn}
            disabled={zoomPercent >= 200 || zoomDisabled}
            className={buttonClassName('icon', 'h-[30px] w-[30px]')}
            aria-label="Acercar"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex min-h-[280px] flex-1 items-center justify-center overflow-auto bg-gray-50/50 p-4">
        {previewBody(kind, { archivoTipo, objectUrl, loading, error, zoomPercent })}
      </div>
    </Card>
  )
}
