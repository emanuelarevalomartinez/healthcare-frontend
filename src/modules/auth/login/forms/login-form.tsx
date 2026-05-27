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
import { getErrorMessage, useAuth, useLanguage } from "@/lib";
import { routes } from "@/lib/routes/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getLoginUserSchema, LoginUserSchema } from "./schema";
import { loginUser } from "../services";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  setUserAuthCredentialsLocalStore,
  setUserDataLocalStore,
} from "@/lib/utils/local-storage";
import {
  UserAuthCredentialsInterface,
  UserDataLocalStorageInterface,
} from "@/lib/utils/local-storage-type";

export default function LoginForm() {
  const { checkAuth } = useAuth();

  const { dictionary } = useLanguage();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  function handleGoTORegisterView() {
    router.push(routes.auth.register);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserSchema>({
    resolver: zodResolver(getLoginUserSchema(dictionary.auth.login.validation)),
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
        const userAuthCredentialsInfo: UserAuthCredentialsInterface = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        };

        setUserAuthCredentialsLocalStore(userAuthCredentialsInfo);

        const userInfo: UserDataLocalStorageInterface = {
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
        };

        setUserDataLocalStore(userInfo);
        checkAuth();

        router.push(routes.root);
        toast(dictionary.auth.login.toastSuccess);
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
        <div className="flex py-10 md:pt-[30%]">
          <Card className="bg-card border border-border rounded-lg w-full min-w-[90vw] md:min-w-lg">
            <CardHeader>
              <CardTitle className="text-foreground text-center">
                {dictionary.auth.login.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    {dictionary.auth.login.emailLabel}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={dictionary.auth.login.emailPlaceholder}
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
                <div className="grid gap-2">
                  <Label htmlFor="password">
                    {dictionary.auth.login.passwordLabel}
                  </Label>
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
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/60 w-full"
              >
                {isLoading
                  ? `${dictionary.auth.login.buttonLoading}`
                  : `${dictionary.auth.login.buttonSubmit}`}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleGoTORegisterView}
                className="w-full"
              >
                {dictionary.auth.login.buttonRegister}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </>
  );
}
