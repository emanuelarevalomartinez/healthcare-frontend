export interface ConsultationApiResponse {
  id: string;
  consultationName: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  observations: string;
  consultationDate: string;
  nextReview: string;
  registrationDate: string;
  appointmentName: string;
  appointmentDateTime: string;
  doctorName: string;
  patientName: string;
}

export interface ConsultationCreateRequest {
  consultationName: string;
  appointmentId: string;
  createdByDoctor: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  observations?: string;
  consultationDate: string;
  nextReview?: string;
}

export interface ConsultationUpdateRequest {
  consultationName?: string;
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
