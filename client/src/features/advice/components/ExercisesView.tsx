import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExercises } from '../hooks/useAdvice';
import {
  EXERCISE_ZONES,
  ZONE_LABELS,
  type ExerciseType,
  type ExerciseZone,
} from '../types/advice.types';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseDetailDialog } from './ExerciseDetailDialog';
import { LoadState } from './LoadState';
import { PageHeader } from './PageHeader';

/** Filtre type dans l'URL (?type=prevention|douleur) → type de l'API. */
const URL_TYPES: Record<string, ExerciseType> = {
  prevention: 'preventive',
  douleur: 'pain',
};

const isZone = (value: string | null): value is ExerciseZone =>
  EXERCISE_ZONES.includes(value as ExerciseZone);

/** Conseils › Exercices : filtres type et partie du corps, grille, détail. */
export function ExercisesView() {
  const [params, setParams] = useSearchParams();
  const typeParam = params.get('type') ?? '';
  const type = URL_TYPES[typeParam];
  const zoneParam = params.get('zone');
  const zone = isZone(zoneParam) ? zoneParam : undefined;
  const { data, error } = useExercises(type, zone);
  const [openId, setOpenId] = useState<string | null>(null);

  const setFilter = (key: 'type' | 'zone', value: string | undefined) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );

  const items = data?.items ?? [];

  return (
    <section className="grid gap-6">
      <PageHeader
        title="Exercices"
        description="Des mouvements courts, sans matériel, à faire au bureau. Arrêtez si un mouvement fait mal."
      />

      <div className="flex flex-wrap items-center gap-4">
        <Tabs
          value={type ? typeParam : 'tous'}
          onValueChange={(value) =>
            setFilter('type', value === 'tous' ? undefined : value)
          }
        >
          <TabsList>
            <TabsTrigger value="tous">
              Tous{data && ` (${data.counts.all})`}
            </TabsTrigger>
            <TabsTrigger value="prevention">
              Préventifs{data && ` (${data.counts.preventive})`}
            </TabsTrigger>
            <TabsTrigger value="douleur">
              En cas de douleur{data && ` (${data.counts.pain})`}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Partie du corps"
        >
          <span className="text-sm font-medium text-muted-foreground">
            Partie du corps
          </span>
          {[undefined, ...EXERCISE_ZONES].map((value) => (
            <Button
              key={value ?? 'toutes'}
              size="sm"
              variant={value === zone ? 'default' : 'outline'}
              aria-pressed={value === zone}
              onClick={() => setFilter('zone', value)}
            >
              {value ? ZONE_LABELS[value] : 'Toutes'}
            </Button>
          ))}
        </div>
      </div>

      {!data ? (
        <LoadState error={error} />
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          Aucun exercice pour ces filtres
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onOpen={() => setOpenId(exercise.id)}
            />
          ))}
        </div>
      )}

      <ExerciseDetailDialog
        exerciseId={openId}
        onClose={() => setOpenId(null)}
      />
    </section>
  );
}
