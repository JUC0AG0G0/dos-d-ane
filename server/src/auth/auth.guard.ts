import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import type { Request, Response } from 'express';
import type { WebSocket } from 'ws';
import type { Role } from '../entities/index.js';
import { AuthService } from './auth.service.js';
import { IS_PUBLIC_KEY, ROLES_KEY } from './decorators.js';

export interface AuthContext {
  userId: string;
  role: Role;
  sessionId: string;
  expiresAt: Date;
}

export type AuthenticatedRequest = Request & { auth?: AuthContext };

/** Connexion WebSocket ; `auth` est rempli à son ouverture si le jeton est valable. */
export type AuthenticatedSocket = WebSocket & { auth?: AuthContext };

/**
 * Guard global : toute route exige un token valide, sauf celles marquées
 * @Public(). Vérifie ensuite le rôle si la route porte @Roles(...).
 * S'applique aussi aux messages WebSocket.
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
    if (context.getType() === 'ws') {
      return this.canActivateWs(context, targets);
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
    context
      .switchToHttp()
      .getResponse<Response>()
      .setHeader('X-Session-Expires-At', auth.expiresAt.toISOString());

    if (!this.hasRole(auth, targets)) {
      throw new ForbiddenException('Rôle insuffisant');
    }
    return true;
  }

  /**
   * Message WebSocket : le jeton n'est vérifié qu'une fois, à l'ouverture de la
   * connexion, qui remplit `client.auth`. Sans lui, le message est refusé.
   */
  private canActivateWs(
    context: ExecutionContext,
    targets: ReturnType<ExecutionContext['getHandler']>[],
  ): boolean {
    const { auth } = context.switchToWs().getClient<AuthenticatedSocket>();
    if (!auth) {
      throw new WsException('Connexion requise');
    }
    if (!this.hasRole(auth, targets)) {
      throw new WsException('Rôle insuffisant');
    }
    return true;
  }

  private hasRole(
    auth: AuthContext,
    targets: ReturnType<ExecutionContext['getHandler']>[],
  ): boolean {
    const roles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      targets,
    );
    return !roles?.length || roles.includes(auth.role);
  }
}
