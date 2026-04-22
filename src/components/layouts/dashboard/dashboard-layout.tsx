import AuthGuard from "@/modules/auth/provider/auth-guard";
import { PropsWithChildren } from "react";

export default function DashBoardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <AuthGuard>
      <div>{children}</div>
    </AuthGuard>
  );
}
