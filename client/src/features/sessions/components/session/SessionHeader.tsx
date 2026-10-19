import type { ReactNode } from 'react';
import type { SessionStatus } from '../../types/sessions.types';
import { SessionStatusBadge } from '../SessionStatusBadge';

/** En-tête d'une vue de session : titre, badge d'état, sous-titre, actions. */
export function SessionHeader({
  title,
  status,
  description,
  actions,
}: {
  title: string;
  status: SessionStatus;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="grid gap-1">
        <h1 className="flex flex-wrap items-center gap-3 text-3xl font-bold">
          {title}
          <SessionStatusBadge status={status} />
        </h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
