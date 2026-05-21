# Nomisalud Front-End

[![CI](https://github.com/brayan-chiquito/nomisalud-front-end/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/brayan-chiquito/nomisalud-front-end/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=brayan-chiquito_nomisalud-front-end&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=brayan-chiquito_nomisalud-front-end)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=brayan-chiquito_nomisalud-front-end&metric=coverage)](https://sonarcloud.io/summary/new_code?id=brayan-chiquito_nomisalud-front-end)

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
| `/dashboard` | Protegida | Dashboard RRHH: KPIs analíticos (`GET /reportes/kpis` + gráfico Recharts para coordinador/admin), KPIs operativos, tabla de incapacidades (`GET /incapacidades`) con filtros y **Exportar Excel** (`GET /incapacidades/exportar`) |
| `/dashboard/auditoria` | Protegida (admin, coordinador_rrhh) | Auditoría de accesos (`GET /auditoria/accesos`) |
| `/dashboard/cobro-ante-entidad` | Protegida (admin, auxiliar_rrhh, coordinador_rrhh) | Marcar trámites **transcrita** → **cobrada** (`PATCH /incapacidades/{id}/estado`). Flujo manual hasta integración EPS; desbloquea el selector en Pagos |
| `/dashboard/pagos` | Protegida (módulo finanzas) | Registrar pago (`POST /pagos`) con `GET /pagos/radicados-disponibles`; histórico `GET /pagos`. Rol **contabilidad**: solo Pagos + Conciliación |
| `/dashboard/conciliacion` | Protegida (módulo finanzas) | Conciliación por mes/año/entidad (`GET /conciliacion`) y exportación Excel (`GET /conciliacion/exportar`). Login contabilidad redirige aquí |
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
| `npm run test:coverage` | Tests con reporte de cobertura (genera `coverage/lcov.info` para SonarCloud) |

## Pruebas automatizadas (SCRUM-217)

El front usa **Vitest** + **React Testing Library** (equivalente al stack Jest/RTL del ticket; Vitest es compatible con matchers de `@testing-library/jest-dom`).

### Configuración

| Archivo | Rol |
|---------|-----|
| `vitest.config.ts` | Entorno `jsdom`, alias `@/`, cobertura v8 + `lcov` |
| `src/test/setup.ts` | Import de `@testing-library/jest-dom` |
| `package.json` → `test` / `test:coverage` | Ejecución en CI y local |

### Cobertura local

```bash
npm run test:coverage
```

Última validación en rama `develop`: **~91 %** statements, **~84 %** branches (objetivo del proyecto y SonarCloud: **≥ 80 %** en código nuevo).

### Componentes críticos cubiertos

Los nombres del ticket SCRUM-217 se mapean al código real del repo:

| Ticket (genérico) | Implementación en este repo | Tests |
|-------------------|----------------------------|-------|
| `DataTable` | `RrhhIncapacidadesPanel` (tabla paginada + filtros) | `RrhhIncapacidadesPanel.test.tsx` |
| `StatusTimeline` | `StatusTimeline` (portal colaborador) | `StatusTimeline.test.tsx` |
| `ReviewPanel` | `IncapacityAiReviewView` / `IncapacityAiReviewPanel` | `IncapacityAiReviewView.test.tsx`, `IncapacityAiReviewPanel.test.tsx` |
| Formulario auth | `LoginForm` | `LoginForm.test.tsx`, `LoginPage.test.tsx` |
| Carga de archivos | `FileDropzone`, `RadicarIncapacidadView`, `RecepcionRadicarView` | `FileDropzone.test.tsx`, `RadicarIncapacidadView.test.tsx`, `RecepcionRadicarView.test.tsx` |

Hay **116+ archivos** `*.test.ts(x)` en `src/` (servicios, hooks, páginas y UI). Detalle por tarea en `docs/tasks/SCRUM-217.md`.

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

## CI/CD (GitHub Actions — SCRUM-218)

| Workflow | Trigger | Descripción |
|---|---|---|
| [`ci.yml`](.github/workflows/ci.yml) | `pull_request` y `push` a `main` / `develop` | Pipeline de calidad del **front** |
| [`cd.yml`](.github/workflows/cd.yml) | Push a `main` / tag `v*.*.*` | Build y push imagen Docker a GHCR |

### Jobs de `ci.yml` (este repositorio)

1. **Lint & Format** — `npm run lint`, `npm run format:check`
2. **Tests & Coverage** — `npm run test:coverage`; sube artefacto `coverage/` (incluye `lcov.info`)
3. **SonarCloud Analysis** — análisis con umbral de calidad en PR (código nuevo ≥ 80 % según reglas del proyecto en SonarCloud)
4. **Build** — `npm run build` (TypeScript + Vite)

> **Backend (`pytest`):** el API FastAPI vive en otro repositorio. Su CI con `--cov-fail-under=80` no forma parte de este workflow; la documentación del API está en [`docs/README.md`](docs/README.md).

### Protección de ramas (configuración manual en GitHub)

En **Settings → Branches → Branch protection rules** para `main` (y opcionalmente `develop`), se recomienda exigir antes del merge:

- Status checks: `Lint & Format`, `Tests & Coverage`, `Build`, `SonarCloud Analysis`
- PR actualizado con la base

Esto corresponde al paso 5 del checklist SCRUM-218 y no se versiona en código.

### Secretos requeridos en GitHub

| Secret / Variable | Descripción |
|---|---|
| `SONAR_TOKEN` *(secret)* | Token de SonarCloud para el job de análisis |
| `VITE_API_URL` *(secret)* | URL de la API para el build de producción (CD) |
| `VITE_APP_NAME` *(variable)* | Nombre de la app para el build |

`GITHUB_TOKEN` lo provee Actions para SonarCloud y el checkout.

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
