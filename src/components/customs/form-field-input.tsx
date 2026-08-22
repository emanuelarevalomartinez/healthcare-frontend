"use client";

import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface FormFieldInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  register: UseFormRegisterReturn;
  integer?: boolean;
}

export function FormFieldInput({
  id,
  label,
  error,
  register,
  disabled,
  type = "text",
  placeholder,
  integer = false,
  className,
  ...props
}: FormFieldInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>

      <Input
        id={id}
        type={integer ? "number" : type}
        placeholder={placeholder}
        disabled={disabled}
        step={integer ? 1 : props.step}
        inputMode={integer ? "numeric" : props.inputMode}
        className={`${integer ? "text-right" : ""} ${
          className ?? ""
        }`}
        {...register}
        aria-invalid={error ? "true" : "false"}
        {...props}
      />

      <div className="text-sm h-5 text-red-500">
        {error ? error : <>&nbsp;</>}
      </div>
    </div>
  );
}