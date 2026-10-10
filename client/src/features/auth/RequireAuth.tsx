import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';

/** Laisse passer les routes enfants seulement si l'utilisateur est connecté. */
export function RequireAuth() {
  const isSignedIn = useAuthStore((state) => state.accessToken !== null);
  const location = useLocation();
  return isSignedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
}

/** Pages de connexion et d'inscription : renvoie à l'accueil si déjà connecté. */
export function RedirectIfSignedIn() {
  const isSignedIn = useAuthStore((state) => state.accessToken !== null);
  return isSignedIn ? <Navigate to="/" replace /> : <Outlet />;
}
