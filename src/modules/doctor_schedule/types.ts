import { DOCTOR_SCHEDULE_DAY_OF_WEEK } from "@/lib";
import { UserCreateRequest, UserUpdateRequest } from "../user/types";
import { DoctorUpdateRequest, DoctorWithoutUserCreateRequest } from "../doctors/types";


export interface DoctorScheduleApiResponse {
  id: string;
  dayOfWeek: DOCTOR_SCHEDULE_DAY_OF_WEEK;
  startTime: string;
  endTime: string;
  available: boolean;
  notes: string;
}

export interface DoctorScheduleDayCreateRequest {
  dayOfWeek: DOCTOR_SCHEDULE_DAY_OF_WEEK;
  startTime: string;
  endTime: string;
  available: boolean;
  notes?: string;
}

export interface DoctorScheduleCreateRequest {
  schedules: DoctorScheduleDayCreateRequest[];
}

export interface CreateDoctorWithUserAndSchedule {
  user: UserCreateRequest;
  doctor: DoctorWithoutUserCreateRequest;
  schedule: DoctorScheduleCreateRequest;
}

export interface DoctorScheduleDayUpdateRequest {
  id?: string;
  dayOfWeek: DOCTOR_SCHEDULE_DAY_OF_WEEK;
  startTime: string;
  endTime: string;
  available: boolean;
  notes?: string;
}

export interface DoctorScheduleUpdateRequest {
  schedules: DoctorScheduleDayUpdateRequest[];
}

export interface UpdateDoctorWithUserAndScheduleRequest {
  user?: UserUpdateRequest;
  doctor?: DoctorUpdateRequest;
  schedule?: DoctorScheduleUpdateRequest;
}