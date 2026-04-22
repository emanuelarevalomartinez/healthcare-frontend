"use client";

import { routes } from "@/lib/routes/routes";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export default function AuthGuard({ children }: Readonly<PropsWithChildren>) {
  const router = useRouter();

  // FIXME corregir esto para que se guarde y obtenga correctamente el token

  const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("token") === "true";

  useEffect(() => {

    if (!isAuthenticated) {
      router.push(routes.auth.login);
    }
  }, [isAuthenticated]);

  return (
    <>
      {children}
    </>
  );
}
