import { useIncapacidadesList } from '@/features/incapacidades/hooks/useIncapacidadesList'

export type UseTranscritasCobroListResult = Readonly<{
  data: ReturnType<typeof useIncapacidadesList>['data']
  loading: boolean
  error: string | null
  page: number
  setPage: ReturnType<typeof useIncapacidadesList>['setPage']
  tipo: string
  setTipo: ReturnType<typeof useIncapacidadesList>['setTipo']
  entidadInput: string
  setEntidadInput: ReturnType<typeof useIncapacidadesList>['setEntidadInput']
  refetch: () => void
}>

/** Listado paginado `GET /incapacidades?estado=transcrita` para marcar cobrada. */
export function useTranscritasCobroList(entidadDebounceMs = 350): UseTranscritasCobroListResult {
  const list = useIncapacidadesList({
    entidadDebounceMs,
    fixedEstado: 'transcrita',
    refetchable: true,
  })

  return {
    data: list.data,
    loading: list.loading,
    error: list.error,
    page: list.page,
    setPage: list.setPage,
    tipo: list.tipo,
    setTipo: list.setTipo,
    entidadInput: list.entidadInput,
    setEntidadInput: list.setEntidadInput,
    refetch: list.refetch ?? (() => undefined),
  }
}
