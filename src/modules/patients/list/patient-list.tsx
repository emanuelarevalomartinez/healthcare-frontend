"use client";

import {
  TableAction,
  TableColumn,
  TableWrapper,
} from "@/components/customs/table-wrapper";
import { useEffect, useState } from "react";
import { getAllPatients } from "../services";
import { PatientApiResponse } from "../types";
import { PaginatedData } from "@/lib/server/api-response";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";
import { SectionHeader } from "@/components/customs/secction-header";
import { TablePagination } from "@/components/customs/table-pagination";

export function PatientList() {
  const [patients, setPatients] = useState<PaginatedData<PatientApiResponse>>();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

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

  /*   const patientColumns: TableColumn<PatientApiResponse>[] = [
  { 
    header: "ID", 
    accessor: "id" 
  },
  { 
    header: "Nº Historial", 
    accessor: "medicalRecordNumber" 
  },
  { 
    header: "Nombre Completo", 
    accessor: "fullName" 
  },
  { 
    header: "Tipo Doc.", 
    accessor: "documentType" 
  },
  { 
    header: "Nº Documento", 
    accessor: "documentNumber" 
  },
  { 
    header: "F. Nacimiento", 
    accessor: (patient) => new Date(patient.birthDate).toLocaleDateString()
  },
  { 
    header: "Sexo", 
    accessor: "sex" 
  },
  { 
    header: "Teléfono", 
    accessor: "phone" 
  },
  { 
    header: "Email", 
    accessor: "email" 
  },
  { 
    header: "Dirección", 
    accessor: "address" 
  },
  { 
    header: "Notas", 
    accessor: "notes" 
  },
  { 
    header: "Creado Por (ID)", 
    accessor: "createdById" 
  },
  { 
    header: "F. Registro", 
    accessor: (patient) => new Date(patient.createdAt).toLocaleDateString(),
    className: "text-gray-500"
  }
]; */

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
      onClick: (patient) => console.warn("Eliminando id:", patient.id),
    },
  ];

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getAllPatients(currentPage, pageSize);
        setPatients(response.data);
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      }
    };
    fetchPatients();
  }, [currentPage]);

  return (
    <>
      <div className="space-y-4 p-1">
        <SectionHeader
          title="Pacientes"
          description="Gestiona el historial clínico, la información de contacto y los registros de la clínica."
        >
          <Button
            onClick={() => console.log("Nuevo paciente")}
            className="w-full sm:w-auto shadow-sm"
          >
            <UserPlusIcon className="mr-2 size-4" />
            Nuevo Paciente
          </Button>
        </SectionHeader>
        <div>
          <TableWrapper
            cols={patientColumns}
            data={patients?.content || []}
            actions={patientActions}
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
