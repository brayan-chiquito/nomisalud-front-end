export type ActionSuccessKind = 'confirmada' | 'rechazada'

export type DashboardLocationState = Readonly<{
  actionSuccess?: ActionSuccessKind
}>

export function messageForActionSuccess(kind: ActionSuccessKind): string {
  if (kind === 'confirmada') {
    return 'La incapacidad fue confirmada y pasó a estado Transcrita.'
  }
  return 'La incapacidad fue rechazada correctamente.'
}
