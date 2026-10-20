import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import type { LiveStateDto } from './dto/device-messages.dto.js';

/** Un Pi envoie au plus une image toutes les 2 s : plus souvent, les états sont ignorés. */
const MIN_INTERVAL_MS = 500;

export interface LiveState extends LiveStateDto {
  deviceId: string;
  /** Heure de réception par le serveur : à préférer à `at` (horloge du Pi) pour juger la fraîcheur. */
  receivedAt: Date;
}

/** Message relayé aux écrans qui suivent une session en direct (SSE). */
export interface LiveMessage {
  type: 'state';
  data: LiveState;
}

/**
 * Dernier état en direct de chaque session en cours, en mémoire seulement
 * (jamais stocké, audit §7.2), relayé aux écrans qui suivent la session.
 */
@Injectable()
export class LiveStates {
  private readonly bySession = new Map<string, LiveState>();
  private readonly lastByDevice = new Map<string, number>();
  /** Un flux par session suivie, supprimé quand plus personne ne la suit. */
  private readonly feeds = new Map<string, Subject<LiveMessage>>();

  /** Garde l'état ; renvoie false s'il arrive trop tôt après le précédent du même appareil. */
  set(deviceId: string, state: LiveStateDto): boolean {
    const now = Date.now();
    if (now - (this.lastByDevice.get(deviceId) ?? 0) < MIN_INTERVAL_MS) {
      return false;
    }
    this.lastByDevice.set(deviceId, now);
    const live = { ...state, deviceId, receivedAt: new Date(now) };
    this.bySession.set(state.sessionId, live);
    this.feeds.get(state.sessionId)?.next({ type: 'state', data: live });
    return true;
  }

  get(sessionId: string): LiveState | undefined {
    return this.bySession.get(sessionId);
  }

  /** Suit une session : le dernier état connu tout de suite, puis chaque nouveau. */
  watch(sessionId: string): Observable<LiveMessage> {
    return new Observable<LiveMessage>((subscriber) => {
      const last = this.bySession.get(sessionId);
      if (last) {
        subscriber.next({ type: 'state', data: last });
      }
      let feed = this.feeds.get(sessionId);
      if (!feed) {
        feed = new Subject<LiveMessage>();
        this.feeds.set(sessionId, feed);
      }
      const subscription = feed.subscribe(subscriber);
      return () => {
        subscription.unsubscribe();
        if (!feed.observed) {
          this.feeds.delete(sessionId);
        }
      };
    });
  }

  clear(sessionId: string) {
    this.bySession.delete(sessionId);
  }

  forgetDevice(deviceId: string) {
    this.lastByDevice.delete(deviceId);
  }
}
