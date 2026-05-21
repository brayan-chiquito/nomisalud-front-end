import { useCallback, useId, useRef, useState } from 'react'
import { Loader2, Search } from 'lucide-react'
import { cn } from '@/utils/cn'

export type EntidadAutocompleteInputProps = Readonly<{
  value: string
  onChange: (value: string) => void
  suggestions: readonly string[]
  suggestionsLoading?: boolean
  placeholder?: string
  ariaLabel?: string
  className?: string
}>

export function EntidadAutocompleteInput({
  value,
  onChange,
  suggestions,
  suggestionsLoading = false,
  placeholder = 'Filtrar por entidad…',
  ariaLabel = 'Filtrar por entidad',
  className,
}: EntidadAutocompleteInputProps) {
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const skipOpenOnNextFocusRef = useRef(false)
  const [focused, setFocused] = useState(false)
  const [listOpen, setListOpen] = useState(false)
  const blurTimerRef = useRef<ReturnType<typeof globalThis.setTimeout> | undefined>(undefined)

  const showList =
    focused &&
    listOpen &&
    value.trim().length >= 2 &&
    (suggestions.length > 0 || suggestionsLoading)

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
      setFocused(true)
      setListOpen(false)
      inputRef.current?.focus()
    },
    [onChange, clearBlurTimer],
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
        className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm placeholder:text-gray-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
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
          className="absolute top-full right-0 left-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {suggestionsLoading && suggestions.length === 0 ? (
            <li
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500"
              role="presentation"
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Buscando entidades…
            </li>
          ) : null}
          {suggestions.map((name) => (
            <li key={name} role="option" aria-selected={value === name}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-gray-800 hover:bg-primary/5 focus:bg-primary/5 focus:outline-none"
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
