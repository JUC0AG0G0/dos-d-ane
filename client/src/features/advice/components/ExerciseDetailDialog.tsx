import { Timer, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useApi } from '@/hooks/useApi';
import { adviceService } from '../services/advice.service';
import { ZONE_LABELS } from '../types/advice.types';
import { formatDuration, formatDurationLong } from '../utils';
import { ExerciseMedia } from './ExerciseMedia';
import { ExerciseTimer } from './ExerciseTimer';
import { ExerciseTypeBadges } from './ExerciseTypeBadges';
import { NumberMarker } from '@/components/NumberMarker';

interface ExerciseDetailDialogProps {
  /** Exercice affiché ; null ferme la fenêtre. */
  exerciseId: string | null;
  onClose: () => void;
}

export function ExerciseDetailDialog({
  exerciseId,
  onClose,
}: ExerciseDetailDialogProps) {
  return (
    <Dialog
      open={exerciseId !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-3xl">
        {exerciseId && <ExerciseDetail key={exerciseId} id={exerciseId} />}
      </DialogContent>
    </Dialog>
  );
}

function ExerciseDetail({ id }: { id: string }) {
  const [started, setStarted] = useState(false);
  const { data: exercise, error } = useApi(
    () => adviceService.exercise(id),
    [id],
    'Impossible de charger l’exercice.',
  );

  if (error) {
    return (
      <DialogHeader>
        <DialogTitle>Exercice indisponible</DialogTitle>
        <DialogDescription>{error}</DialogDescription>
      </DialogHeader>
    );
  }
  if (!exercise) {
    return (
      <div className="grid gap-4">
        <DialogTitle className="sr-only">Chargement de l’exercice</DialogTitle>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{exercise.title}</DialogTitle>
        <DialogDescription>
          {ZONE_LABELS[exercise.zone]} ·{' '}
          {formatDurationLong(exercise.durationSeconds)} · {exercise.posture}
        </DialogDescription>
        <div className="flex flex-wrap gap-1.5">
          <ExerciseTypeBadges exercise={exercise} />
        </div>
      </DialogHeader>

      <div className="grid gap-6 sm:grid-cols-[320px_1fr]">
        {started ? (
          <ExerciseTimer
            durationSeconds={exercise.durationSeconds}
            onStop={() => setStarted(false)}
          />
        ) : (
          <ExerciseMedia
            media={exercise.media}
            title={exercise.title}
            className="aspect-square w-full rounded-lg border sm:size-80"
            playable
          />
        )}
        <div className="grid content-start gap-3.5">
          <h3 className="text-[15px] font-semibold">Comment faire</h3>
          <ol className="grid gap-3.5">
            {exercise.steps.map((step, index) => (
              <li key={index} className="flex gap-3 text-sm">
                <NumberMarker value={index + 1} />
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
          {exercise.precautions && (
            <Alert variant="warning">
              <TriangleAlert />
              <AlertTitle>Précautions</AlertTitle>
              <AlertDescription>{exercise.precautions}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Fermer</Button>
        </DialogClose>
        <Button disabled={started} onClick={() => setStarted(true)}>
          <Timer />
          Démarrer · {formatDuration(exercise.durationSeconds)}
        </Button>
      </DialogFooter>
    </>
  );
}
