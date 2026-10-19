import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';
import { ErrorAlert } from '@/components/ErrorAlert';

/**
 * Ce qui s'affiche avant le contenu : l'erreur si le chargement a échoué,
 * sinon un bloc de chargement (hauteur réglable par className).
 */
export function LoadState({
  error,
  className,
}: {
  error: string | null;
  className?: string;
}) {
  if (error) return <ErrorAlert message={error} />;
  return <Skeleton className={cn('h-64 w-full', className)} />;
}
