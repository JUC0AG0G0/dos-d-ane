import { Play } from 'lucide-react';
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
 * réglages, sur la hauteur de l'écran (sans défilement sur ordinateur).
 * Survoler un réglage entoure son élément sur le schéma, et inversement.
 */
export function InstallationView() {
  const { data: tips, error } = usePostureTips();
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [active, setActive] = useState<PostureTipKey | null>(null);

  return (
    // Hauteur de l'écran moins l'en-tête (h-14) et les marges de la page (p-6).
    <section className="flex flex-col gap-4 xl:h-[calc(100dvh-3.5rem-3rem)]">
      <PageHeader
        title="Bien s’installer"
        description={`${tips ? `${tips.length} réglages` : 'Quelques réglages'} pour un poste qui ménage le dos, la nuque et les yeux.`}
      />
      {!tips ? (
        <LoadState error={error} />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border bg-accent px-5 py-3 text-accent-foreground">
            <div className="grid flex-1 gap-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold">Réglez votre poste pas à pas</h2>
                <Badge variant="outline" className="bg-card">
                  Tuto · 3 minutes
                </Badge>
              </div>
              <p className="text-sm">
                {tips.length} étapes illustrées, à suivre assis à votre bureau.
                Refaites-le quand vous changez de poste ou de chaise.
              </p>
            </div>
            <Button
              onClick={() => setTutorialOpen(true)}
              disabled={tips.length === 0}
            >
              <Play />
              Commencer le tuto
            </Button>
          </div>

          <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <Card className="min-h-0 gap-3 py-4">
              <CardHeader className="px-5">
                <CardTitle>Le poste en un coup d’œil</CardTitle>
                <CardDescription>
                  Survolez un élément ou un réglage pour les relier.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 px-5">
                <div className="flex min-h-0 flex-1 items-center justify-center rounded-lg bg-muted p-4">
                  <PostureSchema
                    markers={tips.map((tip) => tip.key)}
                    highlight={active}
                    onHover={setActive}
                    className="h-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="min-h-0 gap-2 py-4">
              <CardHeader className="px-5">
                <CardTitle>Les {tips.length} réglages</CardTitle>
              </CardHeader>
              <CardContent className="min-h-0 overflow-y-auto px-3">
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
                          <h3 className="text-sm font-semibold">{tip.title}</h3>
                          <p className="text-[13px] leading-snug text-muted-foreground">
                            {tip.shortText}
                          </p>
                          <SourceLink
                            sourceLabel={tip.sourceLabel}
                            sourceUrl={tip.sourceUrl}
                            className="justify-self-start"
                          />
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
