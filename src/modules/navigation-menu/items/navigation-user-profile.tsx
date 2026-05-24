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
import { ChevronDown } from "lucide-react";

export function NavigationUserProfile() {
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
                CM
              </AvatarFallback>
            </Avatar>

            <div className="hidden flex-col xl:flex">
              <span className="text-sm font-semibold leading-none mb-1">
                Dr. Carlos Martínez
              </span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Cardiólogo
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
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
