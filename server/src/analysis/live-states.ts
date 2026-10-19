import { Injectable } from '@nestjs/common';
import type { LiveStateDto } from './dto/device-messages.dto.js';

/** Un Pi envoie au plus une image toutes les 2 s : plus souvent, les états sont ignorés. */
const MIN_INTERVAL_MS = 500;

export interface LiveState extends LiveStateDto {
  deviceId: string;
  /** Heure de réception par le serveur : à préférer à `at` (horloge du Pi) pour juger la fraîcheur. */
  receivedAt: Date;
}

/**
 * Dernier état en direct de chaque session en cours, en mémoire seulement
 * (jamais stocké, audit §7.2) ; relayé à l'app plus tard (SSE).
 */
@Injectable()
export class LiveStates {
  private readonly bySession = new Map<string, LiveState>();
  private readonly lastByDevice = new Map<string, number>();

  /** Garde l'état ; renvoie false s'il arrive trop tôt après le précédent du même appareil. */
  set(deviceId: string, state: LiveStateDto): boolean {
    const now = Date.now();
    if (now - (this.lastByDevice.get(deviceId) ?? 0) < MIN_INTERVAL_MS) {
      return false;
    }
    this.lastByDevice.set(deviceId, now);
    this.bySession.set(state.sessionId, {
      ...state,
      deviceId,
      receivedAt: new Date(now),
    });
    return true;
  }

  get(sessionId: string): LiveState | undefined {
    return this.bySession.get(sessionId);
  }

  clear(sessionId: string) {
    this.bySession.delete(sessionId);
  }

  forgetDevice(deviceId: string) {
    this.lastByDevice.delete(deviceId);
  }
}
