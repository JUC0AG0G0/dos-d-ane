import { Outlet } from 'react-router-dom';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';

/** Connexion et inscription : panneau vert à gauche, formulaire à droite. */
export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <p className="text-xl font-semibold">🫏 Dos d'âne</p>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">
            Prends soin de ton dos pendant que tu travailles.
          </h2>
          <p className="text-primary-foreground/80">
            Des conseils de posture et des exercices adaptés au travail
            sédentaire.
          </p>
        </div>
        <div className="rounded-lg bg-primary-foreground/10 p-4 text-sm">
          Conseils généraux de posture et d'exercices.{' '}
          <strong>Ne remplace pas l'avis d'un professionnel de santé.</strong>
        </div>
      </aside>
      <main className="flex flex-col items-center justify-center gap-8 p-6">
        <p className="text-xl font-semibold lg:hidden">🫏 Dos d'âne</p>
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
        <div className="max-w-sm lg:hidden">
          <MedicalDisclaimer />
        </div>
      </main>
    </div>
  );
}
