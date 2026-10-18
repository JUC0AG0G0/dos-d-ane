import { useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
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
import {
  POSTURE_TIP_ELEMENTS,
  PostureSchema,
  type PostureTipKey,
} from '@/features/advice';
import { adminAdviceService } from '../services/admin-advice.service';
import type { AdminPostureTip } from '../types/admin-advice.types';
import { errorMessage, sourceInput } from '../utils';
import { ErrorAlert } from './ErrorAlert';
import { Field } from './Field';
import { SourceFields } from './SourceFields';

interface PostureTipEditDialogProps {
  tip: AdminPostureTip | null;
  /** Les 6 réglages dans l'ordre du tableau, pour numéroter l'aperçu. */
  tips: AdminPostureTip[];
  onClose: () => void;
  onSaved: (tip: AdminPostureTip) => void;
}

/** Fenêtre Modifier le réglage : l'élément est en lecture seule. */
export function PostureTipEditDialog({
  tip,
  tips,
  onClose,
  onSaved,
}: PostureTipEditDialogProps) {
  return (
    <Dialog open={tip !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        // Pas de curseur placé d’office dans un champ : on clique pour modifier.
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-3xl"
      >
        {tip && (
          <TipForm
            key={tip.id}
            tip={tip}
            tips={tips}
            onClose={onClose}
            onSaved={onSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TipForm({
  tip,
  tips,
  onClose,
  onSaved,
}: Omit<PostureTipEditDialogProps, 'tip'> & { tip: AdminPostureTip }) {
  const element = POSTURE_TIP_ELEMENTS[tip.key];
  const [title, setTitle] = useState(tip.title);
  const [shortText, setShortText] = useState(tip.shortText);
  const [tutorialText, setTutorialText] = useState(tip.tutorialText);
  const [source, setSource] = useState({
    label: tip.sourceLabel ?? '',
    url: tip.sourceUrl ?? '',
  });
  const [isVisible, setVisible] = useState(tip.isVisible);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Aperçu avec l'affichage choisi dans la fenêtre, avant enregistrement.
  const markers: PostureTipKey[] = tips
    .filter((t) => (t.id === tip.id ? isVisible : t.isVisible))
    .map((t) => t.key);
  const number = markers.indexOf(tip.key) + 1;

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      onSaved(
        await adminAdviceService.updatePostureTip(tip.id, {
          title,
          shortText,
          tutorialText,
          ...sourceInput(source.label, source.url),
          isVisible,
        }),
      );
      onClose();
    } catch (e) {
      setError(errorMessage(e, 'L’enregistrement a échoué.'));
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    setError(null);
    try {
      const saved = await adminAdviceService.resetPostureTip(tip.id);
      setTitle(saved.title);
      setShortText(saved.shortText);
      setTutorialText(saved.tutorialText);
      setSource({ label: saved.sourceLabel ?? '', url: saved.sourceUrl ?? '' });
      onSaved(saved);
    } catch (e) {
      setError(
        errorMessage(e, 'Les textes par défaut n’ont pas été rétablis.'),
      );
    }
  }

  return (
    <form onSubmit={(event) => void save(event)} className="grid gap-5">
      <DialogHeader>
        <DialogTitle>Modifier « {tip.title} »</DialogTitle>
        <DialogDescription>
          Visible sur la page Bien s’installer et dans le tuto.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="grid content-start gap-4">
          <Field
            label="Élément"
            hint="L’élément, son icône et son repère sur le schéma ne se changent pas."
          >
            <div className="flex items-center gap-3 rounded-md bg-muted px-3 py-2.5">
              <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <element.icon className="size-4" />
              </span>
              <span className="flex-1 text-sm font-medium">
                {element.label}
              </span>
              <Badge variant="outline">Fixe</Badge>
            </div>
          </Field>
          <Field label="Titre" htmlFor="tip-title">
            <Input
              id="tip-title"
              value={title}
              required
              maxLength={120}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Field>
          <Field
            label="Texte court"
            htmlFor="tip-short"
            hint="Affiché dans la liste de la page Bien s’installer."
          >
            <Textarea
              id="tip-short"
              value={shortText}
              required
              maxLength={300}
              onChange={(event) => setShortText(event.target.value)}
            />
          </Field>
          <Field label="Texte du tuto" htmlFor="tip-tutorial">
            <Textarea
              id="tip-tutorial"
              value={tutorialText}
              required
              maxLength={1500}
              className="min-h-24"
              onChange={(event) => setTutorialText(event.target.value)}
            />
          </Field>
          <SourceFields
            label={source.label}
            url={source.url}
            onChange={setSource}
          />
        </div>

        <div className="grid content-start gap-4">
          <Field
            label="Repère sur le schéma"
            hint={
              number
                ? `Repère n° ${number}. Pour changer sa place, glissez sa ligne dans le tableau.`
                : 'Masqué : pas de repère sur le schéma.'
            }
          >
            <div className="rounded-md bg-muted px-3 py-2.5">
              <PostureSchema markers={markers} highlight={tip.key} />
            </div>
          </Field>
          <Field
            label="Affichage"
            hint="Masqué, il disparaît de la page, du schéma et du tuto."
          >
            <Label className="font-medium">
              <Switch checked={isVisible} onCheckedChange={setVisible} />
              Affiché
            </Label>
          </Field>
        </div>
      </div>

      <ErrorAlert message={error} />

      <DialogFooter className="sm:justify-between">
        <Button type="button" variant="ghost" onClick={() => void reset()}>
          Rétablir les textes par défaut
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={saving}>
            Enregistrer
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}
