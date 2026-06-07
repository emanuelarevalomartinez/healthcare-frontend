"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { routes, TranslationDictionary } from "@/lib";
import { PaginatedData } from "@/lib/server/api-response";
import { TableAction } from "@/components/customs/table-wrapper";
import { deletePatient, getAllPatients } from "../services";
import {
  PatientApiResponse,
  PATIENT_DOCUMENT_TYPE,
  PATIENT_SEX,
} from "../types";

interface UsePatientsActionsProps {
  dictionary: TranslationDictionary;
}

export function usePatientsActions({ dictionary }: UsePatientsActionsProps) {
  const router = useRouter();
  const t = dictionary.dashboard.patients;

  const [patientsData, setPatientsData] =
    useState<PaginatedData<PatientApiResponse>>();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [patientToDelete, setPatientToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const pageSize = 10;

  const fetchPatients = useCallback(async () => {
    setIsTableLoading(true);
    try {
      const response = await getAllPatients(currentPage, pageSize);
      setPatientsData(response.data);
    } catch (error) {
      console.error("Error to load the patients: ", error);
    } finally {
      setIsTableLoading(false);
    }
  }, [currentPage, pageSize]);

  const handleOpenDeleteConfirm = (id: string, name: string) => {
    setPatientToDelete({ id, name });
    setIsAlertOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!patientToDelete) return;
    try {
      const response = await deletePatient(patientToDelete.id);
      if (response.status === 200 || response.status === 204) {
        toast.success(t.successDeletePatientToast);
        if (patientsData?.content.length === 1 && currentPage > 0) {
          setCurrentPage((prev) => prev - 1);
        } else {
          await fetchPatients();
        }
      }
    } catch (error) {
      console.error("Error to delete:", error);
      toast.error(t.errordeletePatientToast);
    } finally {
      setIsAlertOpen(false);
      setPatientToDelete(null);
    }
  };

  const patientActions: TableAction<PatientApiResponse>[] = [
    {
      label: dictionary.components.actions.viewDetails,
      onClick: (p) => router.push(routes.patients.details.replace(":id", p.id)),
    },
    {
      label: dictionary.components.actions.edit,
      onClick: (p) => router.push(routes.patients.edit.replace(":id", p.id)),
    },
    {
      label: dictionary.components.actions.delete,
      variant: "destructive",
      separatorBefore: true,
      onClick: (p) => handleOpenDeleteConfirm(p.id, p.fullName),
    },
  ];

  const getDocumentTypeOptions = useCallback((optionsDict: any) => {
    return Object.values(PATIENT_DOCUMENT_TYPE).map((docType) => {
      const docTypeKey = docType.toLowerCase() as
        | "dni"
        | "passport"
        | "id_card"
        | "other";
      return { value: docType, label: optionsDict[docTypeKey] };
    });
  }, []);

  const getSexOptions = useCallback((optionsDict: any) => {
    return Object.values(PATIENT_SEX).map((sexItem) => {
      const sexKey = sexItem.toLowerCase() as "male" | "female" | "other";
      return { value: sexItem, label: optionsDict[sexKey] };
    });
  }, []);

  return {
    patientsData,
    isAlertOpen,
    setIsAlertOpen,
    currentPage,
    setCurrentPage,
    patientToDelete,
    setPatientToDelete,
    isTableLoading,
    patientActions,
    fetchPatients,
    handleExecuteDelete,
    getDocumentTypeOptions,
    getSexOptions,
  };
}
