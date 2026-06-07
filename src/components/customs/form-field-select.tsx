"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormFieldSelectProps {
  id: string;
  label: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
}

export function FormFieldSelect({
  id,
  label,
  error,
  disabled,
  placeholder,
  value,
  onValueChange,
  options,
}: FormFieldSelectProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select disabled={disabled} onValueChange={onValueChange} value={value}>
        <SelectTrigger className="w-full" id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-secondary">
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="text-sm h-5 text-red-500">
        {error ? error : <>&nbsp;</>}
      </div>
    </div>
  );
}