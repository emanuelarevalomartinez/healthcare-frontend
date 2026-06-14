export interface DoctorApiResponse {
  id: string;
  specialty: string;
  licenseNumber: string;
  defaultConsultationDuration: number;
}
export interface DoctorCreateRequest {
  userId: string;
  specialty: string;
  licenseNumber: string;
  defaultConsultationDuration: number;
}

export interface DoctorUpdateRequest {
  specialty: string;
  licenseNumber: string;
  defaultConsultationDuration: number;
}
