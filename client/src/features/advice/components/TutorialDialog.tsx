import { ArrowRight, Check, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/utils/cn';
import type { PostureTip } from '../types/advice.types';
import { ExerciseMedia } from './ExerciseMedia';
import { PostureSchema } from './PostureSchema';
import { SourceLink } from './SourceLink';

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Réglages affichés, dans l'ordre : une étape par réglage. */
  tips: PostureTip[];
}

/** Tuto pas à pas de Bien s'installer : suit l'ordre des réglages affichés. */
export function TutorialDialog({
  open,
  onOpenChange,
  tips,
}: TutorialDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        {/* Repart de la première étape à chaque ouverture. */}
        {open && <Steps tips={tips} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function Steps({ tips, onDone }: { tips: PostureTip[]; onDone: () => void }) {
  const [step, setStep] = useState(0);
  const tip = tips[step];
  if (!tip) return null;
  const last = step === tips.length - 1;

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Bien s’installer · étape {step + 1} sur {tips.length}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Tuto pas à pas pour régler son poste de travail.
        </DialogDescription>
      </DialogHeader>

      <div className="flex gap-1.5" aria-hidden>
        {tips.map(({ id }, index) => (
          <span
            key={id}
            className={cn(
              'h-1.5 flex-1 rounded-full',
              index <= step ? 'bg-primary' : 'bg-border',
            )}
          />
        ))}
      </div>

      <div className="flex justify-center rounded-lg bg-muted px-4 py-4">
        {tip.media ? (
          <ExerciseMedia
            media={tip.media}
            title={tip.title}
            className="aspect-[3/2] w-full max-w-md rounded-md"
          />
        ) : (
          <PostureSchema highlight={tip.key} className="max-w-md" />
        )}
      </div>

      <div className="grid gap-2">
        <h3 className="text-lg font-semibold">{tip.title}</h3>
        <p className="text-sm text-muted-foreground">{tip.tutorialText}</p>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          {tip.sourceUrl && 'Source :'}
          <SourceLink sourceLabel={tip.sourceLabel} sourceUrl={tip.sourceUrl} />
        </p>
      </div>

      <DialogFooter className="sm:justify-between">
        <Button variant="ghost" onClick={onDone}>
          Passer le tuto
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            <ChevronLeft />
            Précédent
          </Button>
          {last ? (
            <Button onClick={onDone}>
              <Check />
              Terminer
            </Button>
          ) : (
            <Button onClick={() => setStep(step + 1)}>
              Suivant
              <ArrowRight />
            </Button>
          )}
        </div>
      </DialogFooter>
    </>
  );
}
