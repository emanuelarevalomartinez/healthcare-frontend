import { z } from "zod";
import { PATIENT_DOCUMENT_TYPE, PATIENT_SEX } from "../types";
import { TranslationDictionary } from "@/lib";

export const getCreatePatientSchema = (dictionary: TranslationDictionary) => {
  const v = dictionary.dashboard.patients.validation;

  return z.object({
    medicalRecordNumber: z
      .string()
      .trim()
      .min(1, { message: v.medicalRecordNumberRequired })
      .max(50, { message: v.medicalRecordNumberMax }),

    fullName: z
      .string()
      .trim()
      .min(3, { message: v.fullNameMin })
      .max(150, { message: v.fullNameMax }),

    documentType: z.enum(PATIENT_DOCUMENT_TYPE, {
      error: () => ({ message: v.documentTypeRequired }),
    }),

    documentNumber: z
      .string()
      .trim()
      .min(1, { message: v.documentNumberRequired })
      .max(50, { message: v.documentNumberMax }),

    birthDate: z
      .string()
      .min(1, { message: v.birthDateRequired })
      .refine(
        (val) => {
          const date = new Date(val);
          return date < new Date();
        },
        { message: v.birthDatePast }
      ),

    sex: z.enum(PATIENT_SEX, {
      error: () => ({ message: v.sexRequired }),
    }),

    phone: z
      .string()
      .trim()
      .min(1, { message: v.phoneRequired })
      .max(30, { message: v.phoneMax })
      .regex(/^[0-9+()\-\s]+$/, { message: v.phoneInvalid }),

    email: z
      .string()
      .trim()
      .max(100, { message: v.emailMax })
      .email({ message: v.emailInvalid }),

    address: z
      .string()
      .trim()
      .min(1, { message: v.addressRequired })
      .max(255, { message: v.addressMax }),

    notes: z
      .string()
      .trim()
      .max(1000, { message: v.notesMax })
      .optional()
      .or(z.literal("")),
  });
};

export const getUpdatePatientSchema = (dictionary: TranslationDictionary) => {
  const v = dictionary.dashboard.patients.validation;

  return z.object({
    medicalRecordNumber: z
      .string()
      .trim()
      .min(1, { message: v.medicalRecordNumberRequired })
      .max(50, { message: v.medicalRecordNumberMax }),

    fullName: z
      .string()
      .trim()
      .min(3, { message: v.fullNameMin })
      .max(150, { message: v.fullNameMax }),

    documentType: z.enum(PATIENT_DOCUMENT_TYPE, {
      error: () => ({ message: v.documentTypeRequired }),
    }),

    documentNumber: z
      .string()
      .trim()
      .min(1, { message: v.documentNumberRequired })
      .max(50, { message: v.documentNumberMax }),

    birthDate: z
      .string()
      .min(1, { message: v.birthDateRequired })
      .refine(
        (val) => {
          if (!val) return false;
          const date = new Date(val);
          return date < new Date();
        },
        { message: v.birthDatePast }
      ),

    sex: z.enum(PATIENT_SEX, {
      error: () => ({ message: v.sexRequired }),
    }),

    phone: z
      .string()
      .trim()
      .min(1, { message: v.phoneRequired })
      .max(30, { message: v.phoneMax })
      .regex(/^[0-9+()\-\s]+$/, { message: v.phoneInvalid }),

    email: z
      .string()
      .trim()
      .min(1, { message: v.emailInvalid })
      .max(100, { message: v.emailMax })
      .email({ message: v.emailInvalid }),

    address: z
      .string()
      .trim()
      .min(1, { message: v.addressRequired })
      .max(255, { message: v.addressMax })
      .nullable(),

    notes: z
      .string()
      .trim()
      .max(1000, { message: v.notesMax })
      .nullable()
      .optional()
      .or(z.literal("")),
  });
};

export type CreatePatientSchema = z.infer<
  ReturnType<typeof getCreatePatientSchema>
>;
export type UpdatePatientSchema = z.infer<
  ReturnType<typeof getUpdatePatientSchema>
>;
export type PatientSchema = CreatePatientSchema | UpdatePatientSchema;
