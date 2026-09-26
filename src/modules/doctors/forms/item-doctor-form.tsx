"use client";

import { useCallback, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { FormFieldInput } from "@/components/customs/form-field-input";

import {
  createDoctorWithSchedules,
  updateDoctorWithUserAndSchedule,
} from "../services";
import { DoctorWithSchedulesCreateRequest } from "../types";
import {
  getUserDataLocalStore,
  setUserDataLocalStore,
} from "@/lib/utils/local-storage";
import {
  DEFAULT_SCHEDULE_VALUES,
  DOCTOR_SCHEDULE_DAY_OF_WEEK,
  DoctorFormMode,
  getErrorMessage,
  useLanguage,
} from "@/lib";
import { getUpdateDoctorSchema, UpdateDoctorSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { CalendarDays, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { FormFieldSelect } from "@/components/customs/form-field-select";
import { FormFieldTextArea } from "@/components/customs/form-field-text-area";
import { UserWithDoctorandScheduleApiResponse } from "@/modules/user/types";
import {
  DoctorScheduleApiResponse,
  UpdateDoctorWithUserAndScheduleRequest,
} from "@/modules/doctor-schedule/types";

interface Props {
  mode: DoctorFormMode;
  setOpenDetails: (e: boolean) => void;
  doctorWithUserAndScheduleData: UserWithDoctorandScheduleApiResponse | null;
  getDoctorScheduleDaysOfWeekTypeOptions: (e: any) => {
    value: DOCTOR_SCHEDULE_DAY_OF_WEEK;
    label: any;
  }[];
}

export function ItemDoctorForm({
  mode,
  setOpenDetails,
  doctorWithUserAndScheduleData,
  getDoctorScheduleDaysOfWeekTypeOptions,
}: Props) {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.doctors;

  const [isLoading, setIsLoading] = useState(false);

  const isCompleteMode = mode === "complete";

  const currentSchema = getUpdateDoctorSchema(dictionary);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<UpdateDoctorSchema>({
    resolver: zodResolver(currentSchema),

    defaultValues: {
      specialty: doctorWithUserAndScheduleData?.doctor?.specialty ?? "",
      licenseNumber: doctorWithUserAndScheduleData?.doctor?.licenseNumber ?? "",
      defaultConsultationDuration:
        doctorWithUserAndScheduleData?.doctor?.defaultConsultationDuration ??
        30,
      schedules:
        doctorWithUserAndScheduleData?.schedules?.map(
          (s: DoctorScheduleApiResponse) => ({
            id: s.id,
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            available: s.available,
            note: s.notes ?? "",
          })
        ) ?? [],
    },
  });

  const scheduleValues = watch("schedules");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  const doctorScheduleTypeOptions = useMemo(
    () =>
      getDoctorScheduleDaysOfWeekTypeOptions(t.doctorScheduleDayOfWeekOptions),
    [t.doctorScheduleDayOfWeekOptions, getDoctorScheduleDaysOfWeekTypeOptions]
  );

  const usedDays = useMemo(
    () =>
      (scheduleValues ?? [])
        .map((s) => s?.dayOfWeek)
        .filter((d): d is DOCTOR_SCHEDULE_DAY_OF_WEEK => !!d),
    [scheduleValues]
  );

  const getAvailableDayOptions = useCallback(
    (currentDay?: DOCTOR_SCHEDULE_DAY_OF_WEEK) =>
      doctorScheduleTypeOptions.filter(
        (option) =>
          !usedDays.includes(option.value) || option.value === currentDay
      ),
    [doctorScheduleTypeOptions, usedDays]
  );

  const nextAvailableDay = doctorScheduleTypeOptions.find(
    (option) => !usedDays.includes(option.value)
  )?.value;

  async function onSubmit(data: UpdateDoctorSchema) {
    setIsLoading(true);

    try {
      const user = getUserDataLocalStore();

      if (!user) {
        throw new Error("User not found");
      }

      if (isCompleteMode && doctorWithUserAndScheduleData) {
        const payload: UpdateDoctorWithUserAndScheduleRequest = {
          doctor: {
            specialty: data.specialty ?? "",
            licenseNumber: data.licenseNumber ?? "",
            defaultConsultationDuration: data.defaultConsultationDuration ?? 30,
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

        try {
          const response = await updateDoctorWithUserAndSchedule(
            doctorWithUserAndScheduleData.id,
            payload
          );

          if (response.status === 200) {
            user.doctorProfileCompleted = true;
            setUserDataLocalStore(user);
            toast.success(t.toastUpdateSuccess);
            setOpenDetails(false);
          } else {
            toast.error(dictionary.components.toast.unexpectedResponseStatus);
          }
        } catch (error) {
          toast.error(getErrorMessage(error));
        }
      } else {
        const payload: DoctorWithSchedulesCreateRequest = {
          userId: user.id,
          specialty: data.specialty,
          licenseNumber: data.licenseNumber,
          defaultConsultationDuration: data.defaultConsultationDuration,
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

        try {
          const response = await createDoctorWithSchedules(payload);

          if (response.status === 201) {
            user.doctorProfileCompleted = true;
            setUserDataLocalStore(user);
            toast.success(t.toastSuccess);
            setOpenDetails(false);
          } else {
            toast.error(dictionary.components.toast.unexpectedResponseStatus);
          }
        } catch (error) {
          toast.error(getErrorMessage(error));
        }
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="h-[70vh]" onSubmit={handleSubmit(onSubmit)} noValidate>
      <>
        <Card className="border border-border">
          <CardContent className="grid gap-4 pt-6">
            <FormFieldInput
              id="specialty"
              label={t.specialtyLabel}
              placeholder={t.specialtyPlaceholder}
              register={register("specialty")}
              error={errors.specialty?.message}
            />

            <FormFieldInput
              id="licenseNumber"
              label={t.licenseNumberLabel}
              placeholder={t.licenseNumberPlaceholder}
              register={register("licenseNumber")}
              error={errors.licenseNumber?.message}
            />

            <FormFieldInput
              id="defaultConsultationDuration"
              type="number"
              label={t.defaultConsultationDurationLabel}
              placeholder={t.defaultConsultationDurationPlaceholder}
              register={register("defaultConsultationDuration", {
                valueAsNumber: true,
              })}
              error={errors.defaultConsultationDuration?.message}
            />
          </CardContent>
        </Card>
        <>
          <>
            <Separator className="md:col-span-2 my-4" />

            <FieldGroup className="md:col-span-2 border-2 border-border p-4 rounded-2xl">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <h3 className="font-medium">{t.scheduleSectionTitle}</h3>
                </div>

                {errors.schedules?.message && (
                  <p className="text-sm text-red-500">
                    {errors.schedules.message}
                  </p>
                )}

                {fields.map((field, index) => {
                  const scheduleErrors = (errors.schedules as any)?.[index];
                  const currentDayOfWeek = watch(
                    `schedules.${index}.dayOfWeek`
                  );

                  return (
                    <Card
                      key={field.id}
                      className="border border-border bg-background"
                    >
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                        <FormFieldSelect
                          id={`schedules.${index}.dayOfWeek`}
                          label={t.scheduleDayOfWeekLabel}
                          placeholder={t.scheduleDayOfWeekPlaceholder}
                          value={currentDayOfWeek}
                          onValueChange={(value) =>
                            setValue(
                              `schedules.${index}.dayOfWeek`,
                              value as DOCTOR_SCHEDULE_DAY_OF_WEEK,
                              { shouldValidate: true }
                            )
                          }
                          options={getAvailableDayOptions(currentDayOfWeek)}
                          error={scheduleErrors?.dayOfWeek?.message as string}
                        />
                        <FormFieldInput
                          id={`schedules.${index}.startTime`}
                          type="time"
                          label={t.scheduleStartTimeLabel}
                          placeholder={t.scheduleStartTimePlaceholder}
                          register={register(
                            `schedules.${index}.startTime` as never
                          )}
                          error={scheduleErrors?.startTime?.message}
                        />
                        <FormFieldInput
                          id={`schedules.${index}.endTime`}
                          type="time"
                          label={t.scheduleEndTimeLabel}
                          placeholder={t.scheduleEndTimePlaceholder}
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
                              checked={!!watch(`schedules.${index}.available`)}
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
                        <div className={`col-span-1 md:col-span-2`}>
                          <FormFieldTextArea
                            id={`schedules.${index}.note`}
                            label={t.scheduleNoteLabel}
                            placeholder={t.scheduleNotePlaceholder}
                            register={register(
                              `schedules.${index}.note` as never
                            )}
                            error={scheduleErrors?.note?.message}
                          />
                        </div>
                        {fields.length > 1 && (
                          <div
                            className={`col-span-1 md:col-span-2 flex items-center place-content-center w-full`}
                          >
                            <Button
                              className="w-full h-full md:h-auto py-2"
                              type="button"
                              variant="destructive"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                <div>
                  <div className="flex flex-col w-full md:col-span-2">
                    <Button
                      type="button"
                      className="hover:bg-primary/90"
                      disabled={!nextAvailableDay}
                      onClick={() =>
                        nextAvailableDay &&
                        append({
                          dayOfWeek: nextAvailableDay,
                          ...DEFAULT_SCHEDULE_VALUES,
                        })
                      }
                    >
                      {t.scheduleAddButton}
                    </Button>
                  </div>
                </div>
              </div>
            </FieldGroup>

            <FieldGroup className="md:col-span-2 mt-4 p-4 rounded-2xl">
              <div className="md:col-span-2">
                <Button
                  className="flex w-full"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? t.saving : mode === "create" ? t.save : t.update}
                </Button>
              </div>
            </FieldGroup>
          </>
        </>
      </>
    </form>
  );
}
