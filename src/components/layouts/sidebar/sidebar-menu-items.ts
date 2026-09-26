import { routes, TranslationDictionary, USER_ROLE } from "@/lib";
import {
  BarChart,
  Calendar,
  ClipboardList,
  FileText,
  Heart,
  LayoutDashboard,
  Users,
} from "lucide-react";

export interface MenuItem {
  label: string;
  icon: any;
  href: string;
  roles: USER_ROLE[];
}

export const getSidebarMenuItems = (dictionary: TranslationDictionary) => {
  const t = dictionary.sidebar;

  return [
    {
      label: t.items.dashboard,
      icon: LayoutDashboard,
      href: routes.root,
      roles: [USER_ROLE.ADMIN, USER_ROLE.DOCTOR, USER_ROLE.RECEPTIONIST],
    },
    {
      label: t.items.users,
      icon: Users,
      href: routes.users.root,
      roles: [USER_ROLE.ADMIN],
    },
    {
      label: t.items.reports,
      icon: BarChart,
      href: routes.reports.root,
      roles: [USER_ROLE.ADMIN],
    },
    {
      label: t.items.patients,
      icon: Heart,
      href: routes.patients.root,
      roles: [USER_ROLE.ADMIN, USER_ROLE.DOCTOR, USER_ROLE.RECEPTIONIST],
    },
    {
      label: t.items.appointments,
      icon: Calendar,
      href: routes.appointments.root,
      roles: [USER_ROLE.ADMIN, USER_ROLE.DOCTOR, USER_ROLE.RECEPTIONIST],
    },
    {
      label: t.items.consultations,
      icon: ClipboardList,
      href: routes.consultations.root,
      roles: [USER_ROLE.ADMIN, USER_ROLE.DOCTOR],
    },
    {
      label: t.items.consultationsHistory,
      icon: FileText,
      href: routes.consultationsHistory.root,
      roles: [USER_ROLE.ADMIN, USER_ROLE.DOCTOR],
    },
  ];
};

export function getMenuItemsByRole(
  allItems: MenuItem[],
  role: USER_ROLE
): MenuItem[] {
  return allItems.filter((item) => item.roles.includes(role));
}
