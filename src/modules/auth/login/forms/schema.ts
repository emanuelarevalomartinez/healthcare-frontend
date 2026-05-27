import { z } from "zod";

type ValidationDictionary = {
  emailInvalid: string;
  emailMax: string;
  passwordMin: string;
  passwordMax: string;
};

export const getLoginUserSchema = (dictionary: ValidationDictionary) => {
  return z.object({
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
      }),
  });
};

export type LoginUserSchema = z.infer<ReturnType<typeof getLoginUserSchema>>;
