'use client'

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
import { HEALTHCARE_ICON, routes, useLanguage, USER_ROLE } from "@/lib";
import { getUserDataLocalStore } from "@/lib/utils/local-storage";
import {
  BarChart,
  Calendar,
  ClipboardList,
  FileText,
  Heart,
  LayoutDashboard,
  PlusCircle,
  Stethoscope,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

interface MenuItem {
  label: string;
  icon: any;
  href: string;
  roles: USER_ROLE[];
}

export function AppSidebar() {

  const { dictionary } = useLanguage();

  const [userRole, setUserRole] = useState<USER_ROLE | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ALL_MENU_ITEMS: MenuItem[] = [
    // Dashboard
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: [USER_ROLE.ADMIN, USER_ROLE.DOCTOR, USER_ROLE.RECEPTIONIST],
    },
    // Admin only
    {
      label: "Gestión de Usuarios",
      icon: Users,
      href: routes.users.root,
      roles: [USER_ROLE.ADMIN],
    },
    {
      label: "Médicos",
      icon: Stethoscope,
      href: routes.doctors.root,
      roles: [USER_ROLE.ADMIN],
    },
    {
      label: "Reportes",
      icon: BarChart,
      href: "/reports",
      roles: [USER_ROLE.ADMIN],
    },
    // Patients (all roles)
    {
      label: "Pacientes",
      icon: Heart,
      href: routes.patients.root,
      roles: [USER_ROLE.ADMIN, USER_ROLE.DOCTOR, USER_ROLE.RECEPTIONIST],
    },
    // Appointments (all roles)
    {
      label: "Agenda / Citas",
      icon: Calendar,
      href: "/appointments",
      roles: [USER_ROLE.ADMIN, USER_ROLE.DOCTOR, USER_ROLE.RECEPTIONIST],
    },
    // Receptionist only
    {
      label: "Nueva Cita",
      icon: PlusCircle,
      href: "/appointments/new",
      roles: [USER_ROLE.RECEPTIONIST],
    },
    // Consultations (Admin & Doctor)
    {
      label: "Consultas Médicas",
      icon: ClipboardList,
      href: "/consultations",
      roles: [USER_ROLE.ADMIN, USER_ROLE.DOCTOR],
    },
    // Doctor only
    {
      label: "Consultas de Hoy",
      icon: ClipboardList,
      href: "/consultations/today",
      roles: [USER_ROLE.DOCTOR],
    },
    {
      label: "Historial de Consultas",
      icon: FileText,
      href: "/consultations/history",
      roles: [USER_ROLE.DOCTOR],
    },
  ];

  const getMenuItemsByRole = (role: USER_ROLE): MenuItem[] => {
    return ALL_MENU_ITEMS.filter((item) => item.roles.includes(role));
  };

  useEffect(() => {
    const userData = getUserDataLocalStore();
    if (userData) {
      setUserRole(userData.role);
      setMenuItems(getMenuItemsByRole(userData.role));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Sidebar className="border border-border">
        <SidebarHeader className="p-4 border-b">
          <h1 className="text-xl font-bold text-blue-600">Clínica Salud</h1>
          <p className="text-xs text-gray-500 mt-1">Cargando...</p>
        </SidebarHeader>
      </Sidebar>
    );
  }

  if (!userRole) {
    return null;
  }

  return (
    <Sidebar className="border border-border">
      {/* Header */}
      <SidebarHeader className="flex justify-center p-4 border-b h-20 border-border">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={HEALTHCARE_ICON.src} alt={HEALTHCARE_ICON.alt} />
            <AvatarFallback> {HEALTHCARE_ICON.alt} </AvatarFallback>
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

      {/* Content */}
      <SidebarContent>
        {/* Main Menu Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                    <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                   {/*  <a href={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </a> */}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-border text-xs">
        <p>Versión 1.0.0</p>
        <p className="mt-1">© 2026 todos los derechos reservados</p>
      </SidebarFooter>
    </Sidebar>
  );
}
