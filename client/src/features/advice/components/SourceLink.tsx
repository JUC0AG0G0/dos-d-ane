import { ExternalLink } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Source } from '../types/advice.types';

/** Source cliquable, ouverte dans un nouvel onglet. Rien si elle est absente. */
export function SourceLink({
  sourceLabel,
  sourceUrl,
  className,
}: Source & { className?: string }) {
  if (!sourceLabel || !sourceUrl) return null;
  return (
    <a
      href={sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium text-primary underline underline-offset-2 hover:text-primary/80',
        className,
      )}
    >
      {sourceLabel}
      <ExternalLink className="size-3" aria-hidden />
      <span className="sr-only">(nouvel onglet)</span>
    </a>
  );
}
