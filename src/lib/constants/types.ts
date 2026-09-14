import { QUERY_PARAMS, REDIRECT_REASONS } from "./constants";

export enum USER_ROLE {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  RECEPTIONIST = "RECEPTIONIST",
}

export enum APPOINTMENT_STATUS {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  ATTENDED = "ATTENDED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export enum ALERT_ACTION {
   DELETE = "DELETE",
   CONFIRM = "CONFIRM",
}

export enum DOCTOR_SCHEDULE_DAY_OF_WEEK {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY",
}

export type FormMode = "create" | "edit" | "details";
export type DoctorFormMode = "create" | "complete";


export type RedirectReason =
  (typeof REDIRECT_REASONS)[keyof typeof REDIRECT_REASONS];

export type QueryParameter = (typeof QUERY_PARAMS)[keyof typeof QUERY_PARAMS];
