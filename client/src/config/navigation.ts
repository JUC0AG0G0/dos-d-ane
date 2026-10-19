import {
  Activity,
  BookOpen,
  House,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import type { Role } from '@/types/user';

interface SubPage {
  to: string;
  label: string;
  /** Sections de la sous-page, affichées en dessous dans la barre latérale. */
  children?: SubPage[];
}

/** Entrée de la barre latérale. Avec des sous-pages, elle se déplie sur ses
 * pages et un clic ouvre la première. */
interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles?: Role[];
  children?: SubPage[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Application',
    items: [
      { to: '/', label: 'Accueil', icon: House },
      { to: '/sessions', label: 'Sessions', icon: Activity },
      {
        to: '/conseils',
        label: 'Conseils et exercices',
        icon: BookOpen,
        children: [
          { to: '/conseils/installation', label: 'Bien s’installer' },
          { to: '/conseils/exercices', label: 'Exercices' },
          { to: '/conseils/douleur', label: 'En cas de douleur' },
        ],
      },
    ],
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
      {
        to: '/admin',
        label: 'Administration',
        icon: ShieldCheck,
        roles: ['admin'],
        children: [
          { to: '/admin/utilisateurs', label: 'Utilisateurs' },
          {
            to: '/admin/conseils',
            label: 'Conseils et exercices',
            children: [
              // Mêmes noms et même ordre que Conseils côté utilisateur.
              { to: '/admin/conseils/installation', label: 'Bien s’installer' },
              { to: '/admin/conseils/exercices', label: 'Exercices' },
              { to: '/admin/conseils/douleur', label: 'En cas de douleur' },
            ],
          },
          { to: '/admin/medias', label: 'Médias' },
        ],
      },
    ],
  },
];

export const matches = (pathname: string, to: string) =>
  pathname === to || (to !== '/' && pathname.startsWith(`${to}/`));

export function findBreadcrumb(pathname: string): SubPage[] {
  const item = NAV_SECTIONS.flatMap((section) => section.items)
    .filter(({ to }) => matches(pathname, to))
    .sort((a, b) => b.to.length - a.to.length)[0];
  if (!item) return [];
  const child = item.children?.find(({ to }) => matches(pathname, to));
  if (!child) return [item];
  const section = child.children?.find(({ to }) => matches(pathname, to));
  return section ? [item, child, section] : [item, child];
}
