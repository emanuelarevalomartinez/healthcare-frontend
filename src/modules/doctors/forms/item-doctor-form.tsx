"use client";

import { useMemo, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { FormFieldInput } from "@/components/customs/form-field-input";

import { createDoctor, updateDoctor } from "../services";
import {
  DoctorApiResponse,
  DoctorCreateRequest,
  DoctorUpdateRequest,
} from "../types";
import {
  getUserDataLocalStore,
  setUserDataLocalStore,
} from "@/lib/utils/local-storage";
import { DoctorFormMode, getErrorMessage, useLanguage } from "@/lib";
import {
  DoctorSchema,
  getCreateDoctorSchema,
  getUpdateDoctorSchema,
} from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  mode: DoctorFormMode;
  setOpenDetails: (e: boolean) => void;
  doctorData: DoctorApiResponse | null;
}

export function ItemDoctorForm({ mode, setOpenDetails, doctorData }: Props) {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.doctors;

  const [isLoading, setIsLoading] = useState(false);

  const isCompleteMode = mode === "complete";

  const currentSchema = useMemo(() => {
    return isCompleteMode
      ? getUpdateDoctorSchema(dictionary)
      : getCreateDoctorSchema(dictionary);
  }, [dictionary, isCompleteMode]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DoctorSchema>({
    resolver: zodResolver(currentSchema) as Resolver<DoctorSchema>,
    defaultValues: {
      specialty: doctorData?.specialty ?? "",
      licenseNumber: doctorData?.licenseNumber ?? "",
      defaultConsultationDuration:
        doctorData?.defaultConsultationDuration ?? 30,
    },
  });

  async function onSubmit(data: DoctorSchema) {
    setIsLoading(true);

    try {
      const user = getUserDataLocalStore();

      if (!user) {
        throw new Error("User not found");
      }

      if (isCompleteMode && doctorData) {
        const payload: DoctorUpdateRequest = {
          specialty: data.specialty,
          licenseNumber: data.licenseNumber,
          defaultConsultationDuration: data.defaultConsultationDuration,
        };

        try {
          const response = await updateDoctor(doctorData.id, payload);

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
        const payload: DoctorCreateRequest = {
          userId: user.id,
          specialty: data.specialty,
          licenseNumber: data.licenseNumber,
          defaultConsultationDuration: data.defaultConsultationDuration,
        };

        try {
          const response = await createDoctor(payload);

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

          <Button type="submit" disabled={isLoading}>
            {isLoading ? t.saving : mode === "create" ? t.save : t.update}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
