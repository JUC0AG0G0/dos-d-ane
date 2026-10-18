import { Check, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  ExerciseMedia,
  formatDuration,
  ZONE_LABELS,
  type ExerciseSummary,
} from '@/features/advice';
import { cn } from '@/utils/cn';
import { move } from '@/utils/list';
import { SortableItem, SortableList } from '@/components/Sortable';

const MAX = 3;

/**
 * Exercices conseillés d'une zone : sélection ordonnée (glisser-déposer,
 * retrait) et recherche parmi les exercices publiés. L'ajout est désactivé à 3.
 */
export function ExercisePicker({
  selected,
  published,
  onChange,
}: {
  selected: ExerciseSummary[];
  /** Exercices publiés : les brouillons ne sont pas proposés. */
  published: ExerciseSummary[];
  onChange: (exercises: ExerciseSummary[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const full = selected.length >= MAX;
  const isSelected = (id: string) => selected.some((e) => e.id === id);

  function toggle(exercise: ExerciseSummary) {
    if (isSelected(exercise.id)) {
      onChange(selected.filter((e) => e.id !== exercise.id));
    } else if (!full) {
      onChange([...selected, exercise]);
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <span className="flex-1 text-[13px] text-muted-foreground">
          Dans l’ordre d’affichage
        </span>
        <Badge variant="secondary">
          {selected.length} / {MAX}
        </Badge>
      </div>

      {selected.length > 0 && (
        <div className="divide-y overflow-hidden rounded-xl border">
          <SortableList
            ids={selected.map((e) => e.id)}
            onMove={(from, to) => onChange(move(selected, from, to))}
          >
            {selected.map((exercise) => (
              <SelectedRow
                key={exercise.id}
                exercise={exercise}
                onRemove={() => toggle(exercise)}
              />
            ))}
          </SortableList>
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="justify-self-start"
          >
            <Plus />
            Ajouter un exercice
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput placeholder="Ajouter un exercice…" />
            <CommandList>
              <CommandEmpty>Aucun exercice publié trouvé.</CommandEmpty>
              <CommandGroup heading="Exercices publiés">
                {published.map((exercise) => {
                  const checked = isSelected(exercise.id);
                  return (
                    <CommandItem
                      key={exercise.id}
                      value={`${exercise.title} ${ZONE_LABELS[exercise.zone]}`}
                      disabled={!checked && full}
                      onSelect={() => toggle(exercise)}
                    >
                      <Check
                        className={cn(
                          'text-primary',
                          checked ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <span className={cn('flex-1', checked && 'font-medium')}>
                        {exercise.title}
                      </span>
                      <Badge variant="outline">
                        {ZONE_LABELS[exercise.zone]}
                      </Badge>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function SelectedRow({
  exercise,
  onRemove,
}: {
  exercise: ExerciseSummary;
  onRemove: () => void;
}) {
  return (
    <SortableItem
      id={exercise.id}
      className="flex items-center gap-2.5 bg-card py-2 pr-1.5 pl-2.5"
    >
      {(handle) => (
        <>
          {handle}
          <ExerciseMedia
            media={exercise.media}
            title={exercise.title}
            className="size-9 shrink-0 rounded-md"
          />
          <div className="grid flex-1 gap-0.5">
            <span className="text-sm font-medium">{exercise.title}</span>
            <span className="text-xs text-muted-foreground">
              {formatDuration(exercise.durationSeconds)} ·{' '}
              {ZONE_LABELS[exercise.zone]}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label={`Retirer ${exercise.title}`}
          >
            <X />
          </Button>
        </>
      )}
    </SortableItem>
  );
}
