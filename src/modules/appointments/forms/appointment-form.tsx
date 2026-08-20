"use client";

import { FormMode, getErrorMessage, useLanguage } from "@/lib";
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

import { APPOINTMENT_STATUS_TYPE, AppointmentApiResponse } from "../types";

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

  const isEditMode = mode === "edit";
  const isViewMode = mode === "details";
  const disableFields = isViewMode;

  const currentSchema = useMemo(() => {
    return isEditMode
      ? getUpdateAppointmentSchema(dictionary)
      : getCreateAppointmentSchema(dictionary);
  }, [dictionary, isEditMode]);

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
    register,
    formState: { errors },
  } = useForm<AppointmentSchema>({
    resolver: zodResolver(currentSchema) as Resolver<AppointmentSchema>,
    defaultValues: {
      doctorId: "",
      patientId: "",
      status: ""
    },
  });

  const currentAppointmentStatus = watch("status");

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

    setValue("doctorId", doctor.username);

    clearErrors("doctorId");

    console.log("Doctor seleccionado:", {
      id: doctor.doctorId,
      name: doctor.username,
      email: doctor.email,
      license: doctor.licenseNumber,
    });
  };

  const handleSelectPatient = (patient: PatientFilteredApiResponse): void => {
    setSelectedDoctorId(patient.id);

    setValue("patientId", patient.fullName);

    clearErrors("patientId");

    console.log("Paciente seleccionado:", {
      id: patient.id,
      fullName: patient.fullName,
    });
  };

  const handleSearchDoctorChange = (value: string): void => {
    setValue("doctorId", value);

    if (value === "") {
      setSelectedDoctorId("");
    }
  };

  const handleSearchPatientChange = (value: string): void => {
    setValue("patientId", value);

    if (value === "") {
      setSelectedPatientId("");
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

  const patientsDisplayFields: SearchSelectDisplayField<PatientFilteredApiResponse>[] =
    [
      {
        key: "fullName",
        label: "Usuario",
        getValue: (patient) => patient.fullName,
      },
      {
        key: "medicalRecordNumber",
        label: "# Historia",
        getValue: (patient) => patient.medicalRecordNumber,
      },
      {
        key: "documentNumber",
        label: "# Documento",
        getValue: (patient) => patient.documentNumber,
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
            value={watch("doctorId") || ""}
            onChange={handleSearchDoctorChange}
            onSelect={handleSelectDoctor}
            searchItems={searchDoctors}
            getDisplayLabel={(doctor) => doctor.username}
            displayFields={doctorDisplayFields}
            error={errors.doctorId?.message}
            minChars={1}
            debounceDelay={200}
            maxResults={10}
          />

          <FormFieldSearchSelect<PatientFilteredApiResponse>
            id="patientName"
            label="Buscar Paciente"
            placeholder="Escribe nombre, número de historia o documento..."
            disabled={disableFields}
            value={watch("patientId") || ""}
            onChange={handleSearchPatientChange}
            onSelect={handleSelectPatient}
            searchItems={searchPatients}
            getDisplayLabel={(patient) => patient.fullName}
            displayFields={patientsDisplayFields}
            error={errors.patientId?.message}
            minChars={1}
            debounceDelay={200}
            maxResults={10}
          />

          <FormFieldInput
            id="appointmentDateTime"
            label={"appointmentDateTime"}
            placeholder={"placeholder"}
            disabled={disableFields}
            register={register("appointmentDateTime")}
            error={errors.appointmentDateTime?.message as string}
          />

          <FormFieldInput
            id="durationMinutes"
            label={"durationMinutes"}
            placeholder={"placeholder"}
            disabled={disableFields}
            register={register("durationMinutes")}
            error={errors.durationMinutes?.message as string}
          />

          <FormFieldInput
            id="consultationReason"
            label={"consultationReason"}
            placeholder={"placeholder"}
            disabled={disableFields}
            register={register("consultationReason")}
            error={errors.consultationReason?.message as string}
          />

          <FormFieldSelect
            id="status"
            label={"status"}
            placeholder={"status"}
            disabled={disableFields}
            value={currentAppointmentStatus}
            onValueChange={(value) =>
              setValue("status", value as APPOINTMENT_STATUS_TYPE, {
                shouldValidate: true,
              })
            }
            options={appointmentStatusOptions}
            error={errors.status?.message as string}
          />

          <FormFieldInput
            id="notes"
            label={"notes"}
            placeholder={"placeholder"}
            disabled={disableFields}
            register={register("notes")}
            error={errors.notes?.message as string}
          />
        </CardContent>
      </Card>
    </form>
  );
}
