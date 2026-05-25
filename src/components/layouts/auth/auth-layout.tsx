import { NavigationMenuAuth } from "@/modules/navigation-menu/navigation-menu-auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationMenuAuth />
      <div>
        <div className="flex w-screen h-full justify-center">
          <div className="flex h-full">{children}</div>
        </div>
      </div>
    </>
  );
}
