import { Ellipsis, Pencil, Trash2, TriangleAlert } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  ExerciseMedia,
  SourceLink,
  type ExerciseSummary,
} from '@/features/advice';
import { adminAdviceService } from '../services/admin-advice.service';
import type {
  AdminPainZone,
  AdminPainZones,
} from '../types/admin-advice.types';
import { apiErrorMessage } from '@/utils/api-error';
import { formatShortDate } from '@/utils/format';
import { move } from '@/utils/list';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ErrorAlert } from '@/components/ErrorAlert';
import { PainZoneEditDialog } from './PainZoneEditDialog';
import { SortableItem, SortableList } from '@/components/Sortable';
import { StatusBadge } from './StatusBadge';

interface PainZonesTabProps {
  data: AdminPainZones;
  onChange: (data: AdminPainZones) => void;
  reload: () => void;
  /** Exercices publiés, pour le choix des exercices conseillés. */
  published: ExerciseSummary[];
  creating: boolean;
  onCreatingChange: (open: boolean) => void;
}

const points = (count: number) => `${count} point${count > 1 ? 's' : ''}`;

/** Onglet En cas de douleur : message « Quand consulter » et zones ordonnées. */
export function PainZonesTab({
  data,
  onChange,
  reload,
  published,
  creating,
  onCreatingChange,
}: PainZonesTabProps) {
  const [editing, setEditing] = useState<AdminPainZone | null>(null);
  const [deleting, setDeleting] = useState<AdminPainZone | null>(null);
  const [editingMessage, setEditingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { zones } = data;

  async function reorder(from: number, to: number) {
    const previous = data;
    const next = move(zones, from, to);
    onChange({ ...data, zones: next });
    setError(null);
    try {
      onChange(await adminAdviceService.orderPainZones(next.map((z) => z.id)));
    } catch (e) {
      onChange(previous);
      setError(apiErrorMessage(e, 'Le nouvel ordre n’a pas été enregistré.'));
    }
  }

  async function remove(zone: AdminPainZone) {
    setDeleting(null);
    setError(null);
    try {
      await adminAdviceService.deletePainZone(zone.id);
      reload();
    } catch (e) {
      setError(apiErrorMessage(e, 'La suppression a échoué.'));
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex items-center gap-4 rounded-xl border border-warning-border bg-warning px-5 py-4">
        <TriangleAlert className="size-[18px] shrink-0 text-warning-icon" />
        <div className="grid flex-1 gap-1 text-warning-foreground">
          <span className="text-sm font-semibold">
            Message « Quand consulter un médecin »
          </span>
          <span className="text-[13px]">
            Affiché en haut de la page En cas de douleur, pour toutes les zones.
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditingMessage(true)}
        >
          <Pencil />
          Modifier
        </Button>
      </div>

      <ErrorAlert message={error} />

      <Card>
        <CardHeader>
          <CardTitle>Zones</CardTitle>
          <CardDescription>
            {zones.length} zone{zones.length > 1 && 's'} · jusqu’à 3 exercices
            conseillés par zone, affichés dans l’ordre choisi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Ordre</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Ce qui aide</TableHead>
                <TableHead>À éviter</TableHead>
                <TableHead>Exercices conseillés</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Modifié le</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Aucune zone pour le moment.
                  </TableCell>
                </TableRow>
              )}
              <SortableList
                ids={zones.map((zone) => zone.id)}
                onMove={(from, to) => void reorder(from, to)}
              >
                {zones.map((zone, index) => (
                  <ZoneRow
                    key={zone.id}
                    zone={zone}
                    position={index + 1}
                    onEdit={() => setEditing(zone)}
                    onDelete={() => setDeleting(zone)}
                  />
                ))}
              </SortableList>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PainZoneEditDialog
        zone={editing}
        open={editing !== null || creating}
        onOpenChange={(open) => {
          if (open) return;
          setEditing(null);
          onCreatingChange(false);
        }}
        published={published}
        onSaved={reload}
      />
      <ConfirmDialog
        confirmLabel="Supprimer"
        open={deleting !== null}
        title={`Supprimer la zone « ${deleting?.name} » ?`}
        description="La zone et ses conseils disparaissent de la page En cas de douleur. Les exercices ne sont pas supprimés. Cette action est définitive."
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && void remove(deleting)}
      />
      <DoctorMessageDialog
        open={editingMessage}
        text={data.whenToSeeDoctor}
        onClose={() => setEditingMessage(false)}
        onSaved={(whenToSeeDoctor) => onChange({ ...data, whenToSeeDoctor })}
      />
    </div>
  );
}

function ZoneRow({
  zone,
  position,
  onEdit,
  onDelete,
}: {
  zone: AdminPainZone;
  position: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <SortableItem id={zone.id} as="tr" onClick={onEdit}>
      {(handle) => (
        <>
          <TableCell>
            <div className="flex items-center gap-1.5">
              {handle}
              <span className="font-medium">{position}</span>
            </div>
          </TableCell>
          <TableCell className="font-medium">{zone.name}</TableCell>
          <TableCell className="text-muted-foreground">
            {points(zone.helps.length)}
          </TableCell>
          <TableCell className="text-muted-foreground">
            {points(zone.avoid.length)}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1.5">
              {zone.exercises.map((exercise) => (
                <ExerciseMedia
                  key={exercise.id}
                  media={exercise.media}
                  title={exercise.title}
                  className="size-8 rounded-md [&_svg]:size-4"
                />
              ))}
              <span
                className={
                  zone.exercises.length === 3
                    ? 'font-medium'
                    : 'font-medium text-muted-foreground'
                }
                title={zone.exercises.map((e) => e.title).join(', ')}
              >
                {zone.exercises.length} / 3
              </span>
            </div>
          </TableCell>
          <TableCell className="whitespace-normal">
            <SourceLink
              onClick={(event) => event.stopPropagation()}
              sourceLabel={zone.sourceLabel}
              sourceUrl={zone.sourceUrl}
            />
          </TableCell>
          <TableCell>
            <StatusBadge status={zone.status} />
          </TableCell>
          <TableCell className="text-muted-foreground">
            {formatShortDate(zone.updatedAt)}
          </TableCell>
          <TableCell>
            <div
              className="flex justify-end gap-1"
              onClick={(event) => event.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onEdit}
                aria-label={`Modifier ${zone.name}`}
              >
                <Pencil />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Plus d’actions"
                  >
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem variant="destructive" onSelect={onDelete}>
                    <Trash2 />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableCell>
        </>
      )}
    </SortableItem>
  );
}

function DoctorMessageDialog({
  open,
  text,
  onClose,
  onSaved,
}: {
  open: boolean;
  text: string;
  onClose: () => void;
  onSaved: (text: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent
        // Pas de curseur placé d’office dans un champ : on clique pour modifier.
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="sm:max-w-xl"
      >
        {open && (
          <DoctorMessageForm text={text} onClose={onClose} onSaved={onSaved} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function DoctorMessageForm({
  text,
  onClose,
  onSaved,
}: {
  text: string;
  onClose: () => void;
  onSaved: (text: string) => void;
}) {
  const [value, setValue] = useState(text);
  const [error, setError] = useState<string | null>(null);

  async function save(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const saved = await adminAdviceService.updateWhenToSeeDoctor(value);
      onSaved(saved.text);
      onClose();
    } catch (e) {
      setError(apiErrorMessage(e, 'L’enregistrement a échoué.'));
    }
  }

  return (
    <form onSubmit={(event) => void save(event)} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>Quand consulter un médecin</DialogTitle>
        <DialogDescription>
          Un seul texte, affiché en haut de En cas de douleur quelle que soit la
          zone.
        </DialogDescription>
      </DialogHeader>
      <Textarea
        value={value}
        required
        maxLength={1000}
        className="min-h-28"
        aria-label="Message"
        onChange={(event) => setValue(event.target.value)}
      />
      <ErrorAlert message={error} />
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit">Enregistrer</Button>
      </DialogFooter>
    </form>
  );
}
