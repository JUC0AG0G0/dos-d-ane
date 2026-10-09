import { Link, Outlet } from 'react-router-dom';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';

/** Cadre commun à toutes les pages : en-tête, contenu, avertissement. */
export function Layout() {
  return (
    <div className="layout">
      <header className="layout__header">
        <Link to="/" className="layout__brand">
          🫏 Dos d'âne
        </Link>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
      <footer className="layout__footer">
        <MedicalDisclaimer />
      </footer>
    </div>
  );
}
