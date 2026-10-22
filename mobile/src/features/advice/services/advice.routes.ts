/** Routes des Conseils de l'API (mêmes que le site web). */
export const ADVICE_ROUTES = {
  exercises: '/advice/exercises',
  exercise: (id: string) => `/advice/exercises/${encodeURIComponent(id)}`,
  media: (id: string) => `/advice/media/${encodeURIComponent(id)}`,
} as const;
