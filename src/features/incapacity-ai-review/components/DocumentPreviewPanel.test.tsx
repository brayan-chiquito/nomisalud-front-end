import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DocumentPreviewPanel } from './DocumentPreviewPanel'

describe('DocumentPreviewPanel', () => {
  const noop = () => undefined

  it('muestra carga', () => {
    render(
      <DocumentPreviewPanel
        archivoTipo="pdf"
        objectUrl={null}
        loading
        error={null}
        zoomPercent={100}
        onZoomIn={noop}
        onZoomOut={noop}
      />,
    )
    expect(screen.getByText('Cargando documento…')).toBeInTheDocument()
  })

  it('muestra error', () => {
    render(
      <DocumentPreviewPanel
        archivoTipo="pdf"
        objectUrl={null}
        loading={false}
        error="Sin permiso"
        zoomPercent={100}
        onZoomIn={noop}
        onZoomOut={noop}
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Sin permiso')
  })

  it('tipo no soportado', () => {
    render(
      <DocumentPreviewPanel
        archivoTipo="docx"
        objectUrl="blob:x"
        loading={false}
        error={null}
        zoomPercent={100}
        onZoomIn={noop}
        onZoomOut={noop}
      />,
    )
    expect(screen.getByText(/vista previa no disponible/i)).toBeInTheDocument()
  })

  it('sin URL muestra mensaje', () => {
    render(
      <DocumentPreviewPanel
        archivoTipo="pdf"
        objectUrl={null}
        loading={false}
        error={null}
        zoomPercent={100}
        onZoomIn={noop}
        onZoomOut={noop}
      />,
    )
    expect(screen.getByText(/no hay archivo adjunto/i)).toBeInTheDocument()
  })

  it('PDF con URL muestra iframe', () => {
    render(
      <DocumentPreviewPanel
        archivoTipo="pdf"
        objectUrl="blob:http://localhost/x"
        loading={false}
        error={null}
        zoomPercent={100}
        onZoomIn={noop}
        onZoomOut={noop}
      />,
    )
    expect(screen.getByTitle('Vista previa del PDF')).toBeInTheDocument()
  })

  it('imagen con URL muestra img', () => {
    render(
      <DocumentPreviewPanel
        archivoTipo="png"
        objectUrl="blob:http://localhost/y"
        loading={false}
        error={null}
        zoomPercent={100}
        onZoomIn={noop}
        onZoomOut={noop}
      />,
    )
    expect(screen.getByRole('img', { name: /documento de incapacidad/i })).toBeInTheDocument()
  })
})
