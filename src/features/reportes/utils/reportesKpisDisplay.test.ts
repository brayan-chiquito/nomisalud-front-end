import { describe, it, expect } from 'vitest'
import {
  formatReportesRatioPercent,
  mapPorEstadoToChartData,
  urgenciaRojoTotal,
} from './reportesKpisDisplay'

describe('reportesKpisDisplay', () => {
  it('formatea ratios como porcentaje con un decimal', () => {
    expect(formatReportesRatioPercent(0.825)).toBe('82.5%')
    expect(formatReportesRatioPercent(null)).toBe('—')
  })

  it('obtiene total de urgencia roja', () => {
    expect(
      urgenciaRojoTotal([
        { urgencia: 'verde', total: 10 },
        { urgencia: 'rojo', total: 4 },
      ]),
    ).toBe(4)
  })

  it('mapea por_estado a datos del gráfico', () => {
    const rows = mapPorEstadoToChartData([{ estado: 'transcrita', total: 5 }])
    expect(rows[0]?.total).toBe(5)
    expect(rows[0]?.label).toMatch(/transcrita/i)
    expect(rows[0]?.fill).toBeTruthy()
  })
})
