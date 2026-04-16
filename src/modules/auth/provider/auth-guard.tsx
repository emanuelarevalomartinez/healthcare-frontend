"use client";

import { routes } from "@/lib/routes/routes";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export default function AuthGuard({ children }: Readonly<PropsWithChildren>) {
  const router = useRouter();
  const isAuthenticated = false;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(routes.auth.login);
    }
  }, [isAuthenticated]);

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="flex h-96">
          {children}
        </div>
        </div>
    </>
  );
}
