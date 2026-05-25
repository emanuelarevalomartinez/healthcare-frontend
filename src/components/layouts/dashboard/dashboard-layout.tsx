"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/lib";
import AuthGuard from "@/modules/auth/provider/auth-guard";
import { NavigationMenu } from "@/modules/navigation-menu/navigation-menu";
import { PropsWithChildren } from "react";

export default function DashBoardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const { isAuthenticated } = useAuth();

  return (
    <AuthGuard>
      <div className="">
        <SidebarProvider>
          {isAuthenticated && <AppSidebar />}

          <main className="w-full">
            <div className="flex w-full">
              <div className="flex rounded-xl h-12 w-12 items-center justify-center bg-card mt-4 mx-2">
                <SidebarTrigger size="icon" className="items-center" />
              </div>
              {isAuthenticated && <NavigationMenu />}
            </div>
            <hr className="border-b w-full border-border" />
            <div>{children}</div>
          </main>
        </SidebarProvider>
      </div>
    </AuthGuard>
  );
}
