import { QUERY_PARAMS, REDIRECT_REASONS } from "./constants";

export enum USER_ROLE {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  RECEPTIONIST = "RECEPTIONIST",
}

export type FormMode = "create" | "edit" | "details";
export type DoctorFormMode = "create" | "complete";

export type RedirectReason =
  (typeof REDIRECT_REASONS)[keyof typeof REDIRECT_REASONS];

export type QueryParameter = (typeof QUERY_PARAMS)[keyof typeof QUERY_PARAMS];
