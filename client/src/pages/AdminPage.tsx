import { Navigate } from 'react-router-dom';
import { UsersSection } from '@/features/admin';
import { useAuthStore } from '@/store';

export function AdminPage() {
  const isAdmin = useAuthStore((state) => state.user?.role === 'admin');
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-bold">Administration</h1>
      <UsersSection />
    </section>
  );
}
