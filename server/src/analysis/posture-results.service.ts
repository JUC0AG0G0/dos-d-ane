import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthContext } from '../auth/auth.guard.js';
import { AuthService } from '../auth/auth.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type {
  CreatePostureEventDto,
  CreatePostureSummaryDto,
  PostureEventDto,
  PostureSummaryDto,
} from './dto/posture-results.dto.js';

const withDevice = {
  deviceSession: { select: { deviceId: true } },
} as const;

type EventRow = Prisma.PostureEventGetPayload<{ include: typeof withDevice }>;
type SummaryRow = Prisma.PostureSummaryGetPayload<{
  include: typeof withDevice;
}>;

const toEvent = ({ deviceSession, ...e }: EventRow): PostureEventDto => ({
  id: e.id,
  clientId: e.clientId,
  deviceId: deviceSession.deviceId,
  type: e.type,
  startedAt: e.startedAt,
  endedAt: e.endedAt,
  durationSeconds: e.endedAt
    ? Math.round((e.endedAt.getTime() - e.startedAt.getTime()) / 1000)
    : null,
  headAngleAvg: e.headAngleAvg,
  trunkAngleAvg: e.trunkAngleAvg,
  causes: e.causes as Record<string, number> | null,
});

const toSummary = ({ deviceSession, ...s }: SummaryRow): PostureSummaryDto => ({
  id: s.id,
  clientId: s.clientId,
  deviceId: deviceSession.deviceId,
  periodStart: s.periodStart,
  periodEnd: s.periodEnd,
  score: s.score,
  secondsGreen: s.secondsGreen,
  secondsOrange: s.secondsOrange,
  secondsRed: s.secondsRed,
  secondsIgnored: s.secondsIgnored,
  secondsAbsent: s.secondsAbsent,
});

const isUniqueViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2002';

/**
 * Alertes et résumés envoyés par le Pi (contrat edge/docs/liaison-serveur.md).
 * Envoi idempotent : le Pi renvoie le même clientId après une coupure, le
 * serveur répond avec la ligne déjà enregistrée au lieu d'en créer une autre.
 */
@Injectable()
export class PostureResultsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  async addEvent(
    auth: AuthContext,
    sessionId: string,
    dto: CreatePostureEventDto,
  ): Promise<PostureEventDto> {
    const deviceSessionId = await this.participation(auth, sessionId);
    const startedAt = new Date(dto.startedAt);
    const endedAt = dto.phase === 'end' ? new Date(dto.endedAt!) : null;
    if (endedAt && endedAt < startedAt) {
      throw new BadRequestException('endedAt est avant startedAt');
    }
    const key = {
      deviceSessionId_clientId: { deviceSessionId, clientId: dto.clientId },
    };
    // Fin d'une alerte déjà ouverte : seul endedAt change (une fin renvoyée ne fait rien).
    const close = () =>
      endedAt &&
      this.prisma.postureEvent.updateMany({
        where: {
          deviceSessionId,
          clientId: dto.clientId,
          endedAt: null,
          startedAt: { lte: endedAt },
        },
        data: { endedAt },
      });
    await close();
    const existing = await this.prisma.postureEvent.findUnique({
      where: key,
      include: withDevice,
    });
    if (existing) {
      return toEvent(existing);
    }
    // Pas encore reçue : créée (aussi par une fin dont le début s'est perdu).
    try {
      return toEvent(
        await this.prisma.postureEvent.create({
          data: {
            deviceSessionId,
            clientId: dto.clientId,
            type: dto.type,
            startedAt,
            endedAt,
            headAngleAvg: dto.headAngleAvg ?? null,
            trunkAngleAvg: dto.trunkAngleAvg ?? null,
            causes: dto.causes ?? undefined,
          },
          include: withDevice,
        }),
      );
    } catch (error) {
      if (!isUniqueViolation(error)) {
        throw error;
      }
      // Même message reçu deux fois en même temps : l'autre requête l'a créé.
      await close();
      return toEvent(
        await this.prisma.postureEvent.findUniqueOrThrow({
          where: key,
          include: withDevice,
        }),
      );
    }
  }

  async addSummary(
    auth: AuthContext,
    sessionId: string,
    dto: CreatePostureSummaryDto,
  ): Promise<PostureSummaryDto> {
    const deviceSessionId = await this.participation(auth, sessionId);
    const periodStart = new Date(dto.periodStart);
    const periodEnd = new Date(dto.periodEnd);
    if (periodEnd < periodStart) {
      throw new BadRequestException('periodEnd est avant periodStart');
    }
    const key = {
      deviceSessionId_clientId: { deviceSessionId, clientId: dto.clientId },
    };
    const existing = await this.prisma.postureSummary.findUnique({
      where: key,
      include: withDevice,
    });
    if (existing) {
      return toSummary(existing);
    }
    try {
      return toSummary(
        await this.prisma.postureSummary.create({
          data: {
            deviceSessionId,
            clientId: dto.clientId,
            periodStart,
            periodEnd,
            score: dto.score,
            secondsGreen: dto.secondsGreen,
            secondsOrange: dto.secondsOrange,
            secondsRed: dto.secondsRed,
            secondsIgnored: dto.secondsIgnored,
            secondsAbsent: dto.secondsAbsent,
          },
          include: withDevice,
        }),
      );
    } catch (error) {
      if (!isUniqueViolation(error)) {
        throw error;
      }
      return toSummary(
        await this.prisma.postureSummary.findUniqueOrThrow({
          where: key,
          include: withDevice,
        }),
      );
    }
  }

  async listEvents(
    userId: string,
    sessionId: string,
  ): Promise<PostureEventDto[]> {
    await this.ownSession(userId, sessionId);
    const events = await this.prisma.postureEvent.findMany({
      where: { deviceSession: { analysisSessionId: sessionId } },
      include: withDevice,
      orderBy: [{ startedAt: 'asc' }, { id: 'asc' }],
    });
    return events.map(toEvent);
  }

  async listSummaries(
    userId: string,
    sessionId: string,
  ): Promise<PostureSummaryDto[]> {
    await this.ownSession(userId, sessionId);
    const summaries = await this.prisma.postureSummary.findMany({
      where: { deviceSession: { analysisSessionId: sessionId } },
      include: withDevice,
      orderBy: [{ periodStart: 'asc' }, { id: 'asc' }],
    });
    return summaries.map(toSummary);
  }

  /**
   * Participation de l'appareil de la requête à la session. Une session
   * terminée est acceptée : un Pi coupé du réseau au moment du stop envoie ses
   * derniers résultats après coup.
   */
  private async participation(
    auth: AuthContext,
    sessionId: string,
  ): Promise<string> {
    const session = await this.ownSession(auth.userId, sessionId);
    if (!session.startedAt) {
      throw new ConflictException('Session pas encore lancée');
    }
    const device = await this.auth.sessionDevice(auth.sessionId);
    const deviceSession = await this.prisma.deviceSession.findUnique({
      where: {
        analysisSessionId_deviceId: {
          analysisSessionId: sessionId,
          deviceId: device.id,
        },
      },
      select: { id: true },
    });
    if (!deviceSession) {
      throw new ConflictException('Appareil absent de la session');
    }
    return deviceSession.id;
  }

  private async ownSession(userId: string, sessionId: string) {
    const session = await this.prisma.analysisSession.findFirst({
      where: { id: sessionId, userId },
      select: { startedAt: true },
    });
    if (!session) {
      throw new NotFoundException('Session introuvable');
    }
    return session;
  }
}
