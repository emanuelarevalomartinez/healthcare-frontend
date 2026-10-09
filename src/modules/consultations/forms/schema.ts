import { z } from "zod";
import { TranslationDictionary } from "@/lib";

export const getCreateConsultationSchema = (
  dictionary: TranslationDictionary
) => {
  const v = dictionary.dashboard.consultations.validation;

  return z.object({
    appointmentId: z.string().uuid(v.appointmentRequired),
    createdByDoctor: z.string().uuid(v.createdByDoctorRequired),

    consultationName: z
      .string()
      .trim()
      .min(1, v.consultationNameRequired)
      .max(150, v.consultationNameMaxLength),

    symptoms: z
      .string()
      .trim()
      .min(1, v.symptomsRequired)
      .max(1000, v.symptomsMaxLength),

    diagnosis: z
      .string()
      .trim()
      .min(1, v.diagnosisRequired)
      .max(2000, v.diagnosisMaxLength),

    treatment: z
      .string()
      .trim()
      .min(1, v.treatmentRequired)
      .max(2000, v.treatmentMaxLength),

    prescription: z
      .string()
      .trim()
      .max(2000, v.prescriptionMaxLength)
      .optional()
      .or(z.literal("")),

    observations: z
      .string()
      .trim()
      .max(1000, v.observationsMaxLength)
      .optional()
      .or(z.literal("")),

    consultationDate: z
      .string({
        error: v.consultationDateRequired,
      })
      .min(1, v.consultationDateRequired),

    consultationTime: z
      .string({
        error: v.consultationTimeRequired,
      })
      .min(1, v.consultationTimeRequired),

    nextReview: z.string().optional().nullish(),
    nextReviewTime: z.string().optional().nullish(),
  });
};

export const getUpdateConsultationSchema = (
  dictionary: TranslationDictionary
) => {
  const v = dictionary.dashboard.consultations.validation;

  return z.object({
    consultationName: z
      .string()
      .trim()
      .min(1, v.consultationNameRequired)
      .max(150, v.consultationNameMaxLength)
      .optional(),

    symptoms: z
      .string()
      .trim()
      .min(1, v.symptomsRequired)
      .max(1000, v.symptomsMaxLength)
      .optional(),

    diagnosis: z
      .string()
      .trim()
      .min(1, v.diagnosisRequired)
      .max(2000, v.diagnosisMaxLength)
      .optional(),

    treatment: z
      .string()
      .trim()
      .min(1, v.treatmentRequired)
      .max(2000, v.treatmentMaxLength)
      .optional(),

    prescription: z
      .string()
      .trim()
      .max(2000, v.prescriptionMaxLength)
      .optional()
      .or(z.literal(""))
      .nullish(),

    observations: z
      .string()
      .trim()
      .max(1000, v.observationsMaxLength)
      .optional()
      .or(z.literal(""))
      .nullish(),

    consultationDate: z
      .string({
        error: v.consultationDateRequired,
      })
      .optional(),

    consultationTime: z
      .string({
        error: v.consultationTimeRequired,
      })
      .optional(),

    nextReview: z.string().optional().nullish(),
    nextReviewTime: z.string().optional().nullish(),
  });
};

export type CreateConsultationSchema = z.infer<
  ReturnType<typeof getCreateConsultationSchema>
>;

export type UpdateConsultationSchema = z.infer<
  ReturnType<typeof getUpdateConsultationSchema>
>;

export type ConsultationSchema =
  | CreateConsultationSchema
  | UpdateConsultationSchema;
