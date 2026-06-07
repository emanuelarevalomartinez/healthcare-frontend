"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FormMode, getErrorMessage, useLanguage, routes } from "@/lib";
import { createPatient, updatePatient } from "../services";
import {
  PatientApiResponse,
  PATIENT_DOCUMENT_TYPE,
  PATIENT_SEX,
  PatientCreateRequest,
  PatientUpdateRequest,
} from "../types";
import {
  getCreatePatientSchema,
  getUpdatePatientSchema,
  PatientSchema,
} from "./schema";
import {
  formatApiDateToInputString,
  formatDisplayDateTimeToLocaleString,
  formatSelectedDateToInputString,
  parseInputStringToDate,
} from "@/lib/utils/functions";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/customs/secction-header";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { FormFieldInput } from "@/components/customs/form-field-input";
import { FormFieldSelect } from "@/components/customs/form-field-select";
import { usePatientsActions } from "../list/patients-actions";

interface PatientFormProps {
  patient: PatientApiResponse;
  mode: FormMode;
}

export function PatientForm({ patient, mode }: PatientFormProps) {
  const router = useRouter();
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.patients;
  const { getDocumentTypeOptions, getSexOptions } = usePatientsActions({
    dictionary,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const isEditMode = mode === "edit";
  const isViewMode = mode === "details";
  const disableAllFields = isViewMode;

  const currentSchema = useMemo(() => {
    return isEditMode
      ? getUpdatePatientSchema(dictionary)
      : getCreatePatientSchema(dictionary);
  }, [isEditMode, dictionary]);

  const initialBirthDate = useMemo(() => {
    return formatApiDateToInputString(patient?.birthDate);
  }, [patient?.birthDate]);

  const documentTypeOptions = useMemo(
    () => getDocumentTypeOptions(t.documentTypeOptions),
    [t.documentTypeOptions, getDocumentTypeOptions]
  );
  const sexOptions = useMemo(
    () => getSexOptions(t.sexTypeOptions),
    [t.sexTypeOptions, getSexOptions]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<PatientSchema>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      medicalRecordNumber: patient.medicalRecordNumber,
      fullName: patient.fullName,
      documentType: patient.documentType as PATIENT_DOCUMENT_TYPE,
      documentNumber: patient.documentNumber,
      birthDate: initialBirthDate,
      sex: patient.sex as PATIENT_SEX,
      phone: patient.phone,
      email: patient.email,
      address: patient.address || null,
      notes: patient.notes || null,
    },
  });

  const birthDateValue = watch("birthDate");
  const currentSex = watch("sex");
  const currentDocumentType = watch("documentType");
  const selectedDate = useMemo(
    () => parseInputStringToDate(birthDateValue),
    [birthDateValue]
  );

  const getHeaderTitle = () => {
    if (isViewMode) return t.viewSectionTitle;
    if (isEditMode) return t.editSectionTitle;
    return t.createSectionTitle;
  };

  async function onSubmit(data: PatientSchema) {
    if (isViewMode) return;
    setIsLoading(true);

    try {
      const payload = {
        medicalRecordNumber: data.medicalRecordNumber,
        fullName: data.fullName,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        birthDate: data.birthDate,
        sex: data.sex,
        phone: data.phone,
        email: data.email,
        address: data.address || null,
        notes: data.notes || null,
      };

      const response = isEditMode
        ? await updatePatient(patient.id, payload as PatientUpdateRequest)
        : await createPatient(payload as PatientCreateRequest);

      if (response.status === 201 || response.status === 200) {
        toast.success(isEditMode ? t.toastUpdateSuccess : t.toastSuccess);
        router.push(routes.patients.root);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFocusError = (formErrors: any) => {
    const firstError = Object.keys(formErrors)[0];
    const element = document.getElementById(firstError);
    if (element) element.focus();
  };

  return (
    <form
      id="patient-form"
      noValidate
      onSubmit={handleSubmit(onSubmit, handleFocusError)}
    >
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
            {isLoading ? t.buttonLoading : t.buttonSubmit}
          </Button>
        )}
      </SectionHeader>

      <Card className="border bg-background border-border rounded-lg w-full">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 pt-6">
          <FormFieldInput
            id="medicalRecordNumber"
            label={t.medicalRecordNumberLabel}
            placeholder={t.medicalRecordNumberPlaceholder}
            disabled={disableAllFields}
            register={register("medicalRecordNumber")}
            error={errors.medicalRecordNumber?.message as string}
          />

          <FormFieldInput
            id="fullName"
            label={t.fullNameLabel}
            placeholder={t.fullNamePlaceholder}
            disabled={disableAllFields}
            register={register("fullName")}
            error={errors.fullName?.message as string}
          />

          <FormFieldSelect
            id="documentType"
            label={t.documentTypeLabel}
            placeholder={t.documentTypePlaceholder}
            disabled={disableAllFields}
            value={currentDocumentType}
            onValueChange={(value) =>
              setValue("documentType", value as PATIENT_DOCUMENT_TYPE, {
                shouldValidate: true,
              })
            }
            options={documentTypeOptions}
            error={errors.documentType?.message as string}
          />

          <FormFieldInput
            id="documentNumber"
            label={t.documentNumberLabel}
            placeholder={t.documentNumberPlaceholder}
            disabled={disableAllFields}
            register={register("documentNumber")}
            error={errors.documentNumber?.message as string}
          />

          <div className="grid gap-2">
            <Label htmlFor="birthDate">{t.birthDateLabel}</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="birthDate"
                  variant="outline"
                  disabled={disableAllFields}
                  className={cn(
                    "w-full justify-start text-left font-normal px-3",
                    !birthDateValue && "text-muted-foreground"
                  )}
                  aria-invalid={errors.birthDate ? "true" : "false"}
                >
                  <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                  {birthDateValue ? (
                    birthDateValue
                  ) : (
                    <span>{t.birthDateLabel}</span>
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
                        "birthDate",
                        formatSelectedDateToInputString(date),
                        { shouldValidate: true }
                      );
                    } else {
                      setValue("birthDate", "");
                    }
                    trigger("birthDate");
                    setIsCalendarOpen(false);
                  }}
                  disabled={(date) =>
                    date >= new Date(new Date().setHours(0, 0, 0, 0)) ||
                    date < new Date("1900-01-01")
                  }
                />
              </PopoverContent>
            </Popover>
            <div className="text-sm h-5 text-red-500">
              {errors.birthDate ? (
                (errors.birthDate.message as string)
              ) : (
                <>&nbsp;</>
              )}
            </div>
          </div>

          <FormFieldSelect
            id="sex"
            label={t.sexLabel}
            placeholder={t.sexTypePlaceholder}
            disabled={disableAllFields}
            value={currentSex}
            onValueChange={(value) =>
              setValue("sex", value as PATIENT_SEX, { shouldValidate: true })
            }
            options={sexOptions}
            error={errors.sex?.message as string}
          />

          <FormFieldInput
            id="phone"
            type="tel"
            label={t.phoneLabel}
            placeholder={t.phonePlaceholder}
            disabled={disableAllFields}
            register={register("phone")}
            error={errors.phone?.message as string}
          />

          <FormFieldInput
            id="email"
            type="email"
            label={t.emailLabel}
            placeholder={t.emailPlaceholder}
            disabled={disableAllFields}
            register={register("email")}
            error={errors.email?.message as string}
          />

          <div className="grid gap-2 md:col-span-2">
            <FormFieldInput
              id="address"
              label={t.addressLabel}
              placeholder={t.addressPlaceholder}
              disabled={disableAllFields}
              register={register("address")}
              error={errors.address?.message as string}
            />
          </div>

          {(isEditMode || isViewMode) && (
            <>
              <Separator className="md:col-span-2 mt-2 mb-4" />
              <div className="grid gap-2">
                <Label htmlFor="createdBy">{t.createdByLabel}</Label>
                <Input
                  id="createdBy"
                  value={patient.createdById || t.systemUnknown}
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
                    patient.createdAt
                      ? formatDisplayDateTimeToLocaleString(patient.createdAt)
                      : ""
                  }
                  disabled={true}
                  className="bg-muted text-muted-foreground"
                />
                <div className="text-sm h-5">&nbsp;</div>
              </div>
            </>
          )}

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="notes">{t.notesLabel}</Label>
            <Textarea
              id="notes"
              placeholder={t.notesPlaceholder}
              rows={4}
              disabled={disableAllFields}
              {...register("notes")}
              aria-invalid={errors.notes ? "true" : "false"}
            />
            <div className="text-sm h-5 text-red-500">
              {errors.notes ? (errors.notes.message as string) : <>&nbsp;</>}
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
