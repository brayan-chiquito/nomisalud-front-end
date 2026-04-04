// TODO: reemplazar este placeholder con el layout real del dashboard
// cuando esté definido el diseño de la vista principal post-login

export function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-100">
      <div className="rounded-xl bg-white px-12 py-10 text-center shadow-md">
        <h1 className="text-2xl font-bold text-green-600">¡Inicio de sesión exitoso!</h1>
        <p className="mt-2 text-gray-500">Bienvenido al sistema Nomisalud.</p>
      </div>
    </div>
  )
}
