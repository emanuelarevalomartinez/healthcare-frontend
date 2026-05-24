import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";

export function NavigationUserTheme() {
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="h-11 w-11 rounded-xl bg-card"
      >
        <Moon className="h-5 w-5" />
      </Button>
    </>
  );
}
