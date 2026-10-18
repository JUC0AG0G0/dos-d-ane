import { ChevronLeft, Timer, TriangleAlert } from 'lucide-react';
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
import { useApi } from '../hooks/useApi';
import { adviceService } from '../services/advice.service';
import { ZONE_LABELS } from '../types/advice.types';
import { formatDuration, formatDurationLong } from '../utils';
import { ExerciseMedia } from './ExerciseMedia';
import { ExerciseTypeBadges } from './ExerciseTypeBadges';
import { NumberMarker } from './NumberMarker';

interface ExerciseDetailDialogProps {
  /** Exercice affiché ; null ferme la fenêtre. */
  exerciseId: string | null;
  /** Exercice précédent dans la liste d'où l'on vient, s'il y en a un. */
  previousId?: string | null;
  onNavigate: (id: string) => void;
  onClose: () => void;
}

export function ExerciseDetailDialog({
  exerciseId,
  previousId,
  onNavigate,
  onClose,
}: ExerciseDetailDialogProps) {
  return (
    <Dialog
      open={exerciseId !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-3xl">
        {exerciseId && (
          <ExerciseDetail
            key={exerciseId}
            id={exerciseId}
            previousId={previousId}
            onNavigate={onNavigate}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ExerciseDetail({
  id,
  previousId,
  onNavigate,
}: {
  id: string;
  previousId?: string | null;
  onNavigate: (id: string) => void;
}) {
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
        <ExerciseMedia
          media={exercise.media}
          title={exercise.title}
          className="aspect-square w-full rounded-lg border sm:size-80"
          playable
        />
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

      <DialogFooter className="sm:justify-between">
        <Button
          variant="ghost"
          disabled={!previousId}
          onClick={() => previousId && onNavigate(previousId)}
        >
          <ChevronLeft />
          Exercice précédent
        </Button>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <DialogClose asChild>
            <Button variant="outline">Fermer</Button>
          </DialogClose>
          {/* Pas de minuteur dans cette version (hors périmètre de la spec). */}
          <span title="Le minuteur arrive dans une prochaine version">
            <Button disabled className="w-full">
              <Timer />
              Démarrer · {formatDuration(exercise.durationSeconds)}
            </Button>
          </span>
        </div>
      </DialogFooter>
    </>
  );
}
