import { z } from "zod";
import { PATIENT_DOCUMENT_TYPE, PATIENT_SEX } from "../types";

export type PatientValidationDictionary = {
  medicalRecordNumberRequired: string;
  medicalRecordNumberMax: string;
  fullNameRequired: string;
  fullNameMin: string;
  fullNameMax: string;
  documentTypeRequired: string;
  documentNumberRequired: string;
  documentNumberMax: string;
  birthDateRequired: string;
  birthDatePast: string;
  sexRequired: string;
  phoneRequired: string;
  phoneMax: string;
  phoneInvalid: string;
  emailInvalid: string;
  emailMax: string;
  addressRequired: string;
  addressMax: string;
  notesMax: string;
};

export const getCreatePatientSchema = (
  dictionary: PatientValidationDictionary
) => {
  return z.object({
    medicalRecordNumber: z
      .string()
      .trim()
      .min(1, { message: dictionary.medicalRecordNumberRequired })
      .max(50, { message: dictionary.medicalRecordNumberMax }),

    fullName: z
      .string()
      .trim()
      .min(3, { message: dictionary.fullNameMin })
      .max(150, { message: dictionary.fullNameMax }),

    documentType: z.enum(PATIENT_DOCUMENT_TYPE, {
      error: () => ({ message: dictionary.documentTypeRequired }),
    }),

    documentNumber: z
      .string()
      .trim()
      .min(1, { message: dictionary.documentNumberRequired })
      .max(50, { message: dictionary.documentNumberMax }),

    birthDate: z
      .string()
      .min(1, { message: dictionary.birthDateRequired })
      .refine(
        (val) => {
          const date = new Date(val);
          return date < new Date();
        },
        { message: dictionary.birthDatePast }
      ),
    sex: z.enum(PATIENT_SEX, {
      error: () => ({ message: dictionary.sexRequired }),
    }),

    phone: z
      .string()
      .trim()
      .min(1, { message: dictionary.phoneRequired })
      .max(30, { message: dictionary.phoneMax })
      .regex(/^[0-9+()\-\s]+$/, { message: dictionary.phoneInvalid }),

    email: z
      .string()
      .trim()
      .max(100, { message: dictionary.emailMax })
      .email({ message: dictionary.emailInvalid })
      .or(z.literal("")),

    address: z
      .string()
      .trim()
      .min(1, { message: dictionary.addressRequired })
      .max(255, { message: dictionary.addressMax }),

    notes: z
      .string()
      .trim()
      .max(1000, { message: dictionary.notesMax })
      .optional()
      .or(z.literal("")),
  });
};

export type CreatePatientSchema = z.infer<
  ReturnType<typeof getCreatePatientSchema>
>;
