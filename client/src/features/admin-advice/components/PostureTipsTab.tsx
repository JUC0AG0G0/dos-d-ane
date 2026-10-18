import { Pencil } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  POSTURE_TIP_ELEMENTS,
  PostureSchema,
  SourceLink,
} from '@/features/advice';
import { cn } from '@/utils/cn';
import { adminAdviceService } from '../services/admin-advice.service';
import type { AdminPostureTip } from '../types/admin-advice.types';
import { apiErrorMessage } from '@/utils/api-error';
import { move } from '@/utils/list';
import { ErrorAlert } from '@/components/ErrorAlert';
import { PostureTipEditDialog } from './PostureTipEditDialog';
import { SortableItem, SortableList } from '@/components/Sortable';

interface PostureTipsTabProps {
  tips: AdminPostureTip[];
  onChange: (tips: AdminPostureTip[]) => void;
}

/**
 * Onglet Bien s'installer (réglages du poste) : les 6 éléments sont fixes (ni création ni
 * suppression). L'ordre se change par glisser-déposer, enregistré au dépôt ;
 * le schéma est renuméroté en direct.
 */
export function PostureTipsTab({ tips, onChange }: PostureTipsTabProps) {
  const [editing, setEditing] = useState<AdminPostureTip | null>(null);
  const [error, setError] = useState<string | null>(null);
  const visible = tips.filter((tip) => tip.isVisible);

  async function reorder(from: number, to: number) {
    const previous = tips;
    const next = move(tips, from, to);
    onChange(next);
    setError(null);
    try {
      onChange(
        await adminAdviceService.orderPostureTips(next.map((t) => t.id)),
      );
    } catch (e) {
      onChange(previous);
      setError(apiErrorMessage(e, 'Le nouvel ordre n’a pas été enregistré.'));
    }
  }

  async function setVisible(tip: AdminPostureTip, isVisible: boolean) {
    setError(null);
    try {
      const saved = await adminAdviceService.updatePostureTip(tip.id, {
        isVisible,
      });
      onChange(tips.map((t) => (t.id === saved.id ? saved : t)));
    } catch (e) {
      setError(apiErrorMessage(e, 'Le changement n’a pas été enregistré.'));
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <ErrorAlert message={error} />
      <div className="grid items-start gap-6 2xl:grid-cols-[1fr_440px]">
        <Card>
          <CardHeader>
            <CardTitle>Réglages du poste</CardTitle>
            <CardDescription>
              Les 6 éléments du poste sont fixes. Glissez une ligne pour changer
              l’ordre, masquez ceux à ne pas afficher.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Ordre</TableHead>
                  <TableHead className="w-12" />
                  <TableHead>Titre</TableHead>
                  <TableHead>Texte</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Affiché</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableList
                  ids={tips.map((tip) => tip.id)}
                  onMove={(from, to) => void reorder(from, to)}
                >
                  {tips.map((tip) => (
                    <TipRow
                      key={tip.id}
                      tip={tip}
                      number={visible.indexOf(tip) + 1}
                      onEdit={() => setEditing(tip)}
                      onVisible={(value) => void setVisible(tip, value)}
                    />
                  ))}
                </SortableList>
              </TableBody>
            </Table>
            <p className="text-xs text-muted-foreground">
              Glisser-déposer uniquement : il n’y a pas de champ « ordre ». Le
              tuto suit le même ordre et saute les éléments masqués.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aperçu du schéma</CardTitle>
            <CardDescription>
              Numéroté selon l’ordre du tableau.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-lg bg-muted px-4 py-4">
              <PostureSchema
                markers={visible.map((tip) => tip.key)}
                className="mx-auto max-w-lg"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Le repère 1 est toujours le premier réglage à faire. Un élément
              masqué n’a pas de repère et les suivants sont renumérotés.
            </p>
          </CardContent>
        </Card>
      </div>

      <PostureTipEditDialog
        tip={editing}
        tips={tips}
        onClose={() => setEditing(null)}
        onSaved={(saved) =>
          onChange(tips.map((t) => (t.id === saved.id ? saved : t)))
        }
      />
    </div>
  );
}

function TipRow({
  tip,
  number,
  onEdit,
  onVisible,
}: {
  tip: AdminPostureTip;
  /** Rang parmi les réglages affichés ; 0 s'il est masqué. */
  number: number;
  onEdit: () => void;
  onVisible: (value: boolean) => void;
}) {
  const element = POSTURE_TIP_ELEMENTS[tip.key];
  const dim = cn(!tip.isVisible && 'opacity-45');
  return (
    <SortableItem id={tip.id} as="tr" onClick={onEdit}>
      {(handle) => (
        <>
          <TableCell>
            <div className="flex items-center gap-1.5">
              {handle}
              {tip.isVisible ? (
                <span className="font-medium">{number}</span>
              ) : (
                <Badge variant="outline">Masqué</Badge>
              )}
            </div>
          </TableCell>
          <TableCell className={dim}>
            <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <element.icon className="size-[18px]" />
            </span>
          </TableCell>
          <TableCell className={cn('whitespace-normal', dim)}>
            <div className="grid gap-0.5">
              <span className="font-medium">{tip.title}</span>
              <span className="text-xs text-muted-foreground">
                Élément : {element.label}
              </span>
            </div>
          </TableCell>
          <TableCell
            className={cn(
              'text-[13px] whitespace-normal text-muted-foreground',
              dim,
            )}
          >
            {tip.shortText}
          </TableCell>
          <TableCell className={cn('whitespace-normal', dim)}>
            <SourceLink
              onClick={(event) => event.stopPropagation()}
              sourceLabel={tip.sourceLabel}
              sourceUrl={tip.sourceUrl}
            />
          </TableCell>
          <TableCell>
            <Switch
              onClick={(event) => event.stopPropagation()}
              checked={tip.isVisible}
              onCheckedChange={onVisible}
              aria-label={`Afficher ${tip.title}`}
            />
          </TableCell>
          <TableCell>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onEdit}
              aria-label={`Modifier ${tip.title}`}
            >
              <Pencil />
            </Button>
          </TableCell>
        </>
      )}
    </SortableItem>
  );
}
