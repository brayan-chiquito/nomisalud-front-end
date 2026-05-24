import { useCallback, useId, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import {
  autocompleteListClassName,
  autocompleteOptionButtonClassName,
  autocompleteStatusClassName,
} from '@/components/ui/autocompleteStyles'
import { inputClassName } from '@/components/ui/buttonStyles'
import { cn } from '@/utils/cn'

export type EntidadAutocompleteInputProps = Readonly<{
  value: string
  onChange: (value: string) => void
  suggestions: readonly string[]
  suggestionsLoading?: boolean
  placeholder?: string
  ariaLabel?: string
  className?: string
  /** Se invoca al elegir una sugerencia del listado (además de `onChange`). */
  onSelectSuggestion?: (value: string) => void
}>

export function EntidadAutocompleteInput({
  value,
  onChange,
  suggestions,
  suggestionsLoading = false,
  placeholder = 'Filtrar por entidad…',
  ariaLabel = 'Filtrar por entidad',
  className,
  onSelectSuggestion,
}: EntidadAutocompleteInputProps) {
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const skipOpenOnNextFocusRef = useRef(false)
  const [focused, setFocused] = useState(false)
  const [listOpen, setListOpen] = useState(false)
  const blurTimerRef = useRef<ReturnType<typeof globalThis.setTimeout> | undefined>(undefined)

  const queryLongEnough = value.trim().length >= 2
  const showList = focused && listOpen && queryLongEnough

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

  const selectSuggestion = useCallback(
    (name: string) => {
      clearBlurTimer()
      skipOpenOnNextFocusRef.current = true
      onChange(name)
      onSelectSuggestion?.(name)
      setFocused(true)
      setListOpen(false)
      inputRef.current?.focus()
    },
    [onChange, onSelectSuggestion, clearBlurTimer],
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
    <div className={cn('relative flex min-w-[220px] flex-1 items-center', className)}>
      <Search className="absolute left-3 h-4 w-4 shrink-0 text-gray-400" aria-hidden />
      <input
        ref={inputRef}
        type="search"
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
        className={cn(inputClassName, 'py-2 pl-9')}
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={showList ? listId : undefined}
        aria-busy={false}
        autoComplete="off"
      />

      {showList ? (
        <ul id={listId} role="listbox" className={autocompleteListClassName}>
          {suggestionsLoading ? <li className={autocompleteStatusClassName}>Buscando…</li> : null}
          {!suggestionsLoading && suggestions.length === 0 ? (
            <li className={autocompleteStatusClassName}>No se encontraron coincidencias.</li>
          ) : null}
          {suggestions.map((name) => (
            <li key={name} role="option" aria-selected={value === name}>
              <button
                type="button"
                className={autocompleteOptionButtonClassName}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(name)}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
