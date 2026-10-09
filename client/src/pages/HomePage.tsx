import { ApiStatus } from '@/features/health';

export function HomePage() {
  return (
    <section>
      <h1>Bienvenue</h1>
      <p>Aide à la posture pour le travail sédentaire.</p>
      <ApiStatus />
    </section>
  );
}
