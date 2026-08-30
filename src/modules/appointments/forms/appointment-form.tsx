"use client";

import {
  APPOINTMENT_STATUS,
  FormMode,
  getErrorMessage,
  routes,
  useLanguage,
} from "@/lib";
import { useAppointmentActions } from "../list/appointment-actions";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SectionHeader } from "@/components/customs/secction-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

import {
  AppointmentSchema,
  getCreateAppointmentSchema,
  getUpdateAppointmentSchema,
} from "./schema";

import {
  APPOINTMENT_STATUS_TYPE,
  AppointmentApiResponse,
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
} from "../types";

import { getAllDoctorsFiltered } from "@/modules/doctors/services";
import { DoctorFilteredApiResponse } from "@/modules/doctors/types";

import { ApiResponse, PaginatedData } from "@/lib/server/api-response";
import {
  FormFieldSearchSelect,
  SearchSelectDisplayField,
} from "@/components/customs/form-field-search-select";
import { PatientFilteredApiResponse } from "@/modules/patients/types";
import { getAllPatientsFiltered } from "@/modules/patients/services";
import { FormFieldInput } from "@/components/customs/form-field-input";
import { FormFieldSelect } from "@/components/customs/form-field-select";
import {
  formatApiDateToInputString,
  formatApiDateToTimeInputString,
  formatDateTimeToApiString,
  formatDisplayDateTimeToLocaleString,
  formatSelectedDateToInputString,
  parseInputStringToDate,
} from "@/lib/utils/functions";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { FormFieldTextArea } from "@/components/customs/form-field-text-area";
import { createAppointment, updateAppointment } from "../services";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface AppointmentFormProps {
  appointment: AppointmentApiResponse;
  mode: FormMode;
}

export function AppointmentForm({ appointment, mode }: AppointmentFormProps) {
  const router = useRouter();

  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.appointments;

  const {} = useAppointmentActions({ dictionary });

  const [isLoading, setIsLoading] = useState(false);

  const [doctorData, setDoctorData] = useState<ApiResponse<
    PaginatedData<DoctorFilteredApiResponse>
  > | null>(null);

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [doctorSearch, setDoctorSearch] = useState("");
  const [patientSearch, setPatientSearch] = useState("");

  const isEditMode = mode === "edit";
  const isViewMode = mode === "details";
  const disableFields = isViewMode;

  const currentSchema = useMemo(() => {
    return isEditMode
      ? getUpdateAppointmentSchema(dictionary)
      : getCreateAppointmentSchema(dictionary);
  }, [dictionary, isEditMode]);

  const initialAppointmentDate = useMemo(() => {
    return formatApiDateToInputString(appointment?.appointmentDateTime);
  }, [appointment?.appointmentDateTime]);

  const initialAppointmentTime = useMemo(() => {
    return formatApiDateToTimeInputString(appointment?.appointmentDateTime);
  }, [appointment?.appointmentDateTime]);

  const getAppointmentStatusOptions = useCallback((optionsDict: any) => {
    return Object.values(APPOINTMENT_STATUS_TYPE).map((docType) => {
      const docTypeKey = docType.toLowerCase() as
        | "scheduled"
        | "confirmed"
        | "attended"
        | "cancelled"
        | "no_show";
      return { value: docType, label: optionsDict[docTypeKey] };
    });
  }, []);

  const appointmentStatusOptions = useMemo(
    () => getAppointmentStatusOptions(t.appointmentStatusOptions),
    [t.appointmentStatusOptions, getAppointmentStatusOptions]
  );

  const {
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    trigger,
    register,
    formState: { errors },
  } = useForm<AppointmentSchema>({
    resolver: zodResolver(currentSchema) as Resolver<AppointmentSchema>,
    defaultValues: {
      status: appointment.status as APPOINTMENT_STATUS,
      attendedAt: appointment.attendedAt,
      cancellationReason: appointment.cancellationReason,
      confirmedAt: appointment.confirmedAt,
      appointmentDateTime: initialAppointmentDate,
      appointmentTime: initialAppointmentTime,
      durationMinutes: appointment.durationMinutes,
      consultationReason: appointment.consultationReason,
      notes: appointment.notes,
    },
  });

  const currentAppointmentStatus = watch("status");
  const appointmentDateValue = watch("appointmentDateTime");

  const selectedDate = useMemo(
    () => parseInputStringToDate(appointmentDateValue),
    [appointmentDateValue]
  );

  const searchDoctors = async (
    query: string
  ): Promise<DoctorFilteredApiResponse[]> => {
    try {
      const response = await getAllDoctorsFiltered(0, 10, query);

      return response.data?.content || [];
    } catch (error) {
      console.error("Error searching doctors:", error);
      return [];
    }
  };

  const searchPatients = async (
    query: string
  ): Promise<PatientFilteredApiResponse[]> => {
    try {
      const response = await getAllPatientsFiltered(0, 10, query);

      return response.data?.content || [];
    } catch (error) {
      console.error("Error searching patients:", error);
      return [];
    }
  };

  const handleSelectDoctor = (doctor: DoctorFilteredApiResponse): void => {
    setSelectedDoctorId(doctor.doctorId);
    setDoctorSearch(doctor.username);

    setValue("doctorId", doctor.doctorId, {
      shouldValidate: true,
      shouldDirty: true,
    });

    clearErrors("doctorId");
  };

  const handleSelectPatient = (patient: PatientFilteredApiResponse): void => {
    setSelectedPatientId(patient.id);
    setPatientSearch(patient.fullName);

    setValue("patientId", patient.id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    clearErrors("patientId");
  };

  const getHeaderTitle = () => {
    if (isViewMode) return t.viewSectionTitle;
    if (isEditMode) return t.editSectionTitle;
    return t.createSectionTitle;
  };

  async function onSubmit(data: AppointmentSchema) {
    if (isViewMode) return;
    setIsLoading(true);

    try {
      const payload = {
        patientId: data.patientId,
        doctorId: data.doctorId,
        appointmentDateTime: formatDateTimeToApiString(
          data.appointmentDateTime,
          data.appointmentTime
        ),
        durationMinutes: data.durationMinutes,
        consultationReason: data.consultationReason,
        notes: data.notes || null,
      };

      /*  const response = isEditMode
        ? await updateAppointment(patient.id, payload as AppointmentUpdateRequest)
        : await createAppointment(payload as AppointmentCreateRequest); */

      const response = await createAppointment(
        payload as AppointmentCreateRequest
      );

      if (response.status === 201 || response.status === 200) {
        toast.success(isEditMode ? t.toastUpdateSuccess : t.toastSuccess);
        router.push(routes.appointments.root);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const doctorDisplayFields: SearchSelectDisplayField<DoctorFilteredApiResponse>[] =
    [
      {
        key: "username",
        label: t.doctorSearchFields.username,
        getValue: (doctor) => doctor.username,
      },
      {
        key: "email",
        label: t.doctorSearchFields.email,
        getValue: (doctor) => doctor.email,
      },
      {
        key: "licenseNumber",
        label: t.doctorSearchFields.licenseNumber,
        getValue: (doctor) => doctor.licenseNumber,
        condition: (doctor) => !!doctor.licenseNumber,
      },
    ];

  const patientsDisplayFields: SearchSelectDisplayField<PatientFilteredApiResponse>[] =
    [
      {
        key: "fullName",
        label: t.patientSearchFields.fullName,
        getValue: (patient) => patient.fullName,
      },
      {
        key: "medicalRecordNumber",
        label: t.patientSearchFields.medicalRecordNumber,
        getValue: (patient) => patient.medicalRecordNumber,
      },
      {
        key: "documentNumber",
        label: t.patientSearchFields.documentNumber,
        getValue: (patient) => patient.documentNumber,
      },
    ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <SectionHeader
        title={getHeaderTitle()}
        description={
          isEditMode
            ? t.editSectionSubtitle
            : isViewMode
            ? t.viewSectionSubtitle
            : t.createSectionSubtitle
        }
        onBack={() => router.back()}
      >
        {!isViewMode && (
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            {t.save}
          </Button>
        )}
      </SectionHeader>

      <Card className="border bg-background border-border rounded-lg w-full overflow-visible">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 pt-6">
          <FormFieldSearchSelect<DoctorFilteredApiResponse>
            id="doctorName"
            label={t.doctorLabel}
            placeholder={t.doctorPlaceholder}
            disabled={disableFields}
            value={
              mode === "create" ? doctorSearch : appointment.doctorFullName
            }
            onChange={setDoctorSearch}
            onSelect={handleSelectDoctor}
            searchItems={mode === "create" ? searchDoctors : mode === "edit" ? searchDoctors : undefined}
            getDisplayLabel={(doctor) => doctor.username}
            displayFields={doctorDisplayFields}
            error={errors.doctorId?.message}
            minChars={1}
            debounceDelay={200}
            maxResults={10}
          />

          <FormFieldSearchSelect<PatientFilteredApiResponse>
            id="patientName"
            label={t.patientLabel}
            placeholder={t.patientPlaceholder}
            disabled={disableFields}
            value={
              mode === "create" ? patientSearch : appointment.patientFullName
            }
            onChange={setPatientSearch}
            onSelect={handleSelectPatient}
            searchItems={mode === "create" ? searchPatients : mode === "edit" ? searchPatients : undefined}
            getDisplayLabel={(patient) => patient.fullName}
            displayFields={patientsDisplayFields}
            error={errors.patientId?.message}
            minChars={1}
            debounceDelay={200}
            maxResults={10}
          />

          <div className="grid gap-2">
            <Label htmlFor="appointmentDateTime">
              {t.appointmentDateTimeLabel}
            </Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="appointmentDateTime"
                  variant="outline"
                  disabled={disableFields}
                  className={cn(
                    "w-full justify-start text-left font-normal px-3",
                    !appointmentDateValue && "text-muted-foreground"
                  )}
                  aria-invalid={errors.appointmentDateTime ? "true" : "false"}
                >
                  <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                  {appointmentDateValue ? (
                    appointmentDateValue
                  ) : (
                    <span>{t.appointmentDateTimePlaceholder}</span>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0 bg-card" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setValue(
                        "appointmentDateTime",
                        formatSelectedDateToInputString(date),
                        { shouldValidate: true }
                      );
                    } else {
                      setValue("appointmentDateTime", "");
                    }
                    trigger("appointmentDateTime");
                    setIsCalendarOpen(false);
                  }}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
            <div className="text-sm h-5 text-red-500">
              {errors.appointmentDateTime ? (
                (errors.appointmentDateTime.message as string)
              ) : (
                <>&nbsp;</>
              )}
            </div>
          </div>

          <FormFieldInput
            id="appointmentTime"
            type="time"
            label={t.appointmentTimeLabel}
            placeholder={t.appointmentTimePlaceholder}
            disabled={disableFields}
            register={register("appointmentTime")}
            error={errors.appointmentTime?.message as string}
          />

          <FormFieldInput
            id="durationMinutes"
            label={t.durationMinutesLabel}
            placeholder={t.durationMinutesPlaceholder}
            disabled={disableFields}
            type="number"
            min={1}
            register={register("durationMinutes", {
              valueAsNumber: true,
            })}
            error={errors.durationMinutes?.message as string}
          />

          {isViewMode && (
            <FormFieldSelect
              id="status"
              label={t.statusLabel}
              placeholder={t.statusPlaceholder}
              disabled={disableFields}
              value={currentAppointmentStatus ?? ""}
              onValueChange={(value) =>
                setValue("status", value as APPOINTMENT_STATUS, {
                  shouldValidate: true,
                })
              }
              options={appointmentStatusOptions}
              error={errors.status?.message as string}
            />
          )}
        </CardContent>

        <CardContent className="grid grid-cols-1 gap-x-6">
          {(isEditMode || isViewMode) && (
            <FormFieldTextArea
              id="cancellationReason"
              label={t.cancellationReasonLabel}
              placeholder={
                mode !== "details"
                  ? t.cancellationReasonPlaceholder
                  : t.systemUnknown
              }
              disabled={disableFields}
              register={register("cancellationReason")}
              error={errors.cancellationReason?.message as string}
              maxLength={255}
            />
          )}
        </CardContent>

        <CardContent className="grid grid-cols-1 gap-x-6">
          <FormFieldTextArea
            id="consultationReason"
            label={t.consultationReasonLabel}
            placeholder={t.consultationReasonPlaceholder}
            disabled={disableFields}
            register={register("consultationReason")}
            error={errors.consultationReason?.message as string}
            maxLength={255}
          />

          <FormFieldTextArea
            id="notes"
            label={t.notesLabel}
            placeholder={
              mode !== "details" ? t.notesPlaceholder : t.systemUnknown
            }
            disabled={disableFields}
            register={register("notes")}
            error={errors.notes?.message as string}
            maxLength={500}
          />
        </CardContent>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 pt-2">
          {(isEditMode || isViewMode) && (
            <>
              <Separator className="md:col-span-2 mt-2 mb-4" />

              <div className="grid gap-2">
                <Label htmlFor="createdBy">{t.createdByLabel}</Label>
                <Input
                  id="createdBy"
                  value={appointment.createdBy || t.systemUnknown}
                  disabled={true}
                  className="bg-muted text-muted-foreground"
                />
                <div className="text-sm h-5">&nbsp;</div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="createdAt">{t.createdAtLabel}</Label>
                <Input
                  id="createdAt"
                  value={
                    appointment.createdAt
                      ? formatDisplayDateTimeToLocaleString(
                          appointment.createdAt
                        )
                      : ""
                  }
                  disabled={true}
                  className="bg-muted text-muted-foreground"
                />
                <div className="text-sm h-5">&nbsp;</div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmedAt">{t.confirmedAtLabel}</Label>
                <Input
                  id="confirmedAt"
                  value={
                    appointment.confirmedAt
                      ? formatDisplayDateTimeToLocaleString(
                          appointment.confirmedAt
                        )
                      : t.systemUnknown
                  }
                  disabled={true}
                  className="bg-muted text-muted-foreground"
                />
                <div className="text-sm h-5">&nbsp;</div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="attendedAt">{t.attendedAtLabel}</Label>
                <Input
                  id="attendedAt"
                  value={
                    appointment.attendedAt
                      ? formatDisplayDateTimeToLocaleString(
                          appointment.attendedAt
                        )
                      : t.systemUnknown
                  }
                  disabled={true}
                  className="bg-muted text-muted-foreground"
                />
                <div className="text-sm h-5">&nbsp;</div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cancelledBy">{t.cancelledByLabel}</Label>
                <Input
                  id="cancelledBy"
                  value={appointment.cancelledBy || t.systemUnknown}
                  disabled={true}
                  className="bg-muted text-muted-foreground"
                />
                <div className="text-sm h-5">&nbsp;</div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
}
