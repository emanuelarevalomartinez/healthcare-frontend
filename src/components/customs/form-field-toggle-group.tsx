"use client";

import { UseFormRegisterReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface FormFieldToggleGroupProps {
  id: string;
  label: string;
  error?: string;
  register?: UseFormRegisterReturn;
  options: { value: string; label: string }[];
  type?: "single" | "multiple";
  variant?: "default" | "outline";
}

export function FormFieldToggleGroup({
  id,
  label,
  error,
  register,
  options,
  type = "multiple",
  variant = "default",
}: FormFieldToggleGroupProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>

      <ToggleGroup
        type={type}
        {...register}
        className="flex gap-2 flex-wrap"
      >
        {options.map((opt) => (
          <ToggleGroupItem
            key={opt.value}
            value={opt.value}
            aria-label={opt.label}
            variant={variant}
            className="px-3 py-2 bg-primary hover:bg-primary/90 cursor-pointer"
          >
            {opt.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="h-5 text-sm text-red-500">
        {error ? error : <>&nbsp;</>}
      </div>
    </div>
  );
}
