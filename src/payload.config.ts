import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Labs } from './collections/Labs'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Services } from './collections/Services'
import { Users } from './collections/Users'
import { Work } from './collections/Work'
import { Home } from './globals/Home'
import { Site } from './globals/Site'
import { defaultLocale, locales } from './i18n/routing'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const r2Enabled = Boolean(process.env.R2_BUCKET && process.env.R2_ENDPOINT)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · ÆVΛ',
    },
  },
  i18n: {
    supportedLanguages: { es, en },
    fallbackLanguage: 'es',
  },
  localization: {
    locales: [
      { code: 'es', label: 'Español' },
      { code: 'en', label: 'English' },
    ] satisfies { code: (typeof locales)[number]; label: string }[],
    defaultLocale,
    fallback: true,
  },
  collections: [Products, Work, Labs, Services, Media, Leads, Users],
  globals: [Home, Site],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  // Sin RESEND_API_KEY, Payload imprime los correos en consola (útil en local).
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM || 'hola@aeva.dev',
        defaultFromName: 'ÆVΛ',
      })
    : undefined,
  sharp,
  plugins: [
    // Sin credenciales de R2, los archivos se guardan en /media (solo para local).
    s3Storage({
      enabled: r2Enabled,
      collections: { media: true },
      bucket: process.env.R2_BUCKET || '',
      config: {
        endpoint: process.env.R2_ENDPOINT,
        region: 'auto',
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
