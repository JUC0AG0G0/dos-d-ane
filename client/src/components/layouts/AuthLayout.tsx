import { Outlet } from 'react-router-dom';
import illustration from '@/assets/tung_sahur_italian_brainrot_the_series_png_by_amigurumis1a_dkbnx7t-fullview.png';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';

export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <p className="text-xl font-semibold">🫏 Dos d'âne</p>
        <div className="flex items-center gap-8">
          <div className="flex size-40 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 xl:size-52">
            <img
              src={illustration}
              alt="Un âne assis à son bureau qui travaille sur un ordinateur"
              className="size-32 rounded-full object-cover shadow-lg xl:size-44"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Prenez soin de votre dos</h2>
            <p className="text-primary-foreground/80">
              Dos d'âne analyse votre posture pendant que vous travaillez et
              vous propose des conseils et des exercices adaptés.
            </p>
          </div>
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
