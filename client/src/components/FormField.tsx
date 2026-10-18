import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';

interface FormFieldProps {
  label: string;
  /** id du champ, pour que le libellé le sélectionne au clic. */
  htmlFor?: string;
  /** Aide sous le champ. */
  hint?: ReactNode;
  /** id de l'aide, à reprendre dans aria-describedby du champ. */
  hintId?: string;
  className?: string;
  children: ReactNode;
}

/** Libellé, champ et aide en dessous. */
export function FormField({
  label,
  htmlFor,
  hint,
  hintId,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('grid content-start gap-2', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}
