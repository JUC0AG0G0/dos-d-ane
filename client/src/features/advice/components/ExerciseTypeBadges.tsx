import { Badge } from '@/components/ui/badge';
import type { ExerciseSummary } from '../types/advice.types';

export function ExerciseTypeBadges({
  exercise,
}: {
  exercise: Pick<ExerciseSummary, 'isPreventive' | 'isForPain'>;
}) {
  return (
    <>
      {exercise.isPreventive && <Badge variant="secondary">Préventif</Badge>}
      {exercise.isForPain && <Badge variant="outline">En cas de douleur</Badge>}
    </>
  );
}
