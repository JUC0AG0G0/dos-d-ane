import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { LEGAL_PAGES } from '../legal.config';

export function LegalLinks({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Informations légales"
      className={cn(
        'flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground',
        className,
      )}
    >
      {LEGAL_PAGES.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'hover:text-foreground hover:underline',
              isActive && 'font-medium text-primary',
            )
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
