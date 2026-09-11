import { z } from "zod";
import { DOCTOR_SCHEDULE_DAY_OF_WEEK, TranslationDictionary } from "@/lib";

export const getCreateDoctorScheduleSchema = (dictionary: TranslationDictionary) => {
//  const v = dictionary.dashboard.patients.validation;

  return z.object({
    currentDaysOfWeekType: z.enum(DOCTOR_SCHEDULE_DAY_OF_WEEK, {
          error: () => ({ message: "mensaje de error" }),
        }),
  });
};

export const getUpdateDoctorScheduleSchema = (dictionary: TranslationDictionary) => {
 // const v = dictionary.dashboard.patients.validation;

  return z.object({
     currentDaysOfWeekType: z.enum(DOCTOR_SCHEDULE_DAY_OF_WEEK, {
          error: () => ({ message: "mensaje de error" }),
        }),
  });
};

export type CreateDoctorScheduleSchema = z.infer<
  ReturnType<typeof getCreateDoctorScheduleSchema>
>;
export type UpdateDoctorScheduleSchema = z.infer<
  ReturnType<typeof getUpdateDoctorScheduleSchema>
>;
export type DoctorScheduleSchema = CreateDoctorScheduleSchema | UpdateDoctorScheduleSchema;
