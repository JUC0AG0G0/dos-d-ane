import { ArrowLeft, House } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
        <p className="text-7xl font-bold text-primary">404</p>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Page introuvable</h1>
          <p className="text-muted-foreground">
            Cette page n'existe pas ou a été déplacée.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
            Page précédente
          </Button>
          <Button asChild className="flex-1">
            <Link to="/">
              <House />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
