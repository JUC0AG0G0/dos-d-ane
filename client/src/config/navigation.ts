import { House, Settings, type LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

// Barre latérale : sections et pages accessibles une fois connecté.
export const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Navigation',
    items: [{ to: '/', label: 'Accueil', icon: House }],
  },
  {
    label: 'Compte',
    items: [{ to: '/settings', label: 'Paramètres', icon: Settings }],
  },
];

/** Entrée de menu de la page affichée (la plus précise qui correspond). */
export function findNavItem(pathname: string) {
  return NAV_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({ ...item, section: section.label })),
  )
    .filter(
      ({ to }) =>
        pathname === to || (to !== '/' && pathname.startsWith(`${to}/`)),
    )
    .sort((a, b) => b.to.length - a.to.length)[0];
}
