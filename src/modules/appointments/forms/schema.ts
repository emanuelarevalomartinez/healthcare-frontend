import { z } from "zod";
import { TranslationDictionary } from "@/lib";

export const getCreateAppointmentSchema = (dictionary: TranslationDictionary) => {
  const v = dictionary.dashboard.appointments.validation;

  return z
    .object({
         doctorName: z
        .string()
        .trim()
    })
};

export const getUpdateAppointmentSchema = (dictionary: TranslationDictionary) => {
  const v = dictionary.dashboard.appointments.validation;

  return z
    .object({
    });
};

export type CreateAppointmentSchema = z.infer<ReturnType<typeof getCreateAppointmentSchema>>;

export type UpdateAppointmentSchema = z.infer<ReturnType<typeof getUpdateAppointmentSchema>>;

export type AppointmentSchema = CreateAppointmentSchema | UpdateAppointmentSchema;
