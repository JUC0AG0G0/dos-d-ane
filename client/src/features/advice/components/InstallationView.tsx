import { Play } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { usePostureTips } from '../hooks/useAdvice';
import type { PostureTipKey } from '../types/advice.types';
import { LoadState } from './LoadState';
import { NumberMarker } from './NumberMarker';
import { PageHeader } from './PageHeader';
import { POSTURE_TIP_ELEMENTS } from './posture-tip-elements';
import { PostureSchema } from './PostureSchema';
import { SourceLink } from './SourceLink';
import { TutorialDialog } from './TutorialDialog';

/**
 * Conseils › Bien s'installer : bandeau tuto, schéma numéroté et liste des
 * réglages. La liste prend la hauteur de ses réglages et le schéma s'aligne
 * sur elle. Survoler un réglage entoure son élément sur le schéma, et
 * inversement.
 */
export function InstallationView() {
  const { data: tips, error } = usePostureTips();
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [active, setActive] = useState<PostureTipKey | null>(null);

  return (
    <section className="grid gap-4">
      <PageHeader
        title="Bien s’installer"
        description={`${tips ? `${tips.length} réglages` : 'Quelques réglages'} pour un poste qui ménage le dos, la nuque et les yeux.`}
      />
      {!tips ? (
        <LoadState error={error} />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 rounded-xl border bg-accent px-7 py-5 text-accent-foreground">
            <div className="grid flex-1 justify-items-start gap-2">
              <h2 className="text-xl font-semibold">
                Réglez votre poste pas à pas
              </h2>
              <p className="text-sm">
                {tips.length} étapes illustrées, à suivre assis à votre bureau.
                Refaites-le quand vous changez de poste ou de chaise.
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => setTutorialOpen(true)}
              disabled={tips.length === 0}
            >
              <Play />
              Commencer le tuto
            </Button>
          </div>

          {/* Les deux cartes ont la hauteur de la liste des réglages. */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="gap-3 py-4">
              <CardHeader className="px-5">
                <CardTitle>Le poste en un coup d’œil</CardTitle>
                <CardDescription>
                  Survolez un élément ou un réglage pour les relier.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 px-5">
                {/* Le dessin remplit la place sans agrandir la carte. */}
                <div className="relative min-h-56 flex-1 rounded-lg bg-muted">
                  <PostureSchema
                    markers={tips.map((tip) => tip.key)}
                    highlight={active}
                    onHover={setActive}
                    className="absolute inset-0 h-full p-3"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="gap-2 py-4">
              <CardHeader className="px-5">
                <CardTitle>Les {tips.length} réglages</CardTitle>
              </CardHeader>
              <CardContent className="px-3">
                <ol className="grid gap-0.5">
                  {tips.map((tip, index) => {
                    const Icon = POSTURE_TIP_ELEMENTS[tip.key].icon;
                    return (
                      <li
                        key={tip.id}
                        onMouseEnter={() => setActive(tip.key)}
                        onMouseLeave={() => setActive(null)}
                        className={cn(
                          'flex gap-3 rounded-lg px-2 py-1.5 transition-colors',
                          active === tip.key && 'bg-accent',
                        )}
                      >
                        <NumberMarker value={index + 1} />
                        <div className="grid flex-1 gap-0.5">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                            <h3 className="text-sm font-semibold">
                              {tip.title}
                            </h3>
                            <SourceLink
                              sourceLabel={tip.sourceLabel}
                              sourceUrl={tip.sourceUrl}
                            />
                          </div>
                          <p className="text-[13px] leading-snug text-muted-foreground">
                            {tip.shortText}
                          </p>
                        </div>
                        <Icon
                          className="size-[18px] shrink-0 text-muted-foreground"
                          aria-hidden
                        />
                      </li>
                    );
                  })}
                </ol>
              </CardContent>
            </Card>
          </div>

          <TutorialDialog
            open={tutorialOpen}
            onOpenChange={setTutorialOpen}
            tips={tips}
          />
        </>
      )}
    </section>
  );
}
