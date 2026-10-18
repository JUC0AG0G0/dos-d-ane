import { CircleAlert } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

/** Chargement ou erreur d'une page, avant que le contenu soit là. */
export function LoadState({ error }: { error: string | null }) {
  if (error) {
    return (
      <Alert variant="destructive">
        <CircleAlert />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  return <Skeleton className="h-64 w-full" />;
}
