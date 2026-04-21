"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/lib/routes/routes";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { getRegisterUserSchema, RegisterUserSchema } from "./schema";
import { registerUser } from "../services";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage, USER_ROLE } from "@/lib";
import { toast } from "sonner";

export default function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterUserSchema>({
    resolver: zodResolver(getRegisterUserSchema()),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
    },
  });

  function handleGoToLoginView() {
    router.push(routes.auth.login);
  }

  async function onSubmit(data: RegisterUserSchema) {
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...userData } = data;

      const response = await registerUser(userData);

      if (response.status === 201) {
        console.log(response.message);
        router.push(routes.auth.login);
        toast("El usuario a sido registrado exitosamente");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));

      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFocusError = (errors: any) => {
    const firstError = Object.keys(errors)[0];
    const element = document.getElementById(firstError);
    if (element) {
      element.focus();
    }
  };

  return (
    <>
      <form
        id="register-user-form"
        noValidate
        onSubmit={handleSubmit(onSubmit, handleFocusError)}
      >
        <div>
          <Card className="bg-card border border-border rounded-lg w-full max-w-sm md:min-w-lg">
            <CardHeader>
              <CardTitle className="text-foreground text-center">
                Registrate con nosotros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Nombre de usuario</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="ana"
                    required
                    {...register("username")}
                    aria-invalid={errors.username ? "true" : "false"}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@ejemplo.com"
                    required
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Field className="w-full">
                  <FieldLabel>Rol</FieldLabel>
                  <Select
                    onValueChange={(value) =>
                      setValue("role", value as USER_ROLE)
                    }
                    defaultValue={watch("role")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary">
                      <SelectGroup>
                        <SelectItem value="ADMIN">ADMINISTRADOR</SelectItem>
                        <SelectItem value="DOCTOR">DOCTOR</SelectItem>
                        <SelectItem value="RECEPTIONIST">
                          RECEPCIONISTA
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-red-500">
                      {errors.role.message}
                    </p>
                  )}
                </Field>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Contraseña</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    {...register("password")}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Confirmar Contraseña</Label>
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    {...register("confirmPassword")}
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 border-border">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/60 w-full"
              >
                {isSubmitting ? "Registrando..." : "Registrarse"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleGoToLoginView}
                className="w-full"
              >
                Ya tengo cuenta - Autenticarse
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </>
  );
}
