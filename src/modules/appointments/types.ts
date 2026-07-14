import { APPOINTMENT_STATUS } from "@/lib";

export interface AppointmentApiResponse {
  id: string;
  appointmentDateTime: string;
  durationMinutes: number;
  consultationReason: string;
  status: APPOINTMENT_STATUS;
  cancelledBy: string,
  cancellationReason: string,
  createdBy: string;
  createdAt: string;
  confirmedAt: string;
  attendedAt: string;
  notes: string;
}

