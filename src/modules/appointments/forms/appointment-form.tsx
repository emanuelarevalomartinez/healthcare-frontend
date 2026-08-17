"use client"

import { FormMode, getErrorMessage, useLanguage } from "@/lib";
import { useAppointmentActions } from "../list/appointment-actions";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SectionHeader } from "@/components/customs/secction-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormFieldInput } from "@/components/customs/form-field-input";
import { FormFieldSelect } from "@/components/customs/form-field-select";
import { useRouter } from "next/navigation";
import { AppointmentSchema, getCreateAppointmentSchema, getUpdateAppointmentSchema } from "./schema";
import { AppointmentApiResponse } from "../types";
import { getAllDoctors, getAllDoctorsFiltered } from "@/modules/doctors/services";
import { DoctorApiResponse, DoctorFilteredApiResponse } from "@/modules/doctors/types";
import { ApiResponse, PaginatedData } from "@/lib/server/api-response";

interface AppointmentFormProps {
  appointment: AppointmentApiResponse;
  mode: FormMode;
}

interface DoctorWithMatch extends DoctorFilteredApiResponse {
  matchField?: 'name' | 'email' | 'license';
}

export function AppointmentForm({ appointment, mode }: AppointmentFormProps){

     const router = useRouter();

  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.appointments;

  const {  } = useAppointmentActions({ dictionary });

  const [isLoading, setIsLoading] = useState(false);
  const [doctorData, setDoctorData] = useState<ApiResponse<PaginatedData<DoctorFilteredApiResponse>> | null>(null);

    const [isSearching, setIsSearching] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<DoctorWithMatch[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorFilteredApiResponse | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Ref para el dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isEditMode = mode === "edit";
  const isViewMode = mode === "details";
  const disableFields = isViewMode;

  const currentSchema = useMemo(() => {
    return isEditMode
      ? getUpdateAppointmentSchema(dictionary)
      : getCreateAppointmentSchema(dictionary);
  }, [dictionary, isEditMode]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AppointmentSchema>({
    resolver: zodResolver(currentSchema) as Resolver<AppointmentSchema>,
    defaultValues: {
      doctorName: ""
    },
  });

   const searchDoctors = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      setIsSearching(true);
      // Asumiendo que getAllDoctorsFiltered acepta un parámetro de búsqueda
      // Si no, necesitas crear una función de búsqueda en el servicio
      const response = await getAllDoctorsFiltered(0, 10, query);
      
      // Mapear los doctores para agregar información de coincidencia
      const doctorsWithMatch = response.data.content.map((doctor: DoctorFilteredApiResponse) => {
        const matchField = detectMatchField(doctor, query);
        return {
          ...doctor,
          matchField
        };
      });
      
      setSearchResults(doctorsWithMatch);
      setShowDropdown(doctorsWithMatch.length > 0);
    } catch (error) {
      console.error("Error buscando doctores:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

   const detectMatchField = (doctor: DoctorFilteredApiResponse, query: string): 'name' | 'email' | 'license' => {
    const lowerQuery = query.toLowerCase();
    
    if (doctor.username?.toLowerCase().includes(lowerQuery)) {
      return 'name';
    }
    if (doctor.email?.toLowerCase().includes(lowerQuery)) {
      return 'email';
    }
    if (doctor.licenseNumber?.toLowerCase().includes(lowerQuery)) {
      return 'license';
    }
    return 'name'; // Default
  };

  // Debounce para la búsqueda
 /*  useEffect(() => {
    const timer = setTimeout(() => {
      searchDoctors(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchDoctors]); */

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

  async function onSubmit(data: AppointmentSchema) {
    if (isViewMode) return;

    setIsLoading(true);

    try {
      
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
   const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const response = await getAllDoctorsFiltered(0, 10, "2");
        
        setDoctorData(response);
        
        console.log("Doctores obtenidos:", response);
        
      } catch (err) {
        console.error("Error to load the doctors: ", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [])
  

    return(
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <SectionHeader
        title={"Titulo de nueva cita"}
        description={"descripcion"}
        onBack={() => router.back()}
      >
        {!isViewMode && (
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
          cargando ?
          </Button>
        )}
      </SectionHeader>

      <Card className="border bg-background border-border rounded-lg w-full">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 pt-6">
          <FormFieldInput
            id="doctorName"
            label={"doctorName"}
            placeholder={"doctorName"}
            disabled={disableFields}
            register={register("doctorName")}
            error={errors.doctorName?.message}
          />
          
        </CardContent>
      </Card>
    </form>
    )

}