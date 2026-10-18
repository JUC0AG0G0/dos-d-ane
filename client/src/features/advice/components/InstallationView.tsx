import { Play } from 'lucide-react';
import { Fragment, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePostureTips } from '../hooks/useAdvice';
import { LoadState } from './LoadState';
import { NumberMarker } from './NumberMarker';
import { PageHeader } from './PageHeader';
import { POSTURE_TIP_ELEMENTS } from './posture-tip-elements';
import { PostureSchema } from './PostureSchema';
import { SourceLink } from './SourceLink';
import { TutorialDialog } from './TutorialDialog';

/** Conseils › Bien s'installer : schéma numéroté, liste des réglages et tuto. */
export function InstallationView() {
  const { data: tips, error } = usePostureTips();
  const [tutorialOpen, setTutorialOpen] = useState(false);

  return (
    <section className="grid gap-6">
      <PageHeader
        title="Bien s’installer"
        description={`${tips ? `${tips.length} réglages` : 'Quelques réglages'} pour un poste qui ménage le dos, la nuque et les yeux.`}
      />
      {!tips ? (
        <LoadState error={error} />
      ) : (
        <>
          <div className="flex flex-col items-center gap-8 rounded-xl border bg-accent px-8 py-7 md:flex-row">
            <div className="grid flex-1 justify-items-start gap-3 text-accent-foreground">
              <Badge variant="secondary">Tuto · 3 minutes</Badge>
              <h2 className="text-2xl font-semibold">
                Réglez votre poste pas à pas
              </h2>
              <p className="text-sm">
                {tips.length} étapes illustrées, à suivre assis à votre bureau.
                Refaites-le quand vous changez de poste ou de chaise.
              </p>
              <Button
                onClick={() => setTutorialOpen(true)}
                disabled={tips.length === 0}
              >
                <Play />
                Commencer le tuto
              </Button>
            </div>
            <div className="w-full max-w-sm rounded-lg bg-card px-4 py-3">
              <PostureSchema />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,640px)_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Le poste en un coup d’œil</CardTitle>
                <CardDescription>
                  Les numéros renvoient aux réglages à droite.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted px-4 py-6">
                  <PostureSchema markers={tips.map((tip) => tip.key)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Les {tips.length} réglages</CardTitle>
              </CardHeader>
              <CardContent className="grid">
                {tips.map((tip, index) => {
                  const Icon = POSTURE_TIP_ELEMENTS[tip.key].icon;
                  return (
                    <Fragment key={tip.id}>
                      {index > 0 && <Separator />}
                      <div className="flex gap-3.5 py-3">
                        <NumberMarker value={index + 1} className="size-7" />
                        <div className="grid flex-1 gap-0.5">
                          <h3 className="text-sm font-semibold">{tip.title}</h3>
                          <p className="text-sm text-muted-foreground">
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
                      </div>
                    </Fragment>
                  );
                })}
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
