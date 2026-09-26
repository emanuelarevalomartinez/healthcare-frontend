"use client";

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
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  HEALTHCARE_ICON,
  routes,
  useLanguage,
  USER_ROLE,
} from "@/lib";
import { getUserDataLocalStore } from "@/lib/utils/local-storage";
import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import Link from "next/link";
import { getMenuItemsByRole, getSidebarMenuItems, MenuItem } from "./sidebar-menu-items";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const { dictionary } = useLanguage();
  const t = dictionary.sidebar;
  const pathname = usePathname();

  const [userRole, setUserRole] = useState<USER_ROLE | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const allMenuItems: MenuItem[] = useMemo(
    () => getSidebarMenuItems(dictionary),
    [t]
  );

  const menuItems: MenuItem[] = useMemo(() => {
    if (!userRole) return [];
    return getMenuItemsByRole(allMenuItems, userRole);
  }, [allMenuItems, userRole]);

  useEffect(() => {
    const userData = getUserDataLocalStore();
    if (userData) {
      setUserRole(userData.role);
    }
    setIsLoading(false);
  }, []);

  const isRouteActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (isLoading) {
    return (
      <Sidebar className="border border-border">
        <SidebarHeader className="flex justify-center p-4 border-b h-20 border-border">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage
                src={HEALTHCARE_ICON.src}
                alt={HEALTHCARE_ICON.alt}
              />
              <AvatarFallback>{HEALTHCARE_ICON.alt}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight leading-none mb-1">
                HealthCare
              </span>
              <span className="text-xs text-muted-foreground">
                {dictionary.system.subtitle}
              </span>
            </div>
          </div>
        </SidebarHeader>
      </Sidebar>
    );
  }

  if (!userRole) {
    return null;
  }

  return (
    <Sidebar className="border border-border">
      <SidebarHeader className="flex justify-center p-4 border-b h-20 border-border">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={HEALTHCARE_ICON.src} alt={HEALTHCARE_ICON.alt} />
            <AvatarFallback>{HEALTHCARE_ICON.alt}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight leading-none mb-1">
              HealthCare
            </span>
            <span className="text-xs text-muted-foreground">
              {dictionary.system.subtitle}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t.menuLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const active = isRouteActive(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={
                        active ? "border sm:border-none sm:bg-card" : ""
                      }
                    >
                      <Link href={item.href}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border text-xs">
        <p>{t.footer.version} 1.0.0</p>
        <p className="mt-1">
          © {new Date().getFullYear()} {t.footer.copyright}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
