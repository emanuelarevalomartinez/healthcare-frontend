import { USER_ROLE } from "@/lib";
import { z } from "zod";

type ValidationDictionary = {
  usernameMin: string;
  usernameMax: string;
  usernameRegex: string;
  emailInvalid: string;
  emailMax: string;
  passwordMin: string;
  passwordMax: string;
  passwordRegex: string;
  confirmPasswordMin: string;
  confirmPasswordMax: string;
  roleRequired: string;
  passwordMismatch: string;
};

export const getRegisterUserSchema = (dictionary: ValidationDictionary) => {
  return z
    .object({
      username: z
        .string()
        .trim()
        .min(3, {
          message: dictionary.usernameMin,
        })
        .max(50, {
          message: dictionary.usernameMax,
        })
        .regex(/^[a-zA-Z0-9_]+$/, {
          message: dictionary.usernameRegex,
        }),

      email: z
        .string()
        .trim()
        .email({ message: dictionary.emailInvalid })
        .max(100, {
          message: dictionary.emailMax,
        }),

      password: z
        .string()
        .trim()
        .min(8, { message: dictionary.passwordMin })
        .max(100, {
          message: dictionary.passwordMax,
        })
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          {
            message: dictionary.passwordRegex,
          }
        ),

      confirmPassword: z
        .string()
        .trim()
        .min(8, {
          message: dictionary.confirmPasswordMin,
        })
        .max(100, {
          message: dictionary.confirmPasswordMax,
        }),

      role: z.enum(USER_ROLE, {
        error: () => ({ message: dictionary.roleRequired }),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: dictionary.passwordMismatch,
      path: ["confirmPassword"],
    });
};

export type RegisterUserSchema = z.infer<
  ReturnType<typeof getRegisterUserSchema>
>;
