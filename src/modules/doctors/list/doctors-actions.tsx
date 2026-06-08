"use client"

import { routes, TranslationDictionary } from "@/lib";
import { PaginatedData } from "@/lib/server/api-response";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { DoctorApiResponse } from "../types";
import { deleteDoctor, getAllDoctors } from "../services";
import { toast } from "sonner";
import { TableAction } from "@/components/customs/table-wrapper";

interface UseDoctorsActionsProps {
  dictionary: TranslationDictionary;
}

export function useDoctorsActions({ dictionary }: UseDoctorsActionsProps) {
  const router = useRouter();
  const t = dictionary.dashboard.doctors;

  const [doctorsData, setDoctorsData] =
    useState<PaginatedData<DoctorApiResponse>>();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [doctorToDelete, setDoctorToDelete] = useState<{
    id: string;
    username: string;
  } | null>(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const pageSize = 10;

  const fetchDoctors = useCallback(async () => {
    setIsTableLoading(true);
    try {
      const response = await getAllDoctors(currentPage, pageSize);
      setDoctorsData(response.data);
    } catch (error) {
      console.error("Error to load the users: ", error);
    } finally {
      setIsTableLoading(false);
    }
  }, [currentPage, pageSize]);

  const handleOpenDeleteConfirm = (id: string, username: string) => {
    setDoctorToDelete({ id, username });
    setIsAlertOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!doctorToDelete) return;
    try {
      const response = await deleteDoctor(doctorToDelete.id);
      if (response.status === 200 || response.status === 204) {
        toast.success(t.successDeleteDoctorToast);
        if (doctorsData?.content.length === 1 && currentPage > 0) {
          setCurrentPage((prev) => prev - 1);
        } else {
          await fetchDoctors();
        }
      }
    } catch (error) {
      console.error("Error to delete:", error);
      toast.error(t.errorDeleteDoctorToast);
    } finally {
      setIsAlertOpen(false);
      setDoctorToDelete(null);
    }
  };

  const doctorsActions: TableAction<DoctorApiResponse>[] = [
    {
      label: dictionary.components.actions.viewDetails,
      onClick: (e) => router.push(routes.doctors.details.replace(":id", e.id)),
    },
    {
      label: dictionary.components.actions.edit,
      onClick: (e) => router.push(routes.doctors.edit.replace(":id", e.id)),
    },
    {
      label: dictionary.components.actions.delete,
      variant: "destructive",
      separatorBefore: true,
      onClick: (e) => handleOpenDeleteConfirm(e.id, e.id),
    },
  ];

  return {
    doctorsData,
    isAlertOpen,
    setIsAlertOpen,
    currentPage,
    setCurrentPage,
    doctorToDelete,
    setDoctorToDelete,
    isTableLoading,
    doctorsActions,
    fetchDoctors,
    handleExecuteDelete,
  };
}
