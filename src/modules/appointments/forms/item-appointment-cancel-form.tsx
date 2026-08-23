"use client";

import { Button } from "@/components/ui/button";
import { AppointmentApiResponse, AppointmentUpdateRequest } from "../types";
import { APPOINTMENT_STATUS, getErrorMessage, useLanguage } from "@/lib";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUpdateAppointmentSchema, UpdateAppointmentSchema } from "./schema";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateAppointment } from "../services";
import { FormFieldTextArea } from "@/components/customs/form-field-text-area";

interface Props {
  setOpenDetails: (e: boolean) => void;
  appointmentData: AppointmentApiResponse | null;
  onSuccess: () => Promise<void>;
}

export function ItemAppointmentCancelForm({
  setOpenDetails,
  appointmentData,
  onSuccess,
}: Props) {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.appointments;

  const [isLoading, setIsLoading] = useState(false);

  const currentSchema = getUpdateAppointmentSchema(dictionary);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateAppointmentSchema>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      cancellationReason: appointmentData?.cancellationReason,
    },
  });

  async function onSubmit(data: UpdateAppointmentSchema) {
    setIsLoading(true);

    try {
      const payload: AppointmentUpdateRequest = {
        cancellationReason: data.cancellationReason,
        status: APPOINTMENT_STATUS.CANCELLED
      };

      if (appointmentData) {
        const response = await updateAppointment(appointmentData.id, payload);

        if (response.status === 200) {
          toast.success(t.toastUpdateSuccess);
           await onSuccess();
          setOpenDetails(false);
        } else {
          toast.error(dictionary.components.toast.unexpectedResponseStatus);
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
      <div className="grid mt-2">
        <FormFieldTextArea
          id="cancellationReason"
          label={t.cancellationReasonLabel}
          placeholder={t.cancellationReasonPlaceholder}
          register={register("cancellationReason")}
          error={errors.cancellationReason?.message}
        />

        <div className="flex flex-col gap-y-2 sm:flex-row sm:gap-y-0 gap-x-1 place-content-end">
          <Button variant="outline" type="button" disabled={isLoading}
          onClick={() => { setOpenDetails(false) } }
          >
            {t.cancel}
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? t.saving : t.apply}
          </Button>
        </div>
      </div>
    </form>
  );
}
