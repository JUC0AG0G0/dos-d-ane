/** setup : en préparation ; running : en cours ; paused : en pause ; ended : terminée. */
export type SessionStatus = 'setup' | 'running' | 'paused' | 'ended';

export interface SessionDeviceSummary {
  id: string;
  name: string;
  type: string;
  captureCount: number;
  /** Retrait de la session (ou fin de la session) ; null si actif. */
  leftAt: string | null;
}

export interface SessionSummary {
  id: string;
  status: SessionStatus;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
  /** Durée active (pauses non comprises), null en préparation. */
  durationSeconds: number | null;
  pausedSeconds: number;
  pausedSince: string | null;
  captureCount: number;
  deviceCount: number;
  lastCaptureAt: string | null;
  devices: SessionDeviceSummary[];
}

export interface SessionDevice extends SessionDeviceSummary {
  joinedAt: string;
  lastCaptureAt: string | null;
}

export interface SessionPause {
  startedAt: string;
  endedAt: string | null;
}

export interface SessionDetail extends Omit<SessionSummary, 'devices'> {
  devices: SessionDevice[];
  lastCapture: { id: string; deviceId: string; capturedAt: string } | null;
  pauses: SessionPause[];
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

export type BodyPart =
  | 'nose'
  | 'left_eye'
  | 'right_eye'
  | 'left_ear'
  | 'right_ear'
  | 'left_shoulder'
  | 'right_shoulder'
  | 'left_elbow'
  | 'right_elbow'
  | 'left_wrist'
  | 'right_wrist'
  | 'left_hip'
  | 'right_hip'
  | 'left_knee'
  | 'right_knee'
  | 'left_ankle'
  | 'right_ankle';

export interface Keypoint {
  bodyPart: BodyPart;
  x: number;
  y: number;
  confidence: number | null;
}

/** Capture : positions des articulations seulement, l'image n'est jamais stockée. */
export interface Capture {
  id: string;
  analysisSessionId: string;
  deviceId: string;
  capturedAt: string;
  imageWidth: number;
  imageHeight: number;
  keypoints: Keypoint[];
}

export interface SessionTimeline {
  buckets: { start: string; count: number }[];
  pauses: SessionPause[];
}

export interface SessionStats {
  thisWeek: { sessions: number; durationSeconds: number; captures: number };
  lastWeek: { sessions: number };
}

// --- En direct (flux /live, envoyé par un Raspberry Pi) ----------------------

/** Couleur de l'alerte en cours : orange = en doute, red = alerte. */
export type LiveColor = 'green' | 'orange' | 'red' | 'ignored' | 'absent';

export type LivePosture =
  'GOOD' | 'FORWARD_HEAD' | 'TRUNK_FORWARD' | 'TRUNK_BACKWARD';

/** Dernier état d'un Pi : jamais stocké par le serveur, seulement relayé. */
export interface LiveState {
  sessionId: string;
  deviceId: string;
  /** Heure de l'image sur le Pi. */
  at: string;
  /** Heure de réception par le serveur : à préférer à at pour la fraîcheur. */
  receivedAt: string;
  color: LiveColor;
  /** null si l'image n'est pas jugée (mal vue, personne absente). */
  posture: LivePosture | null;
  headAngle: number | null;
  trunkAngle: number | null;
  /** % du temps en bonne posture sur la période en cours. */
  score: number | null;
}

export type PostureEventType =
  'FORWARD_HEAD' | 'TRUNK_FORWARD' | 'TRUNK_BACKWARD' | 'IMMOBILE';

/** Alerte de posture d'un Pi ; endedAt null tant qu'elle dure. */
export interface PostureEvent {
  id: string;
  clientId: string;
  deviceId: string;
  type: PostureEventType;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  headAngleAvg: number | null;
  trunkAngleAvg: number | null;
  /** Part de chaque cause en %. */
  causes: Record<string, number> | null;
}

/** Statut annoncé par le flux : deleted si la session a été supprimée. */
export type LiveStatus = SessionStatus | 'deleted';

/** Appareil du compte, vu depuis les sessions. */
export interface Device {
  id: string;
  name: string;
  type: string;
  model: string | null;
  captureEligible: boolean;
  captureStatus: 'active' | 'inactive' | null;
  /** Appareil de ce navigateur. */
  current: boolean;
  /** Session ouverte où il est actif. */
  openSessionId: string | null;
}
