import DashBoardLayout from "@/components/layouts/dashboard/dashboard-layout";
import { PropsWithChildren } from "react";

export default async function Layout({
  children,
}: Readonly<PropsWithChildren>) {
  return <DashBoardLayout>{children}</DashBoardLayout>;
}
