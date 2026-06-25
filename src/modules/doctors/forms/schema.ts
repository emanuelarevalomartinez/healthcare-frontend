import { z } from "zod";
import { TranslationDictionary } from "@/lib";

export const getCreateDoctorSchema = (dictionary: TranslationDictionary) => {
  const v = dictionary.dashboard.doctors.validation;

  return z.object({
    specialty: z.string().trim().min(1, {
      message: v.specialtyRequired,
    }),

    licenseNumber: z.string().trim().min(1, {
      message: v.licenseNumberRequired,
    }),

    defaultConsultationDuration: z.preprocess(
      (value) => {
        if (value === "" || value === null || value === undefined) {
          return undefined;
        }

        return Number(value);
      },
      z
        .number({
          message: v.defaultConsultationDurationRequired,
        })
        .min(1, {
          message: v.defaultConsultationDurationMin,
        })
    ),
  });
};

export const getUpdateDoctorSchema = (dictionary: TranslationDictionary) => {
  const v = dictionary.dashboard.doctors.validation;

  return z.object({
    specialty: z.string().trim().min(1, {
      message: v.specialtyRequired,
    }),

    licenseNumber: z.string().trim().min(1, {
      message: v.licenseNumberRequired,
    }),

    defaultConsultationDuration: z.preprocess(
      (value) => {
        if (value === "" || value === null || value === undefined) {
          return undefined;
        }

        return Number(value);
      },
      z
        .number({
          message: v.defaultConsultationDurationRequired,
        })
        .min(1, {
          message: v.defaultConsultationDurationMin,
        })
    ),
  });
};

export type CreateDoctorSchema = z.infer<
  ReturnType<typeof getCreateDoctorSchema>
>;

export type UpdateDoctorSchema = z.infer<
  ReturnType<typeof getUpdateDoctorSchema>
>;

export type DoctorSchema = CreateDoctorSchema | UpdateDoctorSchema;
