'use client'

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getTokenLocalStore } from "@/lib/utils/local-storage";
import AuthGuard from "@/modules/auth/provider/auth-guard";
import { PropsWithChildren, useEffect, useState } from "react";

export default function DashBoardLayout({
  children,
}: Readonly<PropsWithChildren>) {

  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = getTokenLocalStore();
    setIsAuthenticated(!!token);
  }, []);

  if (!mounted) {
    return null;
  }


  return (
    <AuthGuard>
      <div className="">
        <SidebarProvider>
          {/*    <AppSidebar /> */}
          { isAuthenticated &&  <AppSidebar /> }
          <main>
            {/*   <SidebarTrigger /> */}
            { isAuthenticated && <SidebarTrigger /> }
            {children}
          </main>
        </SidebarProvider>
      </div>
    </AuthGuard>
  );
}
