import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { findNavItem } from '@/config/navigation';
import { authService } from '@/services';
import { useAuthStore } from '@/store';

/** Pages de l'utilisateur connecté : barre latérale, en-tête, contenu. */
export function AppLayout() {
  const { pathname } = useLocation();
  const page = findNavItem(pathname);

  // Met à jour l'utilisateur (nom, rôle) ; un 401 vide la session.
  useEffect(() => {
    authService
      .me()
      .then((user) => useAuthStore.getState().setUser(user))
      .catch(() => undefined);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4!" />
          {page && (
            <p className="text-sm">
              <span className="text-muted-foreground">{page.section}</span>
              <span className="mx-2 text-muted-foreground">›</span>
              <span className="font-medium">{page.label}</span>
            </p>
          )}
        </header>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
