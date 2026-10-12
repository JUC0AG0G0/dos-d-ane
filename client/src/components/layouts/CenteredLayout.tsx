import { Info } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

export function CenteredLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-6">
      <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-lg">
          🫏
        </span>
        Dos d'âne
      </Link>
      <main className="w-full max-w-md">
        <Outlet />
      </main>
      <p className="flex max-w-md items-start gap-2 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        Ne remplace pas l'avis d'un professionnel de santé.
      </p>
    </div>
  );
}
