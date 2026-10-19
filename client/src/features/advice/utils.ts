/** Durée courte : « 40 s », « 1 min », « 1 min 30 s ». */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest ? `${minutes} min ${rest} s` : `${minutes} min`;
}

/** Durée en toutes lettres : « 40 secondes », « 1 minute », « 2 minutes 30 ». */
export function formatDurationLong(seconds: number): string {
  if (seconds < 60) return `${seconds} secondes`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  const label = `${minutes} minute${minutes > 1 ? 's' : ''}`;
  return rest ? `${label} ${rest}` : label;
}
