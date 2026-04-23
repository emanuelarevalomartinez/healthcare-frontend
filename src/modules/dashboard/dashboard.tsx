"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
/* import { AppSidebar } from "@/components/app-sidebar" */

export const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
     {/*  <AppSidebar /> */}
      <main>
        <SidebarTrigger />
        {children}
         <div>
      <div className="bg-red-500 dark:bg-blue-500">hola desde el dashboard</div>
    </div>
      </main>
    </SidebarProvider>
   
  );
};
