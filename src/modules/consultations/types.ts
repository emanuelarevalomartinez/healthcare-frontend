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
}

export interface GetConsultationsFilteredParams {
  page?: number;
  size?: number;
  ascending: boolean;
  date: string;
}
