# ÆVΛ — sitio y panel

Una sola app Next.js (App Router) + Payload CMS 3 sobre PostgreSQL. El sitio público vive en `/es` y `/en`; el panel en `/admin`.

## Arrancar en local

Requisitos: Node 22, pnpm 10+, Docker.

```bash
pnpm install
cp .env.example .env          # cambia PAYLOAD_SECRET
pnpm db:up                    # Postgres en localhost:5433
pnpm migrate                  # crea las tablas
pnpm seed                     # contenido de ejemplo (opcional)
pnpm dev                      # http://localhost:3000
```

La primera cuenta se crea en `http://localhost:3000/admin` y siempre queda como **Admin**.

En local no hacen falta R2 ni Resend: sin `R2_*` los archivos se guardan en `/media`, y sin `RESEND_API_KEY` los correos se imprimen en consola.

## Scripts

| Script | Qué hace |
| --- | --- |
| `pnpm dev` / `build` / `start` | Next.js |
| `pnpm lint` / `typecheck` | ESLint y TypeScript |
| `pnpm test:int` / `test:e2e` | Vitest y Playwright (e2e levanta `pnpm dev`) |
| `pnpm migrate:create <nombre>` | Genera una migración tras cambiar colecciones |
| `pnpm migrate` | Aplica migraciones pendientes |
| `pnpm generate:types` | Regenera `src/payload-types.ts` |
| `pnpm seed` | Contenido de ejemplo, idempotente |

## Estructura

```
src/
  access/            Roles (admin, editor, viewer) y reglas de acceso
  collections/       Products, Work, Labs, Services, Media, Leads, Users
  globals/           Home (Hero, Why, Philosophy, Contacto) y Site (pie y redes)
  hooks/revalidate   Regenera solo las páginas afectadas al publicar
  i18n/              next-intl: rutas /es y /en
  lib/content.ts     Única capa de lectura de datos para las páginas
  components/
    brand/glyphs     Æ V Λ como trazos SVG animables
    motion/          GSAP (solo en secciones que lo usan) y Lenis
    sections/        Una sección por archivo; reciben datos, no los buscan
  app/(frontend)/[locale]   Sitio público
  app/(payload)             Panel y API de Payload
  migrations/        Migraciones de Postgres
messages/            Textos por defecto en ES/EN (lo que el panel deje vacío)
```

## Flujo de cambios en el esquema

En desarrollo Payload sincroniza el esquema solo. Antes de abrir un PR que cambie colecciones: `pnpm migrate:create <nombre>` y commitea la migración. En Vercel el build debe correr `pnpm ci` (migrar y luego `next build`).

## Variables de entorno

Ver `.env.example`. En producción: `DATABASE_URL` (Neon), `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `R2_*`, `RESEND_API_KEY`, `EMAIL_FROM`, `LEADS_NOTIFY_TO`.
