import { EntidadAutocompleteInput } from '@/components/ui/EntidadAutocompleteInput'
import { useAuditoriaUsuarioSuggestions } from '../hooks/useAuditoriaUsuarioSuggestions'
import type { UsuarioAuditoriaOption } from '../utils/auditoriaUsuarioSearch'

export type AuditoriaUsuarioSearchFieldProps = Readonly<{
  value: string
  onChange: (value: string) => void
  onSelectUsuario: (option: UsuarioAuditoriaOption) => void
  className?: string
}>

export function AuditoriaUsuarioSearchField({
  value,
  onChange,
  onSelectUsuario,
  className,
}: AuditoriaUsuarioSearchFieldProps) {
  const { suggestions } = useAuditoriaUsuarioSuggestions(value)

  return (
    <EntidadAutocompleteInput
      value={value}
      onChange={onChange}
      suggestions={suggestions.map((o) => o.label)}
      suggestionsLoading={false}
      placeholder="Correo, nombre o UUID…"
      ariaLabel="Filtrar por usuario"
      className={className}
      onSelectSuggestion={(label) => {
        const option = suggestions.find((o) => o.label === label)
        if (option) {
          onChange(option.email || option.label)
          onSelectUsuario(option)
        }
      }}
    />
  )
}
