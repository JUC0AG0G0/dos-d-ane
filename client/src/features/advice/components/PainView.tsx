import {
  ArrowRight,
  Check,
  ChevronRight,
  TriangleAlert,
  X,
} from 'lucide-react';
import { Fragment, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePainZones } from '../hooks/useAdvice';
import type { PainZone } from '../types/advice.types';
import { formatDuration } from '../utils';
import { ExerciseDetailDialog } from './ExerciseDetailDialog';
import { ExerciseMedia } from './ExerciseMedia';
import { ExerciseTypeBadges } from './ExerciseTypeBadges';
import { LoadState } from './LoadState';
import { PageHeader } from './PageHeader';
import { SourceLink } from './SourceLink';

/**
 * Lien « Tous les exercices » : Exercices filtrés sur le type douleur et sur
 * la partie du corps des exercices conseillés (les zones de douleur sont
 * libres, elles n'ont pas de partie du corps à elles).
 */
const allExercisesLink = (zone: PainZone) => {
  const params = new URLSearchParams({ type: 'douleur' });
  if (zone.exercises[0]) params.set('zone', zone.exercises[0].zone);
  return `/conseils/exercices?${params}`;
};

/** Conseils › En cas de douleur : message médecin, zones, exercices conseillés. */
export function PainView() {
  const { data, error } = usePainZones();
  const [params, setParams] = useSearchParams();
  const [openId, setOpenId] = useState<string | null>(null);

  const zones = data?.zones ?? [];
  const zone = zones.find(({ id }) => id === params.get('zone')) ?? zones[0];
  const exercises = zone?.exercises ?? [];
  const openIndex = exercises.findIndex(({ id }) => id === openId);

  return (
    <section className="grid gap-6">
      <PageHeader
        title="En cas de douleur"
        description="Choisissez la zone qui vous gêne pour voir quoi faire et quels exercices essayer."
      />
      {!data ? (
        <LoadState error={error} />
      ) : (
        <>
          {data.whenToSeeDoctor && (
            <Alert variant="warning">
              <TriangleAlert />
              <AlertTitle>Quand consulter un médecin</AlertTitle>
              <AlertDescription>{data.whenToSeeDoctor}</AlertDescription>
            </Alert>
          )}

          {!zone ? (
            <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
              Aucun repère publié pour le moment.
            </p>
          ) : (
            <>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Zone"
              >
                {zones.map(({ id, name }) => (
                  <Button
                    key={id}
                    size="sm"
                    variant={id === zone.id ? 'default' : 'outline'}
                    aria-pressed={id === zone.id}
                    onClick={() => setParams({ zone: id }, { replace: true })}
                  >
                    {name}
                  </Button>
                ))}
              </div>

              <div className="grid items-start gap-6 xl:grid-cols-[1fr_460px]">
                <Card>
                  <CardHeader>
                    <CardTitle>{zone.name}</CardTitle>
                    {zone.intro && (
                      <CardDescription>{zone.intro}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {zone.helps.length > 0 && (
                      <>
                        <h3 className="text-sm font-semibold">Ce qui aide</h3>
                        <ul className="grid gap-3">
                          {zone.helps.map((text, index) => (
                            <li key={index} className="flex gap-2.5 text-sm">
                              <Check
                                className="mt-0.5 size-4 shrink-0 text-primary"
                                aria-hidden
                              />
                              {text}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {zone.helps.length > 0 && zone.avoid.length > 0 && (
                      <Separator />
                    )}
                    {zone.avoid.length > 0 && (
                      <>
                        <h3 className="text-sm font-semibold">À éviter</h3>
                        <ul className="grid gap-3">
                          {zone.avoid.map((text, index) => (
                            <li key={index} className="flex gap-2.5 text-sm">
                              <X
                                className="mt-0.5 size-4 shrink-0 text-destructive"
                                aria-hidden
                              />
                              {text}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {zone.sourceUrl && (
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        Source :
                        <SourceLink
                          sourceLabel={zone.sourceLabel}
                          sourceUrl={zone.sourceUrl}
                        />
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Exercices conseillés</CardTitle>
                    <CardDescription>
                      Pour soulager : {zone.name.toLowerCase()}.
                    </CardDescription>
                    <CardAction>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={allExercisesLink(zone)}>
                          Tous les exercices
                          <ArrowRight />
                        </Link>
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="grid">
                    {exercises.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Pas encore d’exercice conseillé pour cette zone.
                      </p>
                    )}
                    {exercises.map((exercise, index) => (
                      <Fragment key={exercise.id}>
                        {index > 0 && <Separator />}
                        <button
                          type="button"
                          onClick={() => setOpenId(exercise.id)}
                          className="flex items-center gap-3.5 rounded-md py-3 text-left hover:bg-muted/60"
                        >
                          <ExerciseMedia
                            media={exercise.media}
                            title={exercise.title}
                            className="size-16 shrink-0 rounded-md"
                          />
                          <div className="grid flex-1 gap-1.5">
                            <span className="text-sm font-medium">
                              {exercise.title}
                            </span>
                            <span className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                              {formatDuration(exercise.durationSeconds)}
                              <ExerciseTypeBadges exercise={exercise} />
                            </span>
                          </div>
                          <ChevronRight
                            className="size-4 text-muted-foreground"
                            aria-hidden
                          />
                        </button>
                      </Fragment>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </>
      )}

      <ExerciseDetailDialog
        exerciseId={openId}
        previousId={openIndex > 0 ? exercises[openIndex - 1].id : null}
        onNavigate={setOpenId}
        onClose={() => setOpenId(null)}
      />
    </section>
  );
}
