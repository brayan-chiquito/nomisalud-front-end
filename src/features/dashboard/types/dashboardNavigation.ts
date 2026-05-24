export type ActionSuccessKind = 'confirmada' | 'rechazada' | 'documentacion_solicitada'

export type DashboardLocationState = Readonly<{
  actionSuccess?: ActionSuccessKind
}>

export function messageForActionSuccess(kind: ActionSuccessKind): string {
  if (kind === 'confirmada') {
    return 'La incapacidad fue confirmada y pasó a estado Transcrita.'
  }
  if (kind === 'documentacion_solicitada') {
    return 'Se solicitó documentación al colaborador. El trámite quedó en Doc. incompleta.'
  }
  return 'La incapacidad fue rechazada correctamente.'
}
