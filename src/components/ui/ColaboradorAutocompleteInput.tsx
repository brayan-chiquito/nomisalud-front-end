import { useCallback, useId, useRef, useState, type ReactNode } from 'react'
import { Loader2, Search } from 'lucide-react'
import type { ColaboradorBusquedaItem } from '@/features/recepcion/types/colaboradorBusqueda'
import { colaboradorDisplayLabel } from '@/features/recepcion/utils/colaboradorDisplay'
import { cn } from '@/utils/cn'

function renderListStatusMessage(
  isPending: boolean,
  searchError: string | null,
  hasSuggestions: boolean,
): ReactNode {
  if (isPending) {
    return (
      <li className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500" aria-disabled="true">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        Buscando colaboradores…
      </li>
    )
  }
  if (searchError) {
    return (
      <li className="px-3 py-2 text-sm text-danger" aria-disabled="true">
        {searchError}
      </li>
    )
  }
  if (!hasSuggestions) {
    return (
      <li className="px-3 py-2 text-sm text-gray-500" aria-disabled="true">
        No se encontraron colaboradores activos con ese criterio. Prueba con nombre o cédula (ej.
        juan, ana, pedro).
      </li>
    )
  }
  return null
}

export type ColaboradorAutocompleteInputProps = Readonly<{
  value: string
  onChange: (value: string) => void
  suggestions: readonly ColaboradorBusquedaItem[]
  suggestionsLoading?: boolean
  isDebouncing?: boolean
  searchError?: string | null
  onSelect: (item: ColaboradorBusquedaItem) => void
  placeholder?: string
  ariaLabel?: string
  className?: string
}>

export function ColaboradorAutocompleteInput({
  value,
  onChange,
  suggestions,
  suggestionsLoading = false,
  isDebouncing = false,
  searchError = null,
  onSelect,
  placeholder = 'Buscar por nombre o cédula…',
  ariaLabel = 'Buscar colaborador',
  className,
}: ColaboradorAutocompleteInputProps) {
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const skipOpenOnNextFocusRef = useRef(false)
  const [focused, setFocused] = useState(false)
  const [listOpen, setListOpen] = useState(false)
  const blurTimerRef = useRef<ReturnType<typeof globalThis.setTimeout> | undefined>(undefined)

  const query = value.trim()
  const queryLongEnough = query.length >= 2
  const showList = focused && listOpen && queryLongEnough
  const isPending = suggestionsLoading || isDebouncing

  const clearBlurTimer = useCallback(() => {
    if (blurTimerRef.current !== undefined) {
      globalThis.clearTimeout(blurTimerRef.current)
      blurTimerRef.current = undefined
    }
  }, [])

  const scheduleBlur = useCallback(() => {
    clearBlurTimer()
    blurTimerRef.current = globalThis.setTimeout(() => {
      setFocused(false)
      setListOpen(false)
    }, 150)
  }, [clearBlurTimer])

  const selectItem = useCallback(
    (item: ColaboradorBusquedaItem) => {
      clearBlurTimer()
      skipOpenOnNextFocusRef.current = true
      onChange(colaboradorDisplayLabel(item))
      onSelect(item)
      setFocused(true)
      setListOpen(false)
      inputRef.current?.focus()
    },
    [onChange, onSelect, clearBlurTimer],
  )

  const handleChange = useCallback(
    (next: string) => {
      clearBlurTimer()
      setFocused(true)
      setListOpen(true)
      onChange(next)
    },
    [onChange, clearBlurTimer],
  )

  return (
    <div className={cn('relative w-full', className)}>
      <Search
        className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
        aria-hidden
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => {
          clearBlurTimer()
          setFocused(true)
          if (skipOpenOnNextFocusRef.current) {
            skipOpenOnNextFocusRef.current = false
            return
          }
          setListOpen(true)
        }}
        onBlur={scheduleBlur}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-9 text-sm placeholder:text-gray-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={showList ? listId : undefined}
        autoComplete="off"
      />

      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-full right-0 left-0 z-20 mt-1 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {renderListStatusMessage(isPending, searchError, suggestions.length > 0)}
          {suggestions.map((item) => (
            <li key={item.id} role="option">
              <button
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-primary/5 focus:bg-primary/5 focus:outline-none"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectItem(item)}
              >
                <span className="block text-sm font-medium text-gray-900">
                  {colaboradorDisplayLabel(item)}
                </span>
                <span className="block text-xs text-gray-500">
                  CC {item.numero_documento}
                  {item.email ? ` · ${item.email}` : ''}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
