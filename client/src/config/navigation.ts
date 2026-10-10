import { House, Settings, type LucideIcon } from 'lucide-react';

interface SubPage {
  to: string;
  label: string;
}

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Sous-pages (onglets), affichées dans le fil d'Ariane. */
  children?: SubPage[];
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
    items: [
      {
        to: '/settings',
        label: 'Paramètres',
        icon: Settings,
        children: [
          { to: '/settings/account', label: 'Compte' },
          { to: '/settings/devices', label: 'Appareils connectés' },
          { to: '/settings/privacy', label: 'Confidentialité' },
        ],
      },
    ],
  },
];

const matches = (pathname: string, to: string) =>
  pathname === to || (to !== '/' && pathname.startsWith(`${to}/`));

/** Fil d'Ariane de la page affichée : page du menu, puis sous-page éventuelle. */
export function findBreadcrumb(pathname: string): SubPage[] {
  const item = NAV_SECTIONS.flatMap((section) => section.items)
    .filter(({ to }) => matches(pathname, to))
    .sort((a, b) => b.to.length - a.to.length)[0];
  if (!item) return [];
  const child = item.children?.find(({ to }) => matches(pathname, to));
  return child ? [item, child] : [item];
}
