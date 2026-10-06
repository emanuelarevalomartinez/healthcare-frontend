"use client";

import { routes, TranslationDictionary } from "@/lib";
import {
  getConsultationSelectedDateToViewLocalStorage,
  setConsultationSelectedDateToViewLocalStorage,
} from "@/lib/utils/local-storage";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { PaginatedData } from "@/lib/server/api-response";
import { ConsultationApiResponse } from "../types";
import {
  deleteConsultation,
  getAllConsultationsFiltered,
  getAllConsultationsSearched,
} from "../services";
import { toast } from "sonner";
import { TableAction } from "@/components/customs/table-wrapper";

interface UseConsultationActionsProps {
  dictionary: TranslationDictionary;
}

export function useConsultationActions({
  dictionary,
}: UseConsultationActionsProps) {
  const router = useRouter();
  const t = dictionary.dashboard.consultations;

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [consultationsData, setConsultationsDataData] =
    useState<PaginatedData<ConsultationApiResponse>>();
  const [consultationsSearchData, setConsultationsSearchData] =
    useState<PaginatedData<ConsultationApiResponse>>();
  const [consultationToDelete, setConsultationToDelete] = useState<{
    id: string;
  } | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchView, setIsSearchView] = useState(false);

  useEffect(() => {
    const savedData = getConsultationSelectedDateToViewLocalStorage();

    if (savedData) {
      setSelectedDate(
        parse(savedData.consultationSelectedDate, "yyyy-MM-dd", new Date())
      );
      return;
    }

    const currentDate = new Date();

    setSelectedDate(currentDate);

    setConsultationSelectedDateToViewLocalStorage({
      consultationSelectedDate: format(currentDate, "yyyy-MM-dd"),
    });
  }, []);

  const fetchConsultationsFiltered = useCallback(
    async (date?: Date) => {
      const dateToUse = date ?? selectedDate;

      if (!dateToUse) return;

      setIsLoading(true);

      try {
        const dateString = format(dateToUse, "yyyy-MM-dd");

        const response = await getAllConsultationsFiltered({
          page: currentPage,
          size: pageSize,
          ascending: true,
          date: dateString,
        });

        setConsultationsDataData(response.data);
      } catch (error) {
        console.error("Error to load the consultations: ", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, selectedDate]
  );

  const fetchConsultationsSearched = useCallback(
    async (searchTerm: string) => {
      setIsLoading(true);

      try {
        const response = await getAllConsultationsSearched({
          page: currentPage,
          size: pageSize,
          ascending: true,
          searchTerm: searchTerm,
        });

        setConsultationsSearchData(response.data);
      } catch (error) {
        console.error("Error to load searched consultations: ", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage]
  );

  const fetchConsultations = useCallback(
    async (searchTerm?: string) => {
      const normalizedSearchTerm = searchTerm?.trim();

      if (normalizedSearchTerm) {
        setIsSearchView(true);
        await fetchConsultationsSearched(normalizedSearchTerm);
      } else {
        setIsSearchView(false);
        await fetchConsultationsFiltered();
      }
    },
    [fetchConsultationsFiltered, fetchConsultationsSearched]
  );

  const handleDateChange = useCallback(
    (newDate: Date | undefined) => {
      if (!newDate) return;

      setSelectedDate(newDate);

      setConsultationSelectedDateToViewLocalStorage({
        consultationSelectedDate: format(newDate, "yyyy-MM-dd"),
      });

      fetchConsultationsFiltered(newDate);
    },
    [fetchConsultationsFiltered]
  );

  const handleOpenDeleteConfirm = (id: string) => {
    setConsultationToDelete({ id });
    setIsAlertOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!consultationToDelete) return;
    try {
      const response = await deleteConsultation(consultationToDelete.id);
      if (response.status === 200 || response.status === 204) {
        toast.success(t.successDeleteConsultationToast);
        if (consultationsData?.content.length === 1 && currentPage > 0) {
          setCurrentPage((prev) => prev - 1);
        } else {
          await fetchConsultations();
        }
      }
    } catch (error) {
      console.error("Error to delete:", error);
      toast.error(t.errordeleteConsultationToast);
    } finally {
      setIsAlertOpen(false);
      setConsultationToDelete(null);
    }
  };

  const consultationsActions: TableAction<ConsultationApiResponse>[] = [
    {
      label: dictionary.components.actions.viewDetails,
      onClick: (p) =>
        router.push(routes.consultations.details.replace(":id", p.id)),
    },
    {
      label: dictionary.components.actions.edit,
      onClick: (p) =>
        router.push(routes.consultations.edit.replace(":id", p.id)),
    },
    {
      label: dictionary.components.actions.delete,
      variant: "destructive",
      separatorBefore: true,
      onClick: (p) => handleOpenDeleteConfirm(p.id),
    },
  ];

  const handleCloseAlert = () => {
    setConsultationToDelete(null);
  };

  return {
    consultationsData,
    selectedDate,
    handleDateChange,
    handleCloseAlert,
    isAlertOpen,
    setIsAlertOpen,
    isLoading,
    setCurrentPage,
    consultationsActions,
    handleExecuteDelete,
    fetchConsultations,
    searchTerm,
    setSearchTerm,
    consultationsSearchData,
  };
}
