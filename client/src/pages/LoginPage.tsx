import { LoginForm } from '@/features/auth';

export function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="text-muted-foreground">
          Content de te revoir ! Connecte-toi pour continuer.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
