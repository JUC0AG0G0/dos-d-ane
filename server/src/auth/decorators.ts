import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import type { Role } from '../entities/index.js';
import type { AuthenticatedRequest, AuthContext } from './auth.guard.js';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';
export const DEVICE_ALLOWED_KEY = 'deviceAllowed';

/** Route accessible sans être connecté (toutes les autres l'exigent). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Réserve une route (ou un contrôleur entier) aux rôles donnés.
 * Exemple : `@Roles(Role.admin)`.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Route (ou contrôleur) ouverte aussi aux sessions d'appareil : un Raspberry Pi
 * connecté par sa clé n'a accès qu'à celles-ci (moindre privilège).
 */
export const DeviceAllowed = () => SetMetadata(DEVICE_ALLOWED_KEY, true);

/** Injecte l'utilisateur et la session de la requête : `@CurrentAuth() auth`. */
export const CurrentAuth = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthContext =>
    ctx.switchToHttp().getRequest<AuthenticatedRequest>().auth!,
);
