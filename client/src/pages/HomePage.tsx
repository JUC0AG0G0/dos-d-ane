import { ApiStatus } from '@/features/health';

export function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Bienvenue</h1>
      <p className="text-muted-foreground">
        Aide à la posture pour le travail sédentaire.
      </p>
      <ApiStatus />
    </section>
  );
}
