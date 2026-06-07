import { z } from "zod";
import { TranslationDictionary, USER_ROLE } from "@/lib";

const usernameRegex = /^[a-zA-Z0-9_]+$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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

      isActive: z.boolean({ message: v.activeRequired }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: v.passwordsMustMatch,
      path: ["confirmPassword"],
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
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: v.passwordsMustMatch,
      path: ["confirmPassword"],
    });
};

export type CreateUserSchema = z.infer<ReturnType<typeof getCreateUserSchema>>;

export type UpdateUserSchema = z.infer<ReturnType<typeof getUpdateUserSchema>>;

export type UserSchema = CreateUserSchema | UpdateUserSchema;
