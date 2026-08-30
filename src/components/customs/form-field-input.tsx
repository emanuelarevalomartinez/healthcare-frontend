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
}

export function FormFieldInput({
  id,
  label,
  error,
  register,
  disabled,
  type = "text",
  placeholder,
  className,
  onChange,
  ...props
}: FormFieldInputProps) {
  const isNumeric = type === "number";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumeric) {
      event.target.value = event.target.value.replace(/[^0-9.]/g, "");
    }

    onChange?.(event);
    register.onChange(event);
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>

      <Input
        id={id}
        type={isNumeric ? "text" : type}
        placeholder={placeholder}
        disabled={disabled}
        inputMode={isNumeric ? "decimal" : props.inputMode}
        className={`${isNumeric ? "text-right" : ""} ${className ?? ""}`}
        {...register}
        {...props}
        onChange={handleChange}
        aria-invalid={error ? "true" : "false"}
      />

      <div className="h-5 text-sm text-red-500">
        {error ? error : <>&nbsp;</>}
      </div>
    </div>
  );
}
