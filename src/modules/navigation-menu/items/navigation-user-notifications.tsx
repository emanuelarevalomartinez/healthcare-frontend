'use client'

import { Button } from "@/components/ui/button";
import { useApp } from "@/lib";
import { Bell } from "lucide-react";

export function NavigationUserNotifications() {

   const { isSheetOpen, setIsSheetOpen } = useApp();

  return (
    <>
      <Button
      onClick={ ()=> { setIsSheetOpen(true) } }
        variant="outline"
        size="icon"
        className="relative h-11 w-11 rounded-xl bg-card cursor-pointer"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
          3
        </span>
      </Button>
    </>
  );
}
