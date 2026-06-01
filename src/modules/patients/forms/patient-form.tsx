"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { getCreatePatientSchema, CreatePatientSchema } from "./schema";
import { createPatient } from "../services";
import { PATIENT_DOCUMENT_TYPE, PATIENT_SEX } from "../types";
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
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PatientForm() {
  const { dictionary } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const t = dictionary.dashboard.patients;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CreatePatientSchema>({
    resolver: zodResolver(getCreatePatientSchema(t.validation)),
    defaultValues: {
      medicalRecordNumber: "",
      fullName: "",
      documentType: undefined,
      documentNumber: "",
      birthDate: "",
      sex: undefined,
      phone: "",
      email: "",
      address: "",
      notes: "",
    },
  });

  const birthDateValue = watch("birthDate");

  // Convertimos el string guardado a un objeto Date para que el Calendar lo entienda
  const selectedDate = birthDateValue ? new Date(birthDateValue) : undefined;

  async function onSubmit(data: CreatePatientSchema) {
    setIsLoading(true);
    try {
      const newPatient = {
        ...data,
        email: data.email,
        notes: data.notes || null,
        documentType: data.documentType as PATIENT_DOCUMENT_TYPE,
        sex: data.sex as PATIENT_SEX,
        birthDate: new Date(data.birthDate),
      };

      const response = await createPatient(newPatient);

      if (response.status === 201 || response.status === 200) {
        toast.success(t.toastSuccess);
        router.push(routes.patients.root);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFocusError = (errors: any) => {
    const firstError = Object.keys(errors)[0];
    const element = document.getElementById(firstError);
    if (element) {
      element.focus();
    }
  };

  return (
    <form
      id="create-patient-form"
      noValidate
      onSubmit={handleSubmit(onSubmit, handleFocusError)}
      className="container mx-auto"
    >
      <SectionHeader
        title={t.createSectionTitle}
        description={t.createSectionSubtitle}
        onBack={() => router.back()}
      >
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
        >
          {isLoading ? t.buttonLoading : t.buttonSubmit}
        </Button>
      </SectionHeader>

      <Card className=" border border-border rounded-lg w-full">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="medicalRecordNumber">
              {t.medicalRecordNumberLabel}
            </Label>
            <Input
              id="medicalRecordNumber"
              placeholder={t.medicalRecordNumberPlaceholder}
              {...register("medicalRecordNumber")}
              aria-invalid={errors.medicalRecordNumber ? "true" : "false"}
            />
            {errors.medicalRecordNumber && (
              <p className="text-sm text-red-500">
                {errors.medicalRecordNumber.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullName">{t.fullNameLabel}</Label>
            <Input
              id="fullName"
              placeholder={t.fullNamePlaceholder}
              {...register("fullName")}
              aria-invalid={errors.fullName ? "true" : "false"}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="documentType">{t.documentTypeLabel}</Label>
            <Select
              onValueChange={(value) =>
                setValue("documentType", value as PATIENT_DOCUMENT_TYPE)
              }
              defaultValue={watch("documentType")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t.documentTypePlaceholder} />
              </SelectTrigger>
              <SelectContent className="bg-secondary">
                <SelectGroup>
                  {Object.values(PATIENT_DOCUMENT_TYPE).map((documentType) => {
                    const documentTypeKey = documentType.toLowerCase() as
                      | "dni"
                      | "passport"
                      | "id_card"
                      | "other";

                    return (
                      <SelectItem key={documentType} value={documentType}>
                        {t.documentTypeOptions[documentTypeKey]}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.documentType && (
              <p className="text-sm text-red-500">
                {errors.documentType.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="documentNumber">{t.documentNumberLabel}</Label>
            <Input
              id="documentNumber"
              placeholder={t.documentNumberPlaceholder}
              {...register("documentNumber")}
              aria-invalid={errors.documentNumber ? "true" : "false"}
            />
            {errors.documentNumber && (
              <p className="text-sm text-red-500">
                {errors.documentNumber.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="birthDate">{t.birthDateLabel}</Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="birthDate"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal px-3",
                    !birthDateValue && "text-muted-foreground"
                  )}
                  aria-invalid={errors.birthDate ? "true" : "false"}
                >
                  <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                  {birthDateValue ? (
                    format(new Date(birthDateValue), "MM/dd/yyyy")
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
                    setValue("birthDate", date ? date.toISOString() : "");
                    trigger("birthDate");
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                />
              </PopoverContent>
            </Popover>

            {errors.birthDate && (
              <p className="text-sm text-red-500">{errors.birthDate.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sex">{t.sexLabel}</Label>
            <Select
              onValueChange={(value) => setValue("sex", value as PATIENT_SEX)}
              defaultValue={watch("sex")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t.sexTypePlaceholder} />
              </SelectTrigger>
              <SelectContent className="bg-secondary">
                <SelectGroup>
                  {Object.values(PATIENT_SEX).map((sex) => {
                    const sexKey = sex.toLowerCase() as
                      | "male"
                      | "female"
                      | "other";

                    return (
                      <SelectItem key={sex} value={sex}>
                        {t.sexTypeOptions[sexKey]}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.sex && (
              <p className="text-sm text-red-500">{errors.sex.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">{t.phoneLabel}</Label>
            <Input
              id="phone"
              type="tel"
              placeholder={t.phonePlaceholder}
              {...register("phone")}
              aria-invalid={errors.phone ? "true" : "false"}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">{t.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t.emailPlaceholder}
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="address">{t.addressLabel}</Label>
            <Input
              id="address"
              placeholder={t.addressPlaceholder}
              {...register("address")}
              aria-invalid={errors.address ? "true" : "false"}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="notes">{t.notesLabel}</Label>
            <Textarea
              id="notes"
              placeholder={t.notesPlaceholder}
              rows={4}
              {...register("notes")}
              aria-invalid={errors.notes ? "true" : "false"}
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
