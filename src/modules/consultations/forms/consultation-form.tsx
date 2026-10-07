"use client";

import { FormMode, routes, useLanguage, USER_ROLE } from "@/lib";
import {
  ConsultationApiResponse,
} from "../types";
import { useEffect, useMemo, useState } from "react";
import { useConsultationActions } from "../list/consultation-actions";
import { useRouter } from "next/navigation";
import {
  ConsultationSchema,
  getCreateConsultationSchema,
  getUpdateConsultationSchema,
} from "./schema";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SectionHeader } from "@/components/customs/secction-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormFieldSearchSelect, SearchSelectDisplayField } from "@/components/customs/form-field-search-select";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { FormFieldInput } from "@/components/customs/form-field-input";
import { FormFieldTextArea } from "@/components/customs/form-field-text-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { DoctorWithUserAndScheduleApiResponse } from "@/modules/doctors/types";
import {
  formatApiDateToInputString,
  formatApiDateToTimeInputString,
  formatDisplayDateTimeToLocaleString,
  formatSelectedDateToInputString,
  parseInputStringToDate,
} from "@/lib/utils/functions";
import { cn } from "@/lib/utils";
import { getAllDoctorsFiltered } from "@/modules/doctors/services";
import {
  getAllAppointmentsSearched,
} from "@/modules/appointments/services";
import { AppointmentApiResponse } from "@/modules/appointments/types";
import { getUserDataLocalStore } from "@/lib/utils/local-storage";
import { findUserById } from "@/modules/user/services";

interface ConsultationFormProps {
  consultation: ConsultationApiResponse;
  mode: FormMode;
}

export function ConsultationForm({
  consultation,
  mode,
}: ConsultationFormProps) {
  const router = useRouter();

  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.consultations;

  const {} = useConsultationActions({
    dictionary,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isNextReviewCalendarOpen, setIsNextReviewCalendarOpen] =
    useState(false);

      const [isDoctorLocked, setIsDoctorLocked] = useState(false);

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedAppointmentId, setSelectedAppointmentId] =
    useState<string>("");

    const [doctorSearch, setDoctorSearch] = useState(
    mode === "create" ? "" : consultation.doctorName ?? ""
  );
  const [appointmentSearch, setAppointmentSearch] = useState(
    mode === "create" ? "" : consultation.id ?? ""
  );

  const initialConsultationDate = useMemo(() => {
    return formatApiDateToInputString(consultation?.consultationDate);
  }, [consultation?.consultationDate]);

  const initialConsultationTime = useMemo(() => {
    return formatApiDateToTimeInputString(consultation?.consultationDate);
  }, [consultation?.consultationDate]);

  const initialNextReview = useMemo(() => {
    return formatApiDateToInputString(consultation?.nextReview);
  }, [consultation?.nextReview]);

  const initialNextReviewTime = useMemo(() => {
    return formatApiDateToTimeInputString(consultation?.nextReview);
  }, [consultation?.nextReview]);

  const isEditMode = mode === "edit";
  const isViewMode = mode === "details";
  const disableFields = isViewMode;

  const currentSchema = useMemo(() => {
    return isEditMode
      ? getUpdateConsultationSchema(dictionary)
      : getCreateConsultationSchema(dictionary);
  }, [dictionary, isEditMode]);

  const {
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    trigger,
    register,
    formState: { errors },
  } = useForm<ConsultationSchema>({
    resolver: zodResolver(currentSchema) as Resolver<ConsultationSchema>,
    defaultValues: {
      symptoms: consultation.symptoms,
      diagnosis: consultation.diagnosis,
      treatment: consultation.treatment,
      prescription: consultation.prescription,
      observations: consultation.observations,
      consultationDate: initialConsultationDate,
      consultationTime: initialConsultationTime,
      nextReview: initialNextReview,
      nextReviewTime: initialNextReviewTime,
    },
  });

  const consultationDateValue = watch("consultationDate");
  const nextReviewValue = watch("nextReview");

  const selectedConsultationDate = useMemo(
    () => parseInputStringToDate(consultationDateValue),
    [consultationDateValue]
  );

  const selectedNextReviewDate = useMemo(
    () => parseInputStringToDate(nextReviewValue ?? ""),
    [nextReviewValue]
  );

  const getHeaderTitle = () => {
    if (isViewMode) return t.viewSectionTitle;
    if (isEditMode) return t.editSectionTitle;
    return t.createSectionTitle;
  };

  const searchDoctors = async (
    query: string
  ): Promise<DoctorWithUserAndScheduleApiResponse[]> => {
    try {
      const response = await getAllDoctorsFiltered(0, 10, query);
      return response.data?.content || [];
    } catch (error) {
      console.error("Error searching doctors:", error);
      return [];
    }
  };

  const handleSelectDoctor = (
    doctorWithDetails: DoctorWithUserAndScheduleApiResponse
  ): void => {
    const { doctor, user } = doctorWithDetails;

    setSelectedDoctorId(doctor.id);
    setDoctorSearch(user.username);

    setValue("createdByDoctor", doctor.id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    clearErrors("createdByDoctor");
  };

  const searchAppointments = async (
    query: string
  ): Promise<AppointmentApiResponse[]> => {
    try {
      const response = await getAllAppointmentsSearched({
        page: 0,
        size: 10,
        ascending: true,
        searchTerm: query,
      });
      return response.data?.content || [];
    } catch (error) {
      console.error("Error searching appointments:", error);
      return [];
    }
  };

  const handleSelectAppointment = (
    appointment: AppointmentApiResponse
  ): void => {
    setSelectedAppointmentId(appointment.id);
    setAppointmentSearch(appointment.id);

    setValue("appointmentId", appointment.id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    clearErrors("appointmentId");
  };

  async function onSubmit(data: ConsultationSchema) {
    console.log("aqui va el submit");
  }

  /*    async function onSubmit(data: ConsultationSchema) {
    if (isViewMode) return;
    setIsLoading(true);

    try {
      let response;

      if (isEditMode) {
        const updateData = data as UpdateConsultationSchema;

        const updatePayload: ConsultationUpdateRequest = {
          symptoms: updateData.symptoms,
          diagnosis: updateData.diagnosis,
          treatment: updateData.treatment,
          prescription: updateData.prescription || undefined,
          observations: updateData.observations || undefined,
          consultationDate: updateData.consultationDate,
          nextReview: updateData.nextReview || undefined,
        };

        response = await updateConsultation(consultation.id, updatePayload);
      } else {
        const createData = data as CreateConsultationSchema;

        const createPayload: ConsultationCreateRequest = {
          appointmentId: createData.appointmentId,
          createdByDoctor: createData.createdByDoctor,
          symptoms: createData.symptoms,
          diagnosis: createData.diagnosis,
          treatment: createData.treatment,
          prescription: createData.prescription || undefined,
          observations: createData.observations || undefined,
          consultationDate: createData.consultationDate,
          nextReview: createData.nextReview || undefined,
        };

        response = await createConsultation(createPayload);
      }

      if (response.status === 201 || response.status === 200) {
        toast.success(isEditMode ? t.toastUpdateSuccess : t.toastSuccess);
        router.push(routes.consultations.root);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  } */

     const doctorDisplayFields: SearchSelectDisplayField<DoctorWithUserAndScheduleApiResponse>[] =
    [
      {
        key: "user",
        label: t.doctorSearchFields.username,
        getValue: (doctorWithDetails) => doctorWithDetails.user.username,
      },
      {
        key: "user",
        label: t.doctorSearchFields.email,
        getValue: (doctorWithDetails) => doctorWithDetails.user.email,
      },
      {
        key: "schedules",
        label: t.doctorSearchFields.licenseNumber,
        getValue: (doctorWithDetails) => doctorWithDetails.doctor.licenseNumber,
        condition: (doctorWithDetails) =>
          !!doctorWithDetails.doctor.licenseNumber,
      },
    ];

  const appointmentsDisplayFields: SearchSelectDisplayField<AppointmentApiResponse>[] =
    [
      {
        key: "patientFullName",
        label: t.appointmentSearchFields.patientName,
        getValue: (appointment) => appointment.patientFullName,
      },
      {
        key: "doctorFullName",
        label: t.appointmentSearchFields.doctorName,
        getValue: (appointment) => appointment.doctorFullName,
      },
      {
        key: "appointmentDateTime",
        label: t.appointmentSearchFields.appointmentDateTime,
        getValue: (appointment) =>
          formatDisplayDateTimeToLocaleString(appointment.appointmentDateTime),
      },
    ];

    useEffect(() => {
    const loadDoctor = async () => {
      if (mode !== "create") return;

      const userData = getUserDataLocalStore();
      const userId = userData?.id;

      if (!userId) return;

      if (userData.role === USER_ROLE.DOCTOR) {
        try {
          const user = await findUserById(userId);
          const doctorId = user.data.doctor?.id ?? user.data.id;

          setDoctorSearch(user.data.username);
          setIsDoctorLocked(true);
          setSelectedDoctorId(doctorId);
          setValue("createdByDoctor", doctorId, { shouldValidate: true });
        } catch (error) {
          console.error("Error to find doctor:", error);
        }
      }
    };

    loadDoctor();
  }, [mode, setValue]);

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
          {!isEditMode && (
            <FormFieldSearchSelect<AppointmentApiResponse>
              id="appointmentId"
              label={t.appoinmentLabel}
              placeholder={t.appointmentPlaceholder}
              disabled={isViewMode || isEditMode}
              value={appointmentSearch}
              onChange={setAppointmentSearch}
              onSelect={handleSelectAppointment}
              searchItems={searchAppointments}
              getDisplayLabel={(appointment) => appointment.id}
              displayFields={appointmentsDisplayFields}
              error={errors.root?.message}
              minChars={1}
              debounceDelay={200}
              maxResults={10}
            />
          )}

          <FormFieldSearchSelect<DoctorWithUserAndScheduleApiResponse>
            id="createdByDoctor"
            label={t.doctorLabel}
            placeholder={t.doctorPlaceholder}
            disabled={isViewMode || isEditMode || isDoctorLocked}
            value={doctorSearch}
            onChange={setDoctorSearch}
            onSelect={handleSelectDoctor}
            searchItems={searchDoctors}
            getDisplayLabel={(doctorWithDetails) =>
              doctorWithDetails.user.username
            }
            displayFields={doctorDisplayFields}
            error={errors.root?.message}
            minChars={1}
            debounceDelay={200}
            maxResults={10}
          />

          <div className="grid gap-2">
            <Label htmlFor="consultationDate">{t.consultationDateLabel}</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="consultationDate"
                  variant="outline"
                  disabled={disableFields}
                  className={cn(
                    "w-full justify-start text-left font-normal px-3",
                    !consultationDateValue && "text-muted-foreground"
                  )}
                  aria-invalid={errors.consultationDate ? "true" : "false"}
                >
                  <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                  {consultationDateValue ? (
                    consultationDateValue
                  ) : (
                    <span>{t.consultationDatePlaceholder}</span>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0 bg-card" align="start">
                <Calendar
                  mode="single"
                  selected={selectedConsultationDate}
                  onSelect={(date) => {
                    if (date) {
                      setValue(
                        "consultationDate",
                        formatSelectedDateToInputString(date),
                        { shouldValidate: true }
                      );
                    } else {
                      setValue("consultationDate", "");
                    }
                    trigger("consultationDate");
                    setIsCalendarOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
            <div className="text-sm h-5 text-red-500">
              {errors.consultationDate ? (
                (errors.consultationDate.message as string)
              ) : (
                <>&nbsp;</>
              )}
            </div>
          </div>
          <FormFieldInput
            id="consultationTime"
            type="time"
            label={t.consultationTimeLabel}
            placeholder={t.consultationTimePlaceholder}
            disabled={disableFields}
            register={register("consultationTime")}
            error={errors.consultationTime?.message as string}
          />
          <div className="grid gap-2">
            <Label htmlFor="nextReview">{t.nextReviewLabel}</Label>
            <Popover
              open={isNextReviewCalendarOpen}
              onOpenChange={setIsNextReviewCalendarOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  id="nextReview"
                  variant="outline"
                  disabled={disableFields}
                  className={cn(
                    "w-full justify-start text-left font-normal px-3",
                    !nextReviewValue && "text-muted-foreground"
                  )}
                  aria-invalid={errors.nextReview ? "true" : "false"}
                >
                  <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                  {nextReviewValue ? (
                    nextReviewValue
                  ) : (
                    <span>{t.nextReviewPlaceholder}</span>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0 bg-card" align="start">
                <Calendar
                  mode="single"
                  selected={selectedNextReviewDate}
                  onSelect={(date) => {
                    if (date) {
                      setValue(
                        "nextReview",
                        formatSelectedDateToInputString(date),
                        { shouldValidate: true }
                      );
                    } else {
                      setValue("nextReview", "");
                    }
                    trigger("nextReview");
                    setIsNextReviewCalendarOpen(false);
                  }}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
            <div className="text-sm h-5 text-red-500">
              {errors.nextReview ? (
                (errors.nextReview.message as string)
              ) : (
                <>&nbsp;</>
              )}
            </div>
          </div>
          <FormFieldInput
            id="nextReviewTime"
            type="time"
            label={t.nextReviewTimeLabel}
            placeholder={t.nextReviewTimePlaceholder}
            disabled={disableFields}
            register={register("nextReviewTime")}
            error={errors.nextReviewTime?.message as string}
          />

          <div className="md:col-span-2">
            <FormFieldTextArea
              id="symptoms"
              label={t.symptomsLabel}
              placeholder={t.symptomsPlaceholder}
              disabled={disableFields}
              register={register("symptoms")}
              error={errors.symptoms?.message as string}
              maxLength={1000}
            />

            <FormFieldTextArea
              id="diagnosis"
              label={t.diagnosisLabel}
              placeholder={t.diagnosisPlaceholder}
              disabled={disableFields}
              register={register("diagnosis")}
              error={errors.diagnosis?.message as string}
              maxLength={2000}
            />

            <FormFieldTextArea
              id="treatment"
              label={t.treatmentLabel}
              placeholder={t.treatmentPlaceholder}
              disabled={disableFields}
              register={register("treatment")}
              error={errors.treatment?.message as string}
              maxLength={2000}
            />

            <FormFieldTextArea
              id="prescription"
              label={t.prescriptionLabel}
              placeholder={t.prescriptionPlaceholder}
              disabled={disableFields}
              register={register("prescription")}
              error={errors.prescription?.message as string}
              maxLength={2000}
            />

            <FormFieldTextArea
              id="observations"
              label={t.observationsLabel}
              placeholder={t.observationsPlaceholder}
              disabled={disableFields}
              register={register("observations")}
              error={errors.observations?.message as string}
              maxLength={100}
            />
          </div>
        </CardContent>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 pt-2">
          {(isEditMode || isViewMode) && (
            <>
              <Separator className="md:col-span-2 mt-2 mb-4" />

              <div className="grid gap-2">
                <Label htmlFor="registrationDate">
                  {t.registrationDateLabel}
                </Label>
                <Input
                  id="registrationDate"
                  value={
                    consultation.registrationDate
                      ? formatDisplayDateTimeToLocaleString(
                          consultation.registrationDate
                        )
                      : t.systemUnknown
                  }
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
