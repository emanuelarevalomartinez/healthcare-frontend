

import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib";
import Cookies from "js-cookie";
import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";

export function NavigationUserLanguage() {

  const { dictionary } = useLanguage();

  const router = useRouter();

  // FIXME corregir este any por tipo de dato language
  const handleChangeLanguage = (newLanguage: any) => {
    Cookies.set("language", newLanguage);
    router.refresh();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-xl bg-card gap-1"
          >
            <Languages className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 rounded-xl bg-card">
          <DropdownMenuLabel>{dictionary.system.language}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center justify-between"
            onClick={() => handleChangeLanguage("es")}
          >
            <span>Español</span>
            <span className="text-xs text-muted-foreground">ES</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center justify-between"
            onClick={() => handleChangeLanguage("en")}
          >
            <span>English</span>
            <span className="text-xs text-muted-foreground">EN</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
