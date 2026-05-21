import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { CircleCheck, X } from 'lucide-react'
import type { IncapacidadListItem } from '@/features/incapacidades/types/listIncapacidades'
import { IncapacidadTipoEntidadFilters } from '@/features/incapacidades/components/IncapacidadTipoEntidadFilters'
import { ListPanelBody } from '@/components/ui/ListPanelBody'
import { ListPaginationFooter } from '@/components/ui/ListPaginationFooter'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { Card } from '@/components/ui/Card'
import { pageSizeFromResponse, paginationRange } from '@/utils/pagination'
import { useTranscritasCobroList } from '../hooks/useTranscritasCobroList'
import { marcarIncapacidadCobrada } from '../services/marcarCobrada.service'
import { messageFromPatchEstadoError } from '../utils/patchEstadoErrorMessage'
import { MarcarCobradaModal } from './MarcarCobradaModal'
import { TranscritaCobroTableRow } from './TranscritaCobroTableRow'

const TABLE_GRID_COLUMNS =
  'minmax(0, 1fr) minmax(0, 1.35fr) minmax(0, 1.2fr) minmax(0, 100px) minmax(0, 112px) minmax(0, 140px)'

const EMPTY_MESSAGE =
  'No hay trámites en estado transcrita. Aprueba trámites desde verificación (PATCH transcrita) antes de marcar cobro.'

export function CobroAnteEntidadPanel() {
  const {
    data,
    loading,
    error,
    page,
    setPage,
    tipo,
    setTipo,
    entidadInput,
    setEntidadInput,
    refetch,
  } = useTranscritasCobroList()

  const [modalItem, setModalItem] = useState<IncapacidadListItem | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const [successRadicado, setSuccessRadicado] = useState<string | null>(null)

  const total = data?.total ?? 0
  const totalPages = data?.pages ?? 0
  const items = data?.items ?? []
  const pageSize = data ? pageSizeFromResponse(total, totalPages, items.length) : 0
  const { start, end } = paginationRange(total, page, pageSize)

  const openMarcarModal = useCallback((row: IncapacidadListItem) => {
    setModalError(null)
    setModalItem(row)
  }, [])

  const handleConfirmCobrada = useCallback(
    async (observacion?: string) => {
      if (!modalItem) return false
      setSubmitting(true)
      setModalError(null)
      try {
        await marcarIncapacidadCobrada(modalItem.id, observacion)
        setSuccessRadicado(modalItem.radicado)
        setModalItem(null)
        refetch()
        return true
      } catch (e) {
        setModalError(messageFromPatchEstadoError(e))
        return false
      } finally {
        setSubmitting(false)
      }
    },
    [modalItem, refetch],
  )

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <h2 className="text-lg font-semibold text-gray-900">Marcar como cobrada</h2>
        <p className="mt-1 text-sm text-gray-500">
          Trámites en estado transcrita listos para registrar cobro ante la entidad. Al confirmar,
          pasan a cobrada y podrán incluirse en Registrar pago.
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Flujo manual provisional hasta integración con API externa (EPS/entidad).
        </p>
      </div>

      {successRadicado ? (
        <div
          className="mx-5 mt-4 flex items-start gap-2.5 rounded-xl border border-success/20 bg-success-light px-4 py-3 sm:mx-6"
          role="status"
          aria-live="polite"
        >
          <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />
          <p className="min-w-0 flex-1 text-sm text-success-text">
            El trámite <span className="font-mono font-medium">{successRadicado}</span> quedó en
            estado cobrada. Ya puedes registrar el pago en{' '}
            <Link to="/dashboard/pagos" className="font-medium text-primary underline">
              Pagos
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={() => setSuccessRadicado(null)}
            className={buttonClassName('icon', 'text-success hover:bg-success/10')}
            aria-label="Cerrar aviso"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : null}

      <IncapacidadTipoEntidadFilters
        tipo={tipo}
        onTipoChange={setTipo}
        entidadInput={entidadInput}
        onEntidadInputChange={setEntidadInput}
        loading={loading}
      />

      {error ? (
        <p
          className="mx-5 my-3 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger-text sm:mx-6"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="min-h-0 overflow-x-auto">
        <div className="min-w-[900px]">
          <div
            className="grid h-11 items-center gap-x-2 border-b border-gray-100 bg-gray-50/80 px-5 text-[11px] font-semibold tracking-wider text-gray-400 uppercase"
            style={{ gridTemplateColumns: TABLE_GRID_COLUMNS }}
          >
            <span className="min-w-0">Radicado</span>
            <span className="min-w-0">Colaborador</span>
            <span className="min-w-0">Entidad</span>
            <span className="min-w-0">Urgencia</span>
            <span className="min-w-0">Fecha</span>
            <span className="min-w-0 text-center">Acción</span>
          </div>

          <ListPanelBody
            loading={loading}
            items={items}
            emptyMessage={EMPTY_MESSAGE}
            renderItem={(row) => (
              <TranscritaCobroTableRow
                key={row.id}
                row={row}
                gridTemplateColumns={TABLE_GRID_COLUMNS}
                onMarcarCobrada={openMarcarModal}
              />
            )}
          />
        </div>
      </div>

      <ListPaginationFooter
        start={start}
        end={end}
        total={total}
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />

      <MarcarCobradaModal
        isOpen={modalItem !== null}
        radicado={modalItem?.radicado ?? ''}
        onClose={() => {
          if (!submitting) setModalItem(null)
        }}
        onConfirm={handleConfirmCobrada}
        isSubmitting={submitting}
        error={modalError}
      />
    </Card>
  )
}
