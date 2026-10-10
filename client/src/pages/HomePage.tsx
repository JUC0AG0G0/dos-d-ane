import { ColorSwatch } from '@/components/ColorSwatch';

const COLORS = [
  { name: '--primary', role: 'Primaire : boutons, liens' },
  { name: '--primary-foreground', role: 'Texte sur primaire' },
  { name: '--secondary', role: 'Secondaire' },
  { name: '--secondary-foreground', role: 'Texte sur secondaire' },
  { name: '--accent', role: 'Survol' },
  { name: '--background', role: 'Fond des pages' },
  { name: '--foreground', role: 'Texte principal' },
  { name: '--card', role: 'Cartes, fenêtres' },
  { name: '--muted', role: 'Fond atténué' },
  { name: '--muted-foreground', role: 'Texte secondaire' },
  { name: '--border', role: 'Bordures, champs' },
  { name: '--ring', role: 'Focus' },
  { name: '--destructive', role: 'Danger : suppression, déconnexion' },
  { name: '--success', role: 'Alerte succès : fond' },
  { name: '--success-border', role: 'Alerte succès : bordure' },
  { name: '--success-foreground', role: 'Alerte succès : texte' },
  { name: '--warning', role: 'Alerte avertissement : fond' },
  { name: '--warning-border', role: 'Alerte avertissement : bordure' },
  { name: '--warning-foreground', role: 'Alerte avertissement : texte' },
  { name: '--warning-icon', role: 'Alerte avertissement : icône' },
];

export function HomePage() {
  return (
    <section className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Hello world</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {COLORS.map((color) => (
          <ColorSwatch key={color.name} {...color} />
        ))}
      </div>
    </section>
  );
}
