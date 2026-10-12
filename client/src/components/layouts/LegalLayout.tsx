import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';
import { LegalLinks } from '@/features/legal';

export function LegalLayout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary">
              🫏
            </span>
            Dos d'âne
          </Link>
          <LegalLinks />
        </div>
      </header>
      <main className="mx-auto grid max-w-3xl gap-8 px-6 py-10">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-3xl px-6 pb-10">
        <MedicalDisclaimer />
      </footer>
    </div>
  );
}
