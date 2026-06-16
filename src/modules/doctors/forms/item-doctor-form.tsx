"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { FormFieldInput } from "@/components/customs/form-field-input";

import { createDoctor } from "../services";
import { DoctorCreateRequest } from "../types";

interface DoctorFormValues {
  specialty: string;
  licenseNumber: string;
  defaultConsultationDuration: number;
}

export function ItemDoctorForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DoctorFormValues>({
    defaultValues: {
      specialty: "",
      licenseNumber: "",
      defaultConsultationDuration: 30,
    },
  });

  async function onSubmit(data: DoctorFormValues) {
    try {
      setIsLoading(true);

      const payload: DoctorCreateRequest = {
        userId: "",
        specialty: data.specialty,
        licenseNumber: data.licenseNumber,
        defaultConsultationDuration:
          data.defaultConsultationDuration,
      };

      await createDoctor(payload);

      toast.success("Doctor creado correctamente");

      reset();
    } catch (error) {
      toast.error("Error al crear el doctor");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <FormFieldInput
            id="specialty"
            label="Especialidad"
            placeholder="Cardiología"
            register={register("specialty", {
              required: "La especialidad es obligatoria",
            })}
            error={errors.specialty?.message}
          />

          <FormFieldInput
            id="licenseNumber"
            label="Número de licencia"
            placeholder="MED-12345"
            register={register("licenseNumber", {
              required: "La licencia es obligatoria",
            })}
            error={errors.licenseNumber?.message}
          />

          <FormFieldInput
            id="defaultConsultationDuration"
            type="number"
            label="Duración de consulta (min)"
            placeholder="30"
            register={register(
              "defaultConsultationDuration",
              {
                valueAsNumber: true,
                required: "La duración es obligatoria",
                min: {
                  value: 1,
                  message: "Debe ser mayor que cero",
                },
              }
            )}
            error={
              errors.defaultConsultationDuration?.message
            }
          />

          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

 /*  return (
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="grid gap-4"
  >
    <FormFieldInput
      id="specialty"
      label="Especialidad"
      placeholder="Cardiología"
      register={register("specialty", {
        required: "La especialidad es obligatoria",
      })}
      error={errors.specialty?.message}
    />

    <FormFieldInput
      id="licenseNumber"
      label="Número de licencia"
      placeholder="MED-12345"
      register={register("licenseNumber", {
        required: "La licencia es obligatoria",
      })}
      error={errors.licenseNumber?.message}
    />

    <FormFieldInput
      id="defaultConsultationDuration"
      type="number"
      label="Duración de consulta (min)"
      placeholder="30"
      register={register("defaultConsultationDuration", {
        valueAsNumber: true,
        required: "La duración es obligatoria",
        min: {
          value: 1,
          message: "Debe ser mayor que cero",
        },
      })}
      error={errors.defaultConsultationDuration?.message}
    />

    <Button
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? "Guardando..." : "Guardar"}
    </Button>
  </form>
); */
}