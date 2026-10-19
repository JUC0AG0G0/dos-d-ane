import { Logger } from '@nestjs/common';
import {
  MessageBody,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Public } from '../auth/decorators.js';

/**
 * Connexion WebSocket ouverte par le Raspberry Pi (audit §7.2) : commandes
 * serveur → Pi et état en direct Pi → serveur.
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

  handleConnection() {
    this.logger.log('Appareil connecté');
  }

  handleDisconnect() {
    this.logger.log('Appareil déconnecté');
  }

  // Étape A2 seulement, avant l'authentification à l'ouverture (A3).
  @Public()
  @SubscribeMessage('ping')
  ping(@MessageBody() data: unknown) {
    return { event: 'pong', data };
  }
}
