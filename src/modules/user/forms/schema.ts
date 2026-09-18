import { z } from "zod";
import {
  DOCTOR_SCHEDULE_DAY_OF_WEEK,
  TranslationDictionary,
  USER_ROLE,
} from "@/lib";

const usernameRegex = /^[a-zA-Z0-9_]+$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const doctorFields = {
  specialty: z.string().trim().optional(),
  licenseNumber: z.string().trim().optional(),
  defaultConsultationDuration: z.preprocess((value) => {
    if (value === "" || Number.isNaN(value)) {
      return undefined;
    }
    return value;
  }, z.number().positive().optional()),
};

export const getCreateUserSchema = (dictionary: TranslationDictionary) => {
  const v = dictionary.dashboard.users.validation;

  const scheduleItemSchema = z
    .object({
      id: z.string().uuid(v.scheduleIdRequired).optional(),
      dayOfWeek: z.enum(DOCTOR_SCHEDULE_DAY_OF_WEEK, {
        error: () => ({ message: v.scheduleDayOfWeekRequired }),
      }),
      startTime: z.string().min(1, { message: v.scheduleStartTimeRequired }),
      endTime: z.string().min(1, { message: v.scheduleEndTimeRequired }),
      available: z.boolean(),
      note: z
        .string()
        .trim()
        .max(250, { message: v.scheduleNoteMax })
        .optional(),
    })
    .refine(
      (data) => {
        if (!data.startTime || !data.endTime) return true;
        return data.endTime > data.startTime;
      },
      {
        message: v.scheduleEndTimeAfterStartTime,
        path: ["endTime"],
      }
    );

  return z
    .object({
      username: z
        .string()
        .trim()
        .min(3, { message: v.usernameMin })
        .max(50, { message: v.usernameMax })
        .regex(usernameRegex, { message: v.usernameInvalid }),

      password: z
        .string()
        .min(8, { message: v.passwordMin })
        .max(100, { message: v.passwordMax })
        .regex(passwordRegex, { message: v.passwordInvalid }),

      confirmPassword: z
        .string()
        .min(1, { message: v.confirmPasswordRequired })
        .min(8, { message: v.confirmPasswordMin })
        .max(100, { message: v.confirmPasswordMax }),

      email: z
        .string()
        .trim()
        .min(1, { message: v.emailRequired })
        .max(100, { message: v.emailMax })
        .email({ message: v.emailInvalid }),

      role: z.enum(USER_ROLE, {
        error: () => ({ message: v.roleRequired }),
      }),

      isActive: z.boolean({
        message: v.activeRequired,
      }),

      schedules: z.array(scheduleItemSchema).optional().default([]),

      ...doctorFields,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: v.passwordsMustMatch,
      path: ["confirmPassword"],
    })
    .superRefine((data, ctx) => {
      if (data.role !== USER_ROLE.DOCTOR) return;

      if (!data.specialty?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["specialty"],
          message: v.specialtyRequired,
        });
      }

      if (!data.licenseNumber?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["licenseNumber"],
          message: v.licenseNumberRequired,
        });
      }

      if (
        data.defaultConsultationDuration === undefined ||
        Number.isNaN(data.defaultConsultationDuration)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["defaultConsultationDuration"],
          message: v.defaultConsultationDurationRequired,
        });
      }

      if (!data.schedules || data.schedules.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["schedules"],
          message: v.scheduleAtLeastOne,
        });
        return;
      }

      const byDay = new Map<
        string,
        { start: string; end: string; index: number }[]
      >();

      data.schedules.forEach((s, index) => {
        if (!s.dayOfWeek || !s.startTime || !s.endTime) return;
        const list = byDay.get(s.dayOfWeek) ?? [];
        list.push({ start: s.startTime, end: s.endTime, index });
        byDay.set(s.dayOfWeek, list);
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

export const getUpdateUserSchema = (dictionary: TranslationDictionary) => {
  const v = dictionary.dashboard.users.validation;

  const scheduleItemSchema = z
    .object({
      id: z.string().uuid(v.scheduleIdRequired).optional(),
      dayOfWeek: z.enum(DOCTOR_SCHEDULE_DAY_OF_WEEK, {
        error: () => ({ message: v.scheduleDayOfWeekRequired }),
      }),
      startTime: z.string().min(1, { message: v.scheduleStartTimeRequired }),
      endTime: z.string().min(1, { message: v.scheduleEndTimeRequired }),
      available: z.boolean(),
      note: z
        .string()
        .trim()
        .max(250, { message: v.scheduleNoteMax })
        .optional(),
    })
    .refine(
      (data) => {
        if (!data.startTime || !data.endTime) return true;
        return data.endTime > data.startTime;
      },
      { message: v.scheduleEndTimeAfterStartTime, path: ["endTime"] }
    );

  return z
    .object({
      username: z
        .string()
        .trim()
        .min(3, { message: v.usernameMin })
        .max(50, { message: v.usernameMax })
        .regex(usernameRegex, { message: v.usernameInvalid }),

      password: z.string().optional(),

      confirmPassword: z.string().optional(),

      email: z
        .string()
        .trim()
        .min(1, { message: v.emailRequired })
        .max(100, { message: v.emailMax })
        .email({ message: v.emailInvalid }),

      role: z.enum(USER_ROLE, {
        error: () => ({ message: v.roleRequired }),
      }),

      isActive: z.boolean({
        message: v.activeRequired,
      }),

        schedules: z.array(scheduleItemSchema).optional().default([]),

      ...doctorFields,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: v.passwordsMustMatch,
      path: ["confirmPassword"],
    })
    .superRefine((data, ctx) => {
      const password = data.password?.trim();
      const confirmPassword = data.confirmPassword?.trim();

      const hasPassword = !!password;
      const hasConfirmPassword = !!confirmPassword;

      if (hasPassword || hasConfirmPassword) {
        if (hasPassword !== hasConfirmPassword) {
          ctx.addIssue({
            code: "custom",
            path: ["confirmPassword"],
            message: v.confirmPasswordRequired,
          });
        }

        if (password && password.length < 8) {
          ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: v.passwordMin,
          });
        }

        if (password && password.length > 100) {
          ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: v.passwordMax,
          });
        }

        if (password && !passwordRegex.test(password)) {
          ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: v.passwordInvalid,
          });
        }

        if (password !== confirmPassword) {
          ctx.addIssue({
            code: "custom",
            path: ["confirmPassword"],
            message: v.passwordsMustMatch,
          });
        }
      }

      if (data.role === USER_ROLE.DOCTOR) {
        if (!data.specialty?.trim()) {
          ctx.addIssue({
            code: "custom",
            path: ["specialty"],
            message: v.specialtyRequired,
          });
        }

        if (!data.licenseNumber?.trim()) {
          ctx.addIssue({
            code: "custom",
            path: ["licenseNumber"],
            message: v.licenseNumberRequired,
          });
        }

        if (
          data.defaultConsultationDuration === undefined ||
          Number.isNaN(data.defaultConsultationDuration)
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["defaultConsultationDuration"],
            message: v.defaultConsultationDurationRequired,
          });
        }

        if (!data.schedules || data.schedules.length === 0) {
          ctx.addIssue({
            code: "custom",
            path: ["schedules"],
            message: v.scheduleAtLeastOne,
          });
          return;
        }

        const byDay = new Map<
          string,
          { start: string; end: string; index: number }[]
        >();

        data.schedules.forEach((s, index) => {
          if (!s.dayOfWeek || !s.startTime || !s.endTime) return;
          const list = byDay.get(s.dayOfWeek) ?? [];
          list.push({ start: s.startTime, end: s.endTime, index });
          byDay.set(s.dayOfWeek, list);
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
      }
    });
};

export type CreateUserSchema = z.infer<ReturnType<typeof getCreateUserSchema>>;

export type UpdateUserSchema = z.infer<ReturnType<typeof getUpdateUserSchema>>;

export type UserSchema = CreateUserSchema | UpdateUserSchema;
