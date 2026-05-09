import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FileDropzone } from './FileDropzone'

describe('FileDropzone', () => {
  it('notifica el archivo seleccionado vía input', () => {
    const onFileSelected = vi.fn()
    const { container } = render(
      <FileDropzone
        accept="application/pdf"
        maxSizeLabelMb={10}
        selectedFile={null}
        onFileSelected={onFileSelected}
        uploadProgress={null}
      />,
    )

    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'a.pdf', { type: 'application/pdf' })
    fireEvent.change(input, { target: { files: [file] } })

    expect(onFileSelected).toHaveBeenCalledWith(file)
  })

  it('maneja soltar un archivo en la zona', () => {
    const onFileSelected = vi.fn()
    render(
      <FileDropzone
        accept="application/pdf"
        maxSizeLabelMb={10}
        selectedFile={null}
        onFileSelected={onFileSelected}
        uploadProgress={null}
      />,
    )

    const zone = screen.getByRole('button', { name: /arrastra tu documento aquí/i })
    const file = new File(['x'], 'drop.pdf', { type: 'application/pdf' })
    const files = Object.assign([file], {
      length: 1,
      item: (i: number) => (i === 0 ? file : null),
    }) as FileList
    fireEvent.drop(zone, { dataTransfer: { files } })

    expect(onFileSelected).toHaveBeenCalledWith(file)
  })

  it('muestra la barra de progreso cuando uploadProgress < 100', () => {
    render(
      <FileDropzone
        accept="application/pdf"
        maxSizeLabelMb={10}
        selectedFile={null}
        onFileSelected={() => {}}
        uploadProgress={42}
      />,
    )
    expect(screen.getByText(/subiendo… 42%/i)).toBeInTheDocument()
  })

  it('muestra mensaje de error', () => {
    render(
      <FileDropzone
        accept="application/pdf"
        maxSizeLabelMb={10}
        selectedFile={null}
        onFileSelected={() => {}}
        uploadProgress={null}
        errorMessage="Algo salió mal"
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Algo salió mal')
  })

  it('no notifica archivo cuando está deshabilitado', () => {
    const onFileSelected = vi.fn()
    const { container } = render(
      <FileDropzone
        accept="application/pdf"
        maxSizeLabelMb={10}
        selectedFile={null}
        onFileSelected={onFileSelected}
        uploadProgress={null}
        disabled
      />,
    )
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'a.pdf', { type: 'application/pdf' })
    fireEvent.change(input, { target: { files: [file] } })
    expect(onFileSelected).not.toHaveBeenCalled()
  })

  it('muestra carga completada al llegar a 100%', () => {
    render(
      <FileDropzone
        accept="application/pdf"
        maxSizeLabelMb={10}
        selectedFile={new File(['x'], 'a.pdf', { type: 'application/pdf' })}
        onFileSelected={() => {}}
        uploadProgress={100}
      />,
    )
    expect(screen.getByText(/carga completada/i)).toBeInTheDocument()
  })

  it('abre el selector con Enter en la zona', () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click')
    render(
      <FileDropzone
        accept="application/pdf"
        maxSizeLabelMb={10}
        selectedFile={null}
        onFileSelected={() => {}}
        uploadProgress={null}
      />,
    )
    const zone = screen.getByRole('button', { name: /arrastra tu documento aquí/i })
    fireEvent.keyDown(zone, { key: 'Enter' })
    expect(clickSpy).toHaveBeenCalled()
    clickSpy.mockRestore()
  })
})
