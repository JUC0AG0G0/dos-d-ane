import { Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { ExerciseSummary } from '@/features/advice';
import { adminAdviceService } from '../services/admin-advice.service';
import type { AdminPainZone, PainZoneInput } from '../types/admin-advice.types';
import { apiErrorMessage } from '@/utils/api-error';
import { toItems, toTexts } from '@/utils/list';
import { sourceInput } from '../utils';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EditableList } from '@/components/EditableList';
import { ErrorAlert } from '@/components/ErrorAlert';
import { ExercisePicker } from './ExercisePicker';
import { FormField } from '@/components/FormField';
import { SourceFields } from './SourceFields';

interface PainZoneEditDialogProps {
  /** Zone modifiée ; null pour en créer une. */
  zone: AdminPainZone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Exercices publiés proposés comme exercices conseillés. */
  published: ExerciseSummary[];
  onSaved: () => void;
}

/** Fenêtre Modifier la zone, aussi utilisée pour la création. */
export function PainZoneEditDialog({
  zone,
  open,
  onOpenChange,
  published,
  onSaved,
}: PainZoneEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // Pas de curseur placé d’office dans un champ : on clique pour modifier.
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-4xl"
      >
        {open && (
          <ZoneForm
            key={zone?.id ?? 'new'}
            zone={zone}
            published={published}
            onClose={() => onOpenChange(false)}
            onSaved={onSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ZoneForm({
  zone,
  published,
  onClose,
  onSaved,
}: {
  zone: AdminPainZone | null;
  published: ExerciseSummary[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(zone?.name ?? '');
  const [intro, setIntro] = useState(zone?.intro ?? '');
  const [helps, setHelps] = useState(toItems(zone?.helps ?? []));
  const [avoid, setAvoid] = useState(toItems(zone?.avoid ?? []));
  const [source, setSource] = useState({
    label: zone?.sourceLabel ?? '',
    url: zone?.sourceUrl ?? '',
  });
  const [exercises, setExercises] = useState(zone?.exercises ?? []);
  const [isPublished, setPublished] = useState(zone?.status === 'published');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    const input: PainZoneInput = {
      name,
      intro,
      helps: toTexts(helps),
      avoid: toTexts(avoid),
      ...sourceInput(source.label, source.url),
      exerciseIds: exercises.map((e) => e.id),
      status: isPublished ? 'published' : 'draft',
    };
    setSaving(true);
    setError(null);
    try {
      if (zone) await adminAdviceService.updatePainZone(zone.id, input);
      else await adminAdviceService.createPainZone(input);
      onSaved();
      onClose();
    } catch (e) {
      setError(apiErrorMessage(e, 'L’enregistrement a échoué.'));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!zone) return;
    try {
      await adminAdviceService.deletePainZone(zone.id);
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
          {zone ? `Modifier la zone « ${zone.name} »` : 'Nouvelle zone'}
        </DialogTitle>
        <DialogDescription>
          Visible sur la page En cas de douleur quand on choisit cette zone.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 md:grid-cols-[1fr_360px]">
        <div className="grid content-start gap-4">
          <FormField label="Zone" htmlFor="zone-name">
            <Input
              id="zone-name"
              value={name}
              required
              maxLength={60}
              onChange={(event) => setName(event.target.value)}
            />
          </FormField>
          <FormField label="Introduction" htmlFor="zone-intro">
            <Textarea
              id="zone-intro"
              value={intro}
              maxLength={500}
              onChange={(event) => setIntro(event.target.value)}
            />
          </FormField>
          <FormField label="Ce qui aide">
            <EditableList
              items={helps}
              onChange={setHelps}
              addLabel="Ajouter un point"
            />
          </FormField>
          <FormField label="À éviter">
            <EditableList
              items={avoid}
              onChange={setAvoid}
              addLabel="Ajouter un point"
            />
          </FormField>
          <SourceFields
            label={source.label}
            url={source.url}
            onChange={setSource}
          />
        </div>

        <div className="grid content-start gap-4">
          <FormField
            label="Exercices conseillés"
            hint="3 au maximum. Une fois 3 choisis, retirez-en un pour en ajouter un autre. Les brouillons n’apparaissent pas."
          >
            <ExercisePicker
              selected={exercises}
              published={published}
              onChange={setExercises}
            />
          </FormField>
          <FormField label="Statut">
            <Label className="font-medium">
              <Switch checked={isPublished} onCheckedChange={setPublished} />
              Publié
            </Label>
          </FormField>
        </div>
      </div>

      <ErrorAlert message={error} />

      <DialogFooter className="sm:justify-between">
        {zone ? (
          <Button
            type="button"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 />
            Supprimer la zone
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
        title={`Supprimer la zone « ${zone?.name} » ?`}
        description="La zone et ses conseils disparaissent de la page En cas de douleur. Les exercices ne sont pas supprimés. Cette action est définitive."
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => void remove()}
      />
    </form>
  );
}
