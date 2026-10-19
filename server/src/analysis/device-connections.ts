import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';

/** Fermeture d'une connexion remplacée par une autre du même appareil. */
export const REPLACED_CLOSE_CODE = 4409;

interface Connection {
  socket: WebSocket;
  /** Messages en attente de `ready`, qui doit toujours arriver en premier ; null une fois envoyé. */
  pending: string[] | null;
}

/**
 * Connexions WebSocket ouvertes, par appareil : la passerelle les enregistre,
 * AnalysisService s'en sert pour prévenir les Pi (session:start, session:stop).
 * Gardées en mémoire : valable tant qu'il n'y a qu'une instance du serveur.
 */
@Injectable()
export class DeviceConnections {
  private readonly connections = new Map<string, Connection>();

  /** Enregistre la connexion ; une autre connexion du même appareil est fermée. */
  add(deviceId: string, socket: WebSocket) {
    const previous = this.connections.get(deviceId);
    if (previous && previous.socket !== socket) {
      previous.socket.close(
        REPLACED_CLOSE_CODE,
        'Remplacée par une autre connexion',
      );
    }
    this.connections.set(deviceId, { socket, pending: [] });
  }

  /** Envoie `ready`, puis les messages arrivés entre-temps. */
  ready(deviceId: string, socket: WebSocket, data: unknown) {
    const connection = this.connections.get(deviceId);
    if (connection?.socket !== socket || !connection.pending) {
      return;
    }
    const pending = connection.pending;
    connection.pending = null;
    this.write(socket, JSON.stringify({ event: 'ready', data }));
    pending.forEach((message) => this.write(socket, message));
  }

  remove(deviceId: string, socket: WebSocket) {
    if (this.connections.get(deviceId)?.socket === socket) {
      this.connections.delete(deviceId);
    }
  }

  /** Envoie à l'appareil s'il est connecté ; sinon il se synchronisera par `ready`. */
  send(deviceId: string, event: string, data: unknown) {
    const connection = this.connections.get(deviceId);
    if (!connection) {
      return;
    }
    const message = JSON.stringify({ event, data });
    if (connection.pending) {
      connection.pending.push(message);
    } else {
      this.write(connection.socket, message);
    }
  }

  private write(socket: WebSocket, message: string) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  }
}
