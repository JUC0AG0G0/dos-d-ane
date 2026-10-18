import { Fragment } from 'react';
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
import { useCurrentUser } from '@/features/auth';

export function AppLayout() {
  const { pathname } = useLocation();
  const breadcrumb = findBreadcrumb(pathname);

  useCurrentUser();

  return (
    // Barre latérale toujours ouverte sur ordinateur (pas de repli) ; sur
    // téléphone, le bouton l'ouvre par-dessus la page.
    <SidebarProvider open onOpenChange={() => undefined}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <Separator orientation="vertical" className="mr-2 h-4! md:hidden" />
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
