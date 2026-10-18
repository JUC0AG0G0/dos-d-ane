import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadState } from '@/components/LoadState';
import { PageHeader } from '@/components/PageHeader';
import { useApi } from '@/hooks/useApi';
import { adminAdviceService } from '../services/admin-advice.service';
import { ExercisesTab } from './ExercisesTab';
import { PainZonesTab } from './PainZonesTab';
import { PostureTipsTab } from './PostureTipsTab';

// Mêmes noms et même ordre que les pages Conseils côté utilisateur.
const TABS = ['installation', 'exercices', 'douleur'] as const;
type Tab = (typeof TABS)[number];

/**
 * Administration › Conseils et exercices. L'onglet est dans l'URL :
 * /admin/conseils/installation, /exercices, /douleur.
 */
export function AdminAdviceView() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const exercises = useApi(adminAdviceService.exercises, []);
  const tips = useApi(adminAdviceService.postureTips, []);
  const zones = useApi(adminAdviceService.painZones, []);
  const [creating, setCreating] = useState<Tab | null>(null);

  if (!TABS.includes(tab as Tab)) {
    return <Navigate to="/admin/conseils/installation" replace />;
  }

  const action =
    tab === 'exercices' ? (
      <Button onClick={() => setCreating('exercices')}>
        <Plus />
        Nouvel exercice
      </Button>
    ) : tab === 'douleur' ? (
      <Button onClick={() => setCreating('douleur')}>
        <Plus />
        Nouvelle zone
      </Button>
    ) : null;

  const published = (exercises.data ?? []).filter(
    (exercise) => exercise.status === 'published',
  );
  const count = (n: number | undefined) => (n === undefined ? '' : ` (${n})`);
  // Un exercice modifié change aussi les exercices conseillés des zones.
  const reloadExercises = () => {
    exercises.reload();
    zones.reload();
  };

  return (
    <section className="grid grid-cols-1 gap-6">
      <PageHeader
        title="Conseils et exercices"
        description="Ce que les utilisateurs voient dans Conseils. Un brouillon reste invisible tant qu’il n’est pas publié."
        actions={action}
      />
      <Tabs
        value={tab}
        onValueChange={(value) => navigate(`/admin/conseils/${value}`)}
      >
        <TabsList>
          <TabsTrigger value="installation">
            Bien s’installer{count(tips.data?.length)}
          </TabsTrigger>
          <TabsTrigger value="exercices">
            Exercices{count(exercises.data?.length)}
          </TabsTrigger>
          <TabsTrigger value="douleur">
            En cas de douleur{count(zones.data?.zones.length)}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="installation" className="mt-4">
          {tips.data ? (
            <PostureTipsTab tips={tips.data} onChange={tips.setData} />
          ) : (
            <LoadState error={tips.error} />
          )}
        </TabsContent>
        <TabsContent value="exercices" className="mt-4">
          {exercises.data ? (
            <ExercisesTab
              exercises={exercises.data}
              reload={reloadExercises}
              creating={creating === 'exercices'}
              onCreatingChange={(open) =>
                setCreating(open ? 'exercices' : null)
              }
            />
          ) : (
            <LoadState error={exercises.error} />
          )}
        </TabsContent>
        <TabsContent value="douleur" className="mt-4">
          {zones.data ? (
            <PainZonesTab
              data={zones.data}
              onChange={zones.setData}
              reload={zones.reload}
              published={published}
              creating={creating === 'douleur'}
              onCreatingChange={(open) => setCreating(open ? 'douleur' : null)}
            />
          ) : (
            <LoadState error={zones.error} />
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
