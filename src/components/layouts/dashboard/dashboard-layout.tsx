"use client";

import { AppSidebar } from "@/components/customs/app-sidebar";
import { SheetWrapper } from "@/components/customs/sheet-wrapper";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useApp, useAuth } from "@/lib";
import AuthGuard from "@/modules/auth/provider/auth-guard";
import { NavigationMenu } from "@/modules/navigation-menu/navigation-menu";
import { PropsWithChildren } from "react";

export default function DashBoardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const { isAuthenticated } = useAuth();
  const { isSheetOpen, setIsSheetOpen } = useApp();

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
            <hr className="w-full border-border" />
            <div>{children}</div>
            {isAuthenticated && <SheetWrapper open={isSheetOpen} onOpenChange={setIsSheetOpen}/>}
          </main>
        </SidebarProvider>
      </div>
    </AuthGuard>
  );
}
