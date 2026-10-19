import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthContext } from '../auth/auth.guard.js';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { DeviceConnections } from './device-connections.js';
import { LiveStates } from './live-states.js';
import type {
  CreateCaptureDto,
  StartAnalysisSessionDto,
} from './dto/analysis-inputs.dto.js';
import {
  AnalysisSessionStatus,
  type AnalysisSessionDetailDto,
  type AnalysisSessionSummaryDto,
  type CaptureDto,
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

type SessionDates = { startedAt: Date | null; endedAt: Date | null };

const toCapture = ({ deviceSession, ...capture }: CaptureRow): CaptureDto => ({
  id: capture.id,
  analysisSessionId: deviceSession.analysisSessionId,
  deviceId: deviceSession.deviceId,
  capturedAt: capture.capturedAt,
  imageWidth: capture.imageWidth,
  imageHeight: capture.imageHeight,
  keypoints: capture.keypoints,
});

const statusOf = ({ startedAt, endedAt }: SessionDates) =>
  !startedAt
    ? AnalysisSessionStatus.Setup
    : endedAt
      ? AnalysisSessionStatus.Ended
      : AnalysisSessionStatus.Running;

const durationSeconds = ({ startedAt, endedAt }: SessionDates) =>
  startedAt
    ? Math.max(
        0,
        Math.round(
          ((endedAt ?? new Date()).getTime() - startedAt.getTime()) / 1000,
        ),
      )
    : null;

const isUniqueViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2002';

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
        await this.captureDevice(auth.userId, deviceId);
      }
    } else {
      const deviceId = await this.requestDeviceId(auth);
      const device = await this.prisma.device.findUniqueOrThrow({
        where: { id: deviceId },
        select: { captureEligible: true },
      });
      deviceIds = device.captureEligible ? [deviceId] : [];
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

  async list(userId: string): Promise<AnalysisSessionSummaryDto[]> {
    const sessions = await this.prisma.analysisSession.findMany({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
        startedAt: true,
        endedAt: true,
        deviceSessions: { select: { _count: { select: { captures: true } } } },
      },
      orderBy: [
        { startedAt: { sort: 'desc', nulls: 'first' } },
        { createdAt: 'desc' },
      ],
    });
    return sessions.map(({ deviceSessions, ...session }) => ({
      ...session,
      status: statusOf(session),
      durationSeconds: durationSeconds(session),
      captureCount: deviceSessions.reduce(
        (sum, ds) => sum + ds._count.captures,
        0,
      ),
      deviceCount: deviceSessions.length,
    }));
  }

  async detail(userId: string, id: string): Promise<AnalysisSessionDetailDto> {
    const session = await this.prisma.analysisSession.findFirst({
      where: { id, userId },
      select: {
        id: true,
        createdAt: true,
        startedAt: true,
        endedAt: true,
        deviceSessions: {
          select: {
            startedAt: true,
            endedAt: true,
            device: { select: { id: true, name: true, type: true } },
            captures: {
              select: {
                id: true,
                capturedAt: true,
                _count: { select: { keypoints: true } },
              },
            },
          },
          orderBy: { startedAt: 'asc' },
        },
      },
    });
    if (!session) {
      throw new NotFoundException('Session introuvable');
    }
    const captures = session.deviceSessions
      .flatMap((ds) =>
        ds.captures.map((capture) => ({
          id: capture.id,
          deviceId: ds.device.id,
          capturedAt: capture.capturedAt,
          keypointCount: capture._count.keypoints,
        })),
      )
      .sort(
        (a, b) =>
          a.capturedAt.getTime() - b.capturedAt.getTime() ||
          a.id.localeCompare(b.id),
      );
    return {
      id: session.id,
      status: statusOf(session),
      createdAt: session.createdAt,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      durationSeconds: durationSeconds(session),
      captureCount: captures.length,
      deviceCount: session.deviceSessions.length,
      devices: session.deviceSessions.map((ds) => ({
        ...ds.device,
        joinedAt: ds.startedAt,
        leftAt: ds.endedAt,
      })),
      captures,
    };
  }

  async start(userId: string, id: string): Promise<AnalysisSessionDetailDto> {
    const status = await this.sessionStatus(userId, id);
    if (status !== AnalysisSessionStatus.Setup) {
      throw new ConflictException('Session déjà lancée');
    }
    const devices = await this.prisma.deviceSession.count({
      where: { analysisSessionId: id, endedAt: null },
    });
    if (devices === 0) {
      throw new ConflictException(
        'Ajoutez un appareil avant de lancer la session',
      );
    }
    await this.prisma.analysisSession.update({
      where: { id },
      data: { startedAt: new Date() },
    });
    this.notify(await this.openDeviceIds(id), 'session:start', id);
    return this.detail(userId, id);
  }

  async stop(userId: string, id: string): Promise<AnalysisSessionDetailDto> {
    const status = await this.sessionStatus(userId, id);
    if (status !== AnalysisSessionStatus.Running) {
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
    ]);
    this.notify(deviceIds, 'session:stop', id);
    this.liveStates.clear(id);
    return this.detail(userId, id);
  }

  async remove(userId: string, id: string): Promise<void> {
    const status = await this.sessionStatus(userId, id);
    const deviceIds =
      status === AnalysisSessionStatus.Running
        ? await this.openDeviceIds(id)
        : [];
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
   * Session en cours à laquelle participe l'appareil, ou null : envoyée au Pi
   * à chaque connexion (`ready`), pour qu'il rattrape un start ou un stop manqué.
   */
  async runningSessionId(deviceId: string): Promise<string | null> {
    const deviceSession = await this.prisma.deviceSession.findFirst({
      where: {
        deviceId,
        endedAt: null,
        analysisSession: { startedAt: { not: null }, endedAt: null },
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
    await this.captureDevice(userId, deviceId);
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
    if (status === AnalysisSessionStatus.Running) {
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
    if (status === AnalysisSessionStatus.Running) {
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
      throw new ConflictException(
        status === AnalysisSessionStatus.Setup
          ? 'Session pas encore lancée'
          : 'Session terminée',
      );
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
      data: { deviceSessionId: deviceSession.id, ...this.captureData(dto) },
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

  private async captureDevice(userId: string, deviceId: string): Promise<void> {
    const device = await this.prisma.device.findFirst({
      where: { id: deviceId, userId },
      select: { captureEligible: true },
    });
    if (!device) {
      throw new NotFoundException('Appareil introuvable');
    }
    if (!device.captureEligible) {
      throw new BadRequestException(
        'Cet appareil ne peut pas envoyer de captures (navigateur web)',
      );
    }
  }

  private async sessionStatus(
    userId: string,
    id: string,
  ): Promise<AnalysisSessionStatus> {
    const session = await this.prisma.analysisSession.findFirst({
      where: { id, userId },
      select: { startedAt: true, endedAt: true },
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
