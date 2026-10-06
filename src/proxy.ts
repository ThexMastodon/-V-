import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Todo excepto el panel, la API de Payload, internos de Next y archivos con extensión.
  matcher: ['/((?!admin|api|_next|_vercel|.*\..*).*)'],
}
