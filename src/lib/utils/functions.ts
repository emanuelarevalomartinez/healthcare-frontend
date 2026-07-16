import { format, parse } from "date-fns";
import { APPOINTMENT_STATUS } from "../constants";
import { BadgeType } from "@/components/customs/badge-wrapper";

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

export function formatDisplayDateTimeToLocaleString(
  date?: string | Date | null,
  locale: string = "en-US"
) {
  if (!date) return "";

  return new Date(date).toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDisplayDateToLocaleDateString(
  date?: string | Date | null,
  locale: string = "en-US"
) {
  if (!date) return "";

  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export const statusBadgeMap: Record<APPOINTMENT_STATUS, BadgeType> = {
  CONFIRMED: "green",
  SCHEDULED: "blue",
  ATTENDED: "gray",
  CANCELLED: "red",
  NO_SHOW: "red",
};