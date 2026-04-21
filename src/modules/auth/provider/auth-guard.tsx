"use client";

import { routes } from "@/lib/routes/routes";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export default function AuthGuard({ children }: Readonly<PropsWithChildren>) {
  const router = useRouter();
  const isAuthenticated = false;

  useEffect(() => {
    if (!isAuthenticated) {

      // TODO esto debe redirigir inicialmente al login
      router.push(routes.auth.register);
    }
  }, [isAuthenticated]);

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center h-[75vh]">
          {children}
        </div>
        </div>
    </>
  );
}
