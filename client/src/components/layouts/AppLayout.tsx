import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { NAV_ITEMS } from '@/config/navigation';
import { authService } from '@/services';
import { useAuthStore } from '@/store';

/** Pages de l'utilisateur connecté : barre latérale, en-tête, contenu. */
export function AppLayout() {
  const { pathname } = useLocation();
  const title = NAV_ITEMS.find((item) => item.to === pathname)?.label;

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
          <span className="text-sm font-medium">{title}</span>
        </header>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
        <footer className="border-t px-6 py-4">
          <MedicalDisclaimer />
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
