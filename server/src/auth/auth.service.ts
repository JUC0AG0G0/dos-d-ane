import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '../generated/prisma/client.js';
import { CaptureStatus, DeviceType } from '../entities/index.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { AuthContext } from './auth.guard.js';
import type { DeviceInputDto } from './dto/device-input.dto.js';
import type { LoginDto } from './dto/login.dto.js';
import type { RegisterDto } from './dto/register.dto.js';
import type {
  LoginResponseDto,
  SessionDto,
  UserDto,
} from './dto/auth-responses.dto.js';
import { hashPassword, verifyPassword } from './password.js';

/** Durée de validité d'une session de connexion (et de son JWT). */
const SESSION_TTL_S = 30 * 24 * 60 * 60;

/** Contenu du JWT : l'utilisateur et la session qu'il représente. */
interface JwtPayload {
  sub: string;
  sid: string;
}

/** lastUsedAt n'est réécrit qu'au-delà de ce délai, pour limiter les écritures. */
const LAST_USED_PRECISION_MS = 60 * 1000;

const userSelect = {
  id: true,
  email: true,
  displayName: true,
  role: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class AuthService {
  /** Hash calculé une fois, comparé quand l'email est inconnu (voir login). */
  private readonly dummyHash = hashPassword('dummy-password');

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Crée le compte, avec le rôle user par défaut. Ne connecte pas : le client
   * appelle ensuite login.
   */
  async register(dto: RegisterDto): Promise<UserDto> {
    const email = normalizeEmail(dto.email);
    const displayName = dto.displayName.trim();
    await this.assertAvailable(email, displayName);
    try {
      return await this.prisma.user.create({
        data: {
          email,
          displayName,
          passwordHash: await hashPassword(dto.password),
        },
        select: userSelect,
      });
    } catch (error) {
      // Inscription simultanée avec le même email ou nom : l'index unique
      // de la base tranche.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        await this.assertAvailable(email, displayName);
      }
      throw error;
    }
  }

  /** Refuse un email ou un nom affiché déjà pris (casse ignorée pour le nom). */
  private async assertAvailable(email: string, displayName: string) {
    const taken = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { displayName: { equals: displayName, mode: 'insensitive' } },
        ],
      },
      select: { email: true },
    });
    if (taken) {
      throw new ConflictException(
        taken.email === email
          ? 'Un compte existe déjà avec cet email'
          : 'Ce nom affiché est déjà pris',
      );
    }
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: normalizeEmail(dto.email) },
      select: { ...userSelect, passwordHash: true },
    });
    // Même temps de réponse que l'email existe ou non : on ne révèle pas
    // quels emails ont un compte.
    const valid = await verifyPassword(
      dto.password,
      user?.passwordHash ?? (await this.dummyHash),
    );
    if (!user || !valid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    const { passwordHash: _, ...publicUser } = user;
    return this.openSession(publicUser, dto.device);
  }

  /**
   * Vérifie la signature et l'expiration du JWT, puis que sa session est
   * toujours active : une session révoquée invalide son JWT immédiatement.
   * Renvoie null si le token n'est pas valable.
   */
  async authenticate(token: string): Promise<AuthContext | null> {
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(token);
    } catch {
      return null;
    }
    const session = await this.prisma.authSession.findFirst({
      where: { id: payload.sid, userId: payload.sub },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        revokedAt: true,
        lastUsedAt: true,
        user: { select: { role: true } },
      },
    });
    const now = new Date();
    if (!session || session.revokedAt || session.expiresAt <= now) {
      return null;
    }
    if (now.getTime() - session.lastUsedAt.getTime() > LAST_USED_PRECISION_MS) {
      await this.prisma.authSession.update({
        where: { id: session.id },
        data: { lastUsedAt: now },
      });
    }
    return {
      userId: session.userId,
      role: session.user.role,
      sessionId: session.id,
    };
  }

  async me(auth: AuthContext): Promise<UserDto> {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: auth.userId },
      select: userSelect,
    });
  }

  /** Sessions de l'utilisateur, actives et passées, les plus récentes d'abord. */
  async listSessions(auth: AuthContext): Promise<SessionDto[]> {
    const sessions = await this.prisma.authSession.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        createdAt: true,
        lastUsedAt: true,
        expiresAt: true,
        revokedAt: true,
        device: { select: { id: true, name: true, type: true, model: true } },
      },
    });
    const now = new Date();
    return sessions.map((s) => ({
      ...s,
      active: !s.revokedAt && s.expiresAt > now,
      current: s.id === auth.sessionId,
    }));
  }

  /** Déconnecte une session de l'utilisateur (la sienne ou un autre appareil). */
  async revokeSession(auth: AuthContext, sessionId: string): Promise<void> {
    const session = await this.prisma.authSession.findFirst({
      where: { id: sessionId, userId: auth.userId },
      select: { id: true },
    });
    if (!session) {
      throw new NotFoundException('Session introuvable');
    }
    await this.prisma.authSession.updateMany({
      where: { id: sessionId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  /** Déconnecte toutes les autres sessions actives de l'utilisateur. */
  async revokeOtherSessions(auth: AuthContext): Promise<number> {
    const { count } = await this.prisma.authSession.updateMany({
      where: {
        userId: auth.userId,
        id: { not: auth.sessionId },
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      data: { revokedAt: new Date() },
    });
    return count;
  }

  /**
   * Ouvre une session sur l'appareil indiqué (réutilisé s'il appartient à
   * l'utilisateur, créé sinon). Les sessions encore ouvertes sur cet
   * appareil sont fermées : une seule session active par appareil.
   */
  private async openSession(
    user: UserDto,
    deviceInput: DeviceInputDto = { type: DeviceType.Web },
  ): Promise<LoginResponseDto> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_TTL_S * 1000);

    const session = await this.prisma.$transaction(async (tx) => {
      const device = await findOrCreateDevice(tx, user.id, deviceInput);
      await tx.authSession.updateMany({
        where: { deviceId: device.id, revokedAt: null, expiresAt: { gt: now } },
        data: { revokedAt: now },
      });
      return tx.authSession.create({
        data: {
          userId: user.id,
          deviceId: device.id,
          expiresAt,
        },
        select: { id: true, deviceId: true },
      });
    });

    const payload: JwtPayload = { sub: user.id, sid: session.id };
    return {
      accessToken: await this.jwt.signAsync(payload, {
        expiresIn: SESSION_TTL_S,
      }),
      expiresAt,
      sessionId: session.id,
      deviceId: session.deviceId,
      user,
    };
  }
}

async function findOrCreateDevice(
  tx: Prisma.TransactionClient,
  userId: string,
  input: DeviceInputDto,
) {
  if (input.id) {
    const existing = await tx.device.findFirst({
      where: { id: input.id, userId, type: input.type },
      select: { id: true },
    });
    if (existing) return existing;
  }
  const mobile = input.type === DeviceType.Mobile;
  return tx.device.create({
    data: {
      userId,
      type: input.type,
      name: input.name?.trim() || (mobile ? 'Téléphone' : 'Navigateur'),
      model: input.model?.trim() || null,
      // Un téléphone peut capturer, mais la capture reste coupée tant que
      // l'utilisateur ne l'active pas. Un navigateur ne capture jamais.
      captureEligible: mobile,
      captureStatus: mobile ? CaptureStatus.Inactive : null,
    },
    select: { id: true },
  });
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
