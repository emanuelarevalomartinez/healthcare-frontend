"use client";

import { routes } from "@/lib";
import { deleteConsultationSelectedDateToViewLocalStorage } from "@/lib/utils/local-storage";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function ConsultationNavigationWatcher() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    const previousWasConsultations =
      previousPathname.current?.startsWith(routes.consultations.root) ?? false;

    const currentIsConsultations =
      pathname.startsWith(routes.consultations.root);

    if (previousWasConsultations && !currentIsConsultations) {
      deleteConsultationSelectedDateToViewLocalStorage();
    }

    previousPathname.current = pathname;
  }, [pathname]);

  return null;
}