import { useLocalSearchParams } from 'expo-router';

import { EcranExercice } from '@/features/advice';

export default function FicheExercice() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  return <EcranExercice id={id} />;
}
