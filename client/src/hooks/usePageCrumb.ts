import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useBreadcrumbStore } from '@/store/breadcrumb.store';

/** Ajoute label au fil d'Ariane tant que la page est affichée (rien si null). */
export function usePageCrumb(label: string | null) {
  const { pathname } = useLocation();
  const setPage = useBreadcrumbStore((s) => s.setPage);
  useEffect(() => {
    setPage(label ? { pathname, label } : null);
    return () => setPage(null);
  }, [label, pathname, setPage]);
}
