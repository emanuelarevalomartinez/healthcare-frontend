export interface DoctorApiResponse {
  id: string;
  specialty: string;
  licenseNumber: string;
  defaultConsultationDuration: number;
}


export interface DoctorCreateRequest {

}

export interface DoctorUpdateRequest extends DoctorCreateRequest {};