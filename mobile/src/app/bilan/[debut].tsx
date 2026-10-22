import { useLocalSearchParams } from 'expo-router';

import { EcranBilan } from '@/features/sessions';

export default function Bilan() {
  const { debut = '' } = useLocalSearchParams<{ debut: string }>();
  return <EcranBilan debut={Number(debut)} />;
}
