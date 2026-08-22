"use client";

import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface FormFieldTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
  register: UseFormRegisterReturn;
}

export function FormFieldTextArea({
  id,
  label,
  error,
  register,
  disabled,
  placeholder,
  ...props
}: FormFieldTextAreaProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>

      <Textarea
        id={id}
        placeholder={placeholder}
        disabled={disabled}
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