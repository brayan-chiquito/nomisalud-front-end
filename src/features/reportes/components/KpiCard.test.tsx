import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FileStack } from 'lucide-react'
import { KpiCard } from './KpiCard'

describe('KpiCard', () => {
  it('muestra valor y etiqueta', () => {
    render(
      <KpiCard
        label="Total trámites"
        value="45"
        icon={FileStack}
        iconBg="bg-primary/10"
        iconColor="text-primary"
      />,
    )
    expect(screen.getByText('Total trámites')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
  })

  it('muestra guion en carga', () => {
    render(
      <KpiCard
        label="Total"
        value="99"
        loading
        icon={FileStack}
        iconBg="bg-primary/10"
        iconColor="text-primary"
      />,
    )
    expect(screen.getByText('—')).toBeInTheDocument()
  })
})
