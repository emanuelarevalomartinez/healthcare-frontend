import type { Metadata } from "next";
import "./globals.css";
import DashBoardLayout from "@/components/layouts/dashboard/dashboard-layout";

export const metadata: Metadata = {
  title: "HealthCare",
  description:
    "This is an web application designed to manage the complete operational workflow of a small private medical clinic.",
  icons: {
    icon: "/icons/health_care.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark">
      <body className="bg-background text-foreground">
        <DashBoardLayout>{children}</DashBoardLayout>
      </body>
    </html>
  );
}
