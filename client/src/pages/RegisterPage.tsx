import { RegisterForm } from '@/features/auth';

export function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Créer un compte</h1>
        <p className="text-muted-foreground">
          Quelques informations pour commencer.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
