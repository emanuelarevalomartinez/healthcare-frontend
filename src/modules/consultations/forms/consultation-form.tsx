"use client";

import { FormMode, useLanguage } from "@/lib";
import { ConsultationApiResponse } from "../types";
import { useMemo, useState } from "react";
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
import { FormFieldSearchSelect } from "@/components/customs/form-field-search-select";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { FormFieldInput } from "@/components/customs/form-field-input";
import { FormFieldSelect } from "@/components/customs/form-field-select";
import { FormFieldTextArea } from "@/components/customs/form-field-text-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { DoctorWithUserAndScheduleApiResponse } from "@/modules/doctors/types";
import {
  formatApiDateToInputString,
  formatDisplayDateTimeToLocaleString,
  formatSelectedDateToInputString,
  parseInputStringToDate,
} from "@/lib/utils/functions";
import { cn } from "@/lib/utils";

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

  const initialConsultationDate = useMemo(() => {
    return formatApiDateToInputString(consultation?.consultationDate);
  }, [consultation?.consultationDate]);

  const initialNextReview = useMemo(() => {
    return formatApiDateToInputString(consultation?.nextReview);
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
      consultationDate: consultation.consultationDate,
      nextReview: consultation.nextReview,
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

  async function onSubmit(data: ConsultationSchema) {
    console.log("aqui va el submit");
  }

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
          {/*    <FormFieldSearchSelect<ConsultationApiResponse>
            id="patientName"
            label={t.patientLabel}
            placeholder={t.patientPlaceholder}
            disabled={isViewMode || isEditMode}
            value={patientSearch}
            onChange={setPatientSearch}
            onSelect={handleSelectPatient}
            searchItems={searchPatients}
            getDisplayLabel={(patient) => patient.fullName}
            displayFields={patientsDisplayFields}
            error={errors.patientId?.message}
            minChars={1}
            debounceDelay={200}
            maxResults={10}
          /> */}

          {/*  <FormFieldSearchSelect<DoctorWithUserAndScheduleApiResponse>
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
            error={errors.doctorId?.message}
            minChars={1}
            debounceDelay={200}
            maxResults={10}
          /> */}

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
