export interface ConsultationApiResponse {
  id: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  observations: string;
  consultationDate: string;
  nextReview: string;
  registrationDate: string;
  doctorName: string;
  patientName: string;
}

export interface ConsultationCreateRequest {
  appointmentId: string;
  createdByDoctor: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  observations: string;
  consultationDate: string;
  nextReview: string;
}

export interface ConsultationUpdateRequest {
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  observations?: string;
  consultationDate?: string;
  nextReview?: string;
}

export interface GetConsultationsFilteredParams {
  page?: number;
  size?: number;
  ascending: boolean;
  date: string;
}

export interface GetConsultationsSearchedParams {
  page?: number;
  size?: number;
  ascending?: boolean;
  searchTerm: string;
}
