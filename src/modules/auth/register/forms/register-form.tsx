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
import { getErrorMessage, useLanguage, USER_ROLE } from "@/lib";
import { toast } from "sonner";

export default function RegisterForm() {
  const { dictionary } = useLanguage();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterUserSchema>({
    resolver: zodResolver(
      getRegisterUserSchema(dictionary.auth.register.validation)
    ),
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
    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = data;

      const response = await registerUser(userData);

      if (response.status === 201) {
        router.push(routes.auth.login);
        toast(dictionary.auth.register.toastSuccess);
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
        id="register-user-form"
        noValidate
        onSubmit={handleSubmit(onSubmit, handleFocusError)}
      >
        <div className="flex py-10 pt-[30%]">
          <Card className="bg-card border border-border rounded-lg w-full min-w-[90vw] md:min-w-lg">
            <CardHeader>
              <CardTitle className="text-foreground text-center">
                {dictionary.auth.register.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">
                    {dictionary.auth.register.usernameLabel}
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder={dictionary.auth.register.usernamePlaceholder}
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
                  <Label htmlFor="email">
                    {dictionary.auth.register.emailLabel}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={dictionary.auth.register.emailPlaceholder}
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
                  <FieldLabel>{dictionary.auth.register.roleLabel}</FieldLabel>
                  <Select
                    onValueChange={(value) =>
                      setValue("role", value as USER_ROLE)
                    }
                    defaultValue={watch("role")}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={dictionary.auth.register.rolePlaceholder}
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary">
                      <SelectGroup>
                        {Object.values(USER_ROLE).map((role) => {
                          const roleKey = role.toLowerCase() as
                            | "admin"
                            | "doctor"
                            | "receptionist";

                          return (
                            <SelectItem key={role} value={role}>
                              {dictionary.auth.register.roleOptions[roleKey]}
                            </SelectItem>
                          );
                        })}
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
                    <Label htmlFor="password">
                      {dictionary.auth.register.passwordLabel}
                    </Label>
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
                    <Label htmlFor="confirmPassword">
                      {dictionary.auth.register.confirmPasswordLabel}
                    </Label>
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
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/60 w-full"
              >
                {isLoading
                  ? `${dictionary.auth.register.buttonLoading}`
                  : `${dictionary.auth.register.buttonSubmit}`}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleGoToLoginView}
                className="w-full"
              >
                {dictionary.auth.register.buttonLogin}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </>
  );
}
