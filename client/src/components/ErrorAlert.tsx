import { CircleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorAlertProps {
  /** Message principal ; rien n'est affiché s'il est vide. */
  message: string | null | undefined;
  /** Précision sous le message. */
  children?: ReactNode;
  className?: string;
}

/** Alerte rouge d'erreur (chargement ou action qui a échoué). */
export function ErrorAlert({ message, children, className }: ErrorAlertProps) {
  if (!message) return null;
  return (
    <Alert variant="destructive" className={className}>
      <CircleAlert />
      <AlertTitle>{message}</AlertTitle>
      {children && <AlertDescription>{children}</AlertDescription>}
    </Alert>
  );
}
