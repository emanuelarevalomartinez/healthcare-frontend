import { format, parse } from "date-fns";

export function formatApiDateToInputString(date: string | Date | undefined | null): string {
  if (!date) return "";
  return String(date).split("T")[0];
}

export function parseInputStringToDate(dateString: string | undefined | null): Date | undefined {
  if (!dateString) return undefined;
  return parse(dateString, "yyyy-MM-dd", new Date());
}

export function formatDisplayDateTime(date: string | Date | undefined | null): string {
  if (!date) return "";
  return format(new Date(date), "yyyy-MM-dd HH:mm");
}

export function formatSelectedDateToInputString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}