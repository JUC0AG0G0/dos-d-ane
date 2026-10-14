export function errorMessage(error) {
  switch (error?.name) {
    case 'NotAllowedError':
      return 'Autorisez la caméra dans les paramètres Windows.';
    case 'NotFoundError':
      return 'Aucune webcam détectée.';
    case 'NotReadableError':
      return 'La webcam est déjà utilisée par une autre application.';
    default:
      return error?.message || 'Le suivi n’a pas pu démarrer.';
  }
}

export function trackingAvailabilityMessage(frame) {
  if (frame.handsAvailable === false) {
    return 'Le suivi des mains est indisponible. La tête et la posture restent analysées.';
  }
  if (frame.faceAvailable === false) {
    return 'Le suivi détaillé du visage est indisponible. La posture reste partiellement mesurable.';
  }
  return '';
}
