# Nomisalud Front-End

Aplicación web construida con React 19, Vite, TypeScript y Tailwind CSS.

## Stack

| Herramienta | Versión | Descripción |
|---|---|---|
| React | 19 | UI library |
| Vite | 8 | Build tool |
| TypeScript | 5.9 | Static typing |
| Tailwind CSS | 4 | Utility-first CSS |
| React Router | 7 | Client-side routing |
| Axios | latest | HTTP client |
| Vitest | latest | Unit testing |
| ESLint + Prettier | 9 | Linting y formato |
| Husky + lint-staged | latest | Git hooks |
| commitlint | latest | Conventional commits |

## Estructura del proyecto

```
src/
├── assets/          # Imágenes, fuentes y archivos estáticos
├── components/
│   ├── ui/          # Componentes reutilizables (botones, inputs, etc.)
│   └── layout/      # Componentes de estructura (header, footer, etc.)
├── features/        # Módulos por dominio de negocio
├── hooks/           # Custom React hooks
├── layouts/         # Layouts de página
├── pages/           # Vistas / páginas de la app
├── router/          # Configuración de rutas
├── services/        # Clientes HTTP y lógica de API
├── store/           # Estado global (si aplica)
├── test/            # Setup y utilidades de testing
├── types/           # TypeScript types e interfaces compartidos
└── utils/           # Funciones utilitarias puras
```

## Inicio rápido

### Pre-requisitos

- Node 22+
- npm 11+

### Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd nomisalud-front-end

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en http://localhost:3000.

## Rutas

Rutas definidas en `src/router/index.tsx`. Las marcadas como **protegidas** requieren sesión válida (JWT); si no hay token, el usuario es redirigido al login.

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Pública | Inicio de sesión |
| `/login` | Pública | Inicio de sesión (alias) |
| `/dashboard` | Protegida | Dashboard RRHH: layout con sidebar, KPIs por estado, tabla de incapacidades (`GET /incapacidades`) con filtros estado/tipo/búsqueda y paginación |
| `/dashboard/cobro-ante-entidad` | Protegida (admin, auxiliar_rrhh, coordinador_rrhh) | Marcar trámites **transcrita** → **cobrada** (`PATCH /incapacidades/{id}/estado`). Flujo manual hasta integración EPS; desbloquea el selector en Pagos |
| `/dashboard/pagos` | Protegida (admin, auxiliar_rrhh, coordinador_rrhh) | Registrar pago (`POST /pagos`) y listar histórico; solo radicados en estado **cobrada** |
| `/portal/mi-tramite` | Protegida | Portal colaborador: lista de trámites (`GET /incapacidades/mias`) |
| `/portal/mi-tramite/:tramiteId` | Protegida | Detalle del trámite (`GET /incapacidades/{id}`) con `StatusTimeline` desde `historial_estados` |
| `/portal/radicar-incapacidad` | Protegida | Portal colaborador: radicar incapacidad (carga de archivo) |
| `/incapacidad/revision-ia` | Protegida | Revisión side-by-side: `?id={uuid}`; consume `extraccion_ia.datos_extraidos` según contrato en `docs/README.md` (§ detalle `GET /incapacidades/{id}`): `colaborador`, `incapacidad` (`dias`/`total_dias`, `origen`, `codigo_cie10`, `diagnostico`, `diagnostico_principal`, objeto `diagnostico` anidado), `entidad`; `PUT …/verificar` con enriquecimiento alineado al backend |
| `*` (cualquier otra) | Pública | Página 404 |

> Desde el **dashboard**, el enlace **Revisar** abre `/incapacidad/revision-ia?id={id}`. Tras radicar, el colaborador va a `/portal/mi-tramite/{id}`; desde el detalle puede abrir la revisión del documento.

### Flujo cobrada → pagada (RRHH)

1. Confirmar revisión IA → trámite **transcrita**.
2. **Cobro ante entidad** (`/dashboard/cobro-ante-entidad`) o botón en revisión IA → **cobrada** (`PATCH` con `estado: "cobrada"`).
3. **Pagos** (`/dashboard/pagos`) → `POST /pagos` asocia radicados cobrada → **pagada**.

En producción, el paso 2 podrá automatizarse vía API externa (EPS); la pantalla actual es el sustituto manual.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run lint` | Verificar errores de linting |
| `npm run lint:fix` | Corregir errores de linting automáticamente |
| `npm run format` | Formatear código con Prettier |
| `npm run format:check` | Verificar formato sin modificar |
| `npm run test` | Ejecutar tests una vez |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Tests con reporte de cobertura |

## Variables de entorno

Copia `.env.example` en `.env.local` y ajusta los valores:

| Variable | Descripción | Requerida |
|---|---|---|
| `VITE_API_URL` | URL base de la API | Sí |
| `VITE_APP_NAME` | Nombre de la aplicación | No |
| `VITE_APP_VERSION` | Versión de la aplicación | No |

> Las variables de entorno de Vite deben comenzar con `VITE_` para ser expuestas al cliente.
> **Nunca commits `.env.local` o cualquier archivo con secretos reales.**

## Docker

### Producción

```bash
# Build y levantar
docker compose up --build

# La app queda disponible en http://localhost:3000
```

### Desarrollo con Docker

```bash
docker compose -f docker-compose.dev.yml up
```

### Build manual de la imagen

```bash
docker build \
  --build-arg VITE_API_URL=https://api.nomisalud.com/v1 \
  -t nomisalud-front-end:latest .
```

## CI/CD (GitHub Actions)

| Workflow | Trigger | Descripción |
|---|---|---|
| `ci.yml` | PR / push a `main` y `develop` | Lint → Tests → Build |
| `cd.yml` | Push a `main` / tag `v*.*.*` | Build y push imagen Docker a GHCR |

### Secretos requeridos en GitHub

| Secret / Variable | Descripción |
|---|---|
| `VITE_API_URL` *(secret)* | URL de la API para el build de producción |
| `VITE_APP_NAME` *(variable)* | Nombre de la app para el build |

## Convención de commits

El proyecto usa [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<scope opcional>): <descripción>

Tipos válidos: feat, fix, refactor, test, chore, docs, style, ci, perf, revert
```

Ejemplos:
```
feat(auth): add JWT login flow
fix(ui): correct button alignment on mobile
chore: update dependencies
```

## Licencia

Privado – todos los derechos reservados.
