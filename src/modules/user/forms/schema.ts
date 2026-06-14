import { z } from "zod";
import { TranslationDictionary, USER_ROLE } from "@/lib";

const usernameRegex = /^[a-zA-Z0-9_]+$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const doctorFields = {
  specialty: z.string().trim().optional(),
  licenseNumber: z.string().trim().optional(),
  defaultConsultationDuration: z.number().positive().optional(),
};

export const getCreateUserSchema = (dictionary: TranslationDictionary) => {
  const v = dictionary.dashboard.users.validation;

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

      ...doctorFields,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: v.passwordsMustMatch,
      path: ["confirmPassword"],
    })
    .superRefine((data, ctx) => {
      if (data.role !== USER_ROLE.DOCTOR) return;

      if (!data.specialty) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["specialty"],
          message: v.specialtyRequired,
        });
      }

      if (!data.licenseNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["licenseNumber"],
          message: v.licenseNumberRequired,
        });
      }

      if (
        data.defaultConsultationDuration === undefined ||
        data.defaultConsultationDuration === null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["defaultConsultationDuration"],
          message: v.defaultConsultationDurationRequired,
        });
      }
    });
};

export const getUpdateUserSchema = (dictionary: TranslationDictionary) => {
  const v = dictionary.dashboard.users.validation;

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

      if (hasPassword !== hasConfirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: v.confirmPasswordRequired,
        });

        return;
      }

      if (!hasPassword && !hasConfirmPassword) {
        return;
      }

      if (password!.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: v.passwordMin,
        });
      }

      if (password!.length > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: v.passwordMax,
        });
      }

      if (!passwordRegex.test(password!)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: v.passwordInvalid,
        });
      }

      if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: v.passwordsMustMatch,
        });
      }

      if (data.role !== USER_ROLE.DOCTOR) return;

      if (!data.specialty) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["specialty"],
          message: v.specialtyRequired,
        });
      }

      if (!data.licenseNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["licenseNumber"],
          message: v.licenseNumberRequired,
        });
      }

      if (
        data.defaultConsultationDuration === undefined ||
        data.defaultConsultationDuration === null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["defaultConsultationDuration"],
          message: v.defaultConsultationDurationRequired,
        });
      }
    });
};

export type CreateUserSchema = z.infer<ReturnType<typeof getCreateUserSchema>>;

export type UpdateUserSchema = z.infer<ReturnType<typeof getUpdateUserSchema>>;

export type UserSchema = CreateUserSchema | UpdateUserSchema;
