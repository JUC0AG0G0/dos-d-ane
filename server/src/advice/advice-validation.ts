import { BadRequestException, ValidationPipe } from '@nestjs/common';

/** Source : libellé et lien renseignés ensemble, ou aucun des deux. */
export function assertSource(
  sourceLabel: string | null,
  sourceUrl: string | null,
): void {
  if ((sourceLabel === null) !== (sourceUrl === null)) {
    throw new BadRequestException(
      'Indiquez le libellé et le lien de la source, ou aucun des deux',
    );
  }
}

/** Ordre par glisser-déposer : la liste doit contenir exactement tous les identifiants. */
export function assertCompleteOrder(ids: string[], existing: string[]): void {
  const known = new Set(existing);
  if (ids.length !== known.size || ids.some((id) => !known.has(id))) {
    throw new BadRequestException(
      `L’ordre doit contenir les ${known.size} éléments, chacun une fois`,
    );
  }
}

/**
 * Le pipe global valide les corps sans les transformer : celui-ci renvoie
 * l'objet transformé (textes nettoyés, sources vides ramenées à null).
 */
export const TRANSFORM_PIPE = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});
