import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeviceConnections } from '../analysis/device-connections.js';
import { CloseCode } from '../analysis/devices.gateway.js';
import { hashDeviceKey, newDeviceKey } from '../auth/device-key.js';
import { CaptureStatus, DeviceType } from '../entities/index.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { DeviceKeyDto } from './dto/device-key.dto.js';

/** Clés des Raspberry Pi : création, remplacement, révocation. */
@Injectable()
export class DevicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly connections: DeviceConnections,
  ) {}

  /** Ajoute un Raspberry Pi au compte et renvoie sa clé (une seule fois). */
  async createRaspberry(
    userId: string,
    name = 'Raspberry Pi',
  ): Promise<DeviceKeyDto> {
    const key = newDeviceKey();
    const keyCreatedAt = new Date();
    const device = await this.prisma.device.create({
      data: {
        userId,
        name,
        type: DeviceType.Raspberry,
        // Ajouté pour capturer, et sans écran pour activer la capture lui-même.
        captureEligible: true,
        captureStatus: CaptureStatus.Active,
        keyHash: hashDeviceKey(key),
        keyCreatedAt,
      },
      select: { id: true, name: true },
    });
    return { deviceId: device.id, name: device.name, key, keyCreatedAt };
  }

  /**
   * Nouvelle clé pour un de ses Raspberry Pi. L'ancienne ne marche plus et
   * les connexions ouvertes avec elle sont fermées (clé perdue ou volée).
   */
  async renewKey(userId: string, deviceId: string): Promise<DeviceKeyDto> {
    const device = await this.ownRaspberry(userId, deviceId);
    const key = newDeviceKey();
    const keyCreatedAt = new Date();
    await this.prisma.$transaction([
      this.prisma.device.update({
        where: { id: device.id },
        data: { keyHash: hashDeviceKey(key), keyCreatedAt },
      }),
      this.revokeSessions(device.id),
    ]);
    this.disconnect(device.id);
    return { deviceId: device.id, name: device.name, key, keyCreatedAt };
  }

  /** Révoque la clé : le Pi ne peut plus se connecter, ses sessions sont fermées. */
  async revokeKey(userId: string, deviceId: string): Promise<void> {
    const device = await this.ownRaspberry(userId, deviceId);
    await this.prisma.$transaction([
      this.prisma.device.update({
        where: { id: device.id },
        data: { keyHash: null, keyCreatedAt: null },
      }),
      this.revokeSessions(device.id),
    ]);
    this.disconnect(device.id);
  }

  /**
   * Le JWT n'est vérifié qu'à l'ouverture de la WebSocket : sans cela, un Pi
   * révoqué resterait connecté. 4401 : il refait un login, refusé, et s'arrête.
   */
  private disconnect(deviceId: string) {
    this.connections.close(deviceId, CloseCode.Unauthorized, 'Clé révoquée');
  }

  private revokeSessions(deviceId: string) {
    return this.prisma.authSession.updateMany({
      where: { deviceId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async ownRaspberry(userId: string, deviceId: string) {
    const device = await this.prisma.device.findFirst({
      where: { id: deviceId, userId },
      select: { id: true, name: true, type: true },
    });
    if (!device) {
      throw new NotFoundException('Appareil introuvable');
    }
    if (device.type !== DeviceType.Raspberry) {
      throw new BadRequestException('Seul un Raspberry Pi a une clé');
    }
    return device;
  }
}
