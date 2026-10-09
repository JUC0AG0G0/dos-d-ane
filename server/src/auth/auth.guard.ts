import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';
import type { Role } from '../entities/index.js';
import { AuthService } from './auth.service.js';
import { IS_PUBLIC_KEY, ROLES_KEY } from './decorators.js';

export interface AuthContext {
  userId: string;
  role: Role;
  sessionId: string;
  /** Nouvelle expiration de la session, prolongée par cette requête. */
  expiresAt: Date;
}

export type AuthenticatedRequest = Request & { auth?: AuthContext };

/**
 * Guard global : toute route exige un token valide, sauf celles marquées
 * @Public(). Vérifie ensuite le rôle si la route porte @Roles(...).
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly auth: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targets = [context.getHandler(), context.getClass()];
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, targets)) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Connexion requise');
    }
    const auth = await this.auth.authenticate(token);
    if (!auth) {
      throw new UnauthorizedException('Session invalide ou expirée');
    }
    request.auth = auth;
    // Le client sait jusqu'à quand sa session reste valable sans requête.
    context
      .switchToHttp()
      .getResponse<Response>()
      .setHeader('X-Session-Expires-At', auth.expiresAt.toISOString());

    const roles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      targets,
    );
    if (roles?.length && !roles.includes(auth.role)) {
      throw new ForbiddenException('Rôle insuffisant');
    }
    return true;
  }
}
