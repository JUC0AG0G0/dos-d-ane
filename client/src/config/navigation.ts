import { House, type LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

// Entrées de la barre latérale : une ligne par page accessible une fois connecté.
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Accueil', icon: House },
];
