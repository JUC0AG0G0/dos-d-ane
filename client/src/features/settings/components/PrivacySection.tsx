import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const DATA = [
  {
    title: 'Compte',
    text: "Ton email et ton nom affiché, pour te connecter et t'identifier dans l'application.",
  },
  {
    title: 'Appareils connectés',
    text: "Le nom de l'appareil, le navigateur et le système (lus dans le User-Agent), l'adresse IP et les dates de connexion, pour gérer tes sessions.",
  },
  {
    title: 'Posture',
    text: "Seulement les points du corps détectés sur une capture, jamais l'image elle-même.",
  },
];

export function PrivacySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidentialité</CardTitle>
        <CardDescription>
          Les données que Dos d'âne garde sur toi, et pourquoi.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {DATA.map(({ title, text }) => (
          <div key={title} className="grid gap-1">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
        <p className="text-sm text-muted-foreground">
          Ces données ne sont jamais partagées. Tu peux voir et déconnecter tes
          sessions dans « Appareils connectés ».
        </p>
        <p className="text-sm">
          <Link
            to="/legal/privacy"
            className="font-medium text-primary hover:underline"
          >
            Lire la politique de confidentialité
          </Link>{' '}
          : durées de conservation, bases légales et exercice de tes droits.
        </p>
      </CardContent>
    </Card>
  );
}
