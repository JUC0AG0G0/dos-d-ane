import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthContext } from '../auth/auth.guard.js';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CaptureStatus } from '../entities/index.js';
import { DeviceConnections } from './device-connections.js';
import { LiveStates } from './live-states.js';
import type {
  CreateCaptureDto,
  SessionStatusFilter,
  StartAnalysisSessionDto,
} from './dto/analysis-inputs.dto.js';
import {
  AnalysisSessionStatus,
  type AnalysisSessionDetailDto,
  type AnalysisSessionSummaryDto,
  type AnalysisStatsDto,
  type CaptureDto,
  type CapturePageDto,
  type SessionTimelineDto,
} from './dto/analysis-responses.dto.js';

const captureSelect = {
  id: true,
  capturedAt: true,
  imageWidth: true,
  imageHeight: true,
  deviceSession: { select: { analysisSessionId: true, deviceId: true } },
  keypoints: {
    select: { bodyPart: true, x: true, y: true, confidence: true },
    orderBy: { bodyPart: 'asc' },
  },
} as const;

type CaptureRow = {
  id: string;
  capturedAt: Date;
  imageWidth: number;
  imageHeight: number;
  deviceSession: { analysisSessionId: string; deviceId: string };
  keypoints: CaptureDto['keypoints'];
};

type PauseDates = { startedAt: Date; endedAt: Date | null };
type SessionDates = {
  startedAt: Date | null;
  endedAt: Date | null;
  /** Au moins la pause ouverte, s'il y en a une. */
  pauses: PauseDates[];
};

const toCapture = ({ deviceSession, ...capture }: CaptureRow): CaptureDto => ({
  id: capture.id,
  analysisSessionId: deviceSession.analysisSessionId,
  deviceId: deviceSession.deviceId,
  capturedAt: capture.capturedAt,
  imageWidth: capture.imageWidth,
  imageHeight: capture.imageHeight,
  keypoints: capture.keypoints,
});

const statusOf = ({ startedAt, endedAt, pauses }: SessionDates) =>
  !startedAt
    ? AnalysisSessionStatus.Setup
    : endedAt
      ? AnalysisSessionStatus.Ended
      : pauses.some((p) => !p.endedAt)
        ? AnalysisSessionStatus.Paused
        : AnalysisSessionStatus.Running;

/**
 * Durée active (fin ou maintenant, moins le début, moins les pauses), temps
 * de pause et début de la pause en cours. pauses doit contenir toutes les
 * pauses de la session.
 */
const timing = ({ startedAt, endedAt, pauses }: SessionDates) => {
  const end = (endedAt ?? new Date()).getTime();
  const pausedMs = pauses.reduce(
    (sum, p) =>
      sum +
      Math.max(
        0,
        Math.min(p.endedAt?.getTime() ?? end, end) - p.startedAt.getTime(),
      ),
    0,
  );
  return {
    durationSeconds: startedAt
      ? Math.max(0, Math.round((end - startedAt.getTime() - pausedMs) / 1000))
      : null,
    pausedSeconds: Math.round(pausedMs / 1000),
    pausedSince: pauses.find((p) => !p.endedAt)?.startedAt ?? null,
  };
};

const pauseSelect = {
  select: { startedAt: true, endedAt: true },
  orderBy: { startedAt: 'asc' },
} as const;

const sessionSelect = {
  id: true,
  createdAt: true,
  startedAt: true,
  endedAt: true,
  pauses: pauseSelect,
  deviceSessions: {
    select: {
      startedAt: true,
      endedAt: true,
      device: { select: { id: true, name: true, type: true } },
      _count: { select: { captures: true } },
      captures: {
        select: { id: true, capturedAt: true },
        orderBy: [{ capturedAt: 'desc' }, { id: 'desc' }],
        take: 1,
      },
    },
    orderBy: { startedAt: 'asc' },
  },
} satisfies Prisma.AnalysisSessionSelect;

type SessionRow = Prisma.AnalysisSessionGetPayload<{
  select: typeof sessionSelect;
}>;

/** Capture la plus récente de la session, tous appareils confondus. */
const lastCaptureOf = (session: SessionRow) =>
  session.deviceSessions
    .flatMap((ds) => ds.captures.map((c) => ({ ...c, deviceId: ds.device.id })))
    .reduce<{ id: string; deviceId: string; capturedAt: Date } | null>(
      (last, c) => (!last || c.capturedAt > last.capturedAt ? c : last),
      null,
    );

const toSummary = (session: SessionRow): AnalysisSessionSummaryDto => ({
  id: session.id,
  status: statusOf(session),
  createdAt: session.createdAt,
  startedAt: session.startedAt,
  endedAt: session.endedAt,
  ...timing(session),
  captureCount: session.deviceSessions.reduce(
    (sum, ds) => sum + ds._count.captures,
    0,
  ),
  deviceCount: session.deviceSessions.length,
  lastCaptureAt: lastCaptureOf(session)?.capturedAt ?? null,
  devices: session.deviceSessions.map((ds) => ({
    ...ds.device,
    captureCount: ds._count.captures,
    leftAt: ds.endedAt,
  })),
});

/** Filtre Prisma de la liste des sessions par état. */
const statusWhere: Record<
  SessionStatusFilter,
  Prisma.AnalysisSessionWhereInput
> = {
  setup: { startedAt: null },
  running: {
    startedAt: { not: null },
    endedAt: null,
    pauses: { none: { endedAt: null } },
  },
  paused: {
    startedAt: { not: null },
    endedAt: null,
    pauses: { some: { endedAt: null } },
  },
  ended: { endedAt: { not: null } },
  open: { endedAt: null },
};

/** Au-delà, la frise serait illisible et la requête inutilement lourde. */
const MAX_TIMELINE_BUCKETS = 2000;

const conflictFor = (status: AnalysisSessionStatus) =>
  new ConflictException(
    {
      setup: 'Session pas encore lancée',
      running: 'Session en cours',
      paused: 'Session en pause',
      ended: 'Session terminée',
    }[status],
  );

const isUniqueViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2002';

/**
 * Lancée et pas terminée : en cours ou en pause. Pour le Pi, une session en
 * pause reste sa session (le serveur refuse ses captures pendant la pause).
 */
const isLaunched = (status: AnalysisSessionStatus) =>
  status === AnalysisSessionStatus.Running ||
  status === AnalysisSessionStatus.Paused;

const captureDisabled = () =>
  new BadRequestException('La capture est désactivée sur cet appareil');

const deviceBusy = () =>
  new ConflictException(
    'Appareil déjà dans une autre session en préparation ou en cours',
  );

@Injectable()
export class AnalysisService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly connections: DeviceConnections,
    private readonly liveStates: LiveStates,
  ) {}

  async create(
    auth: AuthContext,
    dto: StartAnalysisSessionDto,
  ): Promise<AnalysisSessionDetailDto> {
    let deviceIds = dto.deviceIds;
    if (deviceIds) {
      for (const deviceId of deviceIds) {
        await this.captureDevice(auth.userId, deviceId, true);
      }
    } else {
      // Par défaut, l'appareil qui fait la requête, s'il peut capturer et que
      // la capture y est activée.
      const deviceId = await this.requestDeviceId(auth);
      const device = await this.prisma.device.findUniqueOrThrow({
        where: { id: deviceId },
        select: { captureEligible: true, captureStatus: true },
      });
      deviceIds =
        device.captureEligible &&
        device.captureStatus !== CaptureStatus.Inactive
          ? [deviceId]
          : [];
    }
    const now = new Date();
    try {
      const session = await this.prisma.analysisSession.create({
        data: {
          userId: auth.userId,
          deviceSessions: {
            create: deviceIds.map((deviceId) => ({ deviceId, startedAt: now })),
          },
        },
        select: { id: true },
      });
      return this.detail(auth.userId, session.id);
    } catch (error) {
      throw isUniqueViolation(error) ? deviceBusy() : error;
    }
  }

  /**
   * Sessions de l'utilisateur : préparations d'abord, puis de la plus
   * récemment lancée à la plus ancienne.
   */
  async list(
    userId: string,
    status?: SessionStatusFilter,
    limit?: number,
  ): Promise<AnalysisSessionSummaryDto[]> {
    const sessions = await this.prisma.analysisSession.findMany({
      where: { userId, ...(status && statusWhere[status]) },
      select: sessionSelect,
      orderBy: [
        { startedAt: { sort: 'desc', nulls: 'first' } },
        { createdAt: 'desc' },
      ],
      take: limit,
    });
    return sessions.map(toSummary);
  }

  async detail(userId: string, id: string): Promise<AnalysisSessionDetailDto> {
    const session = await this.prisma.analysisSession.findFirst({
      where: { id, userId },
      select: sessionSelect,
    });
    if (!session) {
      throw new NotFoundException('Session introuvable');
    }
    return {
      ...toSummary(session),
      devices: session.deviceSessions.map((ds) => ({
        ...ds.device,
        joinedAt: ds.startedAt,
        leftAt: ds.endedAt,
        captureCount: ds._count.captures,
        lastCaptureAt: ds.captures[0]?.capturedAt ?? null,
      })),
      lastCapture: lastCaptureOf(session),
      pauses: session.pauses,
    };
  }

  /**
   * Chiffres de la semaine (du lundi 00:00, heure de Paris, à maintenant) et
   * nombre de sessions de la semaine précédente. Une session compte dans la
   * semaine où elle a été lancée ; les captures selon leur propre heure.
   */
  async stats(userId: string): Promise<AnalysisStatsDto> {
    const [week] = await this.prisma.$queryRaw<
      { thisWeek: Date; lastWeek: Date }[]
    >`
      SELECT date_trunc('week', now() AT TIME ZONE 'Europe/Paris')
               AT TIME ZONE 'Europe/Paris' AS "thisWeek",
             (date_trunc('week', now() AT TIME ZONE 'Europe/Paris') - interval '7 days')
               AT TIME ZONE 'Europe/Paris' AS "lastWeek"`;
    const [sessions, lastWeekSessions, captures] = await Promise.all([
      this.prisma.analysisSession.findMany({
        where: { userId, startedAt: { gte: week.thisWeek } },
        select: { startedAt: true, endedAt: true, pauses: pauseSelect },
      }),
      this.prisma.analysisSession.count({
        where: {
          userId,
          startedAt: { gte: week.lastWeek, lt: week.thisWeek },
        },
      }),
      this.prisma.capture.count({
        where: {
          capturedAt: { gte: week.thisWeek },
          deviceSession: { analysisSession: { userId } },
        },
      }),
    ]);
    return {
      thisWeek: {
        sessions: sessions.length,
        durationSeconds: sessions.reduce(
          (sum, s) => sum + (timing(s).durationSeconds ?? 0),
          0,
        ),
        captures,
      },
      lastWeek: { sessions: lastWeekSessions },
    };
  }

  /** Captures de la session, de la plus ancienne à la plus récente, par pages. */
  async captures(
    userId: string,
    id: string,
    cursor: string | undefined,
    limit: number,
  ): Promise<CapturePageDto> {
    await this.sessionStatus(userId, id);
    const rows = await this.prisma.capture.findMany({
      where: { deviceSession: { analysisSessionId: id } },
      select: {
        id: true,
        capturedAt: true,
        deviceSession: { select: { deviceId: true } },
        _count: { select: { keypoints: true } },
      },
      orderBy: [{ capturedAt: 'asc' }, { id: 'asc' }],
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });
    const items = rows.slice(0, limit).map((c) => ({
      id: c.id,
      deviceId: c.deviceSession.deviceId,
      capturedAt: c.capturedAt,
      keypointCount: c._count.keypoints,
    }));
    return {
      items,
      nextCursor: rows.length > limit ? items[items.length - 1].id : null,
    };
  }

  /**
   * Nombre de captures par tranche de bucketMinutes, du début à la fin (ou
   * maintenant) de la session, tranches vides comprises, et pauses.
   */
  async timeline(
    userId: string,
    id: string,
    bucketMinutes: number,
  ): Promise<SessionTimelineDto> {
    const session = await this.prisma.analysisSession.findFirst({
      where: { id, userId },
      select: { startedAt: true, endedAt: true, pauses: pauseSelect },
    });
    if (!session) {
      throw new NotFoundException('Session introuvable');
    }
    if (!session.startedAt) {
      return { buckets: [], pauses: [] };
    }
    const start = session.startedAt;
    const end = session.endedAt ?? new Date();
    const buckets =
      (end.getTime() - start.getTime()) / (bucketMinutes * 60_000);
    if (buckets > MAX_TIMELINE_BUCKETS) {
      throw new BadRequestException(
        'Taille de tranche trop petite pour la durée de la session',
      );
    }
    const rows = await this.prisma.$queryRaw<{ start: Date; count: number }[]>`
      SELECT b.start, COUNT(c.id)::int AS count
      FROM generate_series(
             ${start}::timestamptz,
             ${end}::timestamptz,
             make_interval(mins => ${bucketMinutes}::int)
           ) AS b(start)
      LEFT JOIN "deviceSessions" ds ON ds."analysisSessionId" = ${id}::uuid
      LEFT JOIN captures c
        ON c."deviceSessionId" = ds.id
       AND c."capturedAt" >= b.start
       AND c."capturedAt" < b.start + make_interval(mins => ${bucketMinutes}::int)
      GROUP BY b.start
      ORDER BY b.start`;
    return { buckets: rows, pauses: session.pauses };
  }

  async start(userId: string, id: string): Promise<AnalysisSessionDetailDto> {
    const status = await this.sessionStatus(userId, id);
    if (status !== AnalysisSessionStatus.Setup) {
      throw new ConflictException('Session déjà lancée');
    }
    const devices = await this.prisma.deviceSession.findMany({
      where: { analysisSessionId: id, endedAt: null },
      select: { device: { select: { captureStatus: true } } },
    });
    if (devices.length === 0) {
      throw new ConflictException(
        'Ajoutez un appareil avant de lancer la session',
      );
    }
    if (
      devices.some((ds) => ds.device.captureStatus === CaptureStatus.Inactive)
    ) {
      throw captureDisabled();
    }
    await this.prisma.analysisSession.update({
      where: { id },
      data: { startedAt: new Date() },
    });
    this.notify(await this.openDeviceIds(id), 'session:start', id);
    return this.detail(userId, id);
  }

  /** Met en pause une session en cours : les captures sont refusées. */
  async pause(userId: string, id: string): Promise<AnalysisSessionDetailDto> {
    const status = await this.sessionStatus(userId, id);
    if (status !== AnalysisSessionStatus.Running) {
      throw status === AnalysisSessionStatus.Paused
        ? new ConflictException('Session déjà en pause')
        : conflictFor(status);
    }
    try {
      await this.prisma.analysisSessionPause.create({
        data: { analysisSessionId: id, startedAt: new Date() },
      });
    } catch (error) {
      throw isUniqueViolation(error)
        ? new ConflictException('Session déjà en pause')
        : error;
    }
    // Le Pi termine son analyse et éteint sa webcam ; il reprendra au resume.
    this.notify(await this.openDeviceIds(id), 'session:stop', id);
    this.liveStates.clear(id);
    return this.detail(userId, id);
  }

  /** Reprend une session en pause. */
  async resume(userId: string, id: string): Promise<AnalysisSessionDetailDto> {
    const status = await this.sessionStatus(userId, id);
    if (status !== AnalysisSessionStatus.Paused) {
      throw new ConflictException('Session pas en pause');
    }
    await this.prisma.analysisSessionPause.updateMany({
      where: { analysisSessionId: id, endedAt: null },
      data: { endedAt: new Date() },
    });
    this.notify(await this.openDeviceIds(id), 'session:start', id);
    return this.detail(userId, id);
  }

  /** Arrête une session en cours ou en pause (la pause est fermée). */
  async stop(userId: string, id: string): Promise<AnalysisSessionDetailDto> {
    const status = await this.sessionStatus(userId, id);
    if (
      status !== AnalysisSessionStatus.Running &&
      status !== AnalysisSessionStatus.Paused
    ) {
      throw new ConflictException(
        status === AnalysisSessionStatus.Setup
          ? 'Session pas encore lancée'
          : 'Session déjà terminée',
      );
    }
    const deviceIds = await this.openDeviceIds(id);
    const endedAt = new Date();
    await this.prisma.$transaction([
      this.prisma.analysisSession.update({
        where: { id },
        data: { endedAt },
      }),
      this.prisma.deviceSession.updateMany({
        where: { analysisSessionId: id, endedAt: null },
        data: { endedAt },
      }),
      this.prisma.analysisSessionPause.updateMany({
        where: { analysisSessionId: id, endedAt: null },
        data: { endedAt },
      }),
    ]);
    this.notify(deviceIds, 'session:stop', id);
    this.liveStates.clear(id);
    return this.detail(userId, id);
  }

  async remove(userId: string, id: string): Promise<void> {
    const status = await this.sessionStatus(userId, id);
    const deviceIds = isLaunched(status) ? await this.openDeviceIds(id) : [];
    const { count } = await this.prisma.analysisSession.deleteMany({
      where: { id, userId },
    });
    if (count === 0) {
      throw new NotFoundException('Session introuvable');
    }
    this.notify(deviceIds, 'session:stop', id);
    this.liveStates.clear(id);
  }

  /**
   * Session en cours (lancée, ni en pause ni terminée) à laquelle participe
   * l'appareil, ou null : envoyée au Pi à chaque connexion (`ready`), pour
   * qu'il rattrape un start, un stop ou une pause manqués.
   */
  async runningSessionId(deviceId: string): Promise<string | null> {
    const deviceSession = await this.prisma.deviceSession.findFirst({
      where: {
        deviceId,
        endedAt: null,
        analysisSession: {
          startedAt: { not: null },
          endedAt: null,
          pauses: { none: { endedAt: null } },
        },
      },
      select: { analysisSessionId: true },
    });
    return deviceSession?.analysisSessionId ?? null;
  }

  async addDevice(
    userId: string,
    id: string,
    deviceId: string,
  ): Promise<AnalysisSessionDetailDto> {
    const status = await this.openSession(userId, id);
    await this.captureDevice(userId, deviceId, true);
    const existing = await this.prisma.deviceSession.findUnique({
      where: {
        analysisSessionId_deviceId: { analysisSessionId: id, deviceId },
      },
      select: { id: true, endedAt: true },
    });
    if (existing && !existing.endedAt) {
      throw new ConflictException('Appareil déjà dans la session');
    }
    try {
      if (existing) {
        await this.prisma.deviceSession.update({
          where: { id: existing.id },
          data: { endedAt: null },
        });
      } else {
        await this.prisma.deviceSession.create({
          data: { analysisSessionId: id, deviceId, startedAt: new Date() },
        });
      }
    } catch (error) {
      throw isUniqueViolation(error) ? deviceBusy() : error;
    }
    if (isLaunched(status)) {
      this.notify([deviceId], 'session:start', id);
    }
    return this.detail(userId, id);
  }

  async removeDevice(
    userId: string,
    id: string,
    deviceId: string,
  ): Promise<AnalysisSessionDetailDto> {
    const status = await this.openSession(userId, id);
    const where = { analysisSessionId: id, deviceId, endedAt: null };
    const { count } =
      status === AnalysisSessionStatus.Setup
        ? await this.prisma.deviceSession.deleteMany({ where })
        : await this.prisma.deviceSession.updateMany({
            where,
            data: { endedAt: new Date() },
          });
    if (count === 0) {
      throw new NotFoundException('Appareil absent de la session');
    }
    if (isLaunched(status)) {
      this.notify([deviceId], 'session:stop', id);
    }
    return this.detail(userId, id);
  }

  async addCapture(
    auth: AuthContext,
    sessionId: string,
    dto: CreateCaptureDto,
  ): Promise<CaptureDto> {
    const status = await this.sessionStatus(auth.userId, sessionId);
    if (status !== AnalysisSessionStatus.Running) {
      throw conflictFor(status);
    }
    const data = this.captureData(dto);
    // Refusée aussi si elle a été prise pendant une pause déjà terminée.
    const inPause = await this.prisma.analysisSessionPause.count({
      where: {
        analysisSessionId: sessionId,
        startedAt: { lte: data.capturedAt },
        OR: [{ endedAt: null }, { endedAt: { gt: data.capturedAt } }],
      },
    });
    if (inPause > 0) {
      throw conflictFor(AnalysisSessionStatus.Paused);
    }
    const deviceId = dto.deviceId ?? (await this.requestDeviceId(auth));
    const deviceSession = await this.prisma.deviceSession.findFirst({
      where: { analysisSessionId: sessionId, deviceId, endedAt: null },
      select: { id: true },
    });
    if (!deviceSession) {
      throw new ConflictException(
        'Appareil absent de la session : ajoutez-le avant d’envoyer des captures',
      );
    }
    const capture = await this.prisma.capture.create({
      data: { deviceSessionId: deviceSession.id, ...data },
      select: captureSelect,
    });
    return toCapture(capture);
  }

  async addStandaloneCapture(
    auth: AuthContext,
    dto: CreateCaptureDto,
  ): Promise<CaptureDto> {
    const deviceId = dto.deviceId ?? (await this.requestDeviceId(auth));
    await this.captureDevice(auth.userId, deviceId);
    // Un appareil dont la session est en pause n'envoie rien, même seul.
    const paused = await this.prisma.deviceSession.count({
      where: {
        deviceId,
        endedAt: null,
        analysisSession: { endedAt: null, pauses: { some: { endedAt: null } } },
      },
    });
    if (paused > 0) {
      throw conflictFor(AnalysisSessionStatus.Paused);
    }
    const data = this.captureData(dto);
    const at = data.capturedAt;
    const session = await this.prisma.analysisSession.create({
      data: {
        userId: auth.userId,
        startedAt: at,
        endedAt: at,
        deviceSessions: {
          create: {
            deviceId,
            startedAt: at,
            endedAt: at,
            captures: { create: data },
          },
        },
      },
      select: {
        deviceSessions: { select: { captures: { select: captureSelect } } },
      },
    });
    return toCapture(session.deviceSessions[0].captures[0]);
  }

  async getCapture(userId: string, id: string): Promise<CaptureDto> {
    const capture = await this.prisma.capture.findFirst({
      where: { id, deviceSession: { analysisSession: { userId } } },
      select: captureSelect,
    });
    if (!capture) {
      throw new NotFoundException('Capture introuvable');
    }
    return toCapture(capture);
  }

  async removeCapture(userId: string, id: string): Promise<void> {
    const { count } = await this.prisma.capture.deleteMany({
      where: { id, deviceSession: { analysisSession: { userId } } },
    });
    if (count === 0) {
      throw new NotFoundException('Capture introuvable');
    }
  }

  private captureData(dto: CreateCaptureDto) {
    const outside = dto.keypoints.find(
      (k) => k.x > dto.imageWidth || k.y > dto.imageHeight,
    );
    if (outside) {
      throw new BadRequestException(
        `Point ${outside.bodyPart} en dehors de l’image`,
      );
    }
    return {
      capturedAt: dto.capturedAt ? new Date(dto.capturedAt) : new Date(),
      imageWidth: dto.imageWidth,
      imageHeight: dto.imageHeight,
      keypoints: {
        createMany: {
          data: dto.keypoints.map((k) => ({
            bodyPart: k.bodyPart,
            x: k.x,
            y: k.y,
            confidence: k.confidence ?? null,
          })),
        },
      },
    };
  }

  private async requestDeviceId(auth: AuthContext): Promise<string> {
    const { deviceId } = await this.prisma.authSession.findUniqueOrThrow({
      where: { id: auth.sessionId },
      select: { deviceId: true },
    });
    return deviceId;
  }

  /**
   * Vérifie que l'appareil est à l'utilisateur et peut capturer ; avec
   * requireActive, que la capture y est aussi activée (ajout à une session).
   */
  private async captureDevice(
    userId: string,
    deviceId: string,
    requireActive = false,
  ): Promise<void> {
    const device = await this.prisma.device.findFirst({
      where: { id: deviceId, userId },
      select: { captureEligible: true, captureStatus: true },
    });
    if (!device) {
      throw new NotFoundException('Appareil introuvable');
    }
    if (!device.captureEligible) {
      throw new BadRequestException(
        'Cet appareil ne peut pas envoyer de captures (navigateur web)',
      );
    }
    if (requireActive && device.captureStatus === CaptureStatus.Inactive) {
      throw captureDisabled();
    }
  }

  private async sessionStatus(
    userId: string,
    id: string,
  ): Promise<AnalysisSessionStatus> {
    const session = await this.prisma.analysisSession.findFirst({
      where: { id, userId },
      select: {
        startedAt: true,
        endedAt: true,
        pauses: { where: { endedAt: null }, select: pauseSelect.select },
      },
    });
    if (!session) {
      throw new NotFoundException('Session introuvable');
    }
    return statusOf(session);
  }

  private async openSession(
    userId: string,
    id: string,
  ): Promise<AnalysisSessionStatus> {
    const status = await this.sessionStatus(userId, id);
    if (status === AnalysisSessionStatus.Ended) {
      throw new ConflictException('Session terminée');
    }
    return status;
  }

  private async openDeviceIds(id: string): Promise<string[]> {
    const deviceSessions = await this.prisma.deviceSession.findMany({
      where: { analysisSessionId: id, endedAt: null },
      select: { deviceId: true },
    });
    return deviceSessions.map((ds) => ds.deviceId);
  }

  /** Prévient les Pi connectés ; les autres se mettront à jour à leur connexion (`ready`). */
  private notify(
    deviceIds: string[],
    event: 'session:start' | 'session:stop',
    sessionId: string,
  ) {
    for (const deviceId of deviceIds) {
      this.connections.send(deviceId, event, { sessionId });
    }
  }
}
