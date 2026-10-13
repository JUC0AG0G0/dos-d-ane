import Bowser from 'bowser';
import type { Request } from 'express';

/** Informations sur le client, lues dans la requête sans rien lui demander. */
export interface ClientInfo {
  /** Adresse IP (X-Forwarded-For si un proxy de confiance la transmet). */
  ipAddress: string | null;
  userAgent: string | null;
  /** Nom lisible tiré du User-Agent, ex. « Firefox sur Linux ». */
  deviceName: string | null;
  /** Modèle de l'appareil quand le User-Agent le donne, ex. « iPhone ». */
  deviceModel: string | null;
}

export function readClientInfo(request: Request): ClientInfo {
  const userAgent = request.headers['user-agent']?.slice(0, 500) || null;
  const ipAddress = request.ip ?? null;
  if (!userAgent) {
    return { ipAddress, userAgent, deviceName: null, deviceModel: null };
  }
  const { browser, os, platform } = Bowser.parse(userAgent);
  const deviceName =
    [browser.name, os.name && `sur ${os.name}`].filter(Boolean).join(' ') ||
    null;
  const deviceModel =
    [platform.vendor, platform.model].filter(Boolean).join(' ') || null;
  return { ipAddress, userAgent, deviceName, deviceModel };
}
