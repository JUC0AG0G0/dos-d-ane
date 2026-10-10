import { ApiStatus } from '@/features/health';

export function StatusPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">État du service</h1>
      <ApiStatus />
    </section>
  );
}
