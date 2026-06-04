import { AppSidebar } from "@/components/customs/app-sidebar";
import { SheetWrapper } from "@/components/customs/sheet-wrapper";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { routes } from "@/lib";
import { COOKIE_KEYS } from "@/lib/utils/cookies-types";
import { NavigationMenu } from "@/modules/navigation-menu/navigation-menu";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function DashBoardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

  if (!accessToken) {
    redirect(routes.auth.login);
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />

        <main className="w-full">
          <div className="flex flex-col w-full sticky top-0 z-20 bg-background">
            <div className="flex">
              <div className="flex rounded-xl h-12 w-12 items-center justify-center bg-card mt-4 mx-2">
                <SidebarTrigger size="icon" className="items-center" />
              </div>
              <NavigationMenu />
            </div>

            <hr className="w-full border-border" />
          </div>

          <div className="px-4 py-2">{children}</div>

          <SheetWrapper />
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
