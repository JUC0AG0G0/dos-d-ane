export const ANALYSIS_ROUTES = {
  sessions: '/analysis-sessions',
  session: (id: string) => `/analysis-sessions/${encodeURIComponent(id)}`,
} as const;
