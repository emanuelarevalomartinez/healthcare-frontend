import * as React from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children?: React.ReactNode;
  onBack?: () => void;
}

export function SectionHeader({
  title,
  description,
  children,
  className,
  onBack,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${onBack ? "pb-3" : "border-b border-border pb-5"}`,
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 rounded-full shrink-0"
            onClick={onBack}
            aria-label="Volver atrás"
          >
            <ArrowLeftIcon className="size-5 text-muted-foreground hover:text-foreground" />
          </Button>
        )}
        
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {children && (
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {children}
        </div>
      )}
    </div>
  );
}