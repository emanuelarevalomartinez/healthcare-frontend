import { USER_ROLE } from "@/lib";

export interface DoctorApiResponse {
  id: string;
  modifiedBy: string;
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

export interface DoctorCreateWithUserRequest {
  username: string;
  password: string;
  email: string;
  role: USER_ROLE;
  isActive: boolean;
  specialty: string;
  licenseNumber: string;
  defaultConsultationDuration: number;
}

export interface DoctorUpdateRequest {
  specialty: string;
  licenseNumber: string;
  defaultConsultationDuration: number;
}

export interface DoctorUpdateWithUserRequest {
  username?: string;
  password?: string;
  email?: string;
  role?: USER_ROLE;
  isActive?: boolean;
  specialty?: string;
  licenseNumber?: string;
  defaultConsultationDuration?: number;
}
