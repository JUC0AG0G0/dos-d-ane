import { Timer } from 'lucide-react';
import { formatDuration } from '../utils';
import { ZONE_LABELS, type ExerciseSummary } from '../types/advice.types';
import { ExerciseMedia } from './ExerciseMedia';
import { ExerciseTypeBadges } from './ExerciseTypeBadges';

export function ExerciseCard({
  exercise,
  onOpen,
}: {
  exercise: ExerciseSummary;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col overflow-hidden rounded-xl border bg-card text-left shadow-xs transition-colors hover:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <ExerciseMedia
        media={exercise.media}
        title={exercise.title}
        className="aspect-[15/8] w-full"
        showBadge
      />
      <div className="grid gap-2 px-4 pt-3.5 pb-4">
        <h3 className="text-[15px] font-semibold">{exercise.title}</h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Timer className="size-3.5" aria-hidden />
          {formatDuration(exercise.durationSeconds)} ·{' '}
          {ZONE_LABELS[exercise.zone]}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <ExerciseTypeBadges exercise={exercise} />
        </div>
      </div>
    </button>
  );
}
