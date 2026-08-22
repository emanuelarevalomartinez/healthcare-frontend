import { z } from "zod";
import { TranslationDictionary } from "@/lib";

export const getCreateAppointmentSchema = (
  dictionary: TranslationDictionary
) => {
  const v = dictionary.dashboard.appointments.validation;

  return z.object({
    doctorId: z.string().uuid(v.doctorRequired),

    patientId: z.string().uuid(v.patientRequired),

    appointmentDateTime: z
      .string({
        error: v.appointmentDateTimeRequired,
      })
      .min(1, v.appointmentDateTimeRequired),

    appointmentTime: z
      .string()
      .min(1, v.appointmentTimeRequired)
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, v.appointmentTimeInvalid),

    durationMinutes: z
      .number({
        error: v.durationRequired,
      })
      .positive(v.durationRequired),

    consultationReason: z
      .string()
      .trim()
      .min(1, v.consultationReasonRequired)
      .max(255, v.consultationReasonMaxLength),

    notes: z
      .string()
      .trim()
      .max(500, v.notesMaxLength)
      .optional()
      .or(z.literal("")),
  });
};

export const getUpdateAppointmentSchema = (
  dictionary: TranslationDictionary
) => {
  const v = dictionary.dashboard.appointments.validation;

  return z.object({
    doctorId: z.string().uuid(v.doctorRequired).optional(),
    patientId: z.string().uuid(v.patientRequired).optional(),

    appointmentDateTime: z
      .string({
        error: v.appointmentDateTimeRequired,
      })
      .optional(),

    appointmentTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, v.appointmentTimeInvalid)
      .optional(),

    durationMinutes: z
      .number({
        error: v.durationRequired,
      })
      .positive(v.durationRequired)
      .optional(),

    consultationReason: z
      .string()
      .trim()
      .max(255, v.consultationReasonMaxLength)
      .optional(),

    status: z.string(),

    cancellationReason: z
      .string()
      .trim()
      .max(255, v.cancellationReasonMaxLength)
      .optional(),

    confirmedAt: z.string().optional(),

    attendedAt: z.string().optional(),

    notes: z
      .string()
      .trim()
      .max(500, v.notesMaxLength)
      .optional()
      .or(z.literal("")),
  });
};

export type CreateAppointmentSchema = z.infer<
  ReturnType<typeof getCreateAppointmentSchema>
>;

export type UpdateAppointmentSchema = z.infer<
  ReturnType<typeof getUpdateAppointmentSchema>
>;

export type AppointmentSchema =
  | CreateAppointmentSchema
  | UpdateAppointmentSchema;
