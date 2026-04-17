import { USER_TYPE } from "@/lib";
import { z } from "zod";

export const getRegisterUserSchema = () => {
  return z
    .object({
      username: z
        .string()
        .trim()
        .min(3)
        .max(50)
        .regex(/^[a-zA-Z0-9_]+$/),
      email: z.string().trim().email().max(100),
      password: z
        .string()
        .trim()
        .min(8)
        .max(100)
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      confirmPassword: z.string().trim().min(8).max(100),

      // role: z.enum(USER_TYPE),
      role: z.enum(Object.values(USER_TYPE) as [string, ...string[]]).catch(() => {
        throw new Error("El rol es obligatorio");
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    });
};

export type RegisterUserSchema = z.infer<
  ReturnType<typeof getRegisterUserSchema>
>;
