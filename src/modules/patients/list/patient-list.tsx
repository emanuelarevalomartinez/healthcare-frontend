"use client";

import {
  TableAction,
  TableColumn,
  TableWrapper,
} from "@/components/customs/table-wrapper";
import { useEffect, useState, useCallback } from "react";
import { deletePatient, getAllPatients } from "../services";
import { PatientApiResponse } from "../types";
import { PaginatedData } from "@/lib/server/api-response";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";
import { SectionHeader } from "@/components/customs/secction-header";
import { TablePagination } from "@/components/customs/table-pagination";
import { useRouter } from "next/navigation";
import { routes, useLanguage } from "@/lib";
import { toast } from "sonner";

export function PatientList() {
  const [patients, setPatients] = useState<PaginatedData<PatientApiResponse>>();

  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.patients;

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllPatients(currentPage, pageSize);
      setPatients(response.data);
    } catch (error) {
      console.error("Error al cargar pacientes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);
  const handleDelete = async (id: string, name: string) => {
    try {
      const response = await deletePatient(id);
      
      if (response.status === 200 || response.status === 204) {
        toast.success(`Paciente ${name} eliminado con éxito.`);
        if (patients?.content.length === 1 && currentPage > 0) {
          setCurrentPage((prev) => prev - 1);
        } else {
          await fetchPatients();
        }
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("No se pudo eliminar al paciente.");
    }
  };

  const patientColumns: TableColumn<PatientApiResponse>[] = [
    {
      header: "Nº Historial",
      accessor: "medicalRecordNumber",
    },
    {
      header: "Nombre Completo",
      accessor: "fullName",
    },
    {
      header: "Teléfono",
      accessor: "phone",
    },
    {
      header: "F. Registro",
      accessor: (patient) => new Date(patient.createdAt).toLocaleDateString(),
    },
  ];

  const patientActions: TableAction<PatientApiResponse>[] = [
    {
      label: "Ver Detalles",
      onClick: (patient) => console.log("Abriendo detalles de:", patient.id),
    },
    {
      label: "Editar",
      onClick: (patient) => console.log("Editando paciente:", patient.fullName),
    },
    {
      label: "Eliminar",
      variant: "destructive",
      separatorBefore: true,
      onClick: (patient) => handleDelete(patient.id, patient.fullName),
    },
  ];

  const handleGoToCreatePatient = () => {
    router.push(routes.patients.create);
  };

  return (
    <>
      <div className="space-y-4 p-1">
        <SectionHeader
          title={t.tableSectionTitle}
          description={t.tableSectionSubtitle}
        >
          <Button
            onClick={handleGoToCreatePatient}
            className="w-full sm:w-auto shadow-sm"
          >
            <UserPlusIcon className="mr-2 size-4" />
            {t.createNewPatientButton}
          </Button>
        </SectionHeader>
        <div>
          <TableWrapper
            cols={patientColumns}
            data={patients?.content || []}
            actions={patientActions}
            isLoading={isLoading}
          />
        </div>
        {patients && (
          <TablePagination
            page={patients.page}
            size={patients.size}
            totalElements={patients.totalElements}
            totalPages={patients.totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        )}
      </div>
    </>
  );
}