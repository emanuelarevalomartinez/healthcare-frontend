'use client'

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SystemAlert } from "./system-alert";
import { useApp } from "@/lib";

interface SheetContentWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SheetWrapper() {

   const { isSheetOpen, setIsSheetOpen } = useApp();


  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent className="border-border">
        <SheetHeader>
          <SheetTitle>Notificaciones</SheetTitle>
          <SheetDescription>
            Visualiza tus notificaciones.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <SystemAlert/>
          <SystemAlert/>
          <SystemAlert/>
          <SystemAlert/>
          <SystemAlert/>
          <SystemAlert/>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
