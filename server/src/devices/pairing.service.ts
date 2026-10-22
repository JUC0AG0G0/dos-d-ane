import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeviceConnections } from '../analysis/device-connections.js';
import { CloseCode } from '../analysis/devices.gateway.js';
import {
  hashDeviceKey,
  newDeviceKey,
  sameKeyHash,
} from '../auth/device-key.js';
import { SessionDeviceDto } from '../auth/dto/auth-responses.dto.js';
import { DeviceType } from '../entities/index.js';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { PairingStatusDto } from './dto/pairing.dto.js';
import { hashPairingValue, normalizePairingCode } from './pairing-code.js';

/** Un code n'est accepté que si le Pi l'a envoyé depuis moins de 2 min (allumé). */
const ONLINE_MS = 2 * 60 * 1000;
/** Attente sans nouvelle du Pi depuis 10 min : supprimée. */
const STALE_MS = 10 * 60 * 1000;

/** Même réponse dans tous les cas : ne dit pas si un code existe. */
const unknownCode = () =>
  new NotFoundException('Code inconnu, déjà utilisé ou Raspberry Pi éteint');

const deviceSelect = {
  id: true,
  name: true,
  type: true,
  model: true,
} as const;

const isUniqueViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2002';

/**
 * Appairage d'un Raspberry Pi par le code de son étiquette
 * (edge/docs/liaison-serveur.md §2) : le Pi sans clé attend avec son code et
 * son secret de relève, un compte valide le code, le Pi relève sa clé.
 */
@Injectable()
export class PairingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly connections: DeviceConnections,
  ) {}

  /** Demande du Pi sans clé, toutes les 5 s. */
  async poll(code: string, secret: string): Promise<PairingStatusDto> {
    const canonical = normalizePairingCode(code);
    if (!canonical) {
      throw new BadRequestException('Code invalide : 9 caractères');
    }
    await this.purgeStale();
    const codeHash = hashPairingValue(canonical);
    const secretHash = hashPairingValue(secret);
    // 1re demande : crée l'attente et lie ce secret au code ; sinon, la relit.
    const pairing = await this.prisma.devicePairing.upsert({
      where: { codeHash },
      create: { codeHash, secretHash },
      update: {},
    });
    if (!sameKeyHash(pairing.secretHash, secretHash)) {
      throw new ConflictException(
        'Ce code est déjà utilisé par un autre appareil',
      );
    }
    if (!pairing.deviceId) {
      await this.prisma.devicePairing.update({
        where: { id: pairing.id },
        data: { lastSeenAt: new Date() },
      });
      return { status: 'waiting' };
    }
    // Validé : la clé n'est créée que maintenant, et donnée une seule fois.
    const deviceId = pairing.deviceId;
    const key = newDeviceKey();
    const handedOver = await this.prisma.$transaction(async (tx) => {
      const { count } = await tx.devicePairing.deleteMany({
        where: { id: pairing.id },
      });
      if (count === 0) return false;
      await tx.device.update({
        where: { id: deviceId },
        data: { keyHash: hashDeviceKey(key), keyCreatedAt: new Date() },
      });
      return true;
    });
    if (!handedOver) {
      // Deux demandes en même temps : l'autre a relevé la clé.
      throw new ConflictException('Clé déjà relevée');
    }
    return { status: 'paired', deviceId, key };
  }

  /**
   * Un compte valide le code de l'étiquette. Le même code déjà ajouté à ce
   * compte (Pi révoqué puis ajouté de nouveau) reprend son appareil : même
   * deviceId, nom et historique. Sinon le Pi est créé dans ce compte ; un
   * autre compte a donc son propre appareil, sans l'historique du premier.
   */
  async claim(
    userId: string,
    code: string,
    name = 'Raspberry Pi',
  ): Promise<SessionDeviceDto> {
    const canonical = normalizePairingCode(code);
    if (!canonical) {
      throw new BadRequestException('Code invalide : 9 caractères');
    }
    await this.purgeStale();
    const codeHash = hashPairingValue(canonical);
    const { device, oldKey } = await this.prisma
      .$transaction(async (tx) => {
        const pairing = await tx.devicePairing.findFirst({
          where: {
            codeHash,
            deviceId: null,
            lastSeenAt: { gte: new Date(Date.now() - ONLINE_MS) },
          },
          select: { id: true },
        });
        if (!pairing) throw unknownCode();
        const existing = await tx.device.findUnique({
          where: {
            userId_pairingCodeHash: { userId, pairingCodeHash: codeHash },
          },
          select: { ...deviceSelect, keyHash: true },
        });
        let device: SessionDeviceDto;
        if (existing) {
          // Son nom est gardé (renommer : PATCH /devices/:id). Une clé
          // encore valide (Pi qui l'a perdue) ne doit plus servir : comme une
          // révocation, avant que le Pi relève la nouvelle.
          const { keyHash: _, ...kept } = existing;
          device = kept;
          if (existing.keyHash) {
            await tx.device.update({
              where: { id: existing.id },
              data: { keyHash: null, keyCreatedAt: null },
            });
            await tx.authSession.updateMany({
              where: { deviceId: existing.id, revokedAt: null },
              data: { revokedAt: new Date() },
            });
          }
        } else {
          device = await tx.device.create({
            data: {
              userId,
              name,
              type: DeviceType.Raspberry,
              // Sa clé, il la relève.
              captureEligible: true,
              pairingCodeHash: codeHash,
            },
            select: deviceSelect,
          });
        }
        // Deux comptes en même temps : un seul gagne, l'autre est annulé.
        const { count } = await tx.devicePairing.updateMany({
          where: { id: pairing.id, deviceId: null },
          data: { deviceId: device.id, claimedAt: new Date() },
        });
        if (count === 0) throw unknownCode();
        return { device, oldKey: !!existing?.keyHash };
      })
      .catch((error: unknown) => {
        // Le même code validé deux fois en même temps dans ce compte.
        throw isUniqueViolation(error) ? unknownCode() : error;
      });
    if (oldKey) {
      this.connections.close(device.id, CloseCode.Unauthorized, 'Clé révoquée');
    }
    return device;
  }

  private purgeStale() {
    return this.prisma.devicePairing.deleteMany({
      where: {
        deviceId: null,
        lastSeenAt: { lt: new Date(Date.now() - STALE_MS) },
      },
    });
  }
}
