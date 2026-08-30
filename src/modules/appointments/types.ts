import { APPOINTMENT_STATUS } from "@/lib";
import { string } from "zod";

export interface AppointmentApiResponse {
  id: string;
  appointmentDateTime: string;
  durationMinutes: number;
  consultationReason: string;
  status: APPOINTMENT_STATUS;
  cancelledBy?: string;
  cancellationReason: string;
  createdBy: string;
  createdAt: string;
  confirmedAt: string;
  attendedAt: string;
  notes: string;
  patientFullName: string;
  doctorFullName: string;
}

export interface AppointmentCreateRequest {
  patientId: string;
  doctorId: string;
  appointmentDateTime: string;
  durationMinutes: number;
  consultationReason: string;
  notes: string;
}

export interface AppointmentUpdateRequest {
  appointmentDateTime?: string;
  durationMinutes?: number;
  consultationReason?: string;
  status?: APPOINTMENT_STATUS;
  cancellationReason?: string;
  confirmedAt?: string;
  attendedAt?: string;
  notes?: string;
}

export enum APPOINTMENT_STATUS_TYPE {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  ATTENDED = "ATTENDED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}
