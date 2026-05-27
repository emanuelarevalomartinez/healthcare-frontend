import type { Metadata } from "next";
import "./globals.css";
import DashBoardLayout from "@/components/layouts/dashboard/dashboard-layout";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  AppProvider,
  AuthProvider,
  LanguageProvider,
} from "@/lib";
import { getLanguage } from "@/lib/language/language";

export const metadata: Metadata = {
  title: "HealthCare",
  description:
    "This is an web application designed to manage the complete operational workflow of a small private medical clinic.",
  icons: {
    icon: "/icons/health_care.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const language = await getLanguage();

  return (
    <html className="dark">
      <TooltipProvider>
        <LanguageProvider language={language}>
          <AuthProvider>
            <AppProvider>
              <body className="bg-background text-foreground">
                <div>
                  <DashBoardLayout>{children}</DashBoardLayout>
                </div>
                <Toaster
                  position="bottom-right"
                  richColors
                  toastOptions={{
                    style: {
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-lg)",
                    },
                  }}
                />
              </body>
            </AppProvider>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </html>
  );
}
