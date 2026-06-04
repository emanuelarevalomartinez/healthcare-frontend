"use client";

import { useState, useMemo } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

import { getErrorMessage, useLanguage } from "@/lib";
import { routes } from "@/lib/routes/routes";
import {
  getCreatePatientSchema,
  getUpdatePatientSchema,
  PatientSchema,
} from "./schema";
import { createPatient, updatePatient } from "../services";
import {
  PATIENT_DOCUMENT_TYPE,
  PATIENT_SEX,
  PatientApiResponse,
} from "../types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionHeader } from "@/components/customs/secction-header";
import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type FormMode = "create" | "edit" | "details";

interface Props {
  patient: PatientApiResponse;
  mode: FormMode;
}

export function PatientForm({ patient, mode }: Props) {
  const { dictionary } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const t = dictionary.dashboard.patients;

  const isEditMode = mode === "edit";
  const isViewMode = mode === "details";
  const disableAllFields = isViewMode;

  const currentSchema = isEditMode
    ? getUpdatePatientSchema(t.validation)
    : getCreatePatientSchema(t.validation);

  const initialBirthDate = useMemo(() => {
    if (!patient?.birthDate) return "";
    const isoString =
      patient.birthDate instanceof Date
        ? patient.birthDate.toISOString()
        : String(patient.birthDate);
    return isoString.split("T")[0];
  }, [patient?.birthDate]);

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
      medicalRecordNumber: patient.medicalRecordNumber || "",
      fullName: patient.fullName || "",
      documentType: patient.documentType as PATIENT_DOCUMENT_TYPE,
      documentNumber: patient.documentNumber || "",
      birthDate: initialBirthDate,
      sex: patient.sex as PATIENT_SEX,
      phone: patient.phone || "",
      email: patient.email || "",
      address: patient.address || "",
      notes: patient.notes || "",
    },
  });

  const birthDateValue = watch("birthDate");
  const selectedDate = useMemo(() => {
    if (!birthDateValue) return undefined;
    return parse(birthDateValue, "yyyy-MM-dd", new Date());
  }, [birthDateValue]);

  const currentDocumentType = watch("documentType");
  const currentSex = watch("sex");

  async function onSubmit(data: PatientSchema) {
    if (isViewMode) return;
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        email: data.email || "",
        notes: data.notes || "",
        address: data.address || null,
        documentType: data.documentType as PATIENT_DOCUMENT_TYPE,
        sex: data.sex as PATIENT_SEX,
        birthDate: data.birthDate || null,
      };

      const response = isEditMode
        ? await updatePatient(patient.id, payload as any)
        : await createPatient(payload as any);

      if (response.status === 201 || response.status === 200) {
        toast.success(
          isEditMode ? "Patient updated successfully" : t.toastSuccess
        );
        router.push(routes.patients.root);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFocusError = (formErrors: FieldErrors<PatientSchema>) => {
    const firstError = Object.keys(formErrors)[0];
    const element = document.getElementById(firstError);
    if (element) {
      element.focus();
    }
  };

  const getHeaderTitle = () => {
    if (isViewMode) return "Patient Details";
    if (isEditMode) return "Edit Patient";
    return t.createSectionTitle;
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
            ? "Update details"
            : isViewMode
            ? "Viewing patient profile"
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
          <div className="grid gap-2">
            <Label htmlFor="medicalRecordNumber">
              {t.medicalRecordNumberLabel}
            </Label>
            <Input
              id="medicalRecordNumber"
              placeholder={t.medicalRecordNumberPlaceholder}
              disabled={disableAllFields}
              {...register("medicalRecordNumber")}
              aria-invalid={errors.medicalRecordNumber ? "true" : "false"}
            />
            <div className="text-sm h-5 text-red-500">
              {errors.medicalRecordNumber ? (
                (errors.medicalRecordNumber.message as string)
              ) : (
                <>&nbsp;</>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullName">{t.fullNameLabel}</Label>
            <Input
              id="fullName"
              placeholder={t.fullNamePlaceholder}
              disabled={disableAllFields}
              {...register("fullName")}
              aria-invalid={errors.fullName ? "true" : "false"}
            />
            <div className="text-sm h-5 text-red-500">
              {errors.fullName ? (
                (errors.fullName.message as string)
              ) : (
                <>&nbsp;</>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="documentType">{t.documentTypeLabel}</Label>
            <Select
              disabled={disableAllFields}
              onValueChange={(value) =>
                setValue("documentType", value as PATIENT_DOCUMENT_TYPE, {
                  shouldValidate: true,
                })
              }
              value={currentDocumentType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t.documentTypePlaceholder} />
              </SelectTrigger>
              <SelectContent className="bg-secondary">
                <SelectGroup>
                  {Object.values(PATIENT_DOCUMENT_TYPE).map((docType) => {
                    const docTypeKey = docType.toLowerCase() as
                      | "dni"
                      | "passport"
                      | "id_card"
                      | "other";
                    return (
                      <SelectItem key={docType} value={docType}>
                        {t.documentTypeOptions[docTypeKey]}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="text-sm h-5 text-red-500">
              {errors.documentType ? (
                (errors.documentType.message as string)
              ) : (
                <>&nbsp;</>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="documentNumber">{t.documentNumberLabel}</Label>
            <Input
              id="documentNumber"
              placeholder={t.documentNumberPlaceholder}
              disabled={disableAllFields}
              {...register("documentNumber")}
              aria-invalid={errors.documentNumber ? "true" : "false"}
            />
            <div className="text-sm h-5 text-red-500">
              {errors.documentNumber ? (
                (errors.documentNumber.message as string)
              ) : (
                <>&nbsp;</>
              )}
            </div>
          </div>

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
                      const pureString = format(date, "yyyy-MM-dd");
                      setValue("birthDate", pureString, {
                        shouldValidate: true,
                      });
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

          <div className="grid gap-2">
            <Label htmlFor="sex">{t.sexLabel}</Label>
            <Select
              disabled={disableAllFields}
              onValueChange={(value) =>
                setValue("sex", value as PATIENT_SEX, { shouldValidate: true })
              }
              value={currentSex}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t.sexTypePlaceholder} />
              </SelectTrigger>
              <SelectContent className="bg-secondary">
                <SelectGroup>
                  {Object.values(PATIENT_SEX).map((sexItem) => {
                    const sexKey = sexItem.toLowerCase() as
                      | "male"
                      | "female"
                      | "other";
                    return (
                      <SelectItem key={sexItem} value={sexItem}>
                        {t.sexTypeOptions[sexKey]}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="text-sm h-5 text-red-500">
              {errors.sex ? (errors.sex.message as string) : <>&nbsp;</>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">{t.phoneLabel}</Label>
            <Input
              id="phone"
              type="tel"
              placeholder={t.phonePlaceholder}
              disabled={disableAllFields}
              {...register("phone")}
              aria-invalid={errors.phone ? "true" : "false"}
            />
            <div className="text-sm h-5 text-red-500">
              {errors.phone ? (errors.phone.message as string) : <>&nbsp;</>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">{t.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t.emailPlaceholder}
              disabled={disableAllFields}
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
            />
            <div className="text-sm h-5 text-red-500">
              {errors.email ? (errors.email.message as string) : <>&nbsp;</>}
            </div>
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="address">{t.addressLabel}</Label>
            <Input
              id="address"
              placeholder={t.addressPlaceholder}
              disabled={disableAllFields}
              {...register("address")}
              aria-invalid={errors.address ? "true" : "false"}
            />
            <div className="text-sm h-5 text-red-500">
              {errors.address ? (
                (errors.address.message as string)
              ) : (
                <>&nbsp;</>
              )}
            </div>
          </div>

          {(isEditMode || isViewMode) && (
            <>
              <Separator className="md:col-span-2 mt-2 mb-4" />

              <div className="grid gap-2">
                <Label htmlFor="createdBy">Created By</Label>
                <Input
                  id="createdBy"
                  value={patient.createdById || "System / Unknown"}
                  disabled={true}
                  className="bg-muted text-muted-foreground"
                />

                <div className="text-sm h-5">&nbsp;</div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="createdAt">Created At</Label>
                <Input
                  id="createdAt"
                  value={
                    patient.createdAt
                      ? format(new Date(patient.createdAt), "yyyy-MM-dd HH:mm")
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
