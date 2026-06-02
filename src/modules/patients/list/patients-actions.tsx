"use client";

import { useState, useCallback } from "react";
import { TableAction } from "@/components/customs/table-wrapper";
import { PatientApiResponse } from "../types";
import { deletePatient, findPatientById, getAllPatients } from "../services";
import { toast } from "sonner";
import { PaginatedData } from "@/lib/server/api-response";
import { useRouter } from "next/navigation";
import { routes } from "@/lib";

export function usePatientsActions(t: any) {
  const router = useRouter();

  const [patients, setPatients] = useState<PaginatedData<PatientApiResponse>>();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [patientToDelete, setPatientToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 10;

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllPatients(currentPage, pageSize);
      setPatients(response.data);
    } catch (error) {
      console.error("Error to load the patients: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  const handleOpenDeleteConfirm = (id: string, name: string) => {
    setPatientToDelete({ id, name });
    setIsAlertOpen(true);
  };

  const handleEditPatient = async (id: string) => {
    const editUrl = routes.patients.edit.replace(":id", id);
    router.push(editUrl);
  };

  const handleExecuteDelete = async () => {
    if (!patientToDelete) return;

    const { id } = patientToDelete;

    try {
      const response = await deletePatient(id);

      if (response.status === 200 || response.status === 204) {
        toast.success(t.dashboard.patients.successDeletePatientToast);
        if (patients?.content.length === 1 && currentPage > 0) {
          setCurrentPage((prev) => prev - 1);
        } else {
          await fetchPatients();
        }
      }
    } catch (error) {
      console.error("Error to delete:", error);
      toast.error(t.dashboard.patients.errordeletePatientToast);
    } finally {
      setPatientToDelete(null);
    }
  };

  const patientActions: TableAction<PatientApiResponse>[] = [
    {
      label: t.components.actions.viewDetails,
      onClick: (patient) => console.log("Abriendo detalles de:", patient.id),
    },
    {
      label: t.components.actions.edit,
      onClick: (patient) => handleEditPatient(patient.id),
    },
    {
      label: t.components.actions.delete,
      variant: "destructive",
      separatorBefore: true,
      onClick: (patient) =>
        handleOpenDeleteConfirm(patient.id, patient.fullName),
    },
  ];

  return {
    patients,
    isAlertOpen,
    setIsAlertOpen,
    currentPage,
    setCurrentPage,
    patientToDelete,
    setPatientToDelete,
    isLoading,
    patientActions,
    fetchPatients,
    handleExecuteDelete,
  };
}
