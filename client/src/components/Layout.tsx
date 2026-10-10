import { Link, Outlet } from 'react-router-dom';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';

/** Cadre commun à toutes les pages : en-tête, contenu, avertissement. */
export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-card px-6 py-4">
        <Link to="/" className="text-xl font-semibold">
          🫏 Dos d'âne
        </Link>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <Outlet />
      </main>
      <footer className="border-t bg-card px-6 py-4">
        <MedicalDisclaimer />
      </footer>
    </div>
  );
}
