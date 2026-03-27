import AuthGuard from "@/modules/auth/provider/auth-guard";
import { PropsWithChildren } from "react";

export default function DashBoardLayout({ children }: Readonly<PropsWithChildren>) {
  {
    /* <AuthGuard>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset className="flex-1 min-w-0">
          <DashboardNavbar />
          <div className="flex flex-1 flex-col gap-4  @container">
            {children}
            <div className="bg-muted/50 flex-1 rounded-xl md:min-h-min" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard> */
  }

  return (
    <AuthGuard>
      <div> 
        {children}
      </div>
    </AuthGuard>
  );
}
