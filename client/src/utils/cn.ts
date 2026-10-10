import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Assemble des classes Tailwind ; en cas de conflit, la dernière gagne. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
