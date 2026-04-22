import { z } from "zod";

export const getLoginUserSchema = () => {
  return z
    .object({
      email: z
        .string()
        .trim()
        .email({ message: "Por favor, ingresa un correo electrónico válido" })
        .max(100, {
          message: "El correo electrónico no puede exceder los 100 caracteres",
        }),
      password: z
        .string()
        .trim()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
        .max(100, {
          message: "La contraseña no puede exceder los 100 caracteres",
        })
    })
};

export type LoginUserSchema = z.infer<
  ReturnType<typeof getLoginUserSchema>
>;
