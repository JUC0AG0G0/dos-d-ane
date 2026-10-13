import type { ReactNode } from 'react';
import { LEGAL_UPDATED_AT } from '../legal.config';

export function LegalDocument({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="grid gap-8 [&_a]:font-medium [&_a]:text-primary [&_a]:hover:underline">
      <header className="grid gap-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : {LEGAL_UPDATED_AT}
        </p>
        {intro && <div className="text-muted-foreground">{intro}</div>}
      </header>
      {children}
    </article>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="grid scroll-mt-6 gap-3 leading-relaxed [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-1 [&_ul]:pl-5"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function ToComplete({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-warning-border px-1 text-warning-foreground">
      [À compléter : {children}]
    </mark>
  );
}
