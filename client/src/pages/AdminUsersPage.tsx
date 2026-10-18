import { UsersSection } from '@/features/admin';

export function AdminUsersPage() {
  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-bold">Utilisateurs</h1>
      <UsersSection />
    </section>
  );
}
