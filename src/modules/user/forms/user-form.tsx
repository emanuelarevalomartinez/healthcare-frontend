"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Resolver, useFieldArray } from "react-hook-form";
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
  deleteDoctorAndItScheduleByUserId,
  updateDoctorWithUserAndSchedule,
} from "@/modules/doctors/services";
import {
  DoctorScheduleApiResponse,
  UpdateDoctorWithUserAndScheduleRequest,
} from "@/modules/doctor_schedule/types";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Trash2 } from "lucide-react";
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
      schedules:
        user.schedules?.map((s: DoctorScheduleApiResponse) => ({
          id: s.id,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          available: s.available,
          note: s.notes ?? "",
        })) ?? [],
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
          const updateDoctorWithUserAndSchedulePayload: UpdateDoctorWithUserAndScheduleRequest =
            {
              user: {
                username: updateData.username,
                email: updateData.email,
                role: currentRole,
                isActive: currentActive,
                ...(updateData.password?.trim()
                  ? { password: updateData.password }
                  : {}),
              },
              doctor: {
                specialty: updateData.specialty ?? "",
                licenseNumber: data.licenseNumber ?? "",
                defaultConsultationDuration:
                  data.defaultConsultationDuration ?? 0,
              },
              schedule: {
                schedules: data.schedules.map((s) => ({
                  id: s.id,
                  dayOfWeek: s.dayOfWeek,
                  startTime: s.startTime,
                  endTime: s.endTime,
                  available: s.available,
                  notes: s.note,
                })),
              },
            };
          await updateDoctorWithUserAndSchedule(
            user.id,
            updateDoctorWithUserAndSchedulePayload
          );
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
          await deleteDoctorAndItScheduleByUserId(user.id);
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

          {currentRole === USER_ROLE.DOCTOR && (
            <>
              <Separator className="md:col-span-2 mt-2 mb-4" />

              <FieldGroup className="md:col-span-2 border-2 border-border p-4 rounded-2xl">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <h3 className="font-medium">{t.scheduleSectionTitle}</h3>
                  </div>

                  {user.schedules?.map((field, index) => {
                    const scheduleErrors = (errors.schedules as any)?.[index];
                    const currentDayOfWeek = watch(
                      `schedules.${index}.dayOfWeek`
                    );
                    const currentAvailable = watch(
                      `schedules.${index}.available`
                    );

                    return (
                      <Card
                        key={index}
                        className="border border-border bg-background"
                      >
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                          {/* Día de la semana */}
                          <FormFieldSelect
                            id={`schedules.${index}.dayOfWeek`}
                            label={t.scheduleDayOfWeekLabel}
                            placeholder={t.scheduleDayOfWeekPlaceholder}
                            disabled={disableFields}
                            value={currentDayOfWeek}
                            onValueChange={(value) =>
                              setValue(
                                `schedules.${index}.dayOfWeek`,
                                value as DOCTOR_SCHEDULE_DAY_OF_WEEK,
                                { shouldValidate: true }
                              )
                            }
                            options={doctorScheduleTypeOptions}
                            error={scheduleErrors?.dayOfWeek?.message as string}
                          />

                          {/* Hora inicio */}
                          <FormFieldInput
                            id={`schedules.${index}.startTime`}
                            type="time"
                            label={t.scheduleStartTimeLabel}
                            placeholder={t.scheduleStartTimePlaceholder}
                            disabled={disableFields}
                            register={register(
                              `schedules.${index}.startTime` as never
                            )}
                            error={scheduleErrors?.startTime?.message}
                          />

                          {/* Hora fin */}
                          <FormFieldInput
                            id={`schedules.${index}.endTime`}
                            type="time"
                            label={t.scheduleEndTimeLabel}
                            placeholder={t.scheduleEndTimePlaceholder}
                            disabled={disableFields}
                            register={register(
                              `schedules.${index}.endTime` as never
                            )}
                            error={scheduleErrors?.endTime?.message}
                          />

                          <FieldGroup>
                            <Field
                              orientation="vertical"
                              className="flex justify-center"
                            >
                              <FieldLabel
                                htmlFor={`schedules.${index}.available`}
                              >
                                {watch(`schedules.${index}.available`)
                                  ? t.scheduleAvailableOnLabel
                                  : t.scheduleAvailableOffLabel}
                              </FieldLabel>

                              <Switch
                                id={`schedules.${index}.available`}
                                checked={
                                  !!watch(`schedules.${index}.available`)
                                }
                                disabled={disableFields}
                                onCheckedChange={(checked) =>
                                  setValue(
                                    `schedules.${index}.available`,
                                    checked,
                                    {
                                      shouldValidate: true,
                                    }
                                  )
                                }
                              />
                            </Field>
                          </FieldGroup>

                          {/* Nota */}
                          <div
                            className={`${
                              isEditMode
                                ? "col-span-1 md:col-span-2"
                                : "col-span-1 md:col-span-2"
                            }`}
                          >
                            <FormFieldTextArea
                              id={`schedules.${index}.note`}
                              label={t.scheduleNoteLabel}
                              placeholder={t.scheduleNotePlaceholder}
                              disabled={disableFields}
                              register={register(
                                `schedules.${index}.note` as never
                              )}
                              error={scheduleErrors?.note?.message}
                            />
                          </div>

                          {/* Eliminar */}
                          {!disableFields && isEditMode && (
                            <div
                              className={`${
                                isEditMode
                                  ? "col-span-1 md:col-span-2 flex items-center place-content-center w-full"
                                  : ""
                              }`}
                            >
                              <Button
                                className="w-full h-full md:h-auto py-2"
                                type="button"
                                variant="destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}

                  {isEditMode && (
                    <div>
                      <div className="flex flex-col w-full md:col-span-2">
                        <Button type="button">{t.scheduleAddButton}</Button>
                      </div>
                    </div>
                  )}
                </div>
              </FieldGroup>
            </>
          )}

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
