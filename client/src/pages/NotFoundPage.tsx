import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Page introuvable</h1>
      <Button asChild>
        <Link to="/">Retour à l'accueil</Link>
      </Button>
    </section>
  );
}
