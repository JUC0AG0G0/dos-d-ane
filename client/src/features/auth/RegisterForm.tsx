import { CircleAlert } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PasswordInput } from '@/components/PasswordInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from './useRegister';

export function RegisterForm() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const { register, error, pending } = useRegister();

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void register({ displayName, email, password });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      {error && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}
      <div className="grid gap-2">
        <Label htmlFor="displayName">Nom affiché</Label>
        <Input
          id="displayName"
          autoComplete="nickname"
          placeholder="Jules"
          required
          minLength={2}
          maxLength={50}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>
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
        <PasswordInput
          id="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={128}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-describedby="password-hint"
        />
        <p id="password-hint" className="text-sm text-muted-foreground">
          8 caractères minimum.
        </p>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          required
          checked={consent}
          onCheckedChange={(checked) => setConsent(checked === true)}
          className="mt-0.5"
        />
        <Label htmlFor="consent" className="leading-snug font-normal">
          J'accepte que mes données soient traitées pour le fonctionnement de
          Dos d'âne (RGPD).
        </Label>
      </div>
      <Button type="submit" className="w-full" disabled={pending || !consent}>
        {pending ? 'Création…' : 'Créer mon compte'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte ?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
