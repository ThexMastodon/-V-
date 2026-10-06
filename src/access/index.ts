import type { Access, FieldAccess, PayloadRequest } from 'payload'

import type { User } from '@/payload-types'

export const ROLES = ['admin', 'editor', 'viewer'] as const
export type Role = (typeof ROLES)[number]

const roleOf = (req: PayloadRequest): Role | undefined => (req.user as User | null)?.role ?? undefined

export const hasRole = (req: PayloadRequest, ...roles: Role[]) => {
  const role = roleOf(req)
  return role ? roles.includes(role) : false
}

export const anyone: Access = () => true
export const authenticated: Access = ({ req }) => Boolean(req.user)
export const admins: Access = ({ req }) => hasRole(req, 'admin')
export const editors: Access = ({ req }) => hasRole(req, 'admin', 'editor')

export const adminsField: FieldAccess = ({ req }) => hasRole(req, 'admin')

/** Público solo ve lo publicado; cualquier usuario del panel ve también borradores. */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

/** Admin gestiona a todos; cada usuario puede ver y editar su propia cuenta. */
export const adminsOrSelf: Access = ({ req }) => {
  if (hasRole(req, 'admin')) return true
  if (req.user) return { id: { equals: req.user.id } }
  return false
}
