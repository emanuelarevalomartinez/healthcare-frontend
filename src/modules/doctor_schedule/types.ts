import { DOCTOR_SCHEDULE_DAY_OF_WEEK } from "@/lib";
import { UserUpdateRequest } from "../user/types";
import { DoctorUpdateRequest } from "../doctors/types";


export interface DoctorScheduleApiResponse {
  id: string;
  dayOfWeek: DOCTOR_SCHEDULE_DAY_OF_WEEK;
  startTime: string;
  endTime: string;
  available: boolean;
  notes: string;
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