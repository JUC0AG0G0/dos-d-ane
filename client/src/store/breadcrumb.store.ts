import { create } from 'zustand';

interface BreadcrumbState {
  /** Dernier niveau du fil d'Ariane fixé par la page affichée, pour son chemin. */
  page: { pathname: string; label: string } | null;
  setPage: (page: { pathname: string; label: string } | null) => void;
}

/**
 * Fil d'Ariane des pages dont le titre dépend des données (« Session du
 * 15 oct. 2026 ») : la page le fixe avec usePageCrumb, AppLayout l'ajoute
 * après les niveaux de la navigation.
 */
export const useBreadcrumbStore = create<BreadcrumbState>()((set) => ({
  page: null,
  setPage: (page) => set({ page }),
}));
