import { Cpu, Monitor, Smartphone, type LucideIcon } from 'lucide-react';
import type {
  BodyPart,
  Keypoint,
  SessionDetail,
  SessionPause,
  SessionStatus,
  SessionSummary,
} from './types/sessions.types';

/** Appareil actif sans capture depuis ce temps de session active : alerte. */
export const SILENT_DEVICE_MS = 5 * 60 * 1000;

const DAY = 24 * 60 * 60 * 1000;
const number = new Intl.NumberFormat('fr-FR');
const mediumDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' });
const time = new Intl.DateTimeFormat('fr-FR', { timeStyle: 'short' });
const timeWithSeconds = new Intl.DateTimeFormat('fr-FR', {
  timeStyle: 'medium',
});

/** « 1 058 » */
export const formatCount = (value: number) => number.format(value);

/** « 3 captures », « 1 appareil » (pluriel en s). */
export const plural = (count: number, word: string) =>
  `${formatCount(count)} ${word}${count > 1 ? 's' : ''}`;

/** « 09:02 » */
export const formatTime = (value: string | number) =>
  time.format(new Date(value));

/** « 15:42:07 » */
export const formatTimeSeconds = (value: string | number) =>
  timeWithSeconds.format(new Date(value));

/** « 15 oct. 2026 » */
export const formatDay = (value: string | number) =>
  mediumDate.format(new Date(value));

/** Durée active affichée partout : « 2 h 31 min », « 45 min », « moins d’une minute ». */
export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return 'moins d’une minute';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** Chronomètre : « 07:32 », « 1:07:32 ». */
export function formatClock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** « il y a 4 s », « il y a 3 min », « il y a 2 h », puis le jour. */
export function formatAgo(value: string, now = Date.now()) {
  const seconds = Math.max(0, Math.round((now - Date.parse(value)) / 1000));
  if (seconds < 60) return `il y a ${seconds} s`;
  if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)} min`;
  if (seconds < 24 * 3600) return `il y a ${Math.floor(seconds / 3600)} h`;
  return formatRelative(value, new Date(now));
}

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** « aujourd’hui à 11:58 », « hier à 16:36 », « le 13 oct. 2026 à 12:10 » */
export function formatRelative(value: string, now = new Date()) {
  const days = Math.round(
    (startOfDay(now) - startOfDay(new Date(value))) / DAY,
  );
  const day =
    days === 0 ? 'aujourd’hui' : days === 1 ? 'hier' : `le ${formatDay(value)}`;
  return `${day} à ${formatTime(value)}`;
}

/** Capture seule (POST /captures) : session terminée dès son début. */
export const isSingleCapture = (session: SessionSummary | SessionDetail) =>
  session.status === 'ended' && session.startedAt === session.endedAt;

/** « Session du 15 oct. 2026 » ou « Capture du 15 oct. 2026 ». */
export const sessionTitle = (session: SessionSummary | SessionDetail) =>
  `${isSingleCapture(session) ? 'Capture' : 'Session'} du ${formatDay(
    session.startedAt ?? session.createdAt,
  )}`;

/** « 2 de plus que la semaine dernière », « autant », « 1 de moins ». */
export function compareWeeks(current: number, previous: number) {
  const diff = current - previous;
  if (diff === 0) return 'autant que la semaine dernière';
  return `${Math.abs(diff)} de ${diff > 0 ? 'plus' : 'moins'} que la semaine dernière`;
}

export const STATUS_BADGES: Record<
  SessionStatus,
  { label: string; variant: 'outline' | 'default' | 'warning' | 'secondary' }
> = {
  setup: { label: 'En préparation', variant: 'outline' },
  running: { label: 'En cours', variant: 'default' },
  paused: { label: 'En pause', variant: 'warning' },
  ended: { label: 'Terminée', variant: 'secondary' },
};

export const isLive = (status: SessionStatus) =>
  status === 'running' || status === 'paused';

/** Icônes d'appareil, comme dans Paramètres (bureau et web : Monitor). */
export const DEVICE_ICONS: Record<string, LucideIcon> = {
  mobile: Smartphone,
  raspberry: Cpu,
  desktop: Monitor,
  web: Monitor,
};

/** Temps de pause compris entre from et to (pause en cours jusqu'à to). */
export function pausedBetween(
  pauses: SessionPause[],
  from: number,
  to: number,
) {
  return pauses.reduce((sum, p) => {
    const start = Math.max(from, Date.parse(p.startedAt));
    const end = Math.min(to, p.endedAt ? Date.parse(p.endedAt) : to);
    return sum + Math.max(0, end - start);
  }, 0);
}

/** Durée active en secondes, recalculée à l'instant now (chrono local). */
export function activeSeconds(session: SessionDetail, now = Date.now()) {
  if (!session.startedAt) return 0;
  const start = Date.parse(session.startedAt);
  const end = session.endedAt ? Date.parse(session.endedAt) : now;
  return Math.max(
    0,
    (end - start - pausedBetween(session.pauses, start, end)) / 1000,
  );
}

/** Appareils actifs qui n'ont rien envoyé depuis SILENT_DEVICE_MS de session active. */
export function silentDevices(session: SessionDetail, now = Date.now()) {
  if (session.status !== 'running') return [];
  const lastResume = Math.max(
    0,
    ...session.pauses.map((p) => (p.endedAt ? Date.parse(p.endedAt) : 0)),
  );
  return session.devices.filter((device) => {
    if (device.leftAt) return false;
    const since = Math.max(
      Date.parse(device.joinedAt),
      device.lastCaptureAt ? Date.parse(device.lastCaptureAt) : 0,
      lastResume,
    );
    const active = now - since - pausedBetween(session.pauses, since, now);
    return active >= SILENT_DEVICE_MS;
  });
}

// --- Articulations (format COCO, 17 points) ----------------------------------

export const BODY_PART_COUNT = 17;

/** Libellés français des articulations (copie de ceux du serveur). */
export const BODY_PART_LABELS: Record<BodyPart, string> = {
  nose: 'Tête (nez)',
  left_eye: 'Œil gauche',
  right_eye: 'Œil droit',
  left_ear: 'Oreille gauche',
  right_ear: 'Oreille droite',
  left_shoulder: 'Épaule gauche',
  right_shoulder: 'Épaule droite',
  left_elbow: 'Coude gauche',
  right_elbow: 'Coude droit',
  left_wrist: 'Poignet gauche',
  right_wrist: 'Poignet droit',
  left_hip: 'Bassin côté gauche',
  right_hip: 'Bassin côté droit',
  left_knee: 'Genou gauche',
  right_knee: 'Genou droit',
  left_ankle: 'Cheville gauche',
  right_ankle: 'Cheville droite',
};

/** Segments du squelette COCO. */
export const SKELETON_EDGES: [BodyPart, BodyPart][] = [
  ['left_ear', 'left_eye'],
  ['left_eye', 'nose'],
  ['nose', 'right_eye'],
  ['right_eye', 'right_ear'],
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle'],
];

/**
 * Articulations par paire, pour la phrase des articulations cachées :
 * [nom au singulier (gauche/droite ajouté), au pluriel, féminin ?].
 */
const BODY_GROUPS: {
  parts: BodyPart[];
  one: [string, string];
  both: string;
  feminine: boolean;
}[] = [
  {
    parts: ['nose'],
    one: ['la tête', 'la tête'],
    both: 'la tête',
    feminine: true,
  },
  {
    parts: ['left_eye', 'right_eye'],
    one: ['l’œil gauche', 'l’œil droit'],
    both: 'les yeux',
    feminine: false,
  },
  {
    parts: ['left_ear', 'right_ear'],
    one: ['l’oreille gauche', 'l’oreille droite'],
    both: 'les oreilles',
    feminine: true,
  },
  {
    parts: ['left_shoulder', 'right_shoulder'],
    one: ['l’épaule gauche', 'l’épaule droite'],
    both: 'les épaules',
    feminine: true,
  },
  {
    parts: ['left_elbow', 'right_elbow'],
    one: ['le coude gauche', 'le coude droit'],
    both: 'les coudes',
    feminine: false,
  },
  {
    parts: ['left_wrist', 'right_wrist'],
    one: ['le poignet gauche', 'le poignet droit'],
    both: 'les poignets',
    feminine: false,
  },
  {
    parts: ['left_hip', 'right_hip'],
    one: ['le bassin côté gauche', 'le bassin côté droit'],
    both: 'le bassin',
    feminine: false,
  },
  {
    parts: ['left_knee', 'right_knee'],
    one: ['le genou gauche', 'le genou droit'],
    both: 'les genoux',
    feminine: false,
  },
  {
    parts: ['left_ankle', 'right_ankle'],
    one: ['la cheville gauche', 'la cheville droite'],
    both: 'les chevilles',
    feminine: true,
  },
];

/** « 15 articulations détectées sur 17 : les chevilles sont cachées » */
export function detectionSentence(keypoints: Keypoint[]) {
  const found = new Set(keypoints.map((k) => k.bodyPart));
  const base = `${keypoints.length} articulation${keypoints.length > 1 ? 's' : ''} détectée${keypoints.length > 1 ? 's' : ''} sur ${BODY_PART_COUNT}`;
  const missing: { text: string; plural: boolean; feminine: boolean }[] = [];
  for (const group of BODY_GROUPS) {
    const absent = group.parts.filter((part) => !found.has(part));
    if (absent.length === 0) continue;
    if (absent.length === group.parts.length) {
      missing.push({
        text: group.both,
        plural: group.both.startsWith('les '),
        feminine: group.feminine,
      });
    } else {
      missing.push({
        text: group.one[group.parts.indexOf(absent[0])],
        plural: false,
        feminine: group.feminine,
      });
    }
  }
  if (missing.length === 0) return base;
  const list =
    missing.length === 1
      ? missing[0].text
      : `${missing
          .slice(0, -1)
          .map((m) => m.text)
          .join(', ')} et ${missing[missing.length - 1].text}`;
  const isPlural = missing.length > 1 || missing[0].plural;
  const feminine = missing.every((m) => m.feminine);
  const participle = `caché${feminine ? 'e' : ''}${isPlural ? 's' : ''}`;
  return `${base} : ${list} ${isPlural ? 'sont' : 'est'} ${participle}`;
}
