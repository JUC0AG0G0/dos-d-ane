import { Fragment, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { findBreadcrumb } from '@/config/navigation';
import { authService } from '@/services';
import { useAuthStore } from '@/store';

/** Pages de l'utilisateur connecté : barre latérale, en-tête, contenu. */
export function AppLayout() {
  const { pathname } = useLocation();
  const breadcrumb = findBreadcrumb(pathname);

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
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumb.map(({ to, label }, index) => (
                <Fragment key={to}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {index < breadcrumb.length - 1 ? (
                      <BreadcrumbLink asChild>
                        <Link to={to}>{label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
