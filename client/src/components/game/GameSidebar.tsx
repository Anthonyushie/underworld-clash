import { 
  Home, 
  Package, 
  Store, 
  Swords, 
  Trophy, 
  Settings,
  Crown,
  Shield
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const gameRoutes = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Marketplace", url: "/marketplace", icon: Store },
  { title: "PvP Arena", url: "/arena", icon: Swords },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
];

const adminRoutes = [
  { title: "Admin Panel", url: "/admin", icon: Shield },
];

export function GameSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = window.location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = (isActive: boolean) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-gold w-full flex items-center gap-2 px-3 py-2 rounded-md" 
      : "hover:bg-accent hover:text-accent-foreground w-full flex items-center gap-2 px-3 py-2 rounded-md";

  const handleNavigation = (url: string) => {
    window.location.href = url;
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <SidebarContent className="bg-gradient-empire">
        {/* Main Game Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary">
            <Crown className="h-4 w-4 mr-2" />
            {!collapsed && "Game"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gameRoutes.map((route) => (
                <SidebarMenuItem key={route.title}>
                  <SidebarMenuButton asChild>
                    <button 
                      onClick={() => handleNavigation(route.url)}
                      className={getNavCls(isActive(route.url))}
                    >
                      <route.icon className="h-4 w-4" />
                      {!collapsed && <span>{route.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            <Settings className="h-4 w-4 mr-2" />
            {!collapsed && "Admin"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminRoutes.map((route) => (
                <SidebarMenuItem key={route.title}>
                  <SidebarMenuButton asChild>
                    <button 
                      onClick={() => handleNavigation(route.url)}
                      className={getNavCls(isActive(route.url))}
                    >
                      <route.icon className="h-4 w-4" />
                      {!collapsed && <span>{route.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}