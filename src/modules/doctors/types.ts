import { USER_ROLE } from "@/lib";
import { UserApiResponse } from "../user/types";
import { DoctorScheduleApiResponse, DoctorScheduleCreateRequest } from "../doctor-schedule/types";

export interface DoctorApiResponse {
  id: string;
  modifiedBy: string;
  specialty: string;
  licenseNumber: string;
  defaultConsultationDuration: number;
}

export interface DoctorFilteredApiResponse {
  userId: string;
  username: string;
  email: string;
  role: USER_ROLE;
  isActive: boolean;
  doctorId: string;
  specialty: string;
  licenseNumber: string;
  defaultConsultationDuration: number;
}

export interface DoctorWithUserAndScheduleApiResponse {
  user: UserApiResponse;
  doctor: DoctorApiResponse;
  schedules: DoctorScheduleApiResponse[];
}

export interface DoctorWithSchedulesCreateRequest {
  userId: string;
  specialty: string;
  licenseNumber: string;
  defaultConsultationDuration: number;
  schedule: DoctorScheduleCreateRequest;
}

export interface DoctorWithoutUserCreateRequest {
  specialty: string;
  licenseNumber: string;
  defaultConsultationDuration: number;
}

export interface DoctorCreateWithUserRequest {
  username: string;
  password?: string;
  email: string;
  role: USER_ROLE;
  isActive: boolean;
  specialty: string;
  licenseNumber: string;
  defaultConsultationDuration: number;
}

export interface DoctorUpdateRequest {
  specialty?: string;
  licenseNumber?: string;
  defaultConsultationDuration?: number;
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

export interface DoctorUpdateWithUserAndScheduleRequest {
  username?: string;
  password?: string;
  email?: string;
  role?: USER_ROLE;
  isActive?: boolean;
  specialty?: string;
  licenseNumber?: string;
  defaultConsultationDuration?: number;
}
