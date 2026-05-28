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

export function PatientList() {
  const [patients, setPatients] = useState<PaginatedData<PatientApiResponse>>();

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
        const response = await getAllPatients();
        setPatients(response.data);
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      }
    };
    fetchPatients();
  }, []);

  return (
    <>
      <div>Pacientes</div>
      <div>
        <TableWrapper
          cols={patientColumns}
          data={patients?.content || []}
          actions={patientActions}
        />
      </div>
    </>
  );
}
