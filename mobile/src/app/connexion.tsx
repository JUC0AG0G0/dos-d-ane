import { useLocalSearchParams } from 'expo-router';

import { EcranConnexion } from '@/features/auth';

export default function Connexion() {
  const { email, inscrit } = useLocalSearchParams<{ email?: string; inscrit?: string }>();
  return <EcranConnexion emailInitial={email} inscrit={!!inscrit} />;
}
