import {
  Ellipsis,
  Eye,
  EyeOff,
  ImageIcon,
  Pencil,
  Search,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  EXERCISE_ZONES,
  ExerciseMedia,
  ExerciseTypeBadges,
  formatDuration,
  ZONE_LABELS,
} from '@/features/advice';
import { adminAdviceService } from '../services/admin-advice.service';
import type { AdminExercise } from '../types/admin-advice.types';
import { errorMessage, formatShortDate } from '../utils';
import { ConfirmDelete } from './ConfirmDelete';
import { ErrorAlert } from './ErrorAlert';
import { ExerciseEditDialog } from './ExerciseEditDialog';
import { StatusBadge } from './StatusBadge';

const ALL = 'tous';

interface ExercisesTabProps {
  exercises: AdminExercise[];
  reload: () => void;
  /** Création demandée par le bouton « Nouvel exercice » de l'en-tête. */
  creating: boolean;
  onCreatingChange: (open: boolean) => void;
}

/** Onglet Exercices : recherche, filtres, tableau et fenêtre de modification. */
export function ExercisesTab({
  exercises,
  reload,
  creating,
  onCreatingChange,
}: ExercisesTabProps) {
  const [search, setSearch] = useState('');
  const [zone, setZone] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [editing, setEditing] = useState<AdminExercise | null>(null);
  const [deleting, setDeleting] = useState<AdminExercise | null>(null);
  const [error, setError] = useState<string | null>(null);

  const query = search.trim().toLocaleLowerCase('fr');
  const shown = exercises.filter(
    (e) =>
      (!query || e.title.toLocaleLowerCase('fr').includes(query)) &&
      (zone === ALL || e.zone === zone) &&
      (type === ALL ||
        (type === 'preventive' ? e.isPreventive : e.isForPain)) &&
      (status === ALL || e.status === status),
  );
  const published = exercises.filter((e) => e.status === 'published').length;

  async function togglePublished(exercise: AdminExercise) {
    setError(null);
    try {
      await adminAdviceService.updateExercise(exercise.id, {
        status: exercise.status === 'published' ? 'draft' : 'published',
      });
      reload();
    } catch (e) {
      setError(errorMessage(e, 'Le changement de statut a échoué.'));
    }
  }

  async function remove(exercise: AdminExercise) {
    setDeleting(null);
    setError(null);
    try {
      await adminAdviceService.deleteExercise(exercise.id);
      reload();
    } catch (e) {
      setError(errorMessage(e, 'La suppression a échoué.'));
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un exercice"
            aria-label="Rechercher un exercice"
            className="pl-9"
          />
        </div>
        <FilterSelect
          value={zone}
          onChange={setZone}
          label="Partie du corps"
          options={[
            [ALL, 'Partie du corps : toutes'],
            ...EXERCISE_ZONES.map((z): [string, string] => [z, ZONE_LABELS[z]]),
          ]}
        />
        <FilterSelect
          value={type}
          onChange={setType}
          label="Type"
          options={[
            [ALL, 'Type : tous'],
            ['preventive', 'Préventif'],
            ['pain', 'En cas de douleur'],
          ]}
        />
        <FilterSelect
          value={status}
          onChange={setStatus}
          label="Statut"
          options={[
            [ALL, 'Statut : tous'],
            ['published', 'Publié'],
            ['draft', 'Brouillon'],
          ]}
        />
      </div>

      <ErrorAlert message={error} />

      <Card>
        <CardHeader>
          <CardTitle>Exercices</CardTitle>
          <CardDescription>
            {exercises.length} exercice{exercises.length > 1 && 's'} ·{' '}
            {published} publié{published > 1 && 's'} ·{' '}
            {exercises.length - published} brouillon
            {exercises.length - published > 1 && 's'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16" />
                <TableHead>Titre</TableHead>
                <TableHead>Partie du corps</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Média</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Modifié le</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Aucun exercice pour ces filtres
                  </TableCell>
                </TableRow>
              )}
              {shown.map((exercise) => (
                <TableRow key={exercise.id}>
                  <TableCell>
                    <ExerciseMedia
                      media={exercise.media}
                      title={exercise.title}
                      className="size-11 rounded-md"
                    />
                  </TableCell>
                  <TableCell className="font-medium whitespace-normal">
                    {exercise.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {ZONE_LABELS[exercise.zone]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <ExerciseTypeBadges exercise={exercise} />
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDuration(exercise.durationSeconds)}
                  </TableCell>
                  <TableCell>
                    {exercise.media ? (
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="size-4 text-muted-foreground" />
                        {exercise.media.mimeType === 'image/gif'
                          ? 'GIF'
                          : exercise.media.mimeType === 'video/mp4'
                            ? 'Vidéo'
                            : 'Image'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-warning-foreground">
                        <TriangleAlert className="size-4 text-warning-icon" />
                        Aucun
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={exercise.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatShortDate(exercise.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setEditing(exercise)}
                        aria-label={`Modifier ${exercise.title}`}
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
                          <DropdownMenuItem
                            onSelect={() => void togglePublished(exercise)}
                          >
                            {exercise.status === 'published' ? (
                              <>
                                <EyeOff />
                                Repasser en brouillon
                              </>
                            ) : (
                              <>
                                <Eye />
                                Publier
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => setDeleting(exercise)}
                          >
                            <Trash2 />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ExerciseEditDialog
        exercise={editing}
        open={editing !== null || creating}
        onOpenChange={(open) => {
          if (open) return;
          setEditing(null);
          onCreatingChange(false);
        }}
        onSaved={reload}
      />
      <ConfirmDelete
        open={deleting !== null}
        title={`Supprimer « ${deleting?.title} » ?`}
        description="L’exercice disparaît de Conseils et des zones de douleur, avec son média. Cette action est définitive."
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && void remove(deleting)}
      />
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: [string, string][];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-52" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(([optionValue, optionLabel]) => (
          <SelectItem key={optionValue} value={optionValue}>
            {optionLabel}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
