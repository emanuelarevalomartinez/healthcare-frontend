import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { routes, useAuth } from "@/lib";
import { deleteUserAuthCredentialsLocalStorage, deleteUserDataLocalStorage, getUserDataLocalStore } from "@/lib/utils/local-storage";
import { UserDetailsInterface } from "@/modules/user/types";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function NavigationUserProfile() {
  const { checkAuth } = useAuth();
  const router = useRouter();

  const [userDetails, setUserDetails] = useState<UserDetailsInterface>({
    username: "",
    role: null,
    email: "",
  });

  function handleLogout() {
    deleteUserAuthCredentialsLocalStorage();
    deleteUserDataLocalStorage();
    router.push(routes.auth.login);
    checkAuth();
    toast("Sesión cerrada con exito.");
  }

  useEffect(() => {
  const userData = getUserDataLocalStore();
  if (userData) {
    setUserDetails({
      username: userData.username,
      role: userData.role,
      email: userData.email,
    });
  }
}, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-auto gap-3 rounded-2xl bg-card px-3 py-2 text-left hover:bg-muted"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 font-semibold text-primary text-xs">
                {`${userDetails.username.charAt(0).toUpperCase()}${userDetails.username.charAt(1).toUpperCase()}`}
              </AvatarFallback>
            </Avatar>

            <div className="hidden flex-col xl:flex">
              <span className="text-sm font-semibold leading-none mb-1">
                {userDetails.username}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {userDetails.role}
              </span>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground xl:block opacity-60" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 rounded-xl">
          <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
          <DropdownMenuItem>Configuración</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => {
              handleLogout();
            }}
          >
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
