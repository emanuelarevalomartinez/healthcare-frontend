"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Resolver } from "react-hook-form";
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

import {
  UserApiResponse,
  UserCreateRequest,
  UserUpdateRequest,
} from "../types";

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
import {
  DoctorCreateWithUserRequest,
  DoctorUpdateWithUserRequest,
} from "@/modules/doctors/types";
import {
  createDoctorWithUser,
  updateDoctorWithUser,
} from "@/modules/doctors/services";

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
    resolver: zodResolver(currentSchema) as Resolver<UserSchema>,
    defaultValues: {
      username: user.username,
      email: user.email,
      password: "",
      confirmPassword: "",
      role: user.role,
      isActive: user.isActive,
      specialty: user.doctor?.specialty,
      licenseNumber: user.doctor?.licenseNumber,
      defaultConsultationDuration: user.doctor?.defaultConsultationDuration,
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

        if (currentRole == USER_ROLE.DOCTOR) {
            const updateDoctorWithUserPayload: DoctorUpdateWithUserRequest = {
              username: updateData.username,
              email: updateData.email,
              role: currentRole,
              isActive: currentActive,
              specialty: updateData.specialty ?? "",
              licenseNumber: data.licenseNumber ?? "",
              defaultConsultationDuration:
                data.defaultConsultationDuration ?? 0,
              ...(updateData.password?.trim()
                ? { password: updateData.password }
                : {}),
            };
            await updateDoctorWithUser(user.id, updateDoctorWithUserPayload);
          
        } else {
          const updateUserPayload: UserUpdateRequest = {
            username: updateData.username,
            email: updateData.email,
            role: updateData.role,
            isActive: updateData.isActive,
            ...(updateData.password?.trim()
              ? { password: updateData.password }
              : {}),
          };
          await updateUser(user.id, updateUserPayload);
        }
        toast.success(t.toastUpdateSuccess);
        router.push(routes.users.root);
      } else {
        //TODO CORRECTO
        const createData = data as CreateUserSchema;

        if (currentRole == USER_ROLE.DOCTOR) {
          const createDoctorWithUserPayload: DoctorCreateWithUserRequest = {
            username: createData.username,
            password: createData.password,
            email: createData.email,
            role: currentRole,
            isActive: currentActive,
            specialty: createData.specialty ?? "",
            licenseNumber: data.licenseNumber ?? "",
            defaultConsultationDuration: data.defaultConsultationDuration ?? 0,
          };

          await createDoctorWithUser(createDoctorWithUserPayload);
        } else {
          const createUserPayload: UserCreateRequest = {
            username: createData.username,
            password: createData.password,
            email: createData.email,
            role: createData.role,
            isActive: createData.isActive,
          };

          await createUser(createUserPayload);
        }
        toast.success(t.toastSuccess);
        router.push(routes.users.root);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (currentRole !== USER_ROLE.DOCTOR) {
      setValue("specialty", "");
      setValue("licenseNumber", "");
      setValue("defaultConsultationDuration", undefined);
    }
  }, [currentRole, setValue]);

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

          {currentRole === USER_ROLE.DOCTOR && (
            <>
              <FormFieldInput
                id="specialty"
                label={t.specialtyLabel}
                placeholder={t.specialtyPlaceholder}
                disabled={disableFields}
                register={register("specialty")}
                error={errors.specialty?.message}
              />

              <FormFieldInput
                id="licenseNumber"
                label={t.licenseNumberLabel}
                placeholder={t.licenseNumberPlaceholder}
                disabled={disableFields}
                register={register("licenseNumber")}
                error={errors.licenseNumber?.message}
              />

              <FormFieldInput
                id="defaultConsultationDuration"
                type="number"
                label={t.defaultConsultationDurationLabel}
                placeholder={t.defaultConsultationDurationPlaceholder}
                disabled={disableFields}
                register={register("defaultConsultationDuration", {
                  valueAsNumber: true,
                })}
                error={errors.defaultConsultationDuration?.message}
              />
            </>
          )}

          <FieldGroup className="gap-2">
            <Field
              orientation="vertical"
              className="flex h-full justify-center"
            >
              <FieldLabel htmlFor="active">
                {currentActive ? t.activeUserLabel : t.inactiveUserLabel}
              </FieldLabel>

              <Switch
                id="active"
                size="default"
                checked={currentActive}
                disabled={disableFields}
                onCheckedChange={(checked) =>
                  setValue("isActive", checked, {
                    shouldValidate: true,
                  })
                }
              />
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
