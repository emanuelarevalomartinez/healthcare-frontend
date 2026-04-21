import { USER_ROLE } from "@/lib";
import { z } from "zod";

export const getRegisterUserSchema = () => {
  return z
    .object({
      username: z
        .string()
        .trim()
        .min(3, {
          message: "El nombre de usuario debe tener al menos 3 caracteres",
        })
        .max(50, {
          message: "El nombre de usuario no puede exceder los 50 caracteres",
        })
        .regex(/^[a-zA-Z0-9_]+$/, {
          message:
            "El nombre de usuario solo puede contener letras, números y guiones bajos",
        }),

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
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          {
            message:
              "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)",
          }
        ),

      confirmPassword: z
        .string()
        .trim()
        .min(8, {
          message:
            "La confirmación de contraseña debe tener al menos 8 caracteres",
        })
        .max(100, {
          message:
            "La confirmación de contraseña no puede exceder los 100 caracteres",
        }),

      role: z.enum(USER_ROLE, {
        error: () => ({ message: "Por favor, selecciona un rol válido" }),
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
