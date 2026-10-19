import { Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  EXERCISE_ZONES,
  ZONE_LABELS,
  type ExerciseZone,
  type MediaRef,
} from '@/features/advice';
import { adminAdviceService } from '../services/admin-advice.service';
import {
  POSTURES,
  type AdminExercise,
  type ExerciseInput,
} from '../types/admin-advice.types';
import { apiErrorMessage } from '@/utils/api-error';
import { toItems, toTexts, type EditableItem } from '@/utils/list';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EditableList } from '@/components/EditableList';
import { ErrorAlert } from '@/components/ErrorAlert';
import { FormField } from '@/components/FormField';
import { MediaField } from './MediaField';

interface ExerciseEditDialogProps {
  /** Exercice modifié ; null pour en créer un. */
  exercise: AdminExercise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Appelé après un enregistrement ou une suppression. */
  onSaved: () => void;
}

/** Fenêtre Modifier l'exercice, aussi utilisée pour la création. */
export function ExerciseEditDialog({
  exercise,
  open,
  onOpenChange,
  onSaved,
}: ExerciseEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // Pas de curseur placé d’office dans un champ : on clique pour modifier.
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-4xl"
      >
        {open && (
          <ExerciseForm
            key={exercise?.id ?? 'new'}
            exercise={exercise}
            onClose={() => onOpenChange(false)}
            onSaved={onSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ExerciseForm({
  exercise,
  onClose,
  onSaved,
}: {
  exercise: AdminExercise | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(exercise?.title ?? '');
  const [zone, setZone] = useState<ExerciseZone>(exercise?.zone ?? 'nuque');
  const [duration, setDuration] = useState(
    String(exercise?.durationSeconds ?? 30),
  );
  const [posture, setPosture] = useState(
    exercise?.posture ?? 'assis ou debout',
  );
  const [isPreventive, setPreventive] = useState(
    exercise?.isPreventive ?? true,
  );
  const [isForPain, setForPain] = useState(exercise?.isForPain ?? false);
  const [steps, setSteps] = useState<EditableItem[]>(
    toItems(exercise?.steps ?? ['']),
  );
  const [precautions, setPrecautions] = useState(exercise?.precautions ?? '');
  const [media, setMedia] = useState<MediaRef | null>(exercise?.media ?? null);
  const [published, setPublished] = useState(exercise?.status === 'published');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!isPreventive && !isForPain) {
      setError('Choisissez au moins un type.');
      return;
    }
    const input: ExerciseInput = {
      title,
      zone,
      durationSeconds: Number(duration),
      posture,
      isPreventive,
      isForPain,
      precautions,
      steps: toTexts(steps),
      mediaId: media?.id ?? null,
      status: published ? 'published' : 'draft',
    };
    setSaving(true);
    setError(null);
    try {
      if (exercise) await adminAdviceService.updateExercise(exercise.id, input);
      else await adminAdviceService.createExercise(input);
      onSaved();
      onClose();
    } catch (e) {
      setError(apiErrorMessage(e, 'L’enregistrement a échoué.'));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!exercise) return;
    try {
      await adminAdviceService.deleteExercise(exercise.id);
      onSaved();
      onClose();
    } catch (e) {
      setConfirmDelete(false);
      setError(apiErrorMessage(e, 'La suppression a échoué.'));
    }
  }

  return (
    <form onSubmit={(event) => void save(event)} className="grid gap-5">
      <DialogHeader>
        <DialogTitle>
          {exercise ? 'Modifier l’exercice' : 'Nouvel exercice'}
        </DialogTitle>
        <DialogDescription>
          Si l’exercice est publié, les changements sont visibles dès
          l’enregistrement.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 md:grid-cols-[1fr_280px]">
        <div className="grid content-start gap-4">
          <FormField label="Titre" htmlFor="exercise-title">
            <Input
              id="exercise-title"
              value={title}
              required
              maxLength={120}
              onChange={(event) => setTitle(event.target.value)}
            />
          </FormField>
          <div className="grid gap-3 sm:grid-cols-3">
            <FormField label="Partie du corps">
              <Select
                value={zone}
                onValueChange={(value) => setZone(value as ExerciseZone)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXERCISE_ZONES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {ZONE_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Durée (secondes)" htmlFor="exercise-duration">
              <Input
                id="exercise-duration"
                type="number"
                min={5}
                max={3600}
                required
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              />
            </FormField>
            <FormField label="Position">
              <Select value={posture} onValueChange={setPosture}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POSTURES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value[0].toUpperCase() + value.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <FormField
            label="Type"
            hint="Un exercice peut être à la fois préventif et utile en cas de douleur."
          >
            <div className="flex flex-wrap gap-6 pt-1">
              <Label className="font-normal">
                <Checkbox
                  checked={isPreventive}
                  onCheckedChange={(checked) => setPreventive(checked === true)}
                />
                Préventif
              </Label>
              <Label className="font-normal">
                <Checkbox
                  checked={isForPain}
                  onCheckedChange={(checked) => setForPain(checked === true)}
                />
                En cas de douleur
              </Label>
            </div>
          </FormField>
          <FormField
            label="Étapes"
            hint="Glissez une étape pour changer l’ordre. Au moins une pour publier."
          >
            <EditableList
              items={steps}
              onChange={setSteps}
              addLabel="Ajouter une étape"
              placeholder="Décrivez le mouvement"
              numbered
            />
          </FormField>
          <FormField label="Précautions" htmlFor="exercise-precautions">
            <Textarea
              id="exercise-precautions"
              value={precautions}
              maxLength={1000}
              onChange={(event) => setPrecautions(event.target.value)}
            />
          </FormField>
        </div>

        <div className="grid content-start gap-4">
          <FormField
            label="Image ou GIF"
            hint="GIF, PNG ou MP4, 5 Mo max. Évitez les visages reconnaissables, ou obtenez l’accord écrit de la personne filmée. Les métadonnées (EXIF) sont retirées à l’envoi."
          >
            <MediaField media={media} title={title} onChange={setMedia} />
          </FormField>
          <FormField
            label="Statut"
            hint="Publié : visible par tous les utilisateurs dans Conseils."
          >
            <Label className="font-medium">
              <Switch checked={published} onCheckedChange={setPublished} />
              Publié
            </Label>
          </FormField>
        </div>
      </div>

      <ErrorAlert message={error} />

      <DialogFooter className="sm:justify-between">
        {exercise ? (
          <Button
            type="button"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 />
            Supprimer
          </Button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={saving}>
            Enregistrer
          </Button>
        </div>
      </DialogFooter>

      <ConfirmDialog
        confirmLabel="Supprimer"
        open={confirmDelete}
        title={`Supprimer « ${exercise?.title} » ?`}
        description="L’exercice disparaît de Conseils et des zones de douleur, avec son média. Cette action est définitive."
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => void remove()}
      />
    </form>
  );
}
