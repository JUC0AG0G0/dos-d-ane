/**
 * Corps et réponses de l'API des sessions d'analyse, alignés sur les DTO de
 * server/src/analysis et server/src/devices. Les réponses sont réduites aux
 * champs que l'app utilise.
 */

export type AnalysisSessionStatus = 'setup' | 'running' | 'paused' | 'ended';

export interface AnalysisSession {
  id: string;
  status: AnalysisSessionStatus;
  captureCount: number;
  devices: { id: string; leftAt: string | null }[];
}

export interface Device {
  id: string;
  type: string;
  captureEligible: boolean;
  current: boolean;
  openSessionId: string | null;
}

export interface CaptureSummary {
  id: string;
  deviceId: string;
  capturedAt: string;
  keypointCount: number;
}

export interface CapturePage {
  items: CaptureSummary[];
  nextCursor: string | null;
}

export interface Keypoint {
  bodyPart: string;
  x: number;
  y: number;
  confidence: number | null;
}

export interface Capture {
  id: string;
  capturedAt: string;
  imageWidth: number;
  imageHeight: number;
  keypoints: Keypoint[];
}

export interface KeypointInput {
  bodyPart: string;
  x: number;
  y: number;
  confidence?: number;
}

export interface CaptureInput {
  capturedAt: string;
  imageWidth: number;
  imageHeight: number;
  keypoints: KeypointInput[];
}
