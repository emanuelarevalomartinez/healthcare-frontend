import { DOCTOR_SCHEDULE_DAY_OF_WEEK } from "@/lib";


export interface DoctorScheduleApiResponse {
  id: string;
  dayOfWeek: DOCTOR_SCHEDULE_DAY_OF_WEEK;
  startTime: string;
  endTime: string;
  available: boolean;
  notes: string;
}