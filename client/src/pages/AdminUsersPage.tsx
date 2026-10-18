import { UsersSection } from '@/features/admin';
import { PageHeader } from '@/components/PageHeader';

export function AdminUsersPage() {
  return (
    <section className="grid gap-6">
      <PageHeader title="Utilisateurs" />
      <UsersSection />
    </section>
  );
}
