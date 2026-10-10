import { CircleAlert, CircleCheck } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from './useLogin';

export function LoginForm() {
  const registeredEmail: string | undefined =
    useLocation().state?.registeredEmail;
  const [email, setEmail] = useState(registeredEmail ?? '');
  const [password, setPassword] = useState('');
  const { login, error, pending } = useLogin();

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void login(email, password);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      {registeredEmail && !error && (
        <Alert variant="success">
          <CircleCheck />
          <AlertTitle>Compte créé, tu peux te connecter.</AlertTitle>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="jules@test.fr"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={error ? true : undefined}
        />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Connexion…' : 'Se connecter'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{' '}
        <Link
          to="/register"
          className="font-medium text-primary hover:underline"
        >
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
