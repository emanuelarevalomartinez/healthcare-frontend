"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { deleteAppointmentSelectedDateToViewLocalStorage } from "@/lib/utils/local-storage";
import { routes } from "@/lib";

export function AppointmentNavigationWatcher() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    const previousWasAppointments =
      previousPathname.current?.startsWith(routes.appointments.root) ?? false;

    const currentIsAppointments =
      pathname.startsWith(routes.appointments.root);

    if (previousWasAppointments && !currentIsAppointments) {
      deleteAppointmentSelectedDateToViewLocalStorage();
    }

    previousPathname.current = pathname;
  }, [pathname]);

  return null;
}