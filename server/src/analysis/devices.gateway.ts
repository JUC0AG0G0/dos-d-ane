import type { IncomingMessage } from 'node:http';
import { Logger } from '@nestjs/common';
import {
  MessageBody,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import type { AuthenticatedSocket } from '../auth/auth.guard.js';
import { AuthService } from '../auth/auth.service.js';
import { DeviceType } from '../entities/index.js';

/** Codes de fermeture (la plage 4000–4999 est réservée aux applications). */
export const CloseCode = {
  /** Jeton absent, invalide ou expiré : refaire un login avant de revenir. */
  Unauthorized: 4401,
  /** Session ouverte depuis un appareil qui n'est pas un Raspberry Pi. */
  Forbidden: 4403,
  /** Erreur du serveur (base injoignable…) : réessayer plus tard. */
  InternalError: 1011,
} as const;

type DeviceSocket = AuthenticatedSocket & { deviceId?: string };

/**
 * Connexion WebSocket ouverte par le Raspberry Pi (audit §7.2) : commandes
 * serveur → Pi et état en direct Pi → serveur.
 *
 * Le jeton (`Authorization: Bearer <JWT>` d'un login raspberry) est vérifié
 * une seule fois, à l'ouverture ; jamais dans l'URL, qui finit dans les logs.
 * Tant que la vérification n'est pas finie, le guard global refuse les messages.
 */
@WebSocketGateway({
  // Le préfixe global `api` ne s'applique pas aux WebSockets.
  path: '/api/devices/ws',
  // Un message d'état fait moins de 1 Ko : au-delà, la connexion est coupée.
  maxPayload: 16 * 1024,
})
export class DevicesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(DevicesGateway.name);

  constructor(private readonly auth: AuthService) {}

  async handleConnection(client: DeviceSocket, request: IncomingMessage) {
    // Une promesse rejetée ici arrêterait le serveur : tout passe par le catch.
    try {
      const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
      const auth =
        scheme === 'Bearer' && token
          ? await this.auth.authenticate(token)
          : null;
      if (!auth) {
        this.logger.warn('Connexion refusée : jeton absent ou invalide');
        client.close(CloseCode.Unauthorized, 'Connexion requise');
        return;
      }
      const device = await this.auth.sessionDevice(auth.sessionId);
      if (device.type !== DeviceType.Raspberry) {
        this.logger.warn(`Connexion refusée : appareil ${device.type}`);
        client.close(CloseCode.Forbidden, 'Réservé aux Raspberry Pi');
        return;
      }
      client.auth = auth;
      client.deviceId = device.id;
      this.logger.log(`Appareil connecté : ${device.id}`);
    } catch (err) {
      this.logger.error('Échec de la vérification de connexion', err);
      client.close(CloseCode.InternalError, 'Erreur du serveur');
    }
  }

  handleDisconnect(client: DeviceSocket) {
    if (client.deviceId) {
      this.logger.log(`Appareil déconnecté : ${client.deviceId}`);
    }
  }

  @SubscribeMessage('ping')
  ping(@MessageBody() data: unknown) {
    return { event: 'pong', data };
  }
}
