import type {
  ContentStatus,
  ExerciseZone,
  PostureTipKey,
} from './advice.constants.js';
import type {
  AdminExerciseDto,
  AdminPainZoneDto,
  AdminPostureTipDto,
  ExerciseSummaryDto,
  PainZoneDto,
} from './dto/advice-responses.dto.js';

/** Sélections Prisma communes et conversion des lignes en réponses de l'API. */

const mediaRef = { select: { id: true, mimeType: true } } as const;

export const exerciseSummarySelect = {
  id: true,
  title: true,
  zone: true,
  isPreventive: true,
  isForPain: true,
  durationSeconds: true,
  posture: true,
  media: mediaRef,
} as const;

export const exerciseSelect = {
  ...exerciseSummarySelect,
  precautions: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  steps: { select: { text: true }, orderBy: { position: 'asc' } },
} as const;

export const postureTipSelect = {
  id: true,
  key: true,
  title: true,
  shortText: true,
  tutorialText: true,
  sourceLabel: true,
  sourceUrl: true,
  isVisible: true,
  updatedAt: true,
  media: mediaRef,
} as const;

/** Exercices conseillés d'une zone : publiés seulement, dans l'ordre. */
const zoneExercises = {
  where: { exercise: { status: 'published' } },
  orderBy: { position: 'asc' },
  select: { exercise: { select: exerciseSummarySelect } },
} as const;

export const painZoneSelect = {
  id: true,
  name: true,
  intro: true,
  sourceLabel: true,
  sourceUrl: true,
  status: true,
  updatedAt: true,
  advices: {
    select: { kind: true, text: true },
    orderBy: { position: 'asc' },
  },
  exercises: zoneExercises,
} as const;

interface MediaRow {
  id: string;
  mimeType: string;
}

interface ExerciseSummaryRow {
  id: string;
  title: string;
  zone: string;
  isPreventive: boolean;
  isForPain: boolean;
  durationSeconds: number;
  posture: string;
  media: MediaRow | null;
}

interface ExerciseRow extends ExerciseSummaryRow {
  precautions: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  steps: { text: string }[];
}

export const toExerciseSummary = (
  row: ExerciseSummaryRow,
): ExerciseSummaryDto => ({
  ...row,
  zone: row.zone as ExerciseZone,
});

export const toAdminExercise = ({
  steps,
  ...row
}: ExerciseRow): AdminExerciseDto => ({
  ...row,
  zone: row.zone as ExerciseZone,
  status: row.status as ContentStatus,
  steps: steps.map((s) => s.text),
});

interface PostureTipRow {
  id: string;
  key: string;
  title: string;
  shortText: string;
  tutorialText: string;
  sourceLabel: string | null;
  sourceUrl: string | null;
  isVisible: boolean;
  updatedAt: Date;
  media: MediaRow | null;
}

export const toAdminPostureTip = (row: PostureTipRow): AdminPostureTipDto => ({
  ...row,
  key: row.key as PostureTipKey,
});

interface PainZoneRow {
  id: string;
  name: string;
  intro: string;
  sourceLabel: string | null;
  sourceUrl: string | null;
  status: string;
  updatedAt: Date;
  advices: { kind: string; text: string }[];
  exercises: { exercise: ExerciseSummaryRow }[];
}

export const toAdminPainZone = ({
  advices,
  exercises,
  ...row
}: PainZoneRow): AdminPainZoneDto => ({
  ...row,
  status: row.status as ContentStatus,
  helps: advices.filter((a) => a.kind === 'helps').map((a) => a.text),
  avoid: advices.filter((a) => a.kind === 'avoid').map((a) => a.text),
  exercises: exercises.map((e) => toExerciseSummary(e.exercise)),
});

export const toPainZone = (row: PainZoneRow): PainZoneDto => {
  const {
    status: _status,
    updatedAt: _updatedAt,
    ...zone
  } = toAdminPainZone(row);
  return zone;
};
