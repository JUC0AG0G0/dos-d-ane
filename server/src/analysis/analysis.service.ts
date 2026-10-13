import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthContext } from '../auth/auth.guard.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type {
  CreateCaptureDto,
  StartAnalysisSessionDto,
} from './dto/analysis-inputs.dto.js';
import type {
  AnalysisSessionDetailDto,
  AnalysisSessionSummaryDto,
  CaptureDto,
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

const toCapture = ({ deviceSession, ...capture }: CaptureRow): CaptureDto => ({
  id: capture.id,
  analysisSessionId: deviceSession.analysisSessionId,
  deviceId: deviceSession.deviceId,
  capturedAt: capture.capturedAt,
  imageWidth: capture.imageWidth,
  imageHeight: capture.imageHeight,
  keypoints: capture.keypoints,
});

const durationSeconds = (startedAt: Date, endedAt: Date | null): number =>
  Math.max(
    0,
    Math.round(
      ((endedAt ?? new Date()).getTime() - startedAt.getTime()) / 1000,
    ),
  );

@Injectable()
export class AnalysisService {
  constructor(private readonly prisma: PrismaService) {}

  async start(
    auth: AuthContext,
    dto: StartAnalysisSessionDto,
  ): Promise<AnalysisSessionDetailDto> {
    const deviceIds = dto.deviceIds ?? [await this.requestDeviceId(auth)];
    const owned = await this.prisma.device.count({
      where: { id: { in: deviceIds }, userId: auth.userId },
    });
    if (owned !== deviceIds.length) {
      throw new NotFoundException('Appareil introuvable');
    }
    const startedAt = new Date();
    const session = await this.prisma.analysisSession.create({
      data: {
        userId: auth.userId,
        startedAt,
        deviceSessions: {
          create: deviceIds.map((deviceId) => ({ deviceId, startedAt })),
        },
      },
      select: { id: true },
    });
    return this.detail(auth.userId, session.id);
  }

  async list(userId: string): Promise<AnalysisSessionSummaryDto[]> {
    const sessions = await this.prisma.analysisSession.findMany({
      where: { userId },
      select: {
        id: true,
        startedAt: true,
        endedAt: true,
        deviceSessions: { select: { _count: { select: { captures: true } } } },
      },
      orderBy: [{ startedAt: 'desc' }, { id: 'desc' }],
    });
    return sessions.map(({ deviceSessions, ...session }) => ({
      ...session,
      durationSeconds: durationSeconds(session.startedAt, session.endedAt),
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
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      durationSeconds: durationSeconds(session.startedAt, session.endedAt),
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

  async stop(userId: string, id: string): Promise<AnalysisSessionDetailDto> {
    await this.openSession(userId, id);
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
    return this.detail(userId, id);
  }

  async addDevice(
    userId: string,
    id: string,
    deviceId: string,
  ): Promise<AnalysisSessionDetailDto> {
    await this.openSession(userId, id);
    await this.ownedDevice(userId, deviceId);
    const existing = await this.prisma.deviceSession.findUnique({
      where: {
        analysisSessionId_deviceId: { analysisSessionId: id, deviceId },
      },
      select: { id: true, endedAt: true },
    });
    if (existing && !existing.endedAt) {
      throw new ConflictException('Appareil déjà dans la session');
    }
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
    return this.detail(userId, id);
  }

  async removeDevice(
    userId: string,
    id: string,
    deviceId: string,
  ): Promise<AnalysisSessionDetailDto> {
    await this.openSession(userId, id);
    const { count } = await this.prisma.deviceSession.updateMany({
      where: { analysisSessionId: id, deviceId, endedAt: null },
      data: { endedAt: new Date() },
    });
    if (count === 0) {
      throw new NotFoundException('Appareil absent de la session');
    }
    return this.detail(userId, id);
  }

  async addCapture(
    auth: AuthContext,
    sessionId: string,
    dto: CreateCaptureDto,
  ): Promise<CaptureDto> {
    await this.openSession(auth.userId, sessionId);
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
    await this.ownedDevice(auth.userId, deviceId);
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

  private async ownedDevice(userId: string, deviceId: string): Promise<void> {
    const device = await this.prisma.device.findFirst({
      where: { id: deviceId, userId },
      select: { id: true },
    });
    if (!device) {
      throw new NotFoundException('Appareil introuvable');
    }
  }

  private async openSession(userId: string, id: string): Promise<void> {
    const session = await this.prisma.analysisSession.findFirst({
      where: { id, userId },
      select: { endedAt: true },
    });
    if (!session) {
      throw new NotFoundException('Session introuvable');
    }
    if (session.endedAt) {
      throw new ConflictException('Session terminée');
    }
  }
}
