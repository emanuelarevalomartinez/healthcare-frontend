"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  FormMode,
  getErrorMessage,
  routes,
  useLanguage,
  USER_ROLE,
} from "@/lib";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { SectionHeader } from "@/components/customs/secction-header";
import { FormFieldInput } from "@/components/customs/form-field-input";
import { FormFieldSelect } from "@/components/customs/form-field-select";

import { createUser, updateUser } from "../services";

import { UserApiResponse, UserCreateRequest } from "../types";

import {
  CreateUserSchema,
  getCreateUserSchema,
  getUpdateUserSchema,
  UpdateUserSchema,
  UserSchema,
} from "./schema";

import { useUsersActions } from "../list/users-actions";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { formatDisplayDateTimeToLocaleString } from "@/lib/utils/functions";

interface UserFormProps {
  user: UserApiResponse;
  mode: FormMode;
}

export function UserForm({ user, mode }: UserFormProps) {
  const router = useRouter();

  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.users;

  const { getRoleOptions } = useUsersActions({ dictionary });

  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = mode === "edit";
  const isViewMode = mode === "details";
  const disableFields = isViewMode;

  const currentSchema = useMemo(() => {
    return isEditMode
      ? getUpdateUserSchema(dictionary)
      : getCreateUserSchema(dictionary);
  }, [dictionary, isEditMode]);

  const roleOptions = useMemo(
    () => getRoleOptions(t.roleOptions),
    [getRoleOptions, t.roleOptions]
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserSchema>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      password: "",
      confirmPassword: "",
      role: user.role,
      isActive: user.isActive,
    },
  });

  const currentRole = watch("role");
  const currentActive = watch("isActive");

  const getHeaderTitle = () => {
    if (isViewMode) return t.viewSectionTitle;
    if (isEditMode) return t.editSectionTitle;
    return t.createSectionTitle;
  };

  async function onSubmit(data: UserSchema) {
    if (isViewMode) return;

    setIsLoading(true);

    try {
      if (isEditMode) {
        const updateData = data as UpdateUserSchema;
        const { confirmPassword, ...payload } = updateData;

        const response = await updateUser(user.id, payload);

        if (response.status === 200 || response.status === 204) {
          toast.success(t.toastUpdateSuccess);
          router.push(routes.users.root);
        }
      } else {
        const createData = data as CreateUserSchema;

        const payload: UserCreateRequest = {
          username: createData.username,
          password: createData.password,
          email: createData.email,
          role: createData.role,
          isActive: createData.isActive,
        };

        const response = await createUser(payload);

        if (response.status === 200 || response.status === 201) {
          toast.success(t.toastSuccess);
          router.push(routes.users.root);
        }
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <SectionHeader
        title={getHeaderTitle()}
        description={t.editSectionSubtitle}
        onBack={() => router.back()}
      >
        {!isViewMode && (
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            {isLoading ? t.buttonLoading : t.buttonSubmit}
          </Button>
        )}
      </SectionHeader>

      <Card className="border bg-background border-border rounded-lg w-full">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 pt-6">
          <FormFieldInput
            id="username"
            label={t.usernameLabel}
            placeholder={t.usernamePlaceholder}
            disabled={disableFields}
            register={register("username")}
            error={errors.username?.message}
          />

          <FormFieldInput
            id="email"
            label={t.emailLabel}
            placeholder={t.emailPlaceholder}
            disabled={disableFields}
            register={register("email")}
            error={errors.email?.message}
          />

          {!isViewMode && (
            <FormFieldInput
              id="password"
              type="password"
              label={t.passwordLabel}
              placeholder={t.passwordPlaceholder}
              disabled={disableFields}
              register={register("password")}
              error={errors.password?.message}
            />
          )}

          {!isViewMode && (
            <FormFieldInput
              id="confirmPassword"
              type="password"
              label={t.confirmPasswordLabel}
              placeholder={t.confirmPasswordPlaceholder}
              disabled={disableFields}
              register={register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          )}

          <FormFieldSelect
            id="role"
            label={t.roleLabel}
            placeholder={t.rolePlaceholder}
            disabled={disableFields}
            value={currentRole ?? ""}
            onValueChange={(value) =>
              setValue("role", value as USER_ROLE, {
                shouldValidate: true,
              })
            }
            options={roleOptions}
            error={errors.role?.message}
          />

          <FieldGroup className="gap-2">
            <Field orientation="horizontal">
              <Switch
                id="active"
                size="sm"
                checked={currentActive}
                disabled={disableFields}
                onCheckedChange={(checked) =>
                  setValue("isActive", checked, {
                    shouldValidate: true,
                  })
                }
              />

              <FieldLabel htmlFor="active">
                {currentActive ? "Active user" : "Inactive user"}
              </FieldLabel>
            </Field>

            <div className="text-sm h-5 text-red-500">
              {errors.isActive ? (
                (errors.isActive.message as string)
              ) : (
                <>&nbsp;</>
              )}
            </div>
          </FieldGroup>

          {(isEditMode || isViewMode) && (
            <>
              <Separator className="md:col-span-2 mt-2 mb-4" />

              <div className="grid gap-2">
                <Label>{t.createdAtLabel}</Label>
                <Input
                  disabled
                  value={
                    user.createdAt
                      ? formatDisplayDateTimeToLocaleString(user.createdAt)
                      : "-"
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>{t.updatedAtLabel}</Label>
                <Input
                  disabled
                  value={
                    user.updatedAt
                      ? formatDisplayDateTimeToLocaleString(user.updatedAt)
                      : "-"
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>{t.lastLoginLabel}</Label>
                <Input
                  disabled
                  value={
                    user.lastLogin
                      ? formatDisplayDateTimeToLocaleString(user.lastLogin)
                      : t.never
                  }
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
}
