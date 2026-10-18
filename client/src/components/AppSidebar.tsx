import {
  ChevronRight,
  ChevronsUpDown,
  Info,
  LogOut,
  Settings,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { matches, NAV_SECTIONS } from '@/config/navigation';
import { useLogout } from '@/features/auth';
import { useAuthStore } from '@/store';

export function AppSidebar() {
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const initials = (user?.displayName ?? '?').slice(0, 2).toUpperCase();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/">
                <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-base">
                  🫏
                </span>
                <span className="font-semibold group-data-[collapsible=icon]:hidden">
                  Dos d'âne
                </span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV_SECTIONS.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items
                  .filter(
                    ({ roles }) =>
                      !roles || (user && roles.includes(user.role)),
                  )
                  .map((item) =>
                    item.children ? (
                      // Remonté quand on entre dans ses pages ou qu’on en sort : ouvert
                      // sur ses pages, fermé ailleurs ; le chevron le replie ou le déplie.
                      <NavGroup
                        key={`${item.to}:${matches(pathname, item.to)}`}
                        item={item}
                        pathname={pathname}
                      />
                    ) : (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton
                          asChild
                          isActive={
                            item.to === '/'
                              ? pathname === item.to
                              : matches(pathname, item.to)
                          }
                          tooltip={item.label}
                        >
                          <NavLink to={item.to}>
                            <item.icon />
                            <span>{item.label}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ),
                  )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <p className="flex items-start gap-2 rounded-md bg-sidebar-accent/50 p-3 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          <Info className="mt-px size-4 shrink-0 text-sidebar-primary" />
          Ne remplace pas l'avis d'un professionnel de santé.
        </p>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user?.displayName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuLabel className="font-normal text-muted-foreground">
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NavLink to="/settings">
                    <Settings />
                    Paramètres
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => void logout()}
                >
                  <LogOut />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

type NavItem = (typeof NAV_SECTIONS)[number]['items'][number];

/** Entrée avec sous-pages : un clic ouvre la première sous-page. */
function NavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = matches(pathname, item.to);
  const children = item.children ?? [];
  return (
    <Collapsible asChild defaultOpen={active}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
          <NavLink to={children[0]?.to ?? item.to}>
            <item.icon />
            <span>{item.label}</span>
          </NavLink>
        </SidebarMenuButton>
        <CollapsibleTrigger asChild>
          <SidebarMenuAction className="data-[state=open]:rotate-90">
            <ChevronRight />
            <span className="sr-only">Afficher les sous-pages</span>
          </SidebarMenuAction>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {children.map(({ to, label, children: sections }) => (
              <SidebarMenuSubItem key={to}>
                <SidebarMenuSubButton
                  asChild
                  isActive={matches(pathname, to) && !sections}
                >
                  <NavLink to={sections?.[0]?.to ?? to}>
                    <span>{label}</span>
                  </NavLink>
                </SidebarMenuSubButton>
                {/* Sections de la sous-page (onglets de Conseils et exercices). */}
                {sections && (
                  <SidebarMenuSub className="mr-0 pr-0">
                    {sections.map((section) => (
                      <SidebarMenuSubItem key={section.to}>
                        <SidebarMenuSubButton
                          asChild
                          size="sm"
                          isActive={matches(pathname, section.to)}
                        >
                          <NavLink to={section.to}>
                            <span>{section.label}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
