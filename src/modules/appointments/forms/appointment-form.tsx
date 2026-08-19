"use client";

import { FormMode, getErrorMessage, useLanguage } from "@/lib";
import { useAppointmentActions } from "../list/appointment-actions";
import { useEffect, useMemo, useState } from "react";
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

import { AppointmentApiResponse } from "../types";

import { getAllDoctorsFiltered } from "@/modules/doctors/services";
import { DoctorFilteredApiResponse } from "@/modules/doctors/types";

import { ApiResponse, PaginatedData } from "@/lib/server/api-response";
import {
  FormFieldSearchSelect,
  SearchSelectDisplayField,
} from "@/components/customs/form-field-search-select";

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

  const isEditMode = mode === "edit";
  const isViewMode = mode === "details";
  const disableFields = isViewMode;

  const currentSchema = useMemo(() => {
    return isEditMode
      ? getUpdateAppointmentSchema(dictionary)
      : getCreateAppointmentSchema(dictionary);
  }, [dictionary, isEditMode]);

  const {
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<AppointmentSchema>({
    resolver: zodResolver(currentSchema) as Resolver<AppointmentSchema>,
    defaultValues: {
      doctorName: "",
    },
  });

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

  const handleSelectDoctor = (doctor: DoctorFilteredApiResponse): void => {
    setSelectedDoctorId(doctor.doctorId);

    setValue("doctorName", doctor.username);

    clearErrors("doctorName");

    console.log("Doctor seleccionado:", {
      id: doctor.doctorId,
      name: doctor.username,
      email: doctor.email,
      license: doctor.licenseNumber,
    });
  };

  const handleSearchChange = (value: string): void => {
    setValue("doctorName", value);

    if (value === "") {
      setSelectedDoctorId("");
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);

        const response = await getAllDoctorsFiltered(0, 10, "");

        setDoctorData(response);

        console.log("Doctores obtenidos:", response);
      } catch (err) {
        console.error("Error to load the doctors: ", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  async function onSubmit(data: AppointmentSchema): Promise<void> {
    if (isViewMode) return;

    setIsLoading(true);

    try {
      console.log("Datos:", data);
      console.log("Doctor ID:", selectedDoctorId);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  const doctorDisplayFields: SearchSelectDisplayField<DoctorFilteredApiResponse>[] =
    [
      {
        key: "username",
        label: "Usuario",
        getValue: (doctor) => doctor.username,
      },
      {
        key: "email",
        label: "Email",
        getValue: (doctor) => doctor.email,
      },
      {
        key: "licenseNumber",
        label: "Licencia",
        getValue: (doctor) => doctor.licenseNumber,
        condition: (doctor) => !!doctor.licenseNumber,
      },
    ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <SectionHeader
        title={t.createSectionTitle}
        description={t.createSectionSubtitle}
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
            label="Buscar Doctor"
            placeholder="Escribe nombre, email o licencia..."
            disabled={disableFields}
            value={watch("doctorName") || ""}
            onChange={handleSearchChange}
            onSelect={handleSelectDoctor}
            searchItems={searchDoctors}
            getDisplayLabel={(doctor) => doctor.username}
            displayFields={doctorDisplayFields}
            error={errors.doctorName?.message}
            minChars={1}
            debounceDelay={200}
            maxResults={10}
          />
        </CardContent>
      </Card>
    </form>
  );
}
