"use client";

import { routes } from "@/lib/routes/routes";
import { getTokenLocalStore } from "@/lib/utils/local-storage";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export default function AuthGuard({ children }: Readonly<PropsWithChildren>) {
  const router = useRouter();

  const isAuthenticated = typeof window !== "undefined" && getTokenLocalStore();

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
