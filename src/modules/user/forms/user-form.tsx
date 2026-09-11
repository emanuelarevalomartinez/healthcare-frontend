"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  DOCTOR_SCHEDULE_DAY_OF_WEEK,
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
  UserCreateRequest,
  UserUpdateRequest,
  UserWithDoctorandScheduleApiResponse,
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
  deleteDoctorByUserId,
  updateDoctorWithUser,
} from "@/modules/doctors/services";
import { DoctorScheduleApiResponse } from "@/modules/doctor_schedule/types";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays } from "lucide-react";
import { FormFieldTextArea } from "@/components/customs/form-field-text-area";

interface UserFormProps {
  user: UserWithDoctorandScheduleApiResponse;
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

  const getDoctorScheduleDaysOfWeekTypeOptions = useCallback(
    (optionsDict: any) => {
      return Object.values(DOCTOR_SCHEDULE_DAY_OF_WEEK).map(
        (docScheduleType) => {
          const docScheduleTypeKey = docScheduleType.toLowerCase() as
            | "all_week"
            | "weekdays"
            | "weekend"
            | "monday"
            | "tuesday"
            | "wednesday"
            | "thursday"
            | "friday"
            | "saturday"
            | "sunday";
          return {
            value: docScheduleType,
            label: optionsDict[docScheduleTypeKey],
          };
        }
      );
    },
    []
  );

  const doctorScheduleTypeOptions = useMemo(
    () =>
      getDoctorScheduleDaysOfWeekTypeOptions(t.doctorScheduleDayOfWeekOptions),
    [t.doctorScheduleDayOfWeekOptions, getDoctorScheduleDaysOfWeekTypeOptions]
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
  const currentDaysOfWeekType = watch("currentDaysOfWeekType");

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
            defaultConsultationDuration: data.defaultConsultationDuration ?? 0,
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
          await deleteDoctorByUserId(user.id);
          await updateUser(user.id, updateUserPayload);
        }
        toast.success(t.toastUpdateSuccess);
        router.push(routes.users.root);
      } else {
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

          <>
            <Separator className="md:col-span-2 mt-2 mb-4" />

            <FieldGroup className="col-start-1 col-span-2">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <h3 className="font-medium">Horarios de consulta</h3>
                </div>

                <Card className="border-dashed border-border bg-background">
                  <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-4">
                    <div className="row-start-1 lg:row-start-auto col-span-12 lg:col-span-4 grid gap-2">
                      <FormFieldSelect
                        id="daysOfWeek"
                        label={"label"}
                        placeholder={"placeholder"}
                        disabled={false}
                        value={currentDaysOfWeekType}
                        onValueChange={(value) =>
                          setValue(
                            "currentDaysOfWeekType",
                            value as DOCTOR_SCHEDULE_DAY_OF_WEEK,
                            {
                              shouldValidate: true,
                            }
                          )
                        }
                        options={doctorScheduleTypeOptions}
                        error={errors.currentDaysOfWeekType?.message as string}
                      />
                    </div>

                    <div className="row-start-2 lg:row-start-auto col-span-12 lg:col-span-3 grid gap-2">
                      <FormFieldInput
                        id="startTime"
                        type="time"
                        label={"inicio"}
                        placeholder={"placeholder"}
                        disabled={disableFields}
                        register={register("defaultConsultationDuration", {
                          valueAsNumber: true,
                        })}
                        error={errors.defaultConsultationDuration?.message}
                      />
                    </div>

                    <div className="row-start-3 lg:row-start-auto col-span-12 lg:col-span-3 grid gap-2">
                      <FormFieldInput
                        id="endTime"
                        type="time"
                        label={"inicio"}
                        placeholder={"placeholder"}
                        disabled={disableFields}
                        register={register("defaultConsultationDuration", {
                          valueAsNumber: true,
                        })}
                        error={errors.defaultConsultationDuration?.message}
                      />
                    </div>

                    <div className="row-start-4 lg:row-start-auto col-span-12 lg:col-span-2 grid gap-2">
                      <FieldGroup className="">
                        <Field
                          orientation="vertical"
                          className="flex justify-center"
                        >
                          <FieldLabel htmlFor="active">
                            {currentActive
                              ? t.activeUserLabel
                              : t.inactiveUserLabel}
                          </FieldLabel>

                          <Switch
                            id="scheduleAvailable"
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
                      </FieldGroup>
                    </div>

                    <div className="row-start-5 lg:row-start-2 col-span-12">
                      <FormFieldTextArea
                        id="scheduleNote"
                        label={"label de text area"}
                        placeholder={"placeholder"}
                        disabled={disableFields}
                        register={register("currentDaysOfWeekType")}
                        /*  error={errors.cancellationReason?.message as string} */
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background">
                  <CardContent>
                    <div className="flex flex-col w-full">
                      <Button type="button">Añadir horario</Button>
                    </div>
                  </CardContent>
                </Card>

                {/*  aqui termina el codigo añadido  */}
              </div>
            </FieldGroup>
          </>

          {(isEditMode || isViewMode) && (
            <>
              <Separator className="lg:col-span-2 mt-2 mb-4" />

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
