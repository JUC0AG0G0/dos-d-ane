import { CircleCheck, Pause, Play, RotateCcw, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCountdown } from '../hooks/useCountdown';

const format = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

/**
 * Minuteur affiché à la place du média quand on démarre un exercice :
 * cercle de progression, temps restant, pause / reprise, recommencer.
 * Fermer la fenêtre arrête le minuteur.
 */
export function ExerciseTimer({
  durationSeconds,
  onStop,
}: {
  durationSeconds: number;
  /** Ferme le minuteur et revient au média. */
  onStop: () => void;
}) {
  // Lancé dès l'appui sur « Démarrer ».
  const timer = useCountdown(durationSeconds, true);
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const done = timer.status === 'done';

  return (
    <div className="flex aspect-square w-full flex-col items-center justify-center gap-5 rounded-lg border bg-muted p-6 sm:size-80">
      <div className="relative size-44">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - timer.progress)}
            className="transition-[stroke-dashoffset] duration-200 ease-linear"
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          aria-live="polite"
        >
          {done ? (
            <>
              <CircleCheck className="size-10 text-primary" aria-hidden />
              <span className="mt-1 text-sm font-medium">Terminé !</span>
            </>
          ) : (
            <span className="text-4xl font-semibold tabular-nums">
              {format(timer.remainingSeconds)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {timer.status === 'running' && (
          <Button variant="outline" onClick={timer.pause}>
            <Pause />
            Pause
          </Button>
        )}
        {timer.status === 'paused' && (
          <Button onClick={timer.resume}>
            <Play />
            Reprendre
          </Button>
        )}
        {(timer.status === 'paused' || done) && (
          <Button variant="outline" onClick={timer.start}>
            <RotateCcw />
            Recommencer
          </Button>
        )}
        <Button variant="ghost" onClick={onStop}>
          <Square />
          Arrêter
        </Button>
      </div>
    </div>
  );
}
