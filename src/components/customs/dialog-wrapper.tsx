"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  preventOutsideClose?: boolean;
};

export function DialogWrapper({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  preventOutsideClose = false,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={showCloseButton}
        onPointerDownOutside={(event) => {
          if (preventOutsideClose) {
            event.preventDefault();
          }
        }}
        className={cn("bg-card", className)}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}
