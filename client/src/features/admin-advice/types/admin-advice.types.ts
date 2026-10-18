import type {
  Exercise,
  ExerciseZone,
  MediaMimeType,
  PainZone,
  PostureTip,
} from '@/features/advice';

export type ContentStatus = 'draft' | 'published';

export const STATUS_LABELS: Record<ContentStatus, string> = {
  published: 'Publié',
  draft: 'Brouillon',
};

export const POSTURES = ['assis', 'debout', 'assis ou debout'] as const;

export interface AdminExercise extends Exercise {
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPostureTip extends PostureTip {
  isVisible: boolean;
  updatedAt: string;
}

export interface AdminPainZone extends PainZone {
  status: ContentStatus;
  updatedAt: string;
}

export interface AdminPainZones {
  whenToSeeDoctor: string;
  zones: AdminPainZone[];
}

export interface UploadedMedia {
  id: string;
  mimeType: MediaMimeType;
  sizeBytes: number;
  width: number | null;
  height: number | null;
}

export interface ExerciseInput {
  title: string;
  zone: ExerciseZone;
  durationSeconds: number;
  posture: string;
  isPreventive: boolean;
  isForPain: boolean;
  precautions: string;
  steps: string[];
  mediaId: string | null;
  status: ContentStatus;
}

export interface PostureTipInput {
  title: string;
  shortText: string;
  tutorialText: string;
  sourceLabel: string | null;
  sourceUrl: string | null;
  isVisible: boolean;
}

export interface PainZoneInput {
  name: string;
  intro: string;
  helps: string[];
  avoid: string[];
  sourceLabel: string | null;
  sourceUrl: string | null;
  exerciseIds: string[];
  status: ContentStatus;
}
