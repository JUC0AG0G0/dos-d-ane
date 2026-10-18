import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PasswordInput } from '@/components/PasswordInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '../hooks/useRegister';
import { ErrorAlert } from '@/components/ErrorAlert';
import { FormField } from '@/components/FormField';

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
      <ErrorAlert message={error} />
      <FormField label="Nom affiché" htmlFor="displayName">
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
      </FormField>
      <FormField label="Email" htmlFor="email">
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="jules@test.fr"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <FormField label="Mot de passe" htmlFor="password">
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
      </FormField>
      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          required
          checked={consent}
          onCheckedChange={(checked) => setConsent(checked === true)}
          className="mt-0.5"
        />
        <Label htmlFor="consent" className="leading-snug font-normal">
          <span>
            J'accepte les{' '}
            <Link
              to="/legal/terms"
              target="_blank"
              className="font-medium text-primary hover:underline"
            >
              conditions d'utilisation
            </Link>{' '}
            et j'ai lu la{' '}
            <Link
              to="/legal/privacy"
              target="_blank"
              className="font-medium text-primary hover:underline"
            >
              politique de confidentialité
            </Link>
            .
          </span>
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
