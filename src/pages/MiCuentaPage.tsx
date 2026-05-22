import { CambiarPasswordPropioForm } from '@/features/admin/components/usuarios/CambiarPasswordPropioForm'
import { MiCuentaShell } from '@/features/admin/components/usuarios/MiCuentaShell'

export function MiCuentaPage() {
  return (
    <MiCuentaShell>
      <CambiarPasswordPropioForm />
    </MiCuentaShell>
  )
}
