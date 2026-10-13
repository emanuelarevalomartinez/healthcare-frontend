import { CONSULTATION_HISTORIES_EVENT_TYPE } from "@/lib";

export interface ConsultationHistoriesApiResponse {
   date: string;
   histories: ConsultationHistoryApiResponse[];
}

export interface ConsultationHistoryApiResponse {
    id: string;
    consultationId: string;
    appointmentId: string;
    patientId: string;
    doctorId: string;
    performedByUserId: string;
    consultationName: string;
    appointmentName: string;
    patientName: string;
    doctorName: string;
    performedByUserName: string;
    eventType: CONSULTATION_HISTORIES_EVENT_TYPE;
    registeredAt: string;
}

export interface GetConsultationHistoriesGroupParams {
  page?: number;
  size?: number;
  ascending?: boolean;
}