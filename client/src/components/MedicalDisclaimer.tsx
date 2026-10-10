/** Rappel obligatoire : l'application ne remplace pas un professionnel de santé. */
export function MedicalDisclaimer() {
  return (
    <p className="text-sm text-muted-foreground">
      Conseils généraux de posture et d'exercices.{' '}
      <strong>Ne remplace pas l'avis d'un professionnel de santé.</strong>
    </p>
  );
}
