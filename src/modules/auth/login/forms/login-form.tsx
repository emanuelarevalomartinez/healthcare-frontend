"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getErrorMessage, HEALTHCARE_ICON } from "@/lib";
import { routes } from "@/lib/routes/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getLoginUserSchema, LoginUserSchema } from "./schema";
import { loginUser } from "../services";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { setTokenLocalStore } from "@/lib/utils/local-storage";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  function handleGoTORegisterView() {
    router.push(routes.auth.register);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginUserSchema>({
    resolver: zodResolver(getLoginUserSchema()),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginUserSchema) {
    setIsLoading(true);
    try {
      const response = await loginUser(data);

      if (response.status === 200) {
       setTokenLocalStore("true");
        router.push(routes.root);
        toast("Inicio de sesión exitoso.");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));

      console.error(error);
    } finally {
      setIsLoading(false);
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
        id="login-user-form"
        noValidate
        onSubmit={handleSubmit(onSubmit, handleFocusError)}
      >
        <div>
          <Card className="bg-card border border-border rounded-lg w-full max-w-sm md:min-w-lg">
            <CardHeader>
              <div className="flex w-full h-20 justify-center">
                <Avatar className="w-20 h-20 p-2">
                  <AvatarImage
                    src={HEALTHCARE_ICON.src}
                    alt={HEALTHCARE_ICON.alt}
                  />
                  <AvatarFallback> {HEALTHCARE_ICON.alt} </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-foreground text-center">
                Inicia sesión en tu cuenta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {/* <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@ejemplo.com"
                    required
                  />
                </div> */}
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
                {/*  <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Contraseña</Label>
                  </div>
                  <Input id="password" type="password" required />
                </div> */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
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
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 border-border">
              {/*   <Button
              onClick={() => {
                handleGoTORegisterView();
              }}
              type="submit"
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/60 w-full"
            >
              Registrarse
            </Button> */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/60 w-full"
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleGoTORegisterView}
                className="w-full"
              >
                No tengo cuenta - Registrarme
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </>
  );
}
