import { z } from "zod";
import { DOCTOR_SCHEDULE_DAY_OF_WEEK, TranslationDictionary } from "@/lib";

export const getUpdateDoctorSchema = (dictionary: TranslationDictionary) => {
  const v = dictionary.dashboard.users.validation;

  const scheduleItemSchema = z
    .object({
      id: z.string().uuid(v.scheduleIdRequired).optional(),

      dayOfWeek: z.enum(DOCTOR_SCHEDULE_DAY_OF_WEEK, {
        error: () => ({
          message: v.scheduleDayOfWeekRequired,
        }),
      }),

      startTime: z.string().min(1, {
        message: v.scheduleStartTimeRequired,
      }),

      endTime: z.string().min(1, {
        message: v.scheduleEndTimeRequired,
      }),

      available: z.boolean(),

      note: z
        .string()
        .trim()
        .max(250, {
          message: v.scheduleNoteMax,
        })
        .optional(),
    })
    .refine(
      (data) => {
        if (!data.startTime || !data.endTime) {
          return true;
        }

        return data.endTime > data.startTime;
      },
      {
        message: v.scheduleEndTimeAfterStartTime,
        path: ["endTime"],
      }
    );

  return z
    .object({
      specialty: z.string().trim().min(1, {
        message: v.specialtyRequired,
      }),

      licenseNumber: z.string().trim().min(1, {
        message: v.licenseNumberRequired,
      }),

      defaultConsultationDuration: z
        .number({
          message: v.defaultConsultationDurationRequired,
        })
        .min(1, {
          message: v.defaultConsultationDurationMin,
        }),

      schedules: z.array(scheduleItemSchema).min(1, {
        message: v.scheduleAtLeastOne,
      }),
    })
    .superRefine((data, ctx) => {
      const byDay = new Map<
        string,
        { start: string; end: string; index: number }[]
      >();

      data.schedules.forEach((schedule, index) => {
        if (!schedule.dayOfWeek || !schedule.startTime || !schedule.endTime) {
          return;
        }

        const list = byDay.get(schedule.dayOfWeek) ?? [];

        list.push({
          start: schedule.startTime,
          end: schedule.endTime,
          index,
        });

        byDay.set(schedule.dayOfWeek, list);
      });

      byDay.forEach((items) => {
        for (let i = 0; i < items.length; i++) {
          for (let j = i + 1; j < items.length; j++) {
            const a = items[i];
            const b = items[j];

            if (a.start < b.end && b.start < a.end) {
              ctx.addIssue({
                code: "custom",
                path: ["schedules", items[j].index, "startTime"],
                message: v.scheduleOverlapError,
              });
            }
          }
        }
      });
    });
};

export type UpdateDoctorSchema = z.infer<
  ReturnType<typeof getUpdateDoctorSchema>
>;
